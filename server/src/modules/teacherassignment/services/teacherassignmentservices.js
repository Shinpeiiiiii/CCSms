const TeacherAssignment = require('../models/teacherassignment.models')
const SubjectAssignment = require('../../academic/subject/model/subjectassignment.model')
const User = require('../../auth/models/User')


const createTeacherAssignment = async (data) => {

    const subjectAssignment =
        await SubjectAssignment.findById(data.subjectAssignment)

    if (!subjectAssignment) {
        throw new Error('Subject Assignment not found.')
    }

    const teacher =
        await User.findById(data.teacher)

    if (!teacher) {
        throw new Error('Teacher not found.')
    }

    if (teacher.role !== 'teacher') {
        throw new Error('Selected user is not a teacher.')
    }

    const existingAssignment =
        await TeacherAssignment.findOne({
            subjectAssignment: data.subjectAssignment,
        })

    if (existingAssignment) {
        throw new Error(
            'This subject assignment already has an assigned teacher.'
        )
    }

    return await TeacherAssignment.create(data)

}

const getTeacherAssignment = async () => {

    return await TeacherAssignment.find()
        .populate({
            path: 'subjectAssignment',
            populate: [
                {
                    path: 'section',
                },
                {
                    path: 'curriculumSubject',
                    populate: {
                        path: 'subject',
                    },
                },
            ],
        })
        .populate(
            'teacher',
            'firstName lastName email'
        )
        .populate(
            'createdBy',
            'firstName lastName'
        )
        .sort({
            createdAt: -1,
        })

}

const getTeacherAssignmentById = async (id) => {

    const teacherAssignment =
        await TeacherAssignment.findById(id)
            .populate({
                path: 'subjectAssignment',
                populate: [
                    {
                        path: 'section',
                    },
                    {
                        path: 'curriculumSubject',
                        populate: {
                            path: 'subject',
                        },
                    },
                ],
            })
            .populate(
                'teacher',
                'firstName lastName email'
            )
            .populate(
                'createdBy',
                'firstName lastName'
            )

    if (!teacherAssignment) {
        throw new Error(
            'Teacher Assignment not found.'
        )
    }

    return teacherAssignment

}

const updateTeacherAssignment = async (id, data) => {

    const teacherAssignment =
        await TeacherAssignment.findById(id)

    if (!teacherAssignment) {
        throw new Error(
            'Teacher Assignment not found.'
        )
    }

    if (data.teacher) {

        const teacher =
            await User.findById(data.teacher)

        if (!teacher) {
            throw new Error('Teacher not found.')
        }

        if (teacher.role !== 'teacher') {
            throw new Error(
                'Selected user is not a teacher.'
            )
        }

    }

    return await TeacherAssignment.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    )

}

const unassignTeacher = async (id) => {

    const teacherAssignment =
        await TeacherAssignment.findById(id)

    if (!teacherAssignment) {
        throw new Error(
            'Teacher Assignment not found.'
        )
    }

    teacherAssignment.status = 'Unassigned'

    await teacherAssignment.save()

    return teacherAssignment

}

const deleteTeacherAssignment = async (id) => {

    const teacherAssignment =
        await TeacherAssignment.findById(id)

    if (!teacherAssignment) {
        throw new Error(
            'Teacher Assignment not found.'
        )
    }

    return await TeacherAssignment.findByIdAndDelete(id)

}

module.exports = {
    createTeacherAssignment,
    getTeacherAssignment,
    getTeacherAssignmentById,
    updateTeacherAssignment,
    unassignTeacher,
    deleteTeacherAssignment,
}