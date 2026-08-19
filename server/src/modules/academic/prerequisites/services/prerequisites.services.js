const subjectPrerequisites = require('../models/prerequisites.models')
const Subject = require('../../subject/model/subject.model')
const CurriculumSubject = require('../../curriculum/models/curriculum.subject.models')
const { hasPath } = require('../utils/graph.utils')

const validateSubject = async (subjectId, requiredSubjectId, curriculumId) => {
    const subject = await Subject.findById(subjectId)
    const requiredSubject = await Subject.findById(requiredSubjectId)

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

    if (curriculumId) {
        const subjectInCurriculum = await CurriculumSubject.findOne({
            curriculum: curriculumId,
            subject: subjectId,
        })
        const requiredInCurriculum = await CurriculumSubject.findOne({
            curriculum: curriculumId,
            subject: requiredSubjectId,
        })

        if (!subjectInCurriculum) {
            throw new Error('Subject is not part of the selected curriculum.')
        }

        if (!requiredInCurriculum) {
            throw new Error('Required subject is not part of the selected curriculum.')
        }
    }
}


const createPrerequisite = async (data) => {
    const { subject, requiredSubject, minimumGrade, type, createdBy, curriculum } = data

    const requiredSubjectArray = Array.isArray(requiredSubject)
        ? requiredSubject
        : [requiredSubject]

    const created = []

    for (const reqSub of requiredSubjectArray) {
        await validateSubject(subject, reqSub, curriculum)

        const existing = await subjectPrerequisites.findOne({
            subject,
            requiredSubject: reqSub,
            curriculum: curriculum || undefined,
        })

        if (existing) {
            throw new Error('This prerequisite relationship already exists.')
        }

        const isCyclic = await hasPath(subject, reqSub)

        if (isCyclic) {
            throw new Error(
                'This would create a circular prerequisite chain (e.g., A requires B, B requires A).'
            )
        }

        const prerequisite = await subjectPrerequisites.create({
            subject,
            requiredSubject: reqSub,
            curriculum: curriculum || null,
            minimumGrade: minimumGrade ?? null,
            type: type || 'Prerequisite',
            createdBy,
        })

        created.push(prerequisite)
    }

    return created.length === 1 ? created[0] : created
}


const getPrerequisite = async (curriculumId) => {

    const query = { status: "Active" }

    if (curriculumId) {
        query.curriculum = curriculumId
    }

    return await subjectPrerequisites.find(query)
        .populate('subject','subjectCode subjectName')
        .populate('requiredSubject', 'subjectCode subjectName units version')
        .populate('createdBy', 'firstName lastName')
        .populate('curriculum', 'curriculumName curriculumCode')
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

    const needsValidation =
        data.subject ||
        data.requiredSubject ||
        data.curriculum;

    if (needsValidation) {
        const subjectId = data.subject || prerequisite.subject;
        const requiredSubjectId = data.requiredSubject || prerequisite.requiredSubject;
        const curriculumId = data.curriculum || prerequisite.curriculum;

        await validateSubject(subjectId, requiredSubjectId, curriculumId);

        const isCyclic = await hasPath(subjectId, requiredSubjectId);
        if (isCyclic) {
            throw new Error(
                "This would create a circular prerequisite chain (e.g., A requires B, B requires A)."
            );
        }
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