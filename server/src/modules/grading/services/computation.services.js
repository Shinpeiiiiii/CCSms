const GradeItem = require('../models/gradeitem.model');
const GradeScore = require('../models/gradescore.model');
const GradeGroup = require('../models/gradegroup.model');
const configService = require('./config.services');
const SectionSubject = require('../../sectionsubject/models/sectionsubject.model');
const StudentSubject = require('../../studentsubject/models/studentsubject.models');

const round2 = (n) => (n == null ? null : Math.round(n * 100) / 100);

const computeClassResults = async (sectionSubjectId) => {
    const sectionSubject = await SectionSubject.findById(sectionSubjectId)
        .populate('subject', 'subjectCode subjectName totalUnits')
        .populate('section', 'sectionCode sectionName');
    if (!sectionSubject) throw new Error('Section subject not found.');

    const config = await configService.getOrCreateConfig(sectionSubjectId);

    const enrollments = await StudentSubject.find({
        section: sectionSubject.section._id,
        subject: sectionSubject.subject._id,
    })
        .populate('student', 'studentNumber firstName lastName')
        .sort({ 'student.lastName': 1 });

    const items = await GradeItem.find({ sectionSubject: sectionSubjectId });
    const itemIds = items.map((i) => i._id);
    const scores = await GradeScore.find({ gradeItem: { $in: itemIds } });
    const groups = await GradeGroup.find({ sectionSubject: sectionSubjectId });

    const groupMap = {};
    groups.forEach((g) => {
        g.members.forEach((m) => {
            const key = String(m.student);
            if (!groupMap[key]) groupMap[key] = {};
            groupMap[key][String(g._id)] = m.adjustment || 0;
        });
    });

    const categorySet = config.categories.map((c) => c.key);

    const results = enrollments.map((enr) => {
        const studentId = String(enr.student._id);
        const terms = { prelim: {}, midterm: {}, finals: {} };

        config.categories.forEach((cat) => {
            ['prelim', 'midterm', 'finals'].forEach((term) => {
                terms[term][cat.key] = { earned: 0, possible: 0 };
            });
        });

        items.forEach((item) => {
            let earned = null;
            if (item.isGroup) {
                const adjustment = groupMap[studentId]?.[String(item.groupId)] ?? 0;
                if (item.baseScore != null) {
                    earned = Math.max(0, Math.min(item.possible, Number(item.baseScore) + adjustment));
                }
            } else {
                const sc = scores.find((s) => String(s.gradeItem) === String(item._id) && String(s.student._id) === studentId);
                if (sc) earned = sc.score;
            }

            if (earned == null) return;
            const slot = terms[item.term][item.category];
            if (!slot) return;
            slot.earned += earned;
            slot.possible += Number(item.possible);
        });

        const termGrades = {};
        ['prelim', 'midterm', 'finals'].forEach((term) => {
            let sum = 0;
            let any = false;
            config.categories.forEach((cat) => {
                const slot = terms[term][cat.key];
                const weight = config.categories.find((c) => c.key === cat.key)?.weight || 0;
                if (slot.possible > 0) {
                    any = true;
                    const pct = (slot.earned / slot.possible) * 100;
                    sum += (weight / 100) * pct;
                }
            });
            termGrades[term] = any ? round2(sum) : null;
        });

        const hasAll = ['prelim', 'midterm', 'finals'].every((t) => termGrades[t] != null);
        let finalGrade = null;
        if (hasAll) {
            finalGrade = round2(
                termGrades.prelim * config.termWeights.prelim +
                    termGrades.midterm * config.termWeights.midterm +
                    termGrades.finals * config.termWeights.finals
            );
        }

        return {
            enrollment: enr,
            student: enr.student,
            terms,
            termGrades,
            finalGrade,
        };
    });

    return { sectionSubject, config, results };
};

const saveComputedGrades = async (sectionSubjectId) => {
    const full = await computeClassResults(sectionSubjectId);
    const { results, config } = full;

    await Promise.all(
        results.map(async (r) => {
            const updates = {
                prelimGrade: r.termGrades.prelim,
                midtermGrade: r.termGrades.midterm,
                finalsGrade: r.termGrades.finals,
                finalGrade: r.finalGrade,
            };

            if (r.finalGrade != null) {
                const pass = r.finalGrade >= (config.passingGrade || 75);
                updates.remarks = pass ? 'Passed' : 'Failed';
                updates.status = pass ? 'Completed' : 'Failed';
            } else {
                updates.remarks = null;
                updates.status = 'Loaded';
            }

            await StudentSubject.findByIdAndUpdate(r.enrollment._id, updates, { new: true });
        })
    );

    return full;
};

module.exports = {
    computeClassResults,
    saveComputedGrades,
    round2,
};
