const MATERIAL_CATEGORIES = [
    'Textbook',
    'Lecture Notes',
    'Slides',
    'Lab Materials',
    'Sample Problems',
    'Other',
];

const ALLOWED_MIME_TYPES = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'doc',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ppt',
    'image/jpeg': 'image',
    'image/png': 'image',
    'video/mp4': 'video',
    'application/zip': 'archive',
    'application/x-rar-compressed': 'archive',
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_EXTENSIONS = Object.keys(ALLOWED_MIME_TYPES);

module.exports = {
    MATERIAL_CATEGORIES,
    ALLOWED_MIME_TYPES,
    MAX_FILE_SIZE,
    ALLOWED_EXTENSIONS,
};
