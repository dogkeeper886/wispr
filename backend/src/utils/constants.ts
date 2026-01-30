export const NBI_PORT = 443;
export const NBI_ENDPOINT = '/portalintf';
export const NBI_VENDOR = 'Ruckus';
export const NBI_REQUEST_USERNAME = 'api';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const NBI_REPLY_CODES = {
  SUCCESS: 201,
  AUTH_FAILED: 301,
  INVALID_REQUEST: 401,
  SYSTEM_ERROR: 501,
} as const;
