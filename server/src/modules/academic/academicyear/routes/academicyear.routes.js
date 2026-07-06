const express = require('express')

const router = express.Router()


const {
    createAcademicYear,
    getAcademicYear,
    updateAcademicYear,
    publishAcademicYear,
    activateAcademicYear,
    archiveAcademicYear,
    getCurrentAcademicYear,
    getAcademicYearById,

} = require('../controller/academicyear.controller')
const authMiddleware = require('../../../../middlewares/auth.middleware')
const authorizeRole = require('../../../../middlewares/role.middleware')


router.get('/', authMiddleware, authorizeRole('admin', 'registrar'), getAcademicYear)
router.get('/current', authMiddleware, authorizeRole('admin', 'registrar', 'teacher', 'student'), getCurrentAcademicYear)
router.get('/:id', authMiddleware, authorizeRole('admin', 'registrar', 'teacher', 'student'), getAcademicYearById)
router.post('/', authMiddleware, authorizeRole('admin'), createAcademicYear)
router.patch('/:id/publish', authMiddleware, authorizeRole('admin'), publishAcademicYear)
router.put('/:id', authMiddleware, authorizeRole('admin'), updateAcademicYear)
router.patch('/:id/activate', authMiddleware, authorizeRole('admin'), activateAcademicYear)
router.patch('/:id/archive', authMiddleware, authorizeRole('admin'), archiveAcademicYear)

module.exports = router;