const SubjectAssignment = require('../model/subjectassignment.model')
const Section = require('../../section/models/section.models')
const CurriculumSubject = require('../../curriculum/models/curriculum.subject.models')

const createSubjectAssignment = async (data) => {

    const section = await Section.findById(data.section)

    if (!section) {
        throw new Error('Section not found.')
    }

    const curriculumSubject = await CurriculumSubject.findById(
        data.curriculumSubject
    )

    if (!curriculumSubject) {
        throw new Error('Curriculum Subject not found.')
    }

    const existingAssignment =
        await SubjectAssignment.findOne({
            section: data.section,
            curriculumSubject: data.curriculumSubject,
        })

    if (existingAssignment) {
        throw new Error(
            'This subject has already been assigned to the selected section.'
        )
    }

    return await SubjectAssignment.create(data)

}

const getSubjectAssignment = async () => {

    return await SubjectAssignment.find()
        .populate('section')
        .populate({
            path: 'curriculumSubject',
            populate: {
                path: 'subject'
            }
        })
        .populate('createdBy', 'firstName lastName')
        .sort({
            createdAt: -1,
        })

}

const getSubjectAssignmentById = async (id) => {

    const subjectAssignment =
        await SubjectAssignment.findById(id)
            .populate('section')
            .populate({
                path: 'curriculumSubject',
                populate: {
                    path: 'subject'
                }
            })
            .populate('createdBy', 'firstName lastName')

    if (!subjectAssignment) {
        throw new Error('Subject Assignment not found.')
    }

    return subjectAssignment

}

const updateSubjectAssignment = async (id, data) => {

    const subjectAssignment =
        await SubjectAssignment.findById(id)

    if (!subjectAssignment) {
        throw new Error('Subject Assignment not found.')
    }

    if (data.curriculumSubject) {

        const curriculumSubject =
            await CurriculumSubject.findById(
                data.curriculumSubject
            )

        if (!curriculumSubject) {
            throw new Error(
                'Curriculum Subject not found.'
            )
        }

    }

    if (data.section) {

        const section =
            await Section.findById(data.section)

        if (!section) {
            throw new Error('Section not found.')
        }

    }

    return await SubjectAssignment.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    )

}

const cancelSubjectAssignment = async (id) => {

    const subjectAssignment =
        await SubjectAssignment.findById(id)

    if (!subjectAssignment) {
        throw new Error('Subject Assignment not found.')
    }

    subjectAssignment.status = 'Cancelled'

    await subjectAssignment.save()

    return subjectAssignment

}

const deleteSubjectAssignment = async (id) => {

    const subjectAssignment =
        await SubjectAssignment.findById(id)

    if (!subjectAssignment) {
        throw new Error('Subject Assignment not found.')
    }

    return await SubjectAssignment.findByIdAndDelete(id)

}

module.exports = {
    createSubjectAssignment,
    getSubjectAssignment,
    getSubjectAssignmentById,
    updateSubjectAssignment,
    cancelSubjectAssignment,
    deleteSubjectAssignment,
}