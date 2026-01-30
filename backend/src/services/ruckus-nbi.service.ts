import https from 'https';
import { config } from '../config';
import { logger } from '../utils/logger';
import {
  NBI_PORT,
  NBI_ENDPOINT,
  NBI_VENDOR,
  NBI_REQUEST_USERNAME,
} from '../utils/constants';
import type {
  NBIResponse,
  NBILoginRequest,
  NBILoginAsyncRequest,
  NBIStatusRequest,
  NBILogoutRequest,
  NBIDisconnectRequest,
  NBIEncryptRequest,
  NBIDecryptRequest,
} from '../types/wispr.types';

interface NBIRequestParams {
  nbiIP: string;
  ueIP: string;
  ueMac?: string;
  username?: string;
  password?: string;
}

class RuckusNBIService {
  private createBaseRequest() {
    return {
      Vendor: 'Ruckus' as const,
      RequestUserName: NBI_REQUEST_USERNAME,
      RequestPassword: config.apiKey,
      APIVersion: config.apiVersion,
    };
  }

  private async sendRequest(nbiIP: string, body: object): Promise<NBIResponse> {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(body);

      logger.debug('Sending NBI request', { nbiIP, body });

      const options: https.RequestOptions = {
        hostname: nbiIP,
        port: NBI_PORT,
        path: NBI_ENDPOINT,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
        rejectUnauthorized: false, // Allow self-signed certificates
        timeout: config.apiTimeoutMs,
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data) as NBIResponse;
            logger.info('NBI response received', { response });
            resolve(response);
          } catch (error) {
            logger.error('Failed to parse NBI response', { data, error });
            reject(new Error('Invalid JSON response from NBI'));
          }
        });
      });

      req.on('error', (error) => {
        logger.error('NBI request failed', { error: error.message, nbiIP });
        reject(new Error(`NBI request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('NBI request timed out'));
      });

      req.write(postData);
      req.end();
    });
  }

  async login(params: NBIRequestParams): Promise<NBIResponse> {
    const { nbiIP, ueIP, ueMac, username, password } = params;

    if (!ueMac || !username || !password) {
      throw new Error('Missing required parameters for login');
    }

    const request: NBILoginRequest = {
      ...this.createBaseRequest(),
      RequestCategory: 'UserOnlineControl',
      RequestType: 'Login',
      'UE-IP': ueIP,
      'UE-MAC': ueMac,
      'UE-Username': username,
      'UE-Password': password,
    };

    return this.sendRequest(nbiIP, request);
  }

  async loginAsync(params: NBIRequestParams): Promise<NBIResponse> {
    const { nbiIP, ueIP, ueMac, username, password } = params;

    if (!ueMac || !username || !password) {
      throw new Error('Missing required parameters for async login');
    }

    const request: NBILoginAsyncRequest = {
      ...this.createBaseRequest(),
      RequestCategory: 'UserOnlineControl',
      RequestType: 'LoginAsync',
      'UE-IP': ueIP,
      'UE-MAC': ueMac,
      'UE-Username': username,
      'UE-Password': password,
    };

    return this.sendRequest(nbiIP, request);
  }

  async status(params: NBIRequestParams): Promise<NBIResponse> {
    const { nbiIP, ueIP, ueMac } = params;

    if (!ueMac) {
      throw new Error('Missing required parameters for status');
    }

    const request: NBIStatusRequest = {
      ...this.createBaseRequest(),
      RequestCategory: 'UserOnlineControl',
      RequestType: 'Status',
      'UE-IP': ueIP,
      'UE-MAC': ueMac,
    };

    return this.sendRequest(nbiIP, request);
  }

  async logout(params: NBIRequestParams): Promise<NBIResponse> {
    const { nbiIP, ueIP, ueMac } = params;

    if (!ueMac) {
      throw new Error('Missing required parameters for logout');
    }

    const request: NBILogoutRequest = {
      ...this.createBaseRequest(),
      RequestCategory: 'UserOnlineControl',
      RequestType: 'Logout',
      'UE-IP': ueIP,
      'UE-MAC': ueMac,
    };

    return this.sendRequest(nbiIP, request);
  }

  async disconnect(params: NBIRequestParams): Promise<NBIResponse> {
    const { nbiIP, ueIP, ueMac } = params;

    if (!ueMac) {
      throw new Error('Missing required parameters for disconnect');
    }

    const request: NBIDisconnectRequest = {
      ...this.createBaseRequest(),
      RequestCategory: 'UserOnlineControl',
      RequestType: 'Disconnect',
      'UE-IP': ueIP,
      'UE-MAC': ueMac,
    };

    return this.sendRequest(nbiIP, request);
  }

  async encrypt(params: NBIRequestParams): Promise<NBIResponse> {
    const { nbiIP, ueIP } = params;

    const request: NBIEncryptRequest = {
      ...this.createBaseRequest(),
      RequestCategory: 'GetConfig',
      RequestType: 'EncryptIP',
      'UE-IP': ueIP,
    };

    return this.sendRequest(nbiIP, request);
  }

  async decrypt(params: NBIRequestParams): Promise<NBIResponse> {
    const { nbiIP, ueIP } = params;

    const request: NBIDecryptRequest = {
      ...this.createBaseRequest(),
      RequestCategory: 'GetConfig',
      RequestType: 'DecryptIP',
      'UE-IP': ueIP,
    };

    return this.sendRequest(nbiIP, request);
  }
}

export const ruckusNBIService = new RuckusNBIService();
