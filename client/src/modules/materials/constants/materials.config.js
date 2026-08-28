import { FileText, FileImage, FileVideo, Link2, File, FileSpreadsheet } from 'lucide-react';

export const FILE_TYPE_CONFIG = {
    pdf: {
        icon: FileText,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        label: 'PDF',
    },
    doc: {
        icon: FileText,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        label: 'DOC',
    },
    ppt: {
        icon: FileSpreadsheet,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        label: 'PPT',
    },
    image: {
        icon: FileImage,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        label: 'Image',
    },
    video: {
        icon: FileVideo,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        label: 'Video',
    },
    link: {
        icon: Link2,
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-200',
        label: 'Link',
    },
    archive: {
        icon: File,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        label: 'Archive',
    },
    other: {
        icon: File,
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        label: 'File',
    },
};

export const CATEGORY_OPTIONS = [
    'Textbook',
    'Lecture Notes',
    'Slides',
    'Lab Materials',
    'Sample Problems',
    'Other',
];

export const getFileTypeConfig = (fileType) => {
    return FILE_TYPE_CONFIG[fileType] || FILE_TYPE_CONFIG.other;
};

export const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '—';
    const units = ['B', 'KB', 'MB', 'GB'];
    let idx = 0;
    let size = bytes;
    while (size >= 1024 && idx < units.length - 1) {
        size /= 1024;
        idx++;
    }
    return `${size.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`;
};
