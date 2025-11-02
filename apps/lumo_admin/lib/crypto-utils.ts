import crypto from 'crypto';

// Ensure you have a strong, 32-byte secret key in your .env file
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ''; // Must be 32 characters for AES-256
if (ENCRYPTION_KEY.length !== 32) {
  throw new Error('Invalid ENCRYPTION_KEY length. Must be 32 characters.');
}
const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypts a piece of text.
 * @param {string} text The text to encrypt.
 * @returns {string} The encrypted text, including the IV for decryption.
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16); // Generate a random Initialization Vector
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // Prepend the IV to the encrypted string (IV is not secret)
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts a piece of text.
 * @param {string} encryptedText The text to decrypt (must include the IV).
 * @returns {string} The original, decrypted text.
 */
export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts.shift() as string, 'hex');
  const encrypted = parts.join(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
