const express = require('express');
const router = express.Router();

const{
    createEnrollmentPeriod,
    getEnrollmentPeriod,
    getEnrollmentPeriodById,
    getCurrentEnrollmentPeriod,
    updateEnrollmentPeriod,
    publishEnrollmentPeriod,
    openEnrollmentPeriod,
    closeEnrollmentPeriod,
    archiveEnrollmentPeriod,
} = require('../controller/enrollmentperiod.controller');

const authMiddleware = require('../../../../middlewares/auth.middleware');
const authorizeRole = require('../../../../middlewares/role.middleware');

router.get('/', authMiddleware, authorizeRole('admin', 'registrar'), getEnrollmentPeriod);
router.get('/current', authMiddleware, authorizeRole('admin', 'registrar', 'teacher', 'student'), getCurrentEnrollmentPeriod);
router.get('/:id', authMiddleware, authorizeRole('admin', 'registrar', 'teacher'), getEnrollmentPeriodById);
router.post('/', authMiddleware, authorizeRole('admin'), createEnrollmentPeriod);
router.patch('/:id/publish', authMiddleware, authorizeRole('admin'), publishEnrollmentPeriod);
router.put('/:id', authMiddleware, authorizeRole('admin'), updateEnrollmentPeriod);
router.patch('/:id/open', authMiddleware, authorizeRole('admin'), openEnrollmentPeriod);
router.patch('/:id/close', authMiddleware, authorizeRole('admin'), closeEnrollmentPeriod);
router.patch('/:id/archive', authMiddleware, authorizeRole('admin'), archiveEnrollmentPeriod);

module.exports = router;