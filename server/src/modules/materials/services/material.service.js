const MaterialRepository = require('../repositories/material.repository');
const MaterialStorageService = require('./material-storage.service');
const StudentSubject = require('../../studentsubject/models/studentsubject.models');
const SectionSubject = require('../../sectionsubject/models/sectionsubject.model');

const MaterialService = {
    async uploadMaterial({ file, title, description, subject, category, userId }) {
        if (!file) {
            throw new Error('No file uploaded');
        }

        const fileType = MaterialStorageService.resolveFileType(file.mimetype);
        const relativePath = MaterialStorageService.getRelativePath(file.filename);

        const material = await MaterialRepository.create({
            title,
            description,
            subject,
            category,
            fileType,
            filePath: relativePath,
            fileUrl: null,
            fileName: file.originalname,
            fileSize: file.size,
            uploadedBy: userId,
        });

        return material;
    },

    async addLink({ url, title, description, subject, category, userId }) {
        if (!url) {
            throw new Error('URL is required');
        }

        let fileType = 'link';
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            fileType = 'video';
        } else if (url.includes('docs.google.com') || url.includes('drive.google.com')) {
            fileType = 'doc';
        }

        const material = await MaterialRepository.create({
            title,
            description,
            subject,
            category,
            fileType,
            filePath: null,
            fileUrl: url,
            fileName: null,
            fileSize: 0,
            uploadedBy: userId,
        });

        return material;
    },

    async getTeacherMaterials(teacherId) {
        return MaterialRepository.findByUploader(teacherId);
    },

    async getMaterialsBySubject(subjectId) {
        return MaterialRepository.findBySubject(subjectId);
    },

    async getStudentMaterials(studentId) {
        const enrollments = await StudentSubject.find({ student: studentId })
            .populate({
                path: 'sectionSubject',
                select: 'subject',
            });

        const subjectIds = enrollments
            .map((e) => e.sectionSubject?.subject)
            .filter(Boolean);

        if (subjectIds.length === 0) {
            return [];
        }

        return MaterialRepository.findBySubjects(subjectIds);
    },

    async deleteMaterial(materialId, userId) {
        const material = await MaterialRepository.findById(materialId);

        if (!material) {
            throw new Error('Material not found');
        }

        if (material.uploadedBy.toString() !== userId.toString()) {
            throw new Error('Not authorized to delete this material');
        }

        if (material.filePath) {
            const filename = MaterialStorageService.extractFilename(material.filePath);
            await MaterialStorageService.deleteFile(filename);
        }

        await MaterialRepository.deleteById(materialId);

        return { deleted: true };
    },

    async downloadMaterial(materialId) {
        const material = await MaterialRepository.findById(materialId);

        if (!material) {
            throw new Error('Material not found');
        }

        await MaterialRepository.incrementDownloads(materialId);

        return material;
    },
};

module.exports = MaterialService;
