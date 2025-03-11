// Simple encryption/decryption for demo purposes
// In production, use a proper encryption library and secure key management

const ENCRYPTION_KEY = 'prophone-copilot-key';

export function encryptData(data: string): string {
  try {
    // For demo, we'll do a simple XOR encryption with base64 encoding
    const encrypted = data.split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(0))
    ).join('');
    return btoa(encrypted);
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
}

export function decryptData(encryptedData: string): string {
  try {
    const decoded = atob(encryptedData);
    return decoded.split('').map(char =>
      String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(0))
    ).join('');
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
}