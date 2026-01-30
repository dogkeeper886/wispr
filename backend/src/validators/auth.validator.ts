import { z } from 'zod';

const ipAddressPattern = /^(?:\d{1,3}\.){3}\d{1,3}$|^[a-zA-Z0-9%]+$/;
const macAddressPattern = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^[a-zA-Z0-9%]+$/;

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').max(255),
  password: z.string().min(1, 'Password is required').max(255),
  nbiIP: z.string().min(1, 'NBI IP is required'),
  ueIP: z.string().regex(ipAddressPattern, 'Invalid UE IP format'),
  ueMac: z.string().regex(macAddressPattern, 'Invalid UE MAC format'),
});

export const loginAsyncSchema = loginSchema;

export const statusSchema = z.object({
  nbiIP: z.string().min(1, 'NBI IP is required'),
  ueIP: z.string().regex(ipAddressPattern, 'Invalid UE IP format'),
  ueMac: z.string().regex(macAddressPattern, 'Invalid UE MAC format'),
});

export const logoutSchema = statusSchema;

export const disconnectSchema = statusSchema;

export type LoginInput = z.infer<typeof loginSchema>;
export type LoginAsyncInput = z.infer<typeof loginAsyncSchema>;
export type StatusInput = z.infer<typeof statusSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
export type DisconnectInput = z.infer<typeof disconnectSchema>;
