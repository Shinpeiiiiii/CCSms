const mongoose = require('mongoose')
const Curriculum = require('../models/curriculum.models')
const CurriculumSubject = require('../models/curriculum.subject.models')
const Subject = require('../../subject/model/subject.model')


const addSubjectToCurriculum = async (curriculumId, data) => {
    const resolvedCurriculumId = curriculumId || data?.curriculumId || data?.curriculum;

    if (!resolvedCurriculumId) {
        throw new Error('Curriculum ID is required.')
    }

    const curriculum = await Curriculum.findById(resolvedCurriculumId)

    if (!curriculum) {
        throw new Error('Curriculum not found.')
    }

    if (curriculum.status !== 'Draft') {
        throw new Error(
            'Only draft curriculums can be modified.'
        )
    }

    const subject = await Subject.findById(data.subject)

    if (!subject) {
        throw new Error('Subject not found.')
    }

    const existing =
        await CurriculumSubject.findOne({
            curriculum: resolvedCurriculumId,
            subject: data.subject,
        })

    if (existing) {
        throw new Error(
            'Subject already exists in this curriculum.'
        )
    }

    return await CurriculumSubject.create({
        curriculum: resolvedCurriculumId,
        ...data,
    })

}

const getCurriculumSubject = async (curriculumId) => {

    if (!mongoose.Types.ObjectId.isValid(curriculumId)) {
        return []
    }

    return await CurriculumSubject.find({
        curriculum: curriculumId,
    })
        .populate(
            'subject',
            'subjectCode subjectName units'
        )
        .sort({
            yearLevel: 1,
            semester: 1,
            displayOrder: 1,
        })

}

const updateCurriculumSubject = async (
    id,
    data
) => {

    const curriculumSubject =
        await CurriculumSubject.findById(id)
            .populate('curriculum')

    if (!curriculumSubject) {
        throw new Error(
            'Curriculum Subject not found.'
        )
    }

    if (
        curriculumSubject.curriculum.status !==
        'Draft'
    ) {
        throw new Error(
            'Published curriculums cannot be modified.'
        )
    }

    return await CurriculumSubject.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    )

}

const removeCurriculumSubject =
async (id) => {

    const curriculumSubject =
        await CurriculumSubject.findById(id)
            .populate('curriculum')

    if (!curriculumSubject) {
        throw new Error(
            'Curriculum Subject not found.'
        )
    }

    if (
        curriculumSubject.curriculum.status !==
        'Draft'
    ) {
        throw new Error(
            'Published curriculums cannot be modified.'
        )
    }

    await CurriculumSubject.findByIdAndDelete(id)

}

const bulkAddSubjectToCurriculum = async (
    curriculumId,
    subjects
) => {

    const curriculum = await Curriculum.findById(curriculumId)

    if (!curriculum) {
        throw new Error('Curriculum not found.')
    }

    if (curriculum.status !== 'Draft') {
        throw new Error(
            'Only draft curriculums can be modified.'
        )
    }

    const documents = []

    for (const item of subjects) {

        const subject = await Subject.findById(item.subject)

        if (!subject) {
            throw new Error(
                `Subject ${item.subject} not found.`
            )
        }

        const existing =
            await CurriculumSubject.findOne({
                curriculum: curriculumId,
                subject: item.subject,
            })

        if (existing) {
            throw new Error(
                `${subject.subjectCode} already exists in this curriculum.`
            )
        }

        documents.push({
            curriculum: curriculumId,
            ...item,
        })

    }

    return await CurriculumSubject.insertMany(
        documents
    )

}

module.exports = {
    addSubjectToCurriculum,
    getCurriculumSubject,
    updateCurriculumSubject,
    removeCurriculumSubject,
    bulkAddSubjectToCurriculum,
}