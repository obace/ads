import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import { AWSDeviceAuth } from './aws-oidc.js';
import { generateName, sleep } from './utils.js';

const SELECTORS = {
  emailInput: 'input[placeholder="username@example.com"], input[name="email"], input[type="email"], input[autocomplete="username"]',
  primaryButton: 'button[data-testid="test-primary-button"], button.awsui-button-variant-primary',
  kiroSignInLink: 'a[href*="app.kiro.dev"], a[href*="signin.aws"], a[href*="aws.amazon.com"], a',
  firstNameInput: 'input[name="givenName"], input[autocomplete="given-name"], input[name="firstName"]',
  lastNameInput: 'input[name="familyName"], input[autocomplete="family-name"], input[name="lastName"]',
  fullNameInput: 'input[type="text"][placeholder], input[type="text"]',
  verificationInput: 'input[inputmode="numeric"], input[name="otp"], input[name="code"]',
  passwordInput: 'input[placeholder="Enter password"], input[name="password"], input[type="password"][autocomplete="new-password"]',
  confirmPasswordInput: 'input[placeholder="Re-enter password"], input[name="confirmPassword"], input[type="password"][autocomplete="new-password"]',
  deviceConfirmButton: 'button#cli_verification_btn, button[data-testid="confirm-device-button"]',
  allowAccessButton: 'button#cli_login_button, button[data-testid="allow-access-button"], input[type="submit"][value*="Allow"]'
};

function isTransientDomError(error) {
  const message = String(error?.message || error);
  return (
    message.includes('Execution context was destroyed') ||
    message.includes('Cannot find context with specified id') ||
    message.includes('Cannot find context') ||
    message.includes('No node with given id found') ||
    message.includes('same JavaScript world as target object') ||
    message.includes('Session closed') ||
    message.includes('Target closed')
  );
}

async function findSelector(page, selectorGroup) {
  const selectors = selectorGroup.split(',').map((item) => item.trim());
  for (const selector of selectors) {
    try {
      const exists = await page.evaluate((sel) => !!document.querySelector(sel), selector);
      if (exists) {
        return selector;
      }
    } catch (error) {
      if (isTransientDomError(error)) {
        return null;
      }
      throw error;
    }
  }
  return null;
}

async function saveDebugShot(page, label) {
  const outputDir = path.resolve(process.cwd(), 'debug');
  await fs.mkdir(outputDir, { recursive: true });
  const filePath = path.join(outputDir, `${Date.now()}-${label}.png`);
  await page.screenshot({ path: filePath, fullPage: true }).catch(() => {});
  return filePath;
}

async function fill(page, selectorGroup, value) {
  const selectors = selectorGroup.split(',').map((item) => item.trim());
  for (const selector of selectors) {
    try {
      const exists = await page.evaluate((sel) => !!document.querySelector(sel), selector);
      if (!exists) {
        continue;
      }
      await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        if (!(element instanceof HTMLInputElement)) {
          return;
        }
        element.focus();
        element.value = '';
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }, selector);

      const mod = process.platform === 'darwin' ? 'Meta' : 'Control';
      await page.keyboard.down(mod);
      await page.keyboard.press('KeyA');
      await page.keyboard.up(mod);
      await page.keyboard.press('Backspace');
      await page.keyboard.type(value, { delay: 30 });

      const currentValue = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element instanceof HTMLInputElement ? element.value : '';
      }, selector).catch(() => '');

      if (currentValue !== value) {
        await page.evaluate((sel, nextValue) => {
          const element = document.querySelector(sel);
          if (!(element instanceof HTMLInputElement)) {
            return;
          }
          element.value = nextValue;
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }, selector, value);
      }

      return true;
    } catch (error) {
      if (isTransientDomError(error)) {
        return false;
      }
      throw error;
    }
  }
  return false;
}

async function click(page, selectorGroup) {
  const selectors = selectorGroup.split(',').map((item) => item.trim());
  for (const selector of selectors) {
    try {
      const clicked = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        if (element instanceof HTMLElement) {
          element.click();
          return true;
        }
        return false;
      }, selector);
      if (clicked) {
        return true;
      }
    } catch (error) {
      if (isTransientDomError(error)) {
        return false;
      }
      throw error;
    }
  }
  return false;
}

async function clickButtonByText(page, text) {
  try {
    const clicked = await page.$$eval('button, input[type="submit"]', (elements, targetText) => {
      const normalized = String(targetText).trim();
      const candidate = elements.find((element) => {
        const label = ((element instanceof HTMLInputElement ? element.value : element.innerText) || '').trim();
        if (label !== normalized) {
          return false;
        }
        return !element.closest('#awsccc, .awsccc-u-container, .awsccc-u-wrapper');
      });
      if (!candidate) {
        return false;
      }
      if (candidate instanceof HTMLElement) {
        candidate.click();
        return true;
      }
      return false;
    }, text);
    return clicked;
  } catch (error) {
    if (isTransientDomError(error)) {
      return false;
    }
    throw error;
  }
}

async function readBodyText(page) {
  try {
    return await page.evaluate(() => document.body?.innerText || '');
  } catch (error) {
    if (isTransientDomError(error)) {
      return '';
    }
    throw error;
  }
}

async function maybeAcceptCookies(page) {
  try {
    await page.evaluate(() => {
      const button = document.querySelector('button[data-id="awsccc-cb-btn-accept"]');
      if (button instanceof HTMLElement) {
        button.click();
      }
    });
  } catch (error) {
    if (isTransientDomError(error)) {
      return;
    }
    const message = String(error.message || error);
    if (!message.includes('not clickable')) {
      throw error;
    }
  }
}

async function waitForManualVerification(page) {
  console.log('Verification code required: enter the code in this terminal and the script will fill it in automatically.');
  await page.bringToFront();
  const shot = await saveDebugShot(page, 'manual-verification');
  console.log(`Saved debug screenshot: ${shot}`);
}

async function waitForEmailStep(page, account) {
  console.log(`Manual step required: fill the email field in the browser with your normal email, then press Enter here.`);
  console.log(`Suggested account password for this run: ${account.password}`);
  await page.bringToFront();
  const shot = await saveDebugShot(page, 'manual-email');
  console.log(`Saved debug screenshot: ${shot}`);
}

async function completeBuilderIdFlow(page, account, options) {
  const deadline = Date.now() + 10 * 60 * 1000;
  let emailHandled = false;

  while (Date.now() < deadline) {
    try {
      await maybeAcceptCookies(page);
    } catch (error) {
      if (isTransientDomError(error)) {
        await sleep(1000);
        continue;
      }
      throw error;
    }

    const text = await readBodyText(page);

    if (text.includes('successfully authorized') || text.includes('Authorization complete')) {
      return 'completed';
    }

    if (text.includes('Request approved') || text.includes('You can close this window')) {
      return 'completed';
    }

    if (text.includes('An account with this email already exists') || text.includes('already associated with an account')) {
      throw new Error('Email already registered with AWS Builder ID');
    }

    if (text.includes('Invalid email') || text.includes('email address is not valid')) {
      throw new Error('AWS rejected the email address as invalid');
    }

    const hasPassword = await findSelector(page, SELECTORS.passwordInput);
    const hasConfirmPassword = await findSelector(page, SELECTORS.confirmPasswordInput);

    if (hasPassword && hasConfirmPassword) {
      await fill(page, SELECTORS.passwordInput, account.password);
      await fill(page, SELECTORS.confirmPasswordInput, account.password);
      await sleep(200);
      await clickButtonByText(page, 'Continue');
      await sleep(1500);
      continue;
    }

    if (hasPassword && text.includes('Sign in with your AWS Builder ID')) {
      await fill(page, SELECTORS.passwordInput, account.password);
      await sleep(200);
      await clickButtonByText(page, 'Continue');
      await sleep(1500);
      continue;
    }

    const emailInput = await findSelector(page, SELECTORS.emailInput);
    if (emailInput) {
      if (!emailHandled && options.manualEmail) {
        emailHandled = true;
        await waitForEmailStep(page, account);
        return 'awaiting-manual-email';
      }

      if (!options.manualEmail && account.email) {
        await fill(page, SELECTORS.emailInput, account.email);
        await sleep(200);
        await clickButtonByText(page, 'Continue');
        await sleep(1500);
        continue;
      }
    }

    const hasFirstName = await findSelector(page, SELECTORS.firstNameInput);
    const hasLastName = await findSelector(page, SELECTORS.lastNameInput);
    if (hasFirstName && hasLastName) {
      await fill(page, SELECTORS.firstNameInput, account.firstName);
      await fill(page, SELECTORS.lastNameInput, account.lastName);
      await sleep(200);
      await clickButtonByText(page, 'Continue');
      await sleep(1500);
      continue;
    }

    const fullNameInput = await findSelector(page, SELECTORS.fullNameInput);
    if (fullNameInput && text.includes('Enter your name')) {
      await fill(page, SELECTORS.fullNameInput, `${account.firstName} ${account.lastName}`);
      await sleep(200);
      await clickButtonByText(page, 'Continue');
      await sleep(1500);
      continue;
    }

    if (await click(page, SELECTORS.deviceConfirmButton)) {
      await sleep(1500);
      continue;
    }

    if (await click(page, SELECTORS.allowAccessButton)) {
      await sleep(1500);
      continue;
    }

    const verificationInput = await findSelector(page, SELECTORS.verificationInput);
    if (verificationInput) {
      if (options.verificationCode) {
        await fill(page, SELECTORS.verificationInput, options.verificationCode);
        await sleep(200);
        await clickButtonByText(page, 'Continue');
        await sleep(1500);
        return null;
      }
      await waitForManualVerification(page);
      return 'awaiting-manual-verification';
    }

    await sleep(1000);
  }

  throw new Error('Timed out while driving the AWS Builder ID flow');
}

async function pollToken(auth, timeoutMs = 10 * 60 * 1000) {
  const startedAt = Date.now();
  const intervalMs = Math.max(auth.interval * 1000, 2000);

  while (Date.now() - startedAt < timeoutMs) {
    const token = await auth.getToken();
    if (token) {
      return token;
    }
    await sleep(intervalMs);
  }

  throw new Error('Timed out waiting for the AWS device token');
}

async function waitForCompletionPage(page, timeoutMs = 2 * 60 * 1000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const text = await readBodyText(page);
    if (
      text.includes('Request approved') ||
      text.includes('successfully authorized') ||
      text.includes('Authorization complete') ||
      text.includes('You can close this window')
    ) {
      return true;
    }
    await sleep(1000);
  }
  return false;
}

async function enterViaKiro(page, entryUrl) {
  await page.goto(entryUrl, { waitUntil: 'domcontentloaded' });

  const deadline = Date.now() + 2 * 60 * 1000;
  while (Date.now() < deadline) {
    await maybeAcceptCookies(page).catch(() => {});

    const currentUrl = page.url();
    if (
      currentUrl.includes('profile.aws.amazon.com') ||
      currentUrl.includes('signin.aws') ||
      currentUrl.includes('view.awsapps.com')
    ) {
      return;
    }

    const bodyText = await readBodyText(page);
    if (currentUrl.includes('app.kiro.dev') && bodyText.includes('Choose a way to sign in/sign up')) {
      const clickedBuilderId = await page.evaluate(() => {
        const buttons = [...document.querySelectorAll('button')];
        const target = buttons.find((button) => {
          const text = (button.innerText || '').replace(/\s+/g, ' ').trim().toLowerCase();
          return text.includes('builder id') && text.includes('sign in');
        });
        if (!(target instanceof HTMLElement)) {
          return false;
        }
        target.click();
        return true;
      }).catch(() => false);

      if (clickedBuilderId) {
        await sleep(2500);
        continue;
      }
    }

    const clicked = await page.evaluate(() => {
      const anchors = [...document.querySelectorAll('a')];
      const target = anchors.find((anchor) => {
        const label = (anchor.textContent || '').trim().toLowerCase();
        const href = anchor.getAttribute('href') || '';
        if (label === 'sign in' || label === 'login' || label === 'log in') {
          return true;
        }
        return href.includes('app.kiro.dev') || href.includes('signin.aws') || href.includes('aws.amazon.com');
      });
      if (!(target instanceof HTMLElement)) {
        return false;
      }
      target.click();
      return true;
    }).catch(() => false);

    if (clicked) {
      await sleep(2500);
      continue;
    }

    await sleep(1000);
  }

  throw new Error('Timed out entering the AWS sign-in flow from kiro.dev');
}

export async function runRegistration(config, startInfo) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: startInfo.wsEndpoint,
    defaultViewport: null,
    protocolTimeout: 120000
  });

  const accountName = generateName();
  const account = {
    firstName: accountName.firstName,
    lastName: accountName.lastName,
    password: config.accountPassword,
    email: config.accountEmail
  };

  const auth = config.useKiroEntry ? null : new AWSDeviceAuth(config.awsStartUrl);
  const authInfo = auth ? await auth.quickAuth() : null;

  let page;
  try {
    page = await browser.newPage();
    if (config.useKiroEntry) {
      await enterViaKiro(page, config.kiroEntryUrl);
    } else {
      await page.goto(authInfo.verificationUriComplete, { waitUntil: 'domcontentloaded' });
    }

    console.log(`Profile: ${config.profileId}`);
    if (account.email) {
      console.log(`Email: ${account.email}`);
    }
    console.log(`Password: ${account.password}`);
    if (authInfo?.verificationUriComplete) {
      console.log(`AWS verify URL: ${authInfo.verificationUriComplete}`);
    } else {
      console.log(`Entry URL: ${config.kiroEntryUrl}`);
    }

    const continueFlow = async (verificationCode) => completeBuilderIdFlow(page, account, {
      manualEmail: false,
      verificationCode
    });

    const result = await completeBuilderIdFlow(page, account, {
      manualEmail: config.manualEmail
    });
    if (result === 'awaiting-manual-email' || (result === 'awaiting-manual-verification' && config.waitForManualVerification)) {
      return {
        account,
        authInfo,
        page,
        state: result,
        close: async () => {
          if (page && !page.isClosed()) {
            await page.close().catch(() => {});
          }
          await browser.disconnect();
        },
        continueFlow,
        pollToken: config.useKiroEntry || !config.saveRefreshToken
          ? async () => {
              await waitForCompletionPage(page).catch(() => {});
              return null;
            }
          : async () => {
              await waitForCompletionPage(page).catch(() => {});
              return pollToken(auth);
            }
      };
    }

    const token = auth && config.saveRefreshToken ? await pollToken(auth) : null;
    await page.close().catch(() => {});
    await browser.disconnect();
    return { account, authInfo, token };
  } catch (error) {
    if (page && !page.isClosed()) {
      await page.close().catch(() => {});
    }
    await browser.disconnect();
    throw error;
  }
}
