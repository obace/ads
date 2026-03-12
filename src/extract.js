import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import puppeteer from 'puppeteer-core';
import { loadConfig } from './config.js';
import { checkStatus, createProfile, deleteProfile, listGroups, startProfile, stopProfile } from './adspower.js';
import { AWSDeviceAuth } from './aws-oidc.js';
import { log, sleep } from './utils.js';

async function resolveGroupId(config) {
  if (config.groupId) return config.groupId;
  const groups = await listGroups(config.adspowerBaseUrl);
  const match = groups.find((g) => g.group_name === config.groupName);
  if (!match) throw new Error(`AdsPower group not found: ${config.groupName}`);
  return match.group_id;
}

async function loadAccounts(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return raw.split('\n').filter(Boolean).map((line) => {
    const obj = JSON.parse(line);
    return { email: obj.email, password: obj.password, hasToken: !!obj.refreshToken };
  });
}

async function saveTokenResult(account, token) {
  const filePath = path.resolve(process.cwd(), 'tokens.txt');
  const payload = {
    email: account.email,
    password: account.password,
    refreshToken: token.refreshToken,
    extractedAt: new Date().toISOString()
  };
  await fs.appendFile(filePath, `${JSON.stringify(payload)}\n`, 'utf8');
  return filePath;
}

async function loginAndAuthorize(page, account) {
  const deadline = Date.now() + 5 * 60 * 1000;

  while (Date.now() < deadline) {
    let text = '';
    try { text = await page.evaluate(() => document.body?.innerText || ''); } catch { await sleep(1000); continue; }

    if (text.includes('successfully authorized') || text.includes('Authorization complete') ||
        text.includes('Request approved') || text.includes('You can close this window')) {
      return true;
    }

    // Email page
    const emailInput = await page.evaluate(() => {
      const el = document.querySelector('input[name="email"], input[type="email"], input[autocomplete="username"]');
      return el ? true : false;
    }).catch(() => false);

    if (emailInput) {
      await page.evaluate((email) => {
        const el = document.querySelector('input[name="email"], input[type="email"], input[autocomplete="username"]');
        if (el) { el.focus(); el.value = ''; }
      }, account.email);
      await page.keyboard.type(account.email, { delay: 30 });
      await sleep(200);
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find((b) => b.innerText?.trim() === 'Continue');
        if (btn) btn.click();
      });
      await sleep(2000);
      continue;
    }

    // Password page (sign in, not register)
    const passwordInput = await page.evaluate(() => {
      const el = document.querySelector('input[name="password"], input[type="password"]');
      return el ? true : false;
    }).catch(() => false);

    if (passwordInput) {
      await page.evaluate(() => {
        const el = document.querySelector('input[name="password"], input[type="password"]');
        if (el) { el.focus(); el.value = ''; }
      });
      await page.keyboard.type(account.password, { delay: 30 });
      await sleep(200);
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find((b) => {
          const t = b.innerText?.trim();
          return t === 'Continue' || t === 'Sign in';
        });
        if (btn) btn.click();
      });
      await sleep(2000);
      continue;
    }

    // Device confirm / allow buttons
    const clicked = await page.evaluate(() => {
      const btn = document.querySelector('button#cli_verification_btn, button#cli_login_button, input[type="submit"][value*="Allow"]');
      if (btn instanceof HTMLElement) { btn.click(); return true; }
      return false;
    }).catch(() => false);

    if (clicked) { await sleep(2000); continue; }

    await sleep(1000);
  }

  return false;
}

async function extractOne(config, account, groupId) {
  const profileName = `extract-${Date.now()}`;
  const created = await createProfile(config.adspowerBaseUrl, {
    groupId,
    name: profileName,
    proxy: config.proxy,
    fingerprint: config.fingerprint
  });
  const profileId = created.id;

  const startInfo = await startProfile(config.adspowerBaseUrl, profileId, config.adspowerHeadless);

  try {
    const auth = new AWSDeviceAuth(config.awsStartUrl);
    const authInfo = await auth.quickAuth();

    const browser = await puppeteer.connect({
      browserWSEndpoint: startInfo.wsEndpoint,
      defaultViewport: null,
      protocolTimeout: 120000
    });

    const page = await browser.newPage();
    await page.goto(authInfo.verificationUriComplete, { waitUntil: 'domcontentloaded' });

    log('info', 'Logging in for token extraction', { email: account.email });

    const authorized = await loginAndAuthorize(page, account);
    if (!authorized) {
      await page.close().catch(() => {});
      await browser.disconnect();
      throw new Error('Login flow did not complete');
    }

    // Poll for token
    const intervalMs = Math.max(auth.interval * 1000, 2000);
    const tokenDeadline = Date.now() + 5 * 60 * 1000;
    let token = null;
    while (Date.now() < tokenDeadline) {
      token = await auth.getToken();
      if (token) break;
      await sleep(intervalMs);
    }

    await page.close().catch(() => {});
    await browser.disconnect();

    if (!token) throw new Error('Token polling timed out');
    return token;
  } finally {
    await stopProfile(config.adspowerBaseUrl, profileId).catch(() => {});
    await deleteProfile(config.adspowerBaseUrl, profileId).catch(() => {});
  }
}

async function main() {
  const config = loadConfig();
  await checkStatus(config.adspowerBaseUrl);

  const inputFile = process.argv[2] || 'output.txt';
  const accounts = await loadAccounts(path.resolve(process.cwd(), inputFile));
  const pending = accounts.filter((a) => !a.hasToken);

  if (pending.length === 0) {
    log('info', 'No accounts without tokens found');
    return;
  }

  log('info', `Found ${pending.length} accounts to extract tokens from`);

  const groupId = await resolveGroupId(config);

  for (const account of pending) {
    try {
      const token = await extractOne(config, account, groupId);
      const file = await saveTokenResult(account, token);
      log('info', 'Token extracted', { email: account.email, file });
    } catch (error) {
      log('error', 'Token extraction failed', { email: account.email, error: error.message });
    }

    // 间隔一下，避免连续登录触发风控
    if (pending.indexOf(account) < pending.length - 1) {
      await sleep(5000);
    }
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
