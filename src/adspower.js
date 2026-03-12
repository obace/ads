import process from 'node:process';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildUrl(baseUrl, pathname, query = {}) {
  const url = new URL(pathname, `${baseUrl}/`);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

function getAuthHeaders() {
  const token = process.env.API_TOKEN?.trim() || process.env.ADSPOWER_API_KEY?.trim() || '';
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function adspowerGet(baseUrl, pathname, query) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(buildUrl(baseUrl, pathname, query), {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.code !== 0) {
        throw new Error(`AdsPower API error on ${pathname}: ${data.msg || data.code}`);
      }
      return data.data;
    } catch (error) {
      if (attempt >= MAX_RETRIES) throw error;
      await delay(RETRY_DELAY_MS * attempt);
    }
  }
}

async function adspowerPost(baseUrl, pathname, payload) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(buildUrl(baseUrl, pathname), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.code !== 0) {
        throw new Error(`AdsPower API error on ${pathname}: ${data.msg || data.code}`);
      }
      return data.data;
    } catch (error) {
      if (attempt >= MAX_RETRIES) throw error;
      await delay(RETRY_DELAY_MS * attempt);
    }
  }
}

export async function listGroups(baseUrl) {
  const data = await adspowerGet(baseUrl, '/api/v1/group/list', {
    page: 1,
    page_size: 100
  });
  return data.list || [];
}

export async function createProfile(baseUrl, options) {
  const payload = {
    group_id: options.groupId,
    name: options.name,
    platform: 'amazon.com',
    ipchecker: 'ip2location',
    fingerprint_config: {
      automatic_timezone: options.fingerprint.automaticTimezone,
      location_switch: options.fingerprint.locationSwitch,
      language_switch: options.fingerprint.languageSwitch,
      language: options.fingerprint.language,
      page_language_switch: options.fingerprint.pageLanguageSwitch,
      page_language: options.fingerprint.pageLanguage,
      ua: options.fingerprint.userAgent,
      screen_resolution: options.fingerprint.screenResolution,
      hardware_concurrency: options.fingerprint.hardwareConcurrency,
      device_memory: options.fingerprint.deviceMemory,
      fonts: options.fingerprint.fonts,
      webrtc: options.fingerprint.webrtc,
      canvas: options.fingerprint.canvas,
      webgl: options.fingerprint.webgl,
      webgl_image: options.fingerprint.webglImage,
      audio: options.fingerprint.audio,
      do_not_track: options.fingerprint.doNotTrack,
      gpu: options.fingerprint.gpu,
      flash: options.fingerprint.flash,
      location: options.fingerprint.location,
      scan_port_type: options.fingerprint.scanPortType,
      browser_kernel_config: {
        type: 'chrome',
        version: options.fingerprint.kernelVersion
      },
      random_ua: {
        ua_browser: ['chrome'],
        ua_version: [options.fingerprint.kernelVersion],
        ua_system_version: [options.fingerprint.platform]
      }
    },
    user_proxy_config: {
      proxy_soft: 'other',
      proxy_type: options.proxy.type,
      proxy_host: options.proxy.host,
      proxy_port: options.proxy.port,
      proxy_user: options.proxy.username,
      proxy_password: options.proxy.password
    }
  };
  const data = await adspowerPost(baseUrl, '/api/v2/browser-profile/create', payload);
  return {
    id: data.id || data.profile_id || data.profileId
  };
}

export async function startProfile(baseUrl, profileId, headless = false) {
  const data = await adspowerPost(baseUrl, '/api/v2/browser-profile/start', {
    profile_id: profileId,
    headless: headless ? '1' : '0',
    last_opened_tabs: '0',
    proxy_detection: '1',
    password_filling: '0',
    password_saving: '0',
    cdp_mask: '1',
    delete_cache: '0',
    device_scale: '1'
  });

  const wsEndpoint = data.ws?.puppeteer || data.ws?.selenium;
  if (!wsEndpoint) {
    throw new Error('AdsPower did not return a Puppeteer websocket endpoint');
  }

  return {
    wsEndpoint,
    debugPort: data.debug_port,
    webdriver: data.webdriver,
    raw: data
  };
}

export async function stopProfile(baseUrl, profileId) {
  await adspowerPost(baseUrl, '/api/v2/browser-profile/stop', { profile_id: profileId });
}

export async function deleteProfile(baseUrl, profileId) {
  await adspowerPost(baseUrl, '/api/v2/browser-profile/delete', {
    profile_id: [profileId]
  });
}
