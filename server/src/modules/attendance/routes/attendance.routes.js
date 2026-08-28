const express = require('express');
const router = express.Router();

const {
    markAttendance,
    getAttendanceByDate,
    getAttendanceSummary,
    getAttendanceCalendar,
    getMyAttendance,
} = require("../controllers/attendance.controller");

const authMiddleware = require("../../../middlewares/auth.middleware");
const authorizeRoles = require("../../../middlewares/role.middleware");

router.use(authMiddleware);

router.post('/mark', authorizeRoles('teacher'), markAttendance);
router.get('/my', authorizeRoles('teacher'), getMyAttendance);
router.get('/section-subject/:sectionSubjectId/date/:date', authorizeRoles('teacher'), getAttendanceByDate);
router.get('/section-subject/:sectionSubjectId/summary', authorizeRoles('teacher'), getAttendanceSummary);
router.get('/section-subject/:sectionSubjectId/calendar', authorizeRoles('teacher'), getAttendanceCalendar);

module.exports = router;
