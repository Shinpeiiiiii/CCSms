const express = require('express')

const router = express.Router()

const {

    addSubjectToCurriculum,
    bulkAddSubjectToCurriculum,
    getCurriculumSubject,
    updateCurriculumSubject,
    removeCurriculumSubject,

} = require('../controller/curriculum.subject.controller')

const authMiddleware = require('../../../../middlewares/auth.middleware')
const authorizeRoles = require('../../../../middlewares/role.middleware')

router.get('/curriculum/:curriculumId/subjects', authMiddleware, authorizeRoles('admin', 'registrar'), getCurriculumSubject)
router.get('/curriculum/:curriculumId/subject', authMiddleware, authorizeRoles('admin', 'registrar'), getCurriculumSubject)
router.post('/curriculum/:curriculumId/subjects', authMiddleware, authorizeRoles('admin', 'registrar'), addSubjectToCurriculum)
router.post('/curriculum/:curriculumId/subject', authMiddleware, authorizeRoles('admin', 'registrar'), addSubjectToCurriculum)
router.post('/curriculum/:curriculumId/bulk', authMiddleware, authorizeRoles('admin'), getCurriculumSubject)
router.put('/curriculumsubject/:id', authMiddleware, authorizeRoles('admin'), updateCurriculumSubject)
router.delete('/curriculumsubject/:id', authMiddleware, authorizeRoles('admin'), removeCurriculumSubject)

module.exports = router