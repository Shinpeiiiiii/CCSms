const schemeService = require('../services/scheme.services');
const configService = require('../services/config.services');
const itemService = require('../services/item.services');
const computationService = require('../services/computation.services');
const importService = require('../services/import.services');

const handle = (fn) => async (req, res) => {
    try {
        const result = await fn(req);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

/* ── Schemes (admin) ── */
const createScheme = handle(async (req) => schemeService.createScheme(req.body));
const listSchemes = handle(async () => schemeService.listSchemes());
const updateScheme = handle(async (req) => schemeService.updateScheme(req.params.id, req.body));
const deleteScheme = handle(async (req) => schemeService.deleteScheme(req.params.id));

/* ── Per-class config ── */
const getConfig = handle(async (req) => configService.getConfig(req.params.sectionSubjectId));
const updateConfig = handle(async (req) => configService.updateConfig(req.params.sectionSubjectId, req.body));

/* ── Items ── */
const createItem = handle(async (req) => itemService.createGradeItem(req.user.id, req.body));
const listItems = handle(async (req) => itemService.listGradeItems(req.user.id, req.params.sectionSubjectId, req.query.term));
const updateItem = handle(async (req) => itemService.updateGradeItem(req.user.id, req.params.id, req.body));
const deleteItem = handle(async (req) => itemService.deleteGradeItem(req.user.id, req.params.id));

/* ── Scores ── */
const saveScores = handle(async (req) => itemService.saveScores(req.user.id, req.body));
const getScores = handle(async (req) => itemService.getScoresForItem(req.user.id, req.params.itemId));
const getStudents = handle(async (req) => itemService.getClassStudents(req.params.sectionSubjectId));

/* ── Groups ── */
const createGroup = handle(async (req) => itemService.createGroup(req.user.id, req.body));
const updateGroup = handle(async (req) => itemService.updateGroup(req.user.id, req.params.id, req.body));
const deleteGroup = handle(async (req) => itemService.deleteGroup(req.user.id, req.params.id));
const listGroups = handle(async (req) => itemService.listGroups(req.user.id, req.params.sectionSubjectId));

/* ── Computation ── */
const computeGrades = handle(async (req) => computationService.computeClassResults(req.params.sectionSubjectId));
const saveGrades = handle(async (req) => computationService.saveComputedGrades(req.params.sectionSubjectId));
const getEnrollments = handle(async (req) => itemService.getClassEnrollments(req.params.sectionSubjectId));

/* ── Import ── */
const importCsv = handle(async (req) => importService.importScores(req.user.id, req.body));

module.exports = {
    createScheme,
    listSchemes,
    updateScheme,
    deleteScheme,
    getConfig,
    updateConfig,
    createItem,
    listItems,
    updateItem,
    deleteItem,
    saveScores,
    getScores,
    getStudents,
    createGroup,
    updateGroup,
    deleteGroup,
    listGroups,
    computeGrades,
    saveGrades,
    getEnrollments,
    importCsv,
};
