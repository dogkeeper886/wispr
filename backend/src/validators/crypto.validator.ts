import { z } from 'zod';

const ipAddressPattern = /^(?:\d{1,3}\.){3}\d{1,3}$|^[a-zA-Z0-9%]+$/;

export const encryptSchema = z.object({
  nbiIP: z.string().min(1, 'NBI IP is required'),
  ueIP: z.string().regex(ipAddressPattern, 'Invalid UE IP format'),
});

export const decryptSchema = encryptSchema;

export type EncryptInput = z.infer<typeof encryptSchema>;
export type DecryptInput = z.infer<typeof decryptSchema>;
