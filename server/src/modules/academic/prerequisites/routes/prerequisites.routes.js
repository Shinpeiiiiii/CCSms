const express = require("express");
const router = express.Router();

const {
    createPrerequisite,
    getPrerequisite,
    getPrerequisiteById,
    getPrerequisiteBySubject,
    checkEligibility,
    updatePrerequisite,
    deactivatePrerequisite

} = require("../controllers/prerequisites.controller");

const authMiddleware = require("../../../../middlewares/auth.middleware");
const authorizeRoles = require("../../../../middlewares/role.middleware");
const { getPrerequisitesBySubject } = require("../services/prerequisites.services");

router.post('/', authMiddleware, authorizeRoles('admin'), createPrerequisite);
router.get('/', authMiddleware, authorizeRoles('admin'), getPrerequisite);
router.get('/subject/:subjectId', authMiddleware, authorizeRoles('admin'), getPrerequisiteBySubject);
router.get('/:id', authMiddleware, authorizeRoles('admin'), getPrerequisiteById);
router.put('/:id', authMiddleware, authorizeRoles('admin'), updatePrerequisite);
router.patch('/:id/deactivate', authMiddleware, authorizeRoles('admin'), deactivatePrerequisite);
router.get('/subject/:subjectId/check-eligibility', authMiddleware, authorizeRoles('admin','registrar'), checkEligibility);

module.exports = router;