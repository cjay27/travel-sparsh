const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const keyStr = process.env.ENCRYPTION_KEY || '01234567890123456789012345678901';
const ivStr = process.env.ENCRYPTION_IV || '0123456789012345';

const key = Buffer.from(keyStr, keyStr.length === 64 ? 'hex' : 'utf8');
const iv = Buffer.from(ivStr, ivStr.length === 32 ? 'hex' : 'utf8');

const encrypt = (text) => {
  if (!text) return text;
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (encrypted) => {
  if (!encrypted) return encrypted;
  try {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    // Return original if decryption fails (e.g., if it's already plain)
    return encrypted;
  }
};

module.exports = { encrypt, decrypt };
