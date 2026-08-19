const express = require('express')

const router = express.Router()

const {
    createTeacherAssignment,
    getTeacherAssignment,
    getTeacherAssignmentById,
    updateTeacherAssignment,
    unassignTeacher,
    deleteTeacherAssignment,
} = require('../controller/teacherassignment.controller')

const authMiddleware = require('../../../middlewares/auth.middleware')
const authorizeRoles = require('../../../middlewares/role.middleware')


router.get('/', authMiddleware, authorizeRoles('admin','registrar'), getTeacherAssignment)
router.get('/:id', authMiddleware, authorizeRoles('admin','registrar'), getTeacherAssignmentById)
router.post('/', authMiddleware, authorizeRoles('admin','registrar'), createTeacherAssignment)
router.put('/', authMiddleware, authorizeRoles('admin','registrar'), updateTeacherAssignment)
router.patch('/:id/unassign', authMiddleware, authorizeRoles('admin','registrar'), unassignTeacher)
router.delete('/:id', authMiddleware, authorizeRoles('admin','registrar'), deleteTeacherAssignment)


module.exports = router