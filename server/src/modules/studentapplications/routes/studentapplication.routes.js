const express = require("express");
const router = express.Router();

const {startApplication, getPendingApplications, getApplicationById, submitApplication, approveApplication,
    rejectApplication, requestRevision, trackApplication,
} = require("../controllers/studentapplication.controller");

const authorizeRoles = require("../../../middlewares/role.middleware")
const authMiddleware = require("../../../middlewares/auth.middleware")

router.post('/start', startApplication);
router.get('/track', trackApplication);
router.get('/track/:trackingNumber', trackApplication);
router.put('/:id', submitApplication);
router.get('/', authMiddleware, authorizeRoles('registrar','admin'), getPendingApplications);
router.get('/:id', authMiddleware, authorizeRoles('registrar','admin'), getApplicationById);
router.patch('/:id/approve', authMiddleware, authorizeRoles('admin', 'registrar'), approveApplication);
router.patch('/:id/reject', authMiddleware, authorizeRoles('admin', 'registrar'), rejectApplication);
router.patch('/:id/request-revision', authMiddleware, authorizeRoles('admin', 'registrar'), requestRevision);


module.exports = router;

