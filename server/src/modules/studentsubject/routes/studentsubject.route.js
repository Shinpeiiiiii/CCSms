const express = require('express');
const router = express.Router();

const {
    generateLoad, getStudentLoad, getMySubjects, removeSubjects, generateBulkLoads
} = require("../controllers/studentsubject.controller")

const authMiddleware = require("../../../middlewares/auth.middleware");
const authorizeRoles = require("../../../middlewares/role.middleware");

router.post('/generate', authMiddleware, authorizeRoles('admin','registrar'),generateLoad);
router.post('/generate-bulk', authMiddleware, authorizeRoles('admin','registrar'), generateBulkLoads);
router.get('/student/:studentId', authMiddleware, authorizeRoles('admin', 'registrar'), getStudentLoad);
router.get('/me', authMiddleware, authorizeRoles('admin', 'registrar'), getMySubjects);
router.delete('/:id', authMiddleware, authorizeRoles('admin', "registrar"), removeSubjects)


module.exports = router;