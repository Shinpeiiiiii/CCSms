const express = require('express');;
const router = express.Router();

const authMiddleware = require('../../../middlewares/auth.middleware');
const authorizeRoles = require('../../../middlewares/role.middleware');

const {
    createSchedule, getSectionSchedule,
} = require('../controller/sectionsubject.controller')

router.get('/section/:sectionId', authMiddleware, authorizeRoles('admin', 'registrar'), getSectionSchedule);
router.post('/', authMiddleware, authorizeRoles('admin', 'registrar'), createSchedule);

module.exports = router;