// NBI Request Types
export type NBIRequestType =
  | 'Login'
  | 'LoginAsync'
  | 'Status'
  | 'Logout'
  | 'Disconnect'
  | 'EncryptIP'
  | 'DecryptIP';

export type NBIRequestCategory = 'UserOnlineControl' | 'GetConfig';

// Base NBI Request
export interface NBIBaseRequest {
  Vendor: 'Ruckus';
  RequestUserName: string;
  RequestPassword: string;
  APIVersion: string;
  RequestCategory: NBIRequestCategory;
  RequestType: NBIRequestType;
}

// Login Request
export interface NBILoginRequest extends NBIBaseRequest {
  RequestCategory: 'UserOnlineControl';
  RequestType: 'Login';
  'UE-IP': string;
  'UE-MAC': string;
  'UE-Username': string;
  'UE-Password': string;
}

// Async Login Request
export interface NBILoginAsyncRequest extends NBIBaseRequest {
  RequestCategory: 'UserOnlineControl';
  RequestType: 'LoginAsync';
  'UE-IP': string;
  'UE-MAC': string;
  'UE-Username': string;
  'UE-Password': string;
}

// Status Request
export interface NBIStatusRequest extends NBIBaseRequest {
  RequestCategory: 'UserOnlineControl';
  RequestType: 'Status';
  'UE-IP': string;
  'UE-MAC': string;
}

// Logout Request
export interface NBILogoutRequest extends NBIBaseRequest {
  RequestCategory: 'UserOnlineControl';
  RequestType: 'Logout';
  'UE-IP': string;
  'UE-MAC': string;
}

// Disconnect Request
export interface NBIDisconnectRequest extends NBIBaseRequest {
  RequestCategory: 'UserOnlineControl';
  RequestType: 'Disconnect';
  'UE-IP': string;
  'UE-MAC': string;
}

// Encrypt Request
export interface NBIEncryptRequest extends NBIBaseRequest {
  RequestCategory: 'GetConfig';
  RequestType: 'EncryptIP';
  'UE-IP': string;
}

// Decrypt Request
export interface NBIDecryptRequest extends NBIBaseRequest {
  RequestCategory: 'GetConfig';
  RequestType: 'DecryptIP';
  'UE-IP': string;
}

// NBI Response
export interface NBIResponse {
  Vendor?: string;
  APIVersion?: string;
  ResponseCategory?: string;
  ResponseType?: string;
  ReplyCode?: number;
  ReplyMessage?: string;
  'UE-IP'?: string;
  'UE-MAC'?: string;
  [key: string]: unknown;
}

// API Request DTOs
export interface LoginRequestDTO {
  username: string;
  password: string;
  nbiIP: string;
  ueIP: string;
  ueMac: string;
}

export interface LoginAsyncRequestDTO extends LoginRequestDTO {}

export interface StatusRequestDTO {
  nbiIP: string;
  ueIP: string;
  ueMac: string;
}

export interface LogoutRequestDTO {
  nbiIP: string;
  ueIP: string;
  ueMac: string;
}

export interface DisconnectRequestDTO {
  nbiIP: string;
  ueIP: string;
  ueMac: string;
}

export interface EncryptRequestDTO {
  nbiIP: string;
  ueIP: string;
}

export interface DecryptRequestDTO {
  nbiIP: string;
  ueIP: string;
}

// API Response
export interface APIResponse<T = unknown> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
}
