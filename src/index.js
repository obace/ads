import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { loadConfig } from './config.js';
import { checkStatus, createProfile, deleteProfile, isProfileActive, listGroups, startProfile, stopProfile } from './adspower.js';
import { runRegistration } from './bot.js';
import { log, prompt, sleep } from './utils.js';

async function saveResult(account, config) {
  const filePath = path.resolve(process.cwd(), 'output.txt');
  const payload = {
    email: account.email,
    password: account.password,
    timestamp: new Date().toISOString(),
    entry: config.useKiroEntry ? 'kiro' : 'device-flow',
    proxy: `${config.proxy.type}://${config.proxy.host}:${config.proxy.port}`
  };
  await fs.appendFile(filePath, `${JSON.stringify(payload)}\n`, 'utf8');
  return filePath;
}

async function resolveGroupId(config) {
  if (config.groupId) return config.groupId;
  const groups = await listGroups(config.adspowerBaseUrl);
  const match = groups.find((g) => g.group_name === config.groupName);
  if (!match) throw new Error(`AdsPower group not found: ${config.groupName}`);
  return match.group_id;
}

async function pickEmailFromPool(config) {
  const poolPath = path.resolve(process.cwd(), config.accountEmailPoolFile);
  const usedPath = path.resolve(process.cwd(), config.usedEmailPoolFile);
  try {
    const [poolRaw, usedRaw] = await Promise.all([
      fs.readFile(poolPath, 'utf8'),
      fs.readFile(usedPath, 'utf8').catch(() => '')
    ]);
    const used = new Set(usedRaw.split('\n').map((l) => l.trim().toLowerCase()).filter(Boolean));
    return poolRaw.split('\n').map((l) => l.trim()).find((l) => l && !l.startsWith('#') && !used.has(l.toLowerCase())) || '';
  } catch { return ''; }
}

async function markEmailAsUsed(config, email) {
  if (!email) return;
  await fs.appendFile(path.resolve(process.cwd(), config.usedEmailPoolFile), `${email}\n`, 'utf8');
}

async function main() {
  const config = loadConfig();
  await checkStatus(config.adspowerBaseUrl);
  log('info', 'AdsPower API is ready');

  if (!config.accountEmail) config.accountEmail = await pickEmailFromPool(config);
  if (!config.accountEmail) config.accountEmail = (await prompt('Enter the email address to register with: ')).trim();
  if (!config.accountEmail) throw new Error('ACCOUNT_EMAIL is required');

  const groupId = await resolveGroupId(config);
  const created = await createProfile(config.adspowerBaseUrl, {
    groupId,
    name: `${config.profileNamePrefix}-${Date.now()}`,
    proxy: config.proxy,
    fingerprint: config.fingerprint
  });
  const profileId = created.id;
  config.profileId = profileId;

  const startInfo = await startProfile(config.adspowerBaseUrl, profileId, config.adspowerHeadless);
  for (let i = 0; i < 10; i++) {
    if (await isProfileActive(config.adspowerBaseUrl, profileId).catch(() => false)) break;
    await sleep(1000);
  }

  let cleanupDone = false;
  async function cleanup() {
    if (cleanupDone) return;
    cleanupDone = true;
    await stopProfile(config.adspowerBaseUrl, profileId).catch(() => {});
    await deleteProfile(config.adspowerBaseUrl, profileId).catch(() => {});
  }
  process.on('SIGINT', () => cleanup().then(() => process.exit(130)));
  process.on('SIGTERM', () => cleanup().then(() => process.exit(143)));

  try {
    const session = await runRegistration(config, startInfo);

    while (session.continueFlow) {
      let verificationCode = '';
      if (session.state === 'awaiting-manual-email') {
        await prompt('Fill the email step in the browser, then press Enter here so the script can continue.');
      } else {
        verificationCode = (await prompt('Enter the email verification code: ')).trim();
      }

      const nextState = await session.continueFlow(verificationCode);
      if (nextState === 'completed') break;
      if (nextState === 'awaiting-manual-verification' || nextState === 'awaiting-manual-email') {
        session.state = nextState;
      } else {
        break;
      }
    }

    await session.close?.();

    const filePath = await saveResult(session.account, config);
    await markEmailAsUsed(config, session.account.email);
    log('info', 'Registration completed (account saved, token extraction deferred)', { email: session.account.email, file: filePath });
  } finally {
    await cleanup();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
