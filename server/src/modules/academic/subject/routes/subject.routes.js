const express = require("express");

const router = express.Router();

const {
    createSubject,
    getSubject,
    updateSubject,
    deleteSubject,
    getSubjectById,
    getVersionHistory,
    createNewVersion
} = require('../controller/subject.controller');

const authMiddleware = require("../../../../middlewares/auth.middleware");
const authorizeRoles = require("../../../../middlewares/role.middleware");

router.get("/",authMiddleware,authorizeRoles('admin','registrar','teacher'), getSubject);
router.get("/:id",authMiddleware,authorizeRoles('admin','registrar','teacher'), getSubjectById);
router.post("/",authMiddleware,authorizeRoles('admin'), createSubject);
router.post("/:id/version",authMiddleware,authorizeRoles('admin'), createNewVersion);
router.get("/:id/history",authMiddleware,authorizeRoles('admin','registrar'), getVersionHistory);
router.put("/:id",authMiddleware,authorizeRoles('admin'), updateSubject);
router.delete("/:id",authMiddleware,authorizeRoles('admin'), deleteSubject);

module.exports = router;
