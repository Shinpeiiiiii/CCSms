const GradeItem = require('../models/gradeitem.model');
const GradeScore = require('../models/gradescore.model');
const itemService = require('./item.services');
const SectionSubject = require('../../sectionsubject/models/sectionsubject.model');
const Student = require('../../students/models/Student');

const parseCsv = (csvText) => {
    const lines = csvText
        .replace(/\r/g, '')
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

    return lines.map((line) => {
        const cells = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                inQuotes = !inQuotes;
            } else if (ch === ',' && !inQuotes) {
                cells.push(current.trim());
                current = '';
            } else {
                current += ch;
            }
        }
        cells.push(current.trim());
        return cells;
    });
};

const normalizeName = (name) =>
    String(name)
        .toLowerCase()
        .replace(/[^a-z]/g, '');

const importScores = async (teacherId, data) => {
    const { sectionSubject, itemIds, csv } = data;
    if (!csv || typeof csv !== 'string') throw new Error('CSV content is required.');
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
        throw new Error('At least one grade item is required.');
    }

    await itemService.assertTeacherOwnsClass(sectionSubject, teacherId);

    const items = await GradeItem.find({ _id: { $in: itemIds }, sectionSubject });
    if (items.length !== itemIds.length) {
        throw new Error('One or more grade items were not found in this class.');
    }

    const sectionSubjectDoc = await SectionSubject.findById(sectionSubject).populate('section', 'sectionCode sectionName');
    if (!sectionSubjectDoc) throw new Error('Section subject not found.');

    const students = await Student.find({
        section: sectionSubjectDoc.section._id,
        status: 'Active',
    }).select('studentNumber firstName lastName');

    const byNumber = {};
    const byName = {};
    students.forEach((s) => {
        byNumber[String(s.studentNumber)] = s;
        byName[normalizeName(`${s.firstName} ${s.lastName}`)] = s;
        byName[normalizeName(`${s.lastName}, ${s.firstName}`)] = s;
    });

    const rows = parseCsv(csv);
    if (rows.length === 0) throw new Error('CSV is empty.');

    const header = rows[0];
    const hasHeader = header.length === itemIds.length + 1;
    const dataRows = hasHeader ? rows.slice(1) : rows;

    let created = 0;
    const errors = [];

    for (const row of dataRows) {
        if (row.length !== itemIds.length + 1) {
            errors.push(`Row has ${row.length} columns, expected ${itemIds.length + 1}.`);
            continue;
        }

        const identifier = row[0];
        const student =
            byNumber[String(identifier)] ||
            byName[normalizeName(identifier)];

        if (!student) {
            errors.push(`No active student matched "${identifier}".`);
            continue;
        }

        for (let col = 0; col < itemIds.length; col++) {
            const item = items[col];
            const rawScore = row[col + 1];
            if (rawScore === '' || rawScore == null) continue;

            let score = Number(rawScore);
            if (isNaN(score) || score < 0) {
                errors.push(`Invalid score "${rawScore}" for ${identifier} on ${item.title}.`);
                continue;
            }

            await GradeScore.findOneAndUpdate(
                { gradeItem: item._id, student: student._id },
                { $set: { score, source: 'import' } },
                { upsert: true, new: true }
            );
            created++;
        }
    }

    return { message: 'Import complete.', created, errors };
};

module.exports = {
    importScores,
    parseCsv,
};
