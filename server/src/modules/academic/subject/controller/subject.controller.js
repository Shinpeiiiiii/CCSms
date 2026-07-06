const subjectService = require('../services/subject.services');

const createSubject = async (req, res) => {
    try {

        const subject = await subjectService.createSubject({
            ...req.body,
            createdBy: req.user.id,
        })

        return res.status(201).json({
            message: 'Subject created successfully.',
            subject,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }
}

const getSubject = async (req, res) => {

    try {

        const subjects = await subjectService.getSubject()

        return res.status(200).json(subjects)

    } catch (error) {

        return res.status(500).json({
            message: error.message,
        })

    }

}

const getSubjectById = async (req, res) => {

    try {

        const subject = await subjectService.getSubjectById(req.params.id)

        return res.status(200).json(subject)

    } catch (error) {

        return res.status(404).json({
            message: error.message,
        })

    }

}

const updateSubject = async (req, res) => {

    try {

        const subject = await subjectService.updateSubject(
            req.params.id,
            req.body
        )

        return res.status(200).json({
            message: 'Subject updated successfully.',
            subject,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const deleteSubject = async (req, res) => {

    try {

        await subjectService.deleteSubject(req.params.id)

        return res.status(200).json({
            message: 'Subject deleted successfully.',
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

module.exports = {
    createSubject,
    getSubject,
    getSubjectById,
    updateSubject,
    deleteSubject,
}