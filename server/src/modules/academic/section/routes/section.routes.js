const express = require('express');

const router = express.Router();

const {

    createSection,
    getSection,
    getSectionById,
    updateSection,
    openSection,
    closeSection,
    archiveSection,
    deleteSection,

} = require('../controller/section.controller')

const authMiddleware = require('../../../../middlewares/auth.middleware')

const authorizeRoles = require('../../../../middlewares/role.middleware')

router.get('/', authMiddleware, authorizeRoles('admin', 'registrar'), getSection)
router.get('/:id', authMiddleware, authorizeRoles('admin', 'registrar'), getSectionById)
router.post('/', authMiddleware, authorizeRoles('admin'), createSection)
router.put('/:id', authMiddleware, authorizeRoles('admin'), updateSection)
router.patch('/:id/open', authMiddleware, authorizeRoles('admin'), openSection)
router.patch('/:id/close', authMiddleware, authorizeRoles('admin'), closeSection)
router.patch('/:id/archive', authMiddleware, authorizeRoles('admin'), archiveSection)
router.delete('/:id', authMiddleware, authorizeRoles('admin'), deleteSection)


module.exports = router