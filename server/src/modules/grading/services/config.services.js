const GradeConfig = require('../models/gradeconfig.model');
const schemeService = require('./scheme.services');
const SectionSubject = require('../../sectionsubject/models/sectionsubject.model');

const DEFAULT_CATEGORIES = [
    { key: 'QUIZ', label: 'Quiz', weight: 20 },
    { key: 'SEATWORK', label: 'Seatwork', weight: 15 },
    { key: 'ACTIVITY', label: 'Activity', weight: 15 },
    { key: 'LAB', label: 'Lab', weight: 10 },
    { key: 'PROJECT', label: 'Project', weight: 20 },
    { key: 'EXAM', label: 'Exam', weight: 20 },
];

const getOrCreateConfig = async (sectionSubjectId) => {
    let config = await GradeConfig.findOne({ sectionSubject: sectionSubjectId });
    if (config) return config;

    const sectionSubject = await SectionSubject.findById(sectionSubjectId);
    if (!sectionSubject) throw new Error('Section subject not found.');

    const defaultScheme = await schemeService.getDefaultScheme();
    const categories = defaultScheme && defaultScheme.categories.length
        ? defaultScheme.categories.map((c) => ({
              key: c.key,
              label: c.label,
              weight: c.weight,
          }))
        : DEFAULT_CATEGORIES.map((c) => ({ key: c.key, label: c.label, weight: c.weight }));

    config = await GradeConfig.create({
        sectionSubject: sectionSubjectId,
        scheme: defaultScheme?._id || null,
        categories,
        termWeights: defaultScheme?.termWeights || { prelim: 1 / 3, midterm: 1 / 3, finals: 1 / 3 },
        passingGrade: defaultScheme?.passingGrade || 75,
    });

    return config;
};

const getConfig = async (sectionSubjectId) => {
    return await getOrCreateConfig(sectionSubjectId);
};

const updateConfig = async (sectionSubjectId, data) => {
    const config = await getOrCreateConfig(sectionSubjectId);

    if (data.categories !== undefined) config.categories = data.categories;
    if (data.termWeights !== undefined) config.termWeights = data.termWeights;
    if (data.passingGrade !== undefined) config.passingGrade = data.passingGrade;

    await config.save();
    return config;
};

module.exports = {
    getOrCreateConfig,
    getConfig,
    updateConfig,
};
