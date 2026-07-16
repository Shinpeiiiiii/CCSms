const subjectPrerequisites = require('../models/prerequisites.models')
const Subject = require('../../subject/model/subject.model')
const { hasPath } = require('../utils/graph.utils')

const validateSubject = async (subjectId, reqiuredSubjectId) => {
    const subject = await Subject.findById(subjectId)
    const requiredSubject = await Subject.findById(reqiuredSubjectId)

    if (!subject) {
        throw new Error('Subject not found.')
    }
 
    if (!requiredSubject) {
        throw new Error('Required subject not found.')
    }
 
    if (subject.status !== 'Active') {
        throw new Error('Subject is not Active.')
    }
 
    if (requiredSubject.status !== 'Active') {
        throw new Error('Required subject is not Active.')
    }
 
    if (String(subjectId) === String(requiredSubjectId)) {
        throw new Error('A subject cannot be a prerequisite of itself.')
    }
}


const createPrerequisite = async (data) => {
    const { subject, requiredSubject, minimumGrade, type, createdBy } = data
 
    await validateSubject(subject, requiredSubject)
 
    const existing = await subjectPrerequisites.findOne({
        subject,
        requiredSubject,
    })
 
    if (existing) {
        throw new Error('This prerequisite relationship already exists.')
    }
 
    const isCyclic = await hasPath(subject, requiredSubject)
 
    if (isCyclic) {
        throw new Error(
            'This would create a circular prerequisite chain (e.g., A requires B, B requires A).'
        )
    }
 
    return await subjectPrerequisites.create({
        subject,
        requiredSubject,
        minimumGrade: minimumGrade ?? null,
        type: type || 'Prerequisite',
        createdBy,
    })
}


const getPrerequisite = async () => {

    return await subjectPrerequisites.find({
        status: "Active"
    })
        .populate('subject','subjectCode subjectName')
        .populate('requiredSubject', 'subjectCode subjectName units version')
        .populate('createdBy', 'firstName lastName')
        .sort({
            createdAt: -1
        });

};
const getPrerequisiteBySubject = async (subjectId) => {
 
    return await subjectPrerequisites.find({
        subject: subjectId,
        status: 'Active',
    })
        .populate('requiredSubject', 'subjectCode subjectName units version')
        .populate('createdBy', 'firstName lastName')
        .sort({ createdAt: -1 })
 
}

const getPrerequisiteById = async (id) => {

    const prerequisite =
        await subjectPrerequisites.findById(id)
            .populate('subject', 'subjectCode subjectName')
            .populate('requiredSubject', 'subjectCode subjectName')
            .populate('createdBy', 'firstName lastName')

    if (!prerequisite) {
        throw new Error("Prerequisite not found.");
    }

    return prerequisite;

};

const updatePrerequisite = async (
    id,
    data,
    userId
) => {

    const prerequisite =
        await subjectPrerequisites.findById(id);

    if (!prerequisite) {
        throw new Error("Prerequisite not found.");
    }

    Object.assign(prerequisite, data);

    prerequisite.updatedBy = userId;

    await prerequisite.save();

    return prerequisite.populate([
        "subject",
        "requiredSubject"
    ]);

};


const deactivatePrerequisite = async (
    id,
    userId
) => {

    const prerequisite =
        await subjectPrerequisites.findById(id);

    if (!prerequisite) {
        throw new Error("Prerequisite not found.");
    }

    prerequisite.status = "Inactive";
    prerequisite.updatedBy = userId;

    await prerequisite.save();

    return prerequisite;

};

// array of { subject, grade } already completed by the student.
const checkPrerequisiteMet = async (subjectId, academicRecordEntries = []) => {
 
    const prerequisites = await subjectPrerequisites.find({
        subject: subjectId,
        status: 'Active',
        type: 'Prerequisite',
    }).populate('requiredSubject', 'subjectCode subjectName')
 
    const completedMap = new Map(
        academicRecordEntries.map((entry) => [String(entry.subject), entry.grade])
    )
 
    const unmetPrerequisites = []
 
    for (const prereq of prerequisites) {
 
        const requiredId = String(prereq.requiredSubject._id)
        const wasCompleted = completedMap.has(requiredId)
        const gradeObtained = completedMap.get(requiredId)
 
        const meetsMinimumGrade =
            prereq.minimumGrade == null || (gradeObtained ?? 0) >= prereq.minimumGrade
 
        if (!wasCompleted || !meetsMinimumGrade) {
            unmetPrerequisites.push({
                requiredSubject: prereq.requiredSubject,
                minimumGrade: prereq.minimumGrade,
                gradeObtained: gradeObtained ?? null,
            })
        }
 
    }
 
    return {
        eligible: unmetPrerequisites.length === 0,
        unmetPrerequisites,
    }
 
}



module.exports = {
    createPrerequisite,
    getPrerequisite,
    getPrerequisiteById,
    updatePrerequisite,
    deactivatePrerequisite,
    checkPrerequisiteMet,
    getPrerequisiteBySubject
};