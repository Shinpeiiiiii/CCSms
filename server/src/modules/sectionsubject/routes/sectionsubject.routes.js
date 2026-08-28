const express = require('express');
const router = express.Router();

const authMiddleware = require('../../../middlewares/auth.middleware');
const authorizeRoles = require('../../../middlewares/role.middleware');

const {
    createSchedule, getSectionSchedule, generatesectionSubject, getSectionSubjects, updateSectionSubject, deleteSchedule, getMySchedule, getMyDashboard, getMyClasses, getClassStudents, getClassGrades, updateGrades
} = require('../controller/sectionsubject.controller');


router.use(authMiddleware);

router.get('/my-schedule', authorizeRoles('teacher'), getMySchedule);
router.get('/my-dashboard', authorizeRoles('teacher'), getMyDashboard);
router.get('/my-classes', authorizeRoles('teacher'), getMyClasses);
router.get('/section/:sectionId', authMiddleware, authorizeRoles('admin', 'registrar'), getSectionSchedule);
router.post('/', authMiddleware, authorizeRoles('admin', 'registrar'), createSchedule);
router.post(
    "/generate/:sectionId",
    authorizeRoles("admin", "registrar"),
    generatesectionSubject
);

router.get(
    "/:sectionId",
    authorizeRoles("admin", "registrar", "teacher"),
    getSectionSubjects
);

router.get(
    "/:sectionId/students",
    authorizeRoles("teacher"),
    getClassStudents
);

router.get(
    "/:sectionId/grades",
    authorizeRoles("teacher"),
    getClassGrades
);

router.patch(
    "/:sectionId/grades",
    authorizeRoles("teacher"),
    updateGrades
);

router.patch(
    "/:id",
    authorizeRoles("admin", "registrar"),
    updateSectionSubject
);

router.delete(
    "/:id",
    authorizeRoles("admin", "registrar"),
    deleteSchedule
);

module.exports = router;