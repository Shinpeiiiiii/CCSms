const express = require('express');
const router = express.Router();

const {

    createCurriculum,
    getCurriculum,
    getCurriculumById,
    updateCurriculum,
    publishCurriculum,
    archiveCurriculum,
    createNewVersion,
    getVersionHistory,
    autoStructureCurriculum,

} = require('../controller/curriculum.controller')

const authMiddleware = require('../../../../middlewares/auth.middleware')
const authorizeRoles = require('../../../../middlewares/role.middleware')

router.get('/:id',authMiddleware, authorizeRoles('admin','registrar'), getCurriculumById)
router.get('/', authMiddleware, authorizeRoles('admin','registrar','teacher','student'), getCurriculum)
router.post('/',authMiddleware, authorizeRoles('admin'), createCurriculum)
router.post('/:id/version',authMiddleware, authorizeRoles('admin'), createNewVersion)
router.post('/:id/structure', authMiddleware, authorizeRoles('admin'), autoStructureCurriculum)
router.get('/:id/history',authMiddleware, authorizeRoles('admin'), getVersionHistory)
router.put('/:id',authMiddleware, authorizeRoles('admin'), updateCurriculum)
router.patch('/:id/publish',authMiddleware, authorizeRoles('admin'), publishCurriculum)
router.patch('/:id/archive', authMiddleware, authorizeRoles('admin'), archiveCurriculum)

module.exports = router


    autoStructureCurriculum

