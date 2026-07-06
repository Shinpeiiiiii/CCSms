const subjectAssignmentService = require('../services/subjectassignment.services')

const createSubjectAssignment = async (req, res) => {

    try {

        const subjectAssignment =
            await subjectAssignmentService.createSubjectAssignment({
                ...req.body,
                createdBy: req.user.id,
            })

        return res.status(201).json({
            message: 'Subject Assignment created successfully.',
            subjectAssignment,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const getSubjectAssignment = async (req, res) => {

    try {

        const subjectAssignments =
            await subjectAssignmentService.getSubjectAssignment()

        return res.status(200).json(subjectAssignments)

    } catch (error) {

        return res.status(500).json({
            message: error.message,
        })

    }

}

const getSubjectAssignmentById = async (req, res) => {

    try {

        const subjectAssignment =
            await subjectAssignmentService.getSubjectAssignmentById(
                req.params.id
            )

        return res.status(200).json(subjectAssignment)

    } catch (error) {

        return res.status(404).json({
            message: error.message,
        })

    }

}

const updateSubjectAssignment = async (req, res) => {

    try {

        const subjectAssignment =
            await subjectAssignmentService.updateSubjectAssignment(
                req.params.id,
                req.body
            )

        return res.status(200).json({
            message: 'Subject Assignment updated successfully.',
            subjectAssignment,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const cancelSubjectAssignment = async (req, res) => {

    try {

        const subjectAssignment =
            await subjectAssignmentService.cancelSubjectAssignment(
                req.params.id
            )

        return res.status(200).json({
            message: 'Subject Assignment cancelled successfully.',
            subjectAssignment,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const deleteSubjectAssignment = async (req, res) => {

    try {

        await subjectAssignmentService.deleteSubjectAssignment(
            req.params.id
        )

        return res.status(200).json({
            message: 'Subject Assignment deleted successfully.',
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

module.exports = {
    createSubjectAssignment,
    getSubjectAssignment,
    getSubjectAssignmentById,
    updateSubjectAssignment,
    cancelSubjectAssignment,
    deleteSubjectAssignment,
}