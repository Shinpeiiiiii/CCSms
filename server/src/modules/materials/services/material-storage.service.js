const fs = require('fs');
const path = require('path');
const { ALLOWED_MIME_TYPES } = require('../constants/material.constants');

const UPLOAD_DIR = path.join(__dirname, '..', '..', '..', 'uploads', 'materials');

const MaterialStorageService = {
    getUploadDir() {
        return UPLOAD_DIR;
    },

    resolveFileType(mimetype) {
        return ALLOWED_MIME_TYPES[mimetype] || 'other';
    },

    getFilePath(filename) {
        return path.join(UPLOAD_DIR, filename);
    },

    getRelativePath(filename) {
        return `/uploads/materials/${filename}`;
    },

    async deleteFile(filename) {
        const filePath = path.join(UPLOAD_DIR, filename);
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (err) {
            console.error('Failed to delete file:', filename, err.message);
        }
    },

    extractFilename(filePath) {
        return path.basename(filePath);
    },
};

module.exports = MaterialStorageService;
