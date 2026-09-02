const GradeItem = require('../models/gradeitem.model');
const GradeScore = require('../models/gradescore.model');
const GradeGroup = require('../models/gradegroup.model');
const SectionSubject = require('../../sectionsubject/models/sectionsubject.model');
const StudentSubject = require('../../studentsubject/models/studentsubject.models');
const Student = require('../../students/models/Student');

const assertTeacherOwnsClass = async (sectionSubjectId, teacherId) => {
    const sectionSubject = await SectionSubject.findOne({
        _id: sectionSubjectId,
        instructor: teacherId,
    });
    if (!sectionSubject) {
        throw new Error("Class not found or you don't have access to it.");
    }
    return sectionSubject;
};

const getClassStudents = async (sectionSubjectId) => {
    const sectionSubject = await SectionSubject.findById(sectionSubjectId)
        .populate('section', 'sectionCode sectionName');
    if (!sectionSubject) throw new Error('Section subject not found.');

    return await Student.find({
        section: sectionSubject.section._id,
        status: 'Active',
    })
        .select('studentNumber firstName lastName')
        .sort({ lastName: 1 });
};

const getClassEnrollments = async (sectionSubjectId) => {
    const sectionSubject = await SectionSubject.findById(sectionSubjectId)
        .populate('subject', 'subjectCode subjectName')
        .populate('section', 'sectionCode sectionName');
    if (!sectionSubject) throw new Error('Section subject not found.');

    const enrollments = await StudentSubject.find({
        section: sectionSubject.section._id,
        subject: sectionSubject.subject._id,
    })
        .populate('student', 'studentNumber firstName lastName')
        .sort({ 'student.lastName': 1 });

    return { sectionSubject, enrollments };
};

const createGradeItem = async (teacherId, data) => {
    const { sectionSubject, term, category, title, possible, dueDate, isGroup } = data;
    await assertTeacherOwnsClass(sectionSubject, teacherId);

    const item = await GradeItem.create({
        sectionSubject,
        term,
        category,
        title,
        possible,
        dueDate: dueDate || null,
        isGroup: isGroup || false,
        baseScore: data.baseScore != null ? data.baseScore : null,
        externalId: data.externalId || null,
        externalType: data.externalType || null,
    });

    return item;
};

const listGradeItems = async (teacherId, sectionSubjectId, term) => {
    await assertTeacherOwnsClass(sectionSubjectId, teacherId);
    const filter = { sectionSubject: sectionSubjectId };
    if (term) filter.term = term;

    return await GradeItem.find(filter).sort({ createdAt: 1 });
};

const updateGradeItem = async (teacherId, itemId, data) => {
    const item = await GradeItem.findById(itemId);
    if (!item) throw new Error('Grade item not found.');
    await assertTeacherOwnsClass(item.sectionSubject, teacherId);

    const fields = ['title', 'possible', 'dueDate', 'category', 'term', 'baseScore'];
    fields.forEach((f) => {
        if (data[f] !== undefined) item[f] = data[f];
    });

    await item.save();
    return item;
};

const deleteGradeItem = async (teacherId, itemId) => {
    const item = await GradeItem.findById(itemId);
    if (!item) throw new Error('Grade item not found.');
    await assertTeacherOwnsClass(item.sectionSubject, teacherId);

    await GradeScore.deleteMany({ gradeItem: itemId });
    await GradeItem.findByIdAndDelete(itemId);
    return { message: 'Grade item deleted.' };
};

const saveScores = async (teacherId, payload) => {
    const { gradeItem, scores } = payload;
    const item = await GradeItem.findById(gradeItem);
    if (!item) throw new Error('Grade item not found.');
    await assertTeacherOwnsClass(item.sectionSubject, teacherId);

    if (item.isGroup) {
        if (payload.baseScore == null || isNaN(payload.baseScore) || payload.baseScore < 0) {
            throw new Error('A valid base score is required for a group project.');
        }
        item.baseScore = Number(payload.baseScore);
        await item.save();
        return { message: 'Group score saved.' };
    }

    const operations = scores.map(async ({ student, score, source, externalId }) => {
        const parsed = Number(score);
        if (isNaN(parsed) || parsed < 0) {
            throw new Error('Invalid score value.');
        }
        return await GradeScore.findOneAndUpdate(
            { gradeItem, student },
            {
                $set: {
                    score: parsed,
                    source: source || 'manual',
                    externalId: externalId || null,
                },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    });

    await Promise.all(operations);
    return { message: 'Scores saved.' };
};

const getScoresForItem = async (teacherId, gradeItem) => {
    const item = await GradeItem.findById(gradeItem);
    if (!item) throw new Error('Grade item not found.');
    await assertTeacherOwnsClass(item.sectionSubject, teacherId);

    return await GradeScore.find({ gradeItem }).populate('student', 'studentNumber firstName lastName');
};

const createGroup = async (teacherId, data) => {
    const { sectionSubject, name, memberIds } = data;
    await assertTeacherOwnsClass(sectionSubject, teacherId);

    const group = await GradeGroup.create({
        sectionSubject,
        name: name || '',
        members: (memberIds || []).map((student) => ({ student })),
    });

    return group;
};

const updateGroup = async (teacherId, groupId, data) => {
    const group = await GradeGroup.findById(groupId);
    if (!group) throw new Error('Group not found.');
    await assertTeacherOwnsClass(group.sectionSubject, teacherId);

    if (data.name !== undefined) group.name = data.name;
    if (data.members !== undefined) group.members = data.members;

    await group.save();
    return group;
};

const deleteGroup = async (teacherId, groupId) => {
    const group = await GradeGroup.findById(groupId);
    if (!group) throw new Error('Group not found.');
    await assertTeacherOwnsClass(group.sectionSubject, teacherId);

    await GradeItem.updateMany({ groupId: group._id }, { $set: { isGroup: false, groupId: null } });
    await GradeGroup.findByIdAndDelete(groupId);
    return { message: 'Group deleted.' };
};

const listGroups = async (teacherId, sectionSubjectId) => {
    await assertTeacherOwnsClass(sectionSubjectId, teacherId);
    return await GradeGroup.find({ sectionSubject: sectionSubjectId })
        .populate('members.student', 'studentNumber firstName lastName');
};

module.exports = {
    assertTeacherOwnsClass,
    getClassStudents,
    getClassEnrollments,
    createGradeItem,
    listGradeItems,
    updateGradeItem,
    deleteGradeItem,
    saveScores,
    getScoresForItem,
    createGroup,
    updateGroup,
    deleteGroup,
    listGroups,
};
