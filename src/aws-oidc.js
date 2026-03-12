import { generateUUID } from './utils.js';

const OIDC_BASE_URL = 'https://oidc.us-east-1.amazonaws.com';

function getOidcHeaders() {
  return {
    'Content-Type': 'application/json',
    'User-Agent': 'aws-sdk-rust/1.3.9 os/windows lang/rust/1.87.0',
    'x-amz-user-agent': 'aws-sdk-rust/1.3.9 ua/2.1 api/ssooidc/1.88.0 os/windows lang/rust/1.87.0 m/E app/AmazonQ-For-CLI',
    'amz-sdk-request': 'attempt=1; max=3',
    'amz-sdk-invocation-id': generateUUID()
  };
}

export class AWSDeviceAuth {
  constructor(startUrl) {
    this.startUrl = startUrl;
    this.clientId = '';
    this.clientSecret = '';
    this.deviceCode = '';
    this.userCode = '';
    this.verificationUri = '';
    this.verificationUriComplete = '';
    this.expiresIn = 0;
    this.interval = 1;
  }

  async registerClient() {
    const payload = {
      clientName: 'Amazon Q Developer for command line',
      clientType: 'public',
      scopes: [
        'codewhisperer:completions',
        'codewhisperer:analysis',
        'codewhisperer:conversations'
      ],
      grantTypes: [
        'urn:ietf:params:oauth:grant-type:device_code',
        'refresh_token'
      ],
      issuerUrl: 'https://identitycenter.amazonaws.com/ssoins-722374e5d5e7e3e0'
    };

    const response = await fetch(`${OIDC_BASE_URL}/client/register`, {
      method: 'POST',
      headers: getOidcHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`registerClient failed: ${await response.text()}`);
    }

    const data = await response.json();
    this.clientId = data.clientId;
    this.clientSecret = data.clientSecret;
    return data;
  }

  async deviceAuthorize() {
    const response = await fetch(`${OIDC_BASE_URL}/device_authorization`, {
      method: 'POST',
      headers: getOidcHeaders(),
      body: JSON.stringify({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        startUrl: this.startUrl
      })
    });

    if (!response.ok) {
      throw new Error(`deviceAuthorize failed: ${await response.text()}`);
    }

    const data = await response.json();
    this.deviceCode = data.deviceCode;
    this.userCode = data.userCode;
    this.verificationUri = data.verificationUri;
    this.verificationUriComplete = data.verificationUriComplete;
    this.expiresIn = data.expiresIn || 600;
    this.interval = data.interval || 1;
    return data;
  }

  async quickAuth() {
    await this.registerClient();
    await this.deviceAuthorize();
    return this.getAuthInfo();
  }

  async getToken() {
    const response = await fetch(`${OIDC_BASE_URL}/token`, {
      method: 'POST',
      headers: getOidcHeaders(),
      body: JSON.stringify({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        deviceCode: this.deviceCode,
        grantType: 'urn:ietf:params:oauth:grant-type:device_code'
      })
    });

    const data = await response.json();
    if (response.ok) {
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        tokenType: data.tokenType
      };
    }

    if (data.error === 'authorization_pending') {
      return null;
    }

    throw new Error(`getToken failed: ${data.error || 'unknown_error'} ${data.error_description || ''}`.trim());
  }

  getAuthInfo() {
    return {
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      deviceCode: this.deviceCode,
      userCode: this.userCode,
      verificationUri: this.verificationUri,
      verificationUriComplete: this.verificationUriComplete,
      expiresIn: this.expiresIn,
      interval: this.interval
    };
  }
}
