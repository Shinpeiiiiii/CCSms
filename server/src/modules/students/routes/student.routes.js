const express = require('express')


const {
    createStudent,
    getStudents,
    deleteStudent,
    updateStudent, getMyProfile, updateMyProfile, getDashboard, getMySubjects, assignSection
} = require('../controllers/student.controller')

const router = express.Router()
const authMiddleware = require("../../../middlewares/auth.middleware");
const authorizeRoles = require("../../../middlewares/role.middleware");

router.post('/', createStudent)
router.get('/', getStudents)
router.delete('/:id', deleteStudent)
router.put('/:id', updateStudent)

router.patch('/:id/assign-section', authMiddleware, authorizeRoles('admin','registrar'), assignSection)


router.get('/profile', authMiddleware, authorizeRoles('student'), getMyProfile)
router.put('/profile/update', authMiddleware, authorizeRoles('student'), updateMyProfile)
router.get('/dashboard', authMiddleware, authorizeRoles('student'), getDashboard)
router.get('/subjects', authMiddleware, authorizeRoles('student'), getMySubjects)


module.exports = router