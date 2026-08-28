const express = require('express')
const router = express.Router()

const {
    saveAsTemplate,
    getTemplates,
    createFromTemplate,
    exportCurriculum,
    importCurriculum,
} = require('../controller/template.controller')

const authMiddleware = require('../../../../middlewares/auth.middleware')
const authorizeRoles = require('../../../../middlewares/role.middleware')

router.get('/templates', authMiddleware, authorizeRoles('admin', 'registrar'), getTemplates)
router.post('/:id/template', authMiddleware, authorizeRoles('admin', 'registrar'), saveAsTemplate)
router.post('/from-template/:templateId', authMiddleware, authorizeRoles('admin', 'registrar'), createFromTemplate)
router.get('/:id/export', authMiddleware, authorizeRoles('admin', 'registrar'), exportCurriculum)
router.post('/import', authMiddleware, authorizeRoles('admin', 'registrar'), importCurriculum)

module.exports = router
