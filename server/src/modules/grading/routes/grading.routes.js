const express = require('express');
const router = express.Router();

const authMiddleware = require('../../../middlewares/auth.middleware');
const authorizeRoles = require('../../../middlewares/role.middleware');

const c = require('../controllers/grading.controller');

router.use(authMiddleware);

/* ── Schemes ── */
router.get('/schemes', authorizeRoles('admin'), c.listSchemes);
router.post('/schemes', authorizeRoles('admin'), c.createScheme);
router.put('/schemes/:id', authorizeRoles('admin'), c.updateScheme);
router.delete('/schemes/:id', authorizeRoles('admin'), c.deleteScheme);

/* ── Per-class config ── */
router.get('/config/:sectionSubjectId', authorizeRoles('teacher'), c.getConfig);
router.put('/config/:sectionSubjectId', authorizeRoles('teacher'), c.updateConfig);

/* ── Enrollments + students ── */
router.get('/:sectionSubjectId/enrollments', authorizeRoles('teacher'), c.getEnrollments);
router.get('/:sectionSubjectId/students', authorizeRoles('teacher'), c.getStudents);

/* ── Items ── */
router.get('/:sectionSubjectId/items', authorizeRoles('teacher'), c.listItems);
router.post('/items', authorizeRoles('teacher'), c.createItem);
router.put('/items/:id', authorizeRoles('teacher'), c.updateItem);
router.delete('/items/:id', authorizeRoles('teacher'), c.deleteItem);

/* ── Scores ── */
router.post('/scores', authorizeRoles('teacher'), c.saveScores);
router.get('/items/:itemId/scores', authorizeRoles('teacher'), c.getScores);

/* ── Groups ── */
router.get('/:sectionSubjectId/groups', authorizeRoles('teacher'), c.listGroups);
router.post('/groups', authorizeRoles('teacher'), c.createGroup);
router.put('/groups/:id', authorizeRoles('teacher'), c.updateGroup);
router.delete('/groups/:id', authorizeRoles('teacher'), c.deleteGroup);

/* ── Computation ── */
router.get('/:sectionSubjectId/compute', authorizeRoles('teacher'), c.computeGrades);
router.post('/:sectionSubjectId/compute/save', authorizeRoles('teacher'), c.saveGrades);

/* ── Import ── */
router.post('/import', authorizeRoles('teacher'), c.importCsv);

module.exports = router;
