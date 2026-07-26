const express = require('express');
const router = express.Router();

const authMiddleware = require('../../../middlewares/auth.middleware');
const authorizeRoles = require('../../../middlewares/role.middleware');

const {
    createSchedule, getSectionSchedule, generatesectionSubject, getSectionSubjects, updateSectionSubject, deleteSchedule
} = require('../controller/sectionsubject.controller');


router.use(authMiddleware);

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