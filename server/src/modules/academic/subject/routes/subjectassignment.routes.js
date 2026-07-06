const express = require('express')

const router = express.Router()

const {
    createSubjectAssignment,
    getSubjectAssignment,
    getSubjectAssignmentById,
    updateSubjectAssignment,
    cancelSubjectAssignment,
    deleteSubjectAssignment,
} = require('../controller/subjectassignment.controller')

const authMiddleware = require('../../../../middlewares/auth.middleware')
const authorizeRoles = require('../../../../middlewares/role.middleware')    

router.get('/', authMiddleware, authorizeRoles('admin','registrar'), getSubjectAssignment)
router.get('/:id', authMiddleware, authorizeRoles('admin','registrar'), getSubjectAssignmentById)
router.post('/', authMiddleware, authorizeRoles('admin','registrar'), createSubjectAssignment)
router.put('/:id', authMiddleware, authorizeRoles('admin','registrar'), updateSubjectAssignment)
router.patch('/:id/cancel', authMiddleware, authorizeRoles('admin','registrar'), cancelSubjectAssignment)
router.delete('/:id', authMiddleware, authorizeRoles('admin','registrar'), deleteSubjectAssignment)


module.exports = router