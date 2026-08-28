const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middlewares/auth.middleware');
const authorizeRoles = require('../../../middlewares/role.middleware');
const upload = require('../../../middlewares/upload.middleware');
const MaterialController = require('../controllers/material.controller');

router.use(authMiddleware);

router.post(
    '/',
    authorizeRoles('teacher'),
    upload.single('file'),
    MaterialController.uploadMaterial
);

router.post(
    '/link',
    authorizeRoles('teacher'),
    MaterialController.addLink
);

router.get(
    '/my',
    authorizeRoles('teacher'),
    MaterialController.getMyMaterials
);

router.get(
    '/subject/:subjectId',
    authorizeRoles('teacher'),
    MaterialController.getBySubject
);

router.get(
    '/student',
    authorizeRoles('student'),
    MaterialController.getForStudent
);

router.get(
    '/download/:id',
    MaterialController.downloadMaterial
);

router.delete(
    '/:id',
    authorizeRoles('teacher'),
    MaterialController.deleteMaterial
);

module.exports = router;
