const Subject = require('../model/subject.model');

const createSubject = async (data, userId) => {
    const existingSubjectCode = await Subject.findOne({
        subjectCode: data.subjectCode.toUpperCase(),
    })

    if (existingSubjectCode) {
        throw new Error('Subject code already exists.')
    }

    const existingSubjectName = await Subject.findOne({
        subjectName: data.subjectName,
    })

    if (existingSubjectName) {
        throw new Error('Subject name already exists.')
    }

    return await Subject.create({
        ...data,
        subjectCode: data.subjectCode.toUpperCase(),
    })
}

const getSubject = async () => {

    return await Subject.find().populate({
        path: 'createdBy',
        select: 'firstName lastName',
    }).sort({
        subjectCode: 1,
    })
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
            _id: { $ne: id },
        })

        if (existingCode) {
            throw new Error('Subject code already exists.')
        }

        data.subjectCode = data.subjectCode.toUpperCase()

    }

    if (data.subjectName) {

        const existingName = await Subject.findOne({
            subjectName: data.subjectName,
            _id: { $ne: id },
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

module.exports = {
    createSubject,
    getSubject,
    getSubjectById,
    updateSubject,
    deleteSubject,
}