const crypto = require('crypto');

const getKey = () => {
    const secret = process.env.JWT_ACCESS_SECRET || 'teacherportal-dev-secret';
    return crypto.createHash('sha256').update(secret).digest();
};

const encrypt = (plainText) => {
    if (plainText === null || plainText === undefined) return null;
    const key = getKey();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(String(plainText), 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
};

const decrypt = (encryptedText) => {
    if (!encryptedText) return null;
    const key = getKey();
    const parts = encryptedText.split(':');
    if (parts.length !== 3) return null;
    const iv = Buffer.from(parts[0], 'base64');
    const tag = Buffer.from(parts[1], 'base64');
    const data = Buffer.from(parts[2], 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return decipher.update(data, null, 'utf8') + decipher.final('utf8');
};

module.exports = { encrypt, decrypt };