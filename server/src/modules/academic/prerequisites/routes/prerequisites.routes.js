const express = require("express");
const router = express.Router();

const {
    createPrerequisite,
    getPrerequisite,
    getPrerequisiteById,
    updatePrerequisite,
    deactivatePrerequisite

} = require("../controllers/prerequisites.controller");

const authMiddleware = require("../../../../middlewares/auth.middleware");
const authorizeRoles = require("../../../../middlewares/role.middleware");

router.post('/', authMiddleware, authorizeRoles('admin'), createPrerequisite);
router.get('/', authMiddleware, authorizeRoles('admin'), getPrerequisite);
router.get('/:id', authMiddleware, authorizeRoles('admin'), getPrerequisiteById);
router.put('/:id', authMiddleware, authorizeRoles('admin'), updatePrerequisite);
router.patch('/:id/deactivate', authMiddleware, authorizeRoles('admin'), deactivatePrerequisite);

module.exports = router;