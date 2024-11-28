import CryptoJS from 'crypto-js';

const SECRET_KEY = 'my_super_secret_key_1234567890'; // Replace with a strong, secure key

export function encrypt(data) {
    try {
      // Convert data to a JSON string if it's an object
      const jsonData = typeof data === 'object' ? JSON.stringify(data) : data;
      return CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return ''; // Return empty string on error
    }
  }
  
  export function decrypt(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedData; // Ensure this is a JSON string
    } catch (error) {
      console.error('Decryption failed:', error);
      return '{}'; // Return an empty JSON object on error
    }
  }