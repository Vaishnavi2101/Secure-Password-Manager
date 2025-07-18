import CryptoJS from 'crypto-js';

/**
 * Turns the master password into a strong encryption key.
 */
export function deriveKey(masterPassword) {
  return CryptoJS.PBKDF2(masterPassword, 'your-salt', {
    keySize: 256 / 32,
    iterations: 1000
  }).toString();
}

/**
 * Encrypts data (like a website password) using the derived key.
 */
export function encryptData(data, key) {
  return CryptoJS.AES.encrypt(data, key).toString();
}

/**
 * Decrypts previously encrypted data using the same key.
 */
export function decryptData(ciphertext, key) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
