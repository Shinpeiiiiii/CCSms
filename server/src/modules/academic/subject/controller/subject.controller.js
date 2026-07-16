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
        console.error(error);
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

// --- ADD these two handlers into your existing subject.controller.js ---
// (merge alongside createSubject, getSubject, getSubjectById, updateSubject, deleteSubject)
 
const createNewVersion = async (req, res) => {
 
    try {
 
        const newVersion = await subjectService.createNewVersion(
            req.params.id,
            req.body,
            req.user.id
        )
 
        return res.status(201).json({
            message: 'New subject version created successfully.',
            subject: newVersion,
        })
 
    } catch (error) {
 
        return res.status(400).json({
            message: error.message,
        })
 
    }
 
}
 
const getVersionHistory = async (req, res) => {
 
    try {
 
        const history = await subjectService.getVersionHistory(req.params.id)
 
        return res.status(200).json(history)
 
    } catch (error) {
 
        return res.status(404).json({
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
    createNewVersion,
    getVersionHistory
}