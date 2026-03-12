import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { generatePassword } from './utils.js';

function loadDotEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const pivot = line.indexOf('=');
    if (pivot === -1) {
      continue;
    }

    const key = line.slice(0, pivot).trim();
    const value = line.slice(pivot + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function envFlag(name, fallback = false) {
  const value = process.env[name];
  if (value == null || value === '') {
    return fallback;
  }
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function envInt(name, fallback) {
  const value = Number.parseInt(process.env[name] || '', 10);
  return Number.isFinite(value) ? value : fallback;
}

function buildWindowsChromeUa(version) {
  return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.0.0 Safari/537.36`;
}

export function loadConfig() {
  loadDotEnv();

  const groupId = process.env.ADSPOWER_GROUP_ID?.trim();
  const groupName = process.env.ADSPOWER_GROUP_NAME?.trim();
  if (!groupId && !groupName) {
    throw new Error('ADSPOWER_GROUP_ID or ADSPOWER_GROUP_NAME is required');
  }

  const proxyHost = process.env.PROXY_HOST?.trim();
  const proxyPort = process.env.PROXY_PORT?.trim();
  if (!proxyHost || !proxyPort) {
    throw new Error('PROXY_HOST and PROXY_PORT are required');
  }

  return {
    adspowerBaseUrl: (process.env.ADSPOWER_BASE_URL || 'http://127.0.0.1:50325').replace(/\/$/, ''),
    groupId,
    groupName,
    profileNamePrefix: process.env.ADSPOWER_PROFILE_NAME_PREFIX?.trim() || 'aws-buildid',
    adspowerHeadless: envFlag('ADSPOWER_HEADLESS', false),
    proxy: {
      type: process.env.PROXY_TYPE?.trim() || 'socks5',
      host: proxyHost,
      port: proxyPort,
      username: process.env.PROXY_USERNAME?.trim() || '',
      password: process.env.PROXY_PASSWORD?.trim() || ''
    },
    accountPassword: process.env.ACCOUNT_PASSWORD?.trim() || generatePassword(14),
    accountEmail: process.env.ACCOUNT_EMAIL?.trim() || '',
    accountEmailDomain: process.env.ACCOUNT_EMAIL_DOMAIN?.trim() || '',
    accountEmailPoolFile: process.env.ACCOUNT_EMAIL_POOL_FILE?.trim() || 'emails.txt',
    usedEmailPoolFile: process.env.USED_EMAIL_POOL_FILE?.trim() || 'used-emails.txt',
    fingerprint: {
      kernelVersion: process.env.BROWSER_KERNEL_VERSION?.trim() || '144',
      userAgent: process.env.BROWSER_USER_AGENT?.trim() || buildWindowsChromeUa(process.env.BROWSER_KERNEL_VERSION?.trim() || '144'),
      language: ['en-US', 'en'],
      pageLanguage: process.env.BROWSER_PAGE_LANGUAGE?.trim() || 'en-US',
      screenResolution: process.env.BROWSER_SCREEN_RESOLUTION?.trim() || '1920_1080',
      hardwareConcurrency: process.env.BROWSER_HARDWARE_CONCURRENCY?.trim() || '8',
      deviceMemory: process.env.BROWSER_DEVICE_MEMORY?.trim() || '8',
      fonts: (process.env.BROWSER_FONTS?.trim() || 'Arial,Calibri,Cambria,Segoe UI,Segoe UI Emoji,Tahoma,Verdana').split(',').map((font) => font.trim()).filter(Boolean),
      platform: process.env.BROWSER_PLATFORM?.trim() || 'Windows 10',
      webrtc: process.env.BROWSER_WEBRTC?.trim() || 'forward',
      canvas: process.env.BROWSER_CANVAS?.trim() || '1',
      webgl: process.env.BROWSER_WEBGL?.trim() || '3',
      webglImage: process.env.BROWSER_WEBGL_IMAGE?.trim() || '1',
      audio: process.env.BROWSER_AUDIO?.trim() || '1',
      doNotTrack: process.env.BROWSER_DNT?.trim() || 'default',
      gpu: process.env.BROWSER_GPU?.trim() || '1',
      flash: process.env.BROWSER_FLASH?.trim() || 'block',
      location: process.env.BROWSER_LOCATION?.trim() || 'ask',
      locationSwitch: process.env.BROWSER_LOCATION_SWITCH?.trim() || '1',
      automaticTimezone: process.env.BROWSER_AUTOMATIC_TIMEZONE?.trim() || '1',
      languageSwitch: process.env.BROWSER_LANGUAGE_SWITCH?.trim() || '0',
      pageLanguageSwitch: process.env.BROWSER_PAGE_LANGUAGE_SWITCH?.trim() || '0',
      scanPortType: process.env.BROWSER_SCAN_PORT_TYPE?.trim() || '1'
    },
    manualEmail: envFlag('MANUAL_EMAIL', false),
    waitForManualVerification: envFlag('WAIT_FOR_MANUAL_VERIFICATION', true),
    awsStartUrl: process.env.AWS_START_URL?.trim() || 'https://view.awsapps.com/start',
    useKiroEntry: envFlag('USE_KIRO_ENTRY', false),
    kiroEntryUrl: process.env.KIRO_ENTRY_URL?.trim() || 'https://kiro.dev',
    saveRefreshToken: envFlag('SAVE_REFRESH_TOKEN', true)
  };
}
