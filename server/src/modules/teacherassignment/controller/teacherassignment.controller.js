const teacherAssignmentService = require('../services/teacherassignmentservices')


const createTeacherAssignment = async (req, res) => {

    try {

        const teacherAssignment =
            await teacherAssignmentService.createTeacherAssignment({
                ...req.body,
                createdBy: req.user.id,
            })

        return res.status(201).json({
            message: 'Teacher Assignment created successfully.',
            teacherAssignment,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const getTeacherAssignment = async (req, res) => {

    try {

        const teacherAssignments =
            await teacherAssignmentService.getTeacherAssignment()

        return res.status(200).json(teacherAssignments)

    } catch (error) {

        return res.status(500).json({
            message: error.message,
        })

    }

}

const getTeacherAssignmentById = async (req, res) => {

    try {

        const teacherAssignment =
            await teacherAssignmentService.getTeacherAssignmentById(
                req.params.id
            )

        return res.status(200).json(teacherAssignment)

    } catch (error) {

        return res.status(404).json({
            message: error.message,
        })

    }

}


const updateTeacherAssignment = async (req, res) => {

    try {

        const teacherAssignment =
            await teacherAssignmentService.updateTeacherAssignment(
                req.params.id,
                req.body
            )

        return res.status(200).json({
            message: 'Teacher Assignment updated successfully.',
            teacherAssignment,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const unassignTeacher = async (req, res) => {

    try {

        const teacherAssignment =
            await teacherAssignmentService.unassignTeacher(
                req.params.id
            )

        return res.status(200).json({
            message: 'Teacher unassigned successfully.',
            teacherAssignment,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const deleteTeacherAssignment = async (req, res) => {

    try {

        await teacherAssignmentService.deleteTeacherAssignment(
            req.params.id
        )

        return res.status(200).json({
            message: 'Teacher Assignment deleted successfully.',
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

module.exports = {
    createTeacherAssignment,
    getTeacherAssignment,
    getTeacherAssignmentById,
    updateTeacherAssignment,
    unassignTeacher,
    deleteTeacherAssignment,
}