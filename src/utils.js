import crypto from 'node:crypto';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const FIRST_NAMES = [
  'James', 'John', 'Michael', 'David', 'Daniel', 'Matthew', 'Andrew', 'Ryan',
  'Jacob', 'Noah', 'Alexander', 'Emma', 'Olivia', 'Sophia', 'Mia', 'Ava',
  'Isabella', 'Charlotte', 'Amelia', 'Evelyn', 'Wei', 'Ming', 'Yuki', 'Priya'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
  'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Lee', 'Walker',
  'Patel', 'Kim', 'Chen', 'Tanaka'
];

export function randomInt(max) {
  return crypto.randomInt(max);
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateUUID() {
  return crypto.randomUUID();
}

export function generatePassword(length = 14) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const special = '!@#$%^&*';
  const all = lowercase + uppercase + digits + special;
  const chars = [
    lowercase[randomInt(lowercase.length)],
    uppercase[randomInt(uppercase.length)],
    digits[randomInt(digits.length)],
    special[randomInt(special.length)]
  ];

  while (chars.length < length) {
    chars.push(all[randomInt(all.length)]);
  }

  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
}

export function generateName() {
  return {
    firstName: FIRST_NAMES[randomInt(FIRST_NAMES.length)],
    lastName: LAST_NAMES[randomInt(LAST_NAMES.length)]
  };
}

export function generateEmailPrefix(firstName, lastName) {
  const first = (firstName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
  const last = (lastName || 'account').toLowerCase().replace(/[^a-z0-9]/g, '');
  const base = `${first}${last}` || 'useracct';
  const minLength = 9;
  const maxLength = 15;
  const numericSuffix = String(randomInt(100000)).padStart(5, '0');
  const maxBaseLength = maxLength - numericSuffix.length;
  let prefixBase = base.slice(0, Math.max(4, maxBaseLength));

  while ((prefixBase + numericSuffix).length < minLength) {
    prefixBase += String(randomInt(10));
  }

  return `${prefixBase}${numericSuffix}`.slice(0, maxLength);
}

export function generateGmailAlias(baseEmail, suffix = '') {
  if (!baseEmail || !baseEmail.includes('@')) {
    throw new Error('GMAIL_BASE_EMAIL is required and must be a valid email address');
  }

  const [localPart, domain] = baseEmail.split('@');
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(2, 14);
  const token = `${suffix || 'aws'}${stamp}${crypto.randomBytes(2).toString('hex')}`;
  return `${localPart}+${token.toLowerCase()}@${domain}`;
}

export async function prompt(message) {
  const rl = readline.createInterface({ input, output });
  try {
    return await rl.question(message);
  } finally {
    rl.close();
  }
}

export function log(level, msg, data) {
  const entry = { ts: new Date().toISOString(), level, msg, ...data };
  console.log(JSON.stringify(entry));
}
