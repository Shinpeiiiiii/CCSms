const MaterialService = require('../services/material.service');

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const MaterialController = {
    uploadMaterial: asyncHandler(async (req, res) => {
        const { title, description, subject, category } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const material = await MaterialService.uploadMaterial({
            file,
            title,
            description,
            subject,
            category,
            userId: req.user.id,
        });

        return res.status(201).json({ success: true, data: material });
    }),

    addLink: asyncHandler(async (req, res) => {
        const { url, title, description, subject, category } = req.body;

        const material = await MaterialService.addLink({
            url,
            title,
            description,
            subject,
            category,
            userId: req.user.id,
        });

        return res.status(201).json({ success: true, data: material });
    }),

    getMyMaterials: asyncHandler(async (req, res) => {
        const materials = await MaterialService.getTeacherMaterials(req.user.id);
        return res.status(200).json({ success: true, data: materials });
    }),

    getBySubject: asyncHandler(async (req, res) => {
        const { subjectId } = req.params;
        const materials = await MaterialService.getMaterialsBySubject(subjectId);
        return res.status(200).json({ success: true, data: materials });
    }),

    getForStudent: asyncHandler(async (req, res) => {
        const materials = await MaterialService.getStudentMaterials(req.user.id);
        return res.status(200).json({ success: true, data: materials });
    }),

    deleteMaterial: asyncHandler(async (req, res) => {
        const { id } = req.params;
        await MaterialService.deleteMaterial(id, req.user.id);
        return res.status(200).json({ success: true, message: 'Material deleted' });
    }),

    downloadMaterial: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const material = await MaterialService.downloadMaterial(id);

        if (!material.filePath) {
            return res.status(400).json({ success: false, message: 'No file to download' });
        }

        const path = require('path');
        const fullPath = path.join(__dirname, '..', '..', '..', material.filePath);
        return res.download(fullPath, material.fileName);
    }),
};

module.exports = MaterialController;
