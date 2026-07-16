const Subject = require('../model/subject.model');
const { remember } = require('../../../../utils/cache.helper')


const createSubject = async (data, userId) => {
    const existingSubjectCode = await Subject.findOne({
        subjectCode: data.subjectCode.toUpperCase(),
        isCurrentVersion: true,
    })

    if (existingSubjectCode) {
        throw new Error('Subject code already exists.')
    }

    const existingSubjectName = await Subject.findOne({
        subjectName: data.subjectName,
        isCurrentVersion: true,
    })

    if (existingSubjectName) {
        throw new Error('Subject name already exists.')
    }

    return await Subject.create({
        ...data,
        subjectCode: data.subjectCode.toUpperCase(),
    })

    await deleteCache("subjects");
}

const getSubject = async () => {

    return await remember("subjects", 300, async () => {
        return Subject.find({
            isCurrentVersion: true,
        })
        .populate({
            path: 'createdBy',
            select: 'firstName lastName',
        }).sort({
            subjectCode: 1,
        });
    });
}

const getSubjectById = async (id) => {

    const subject = await Subject.findById(id)
        .populate(
            'createdBy',
            'firstName lastName'
        )

    if (!subject) {
        throw new Error('Subject not found.')
    }

    return subject

}

const updateSubject = async (id, data) => {

    const subject = await Subject.findById(id)

    if (!subject) {
        throw new Error('Subject not found.')
    }

    if (data.subjectCode) {

        const existingCode = await Subject.findOne({
            subjectCode: data.subjectCode.toUpperCase(),
            _id: { $ne: id }, isCurrentVersion: true,
        })

        if (existingCode) {
            throw new Error('Subject code already exists.')
        }

        data.subjectCode = data.subjectCode.toUpperCase()

    }

    if (data.subjectName) {

        const existingName = await Subject.findOne({
            subjectName: data.subjectName,
            _id: { $ne: id }, isCurrentVersion: true,
        })

        if (existingName) {
            throw new Error('Subject name already exists.')
        }

    }

    return await Subject.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    )

}

const deleteSubject = async (id) => {

    const subject = await Subject.findById(id)

    if (!subject) {
        throw new Error('Subject not found.')
    }

    /*
        Future validation

        Cannot delete if:

        - Used in Curriculum

        - Used in Schedule

        - Used in Grades

        - Used in Student Enrollment
    */

    return await Subject.findByIdAndDelete(id)

}

const createNewVersion = async (
    subjectId,
    data,
    userId
) => {

    const subject = await Subject.findById(subjectId);

    if (!subject) {
        throw new Error("Subject not found.");
    }

    const existingCode = await Subject.findOne({
        subjectCode: data.subjectCode.toUpperCase(),
        _id: { $ne: subjectId }, isCurrentVersion: true,
    });

    if (existingCode) {
        throw new Error("Subject code already exists.");
    }

    const existingName = await Subject.findOne({
        subjectName: data.subjectName,
        _id: { $ne: subjectId },
        isCurrentVersion: true,
    });

    if (existingName) {
        throw new Error("Subject name already exists.");
    }
    const nextVersion = subject.version + 1;

    subject.isCurrentVersion = false;
    await subject.save();

    const newSubject = await Subject.create({

        subjectCode: data.subjectCode.toUpperCase(),
        subjectName: data.subjectName,
        units: data.units,
        lectureHours: data.lectureHours,
        laboratoryHours: data.laboratoryHours,
        subjectCategory: data.subjectCategory,
        description: data.description,
        status: data.status ?? "Active",
        version: nextVersion,
        parentSubject: subject.parentSubject || subject._id,
        isCurrentVersion: true,
        createdBy: userId,

    });

    return newSubject;

};

const getVersionHistory = async (
    subjectId
) => {

    const subject = await Subject.findById(subjectId);

    if (!subject) {
        throw new Error("Subject not found.");
    }

    const rootId = subject.parentSubject || subject._id;

    return await Subject.find({
        $or: [
            {
                _id: rootId,
            },
            {
                parentSubject: rootId,
            },
        ],
    })
        .sort({
            version: -1,
        })
        .populate(
            "createdBy",
            "firstName lastName"
        );
};

module.exports = {
    createSubject,
    getSubject,
    getSubjectById,
    updateSubject,
    deleteSubject,
    createNewVersion,
    getVersionHistory,
}