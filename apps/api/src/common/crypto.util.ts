import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const DEFAULT_DEV_SALT = 'pf-token-salt-v1';

function resolveSalt(): string {
  const salt = process.env.TOKEN_ENCRYPTION_SALT;
  if (salt?.trim()) return salt;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('TOKEN_ENCRYPTION_SALT must be set in production');
  }
  return DEFAULT_DEV_SALT;
}

function deriveKey(key: string): Buffer {
  return scryptSync(key, resolveSalt(), 32);
}

export function encryptToken(plaintext: string, key: string): string {
  const iv = randomBytes(16);
  const derivedKey = deriveKey(key);
  const cipher = createCipheriv(ALGORITHM, derivedKey, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptToken(ciphertext: string, key: string): string {
  if (ciphertext === 'revoked') {
    throw new Error('Plaid access token has been revoked');
  }
  const [ivHex, authTagHex, encryptedHex] = ciphertext.split(':');
  const iv = Buffer.from(ivHex!, 'hex');
  const authTag = Buffer.from(authTagHex!, 'hex');
  const encrypted = Buffer.from(encryptedHex!, 'hex');
  const derivedKey = deriveKey(key);
  const decipher = createDecipheriv(ALGORITHM, derivedKey, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

export function requireEncryptionKey(key: string | undefined, env: string): string {
  if (key && key !== 'dev-key-change-in-production') return key;
  if (env === 'production') {
    throw new Error('TOKEN_ENCRYPTION_KEY must be set in production');
  }
  return key ?? 'dev-key-change-in-production';
}
