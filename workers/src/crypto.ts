import { createCipheriv, createDecipheriv, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SALT = process.env.TOKEN_ENCRYPTION_SALT ?? 'pf-token-salt-v1';

function deriveKey(key: string): Buffer {
  return scryptSync(key, SALT, 32);
}

export function decryptToken(ciphertext: string, key: string): string {
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
