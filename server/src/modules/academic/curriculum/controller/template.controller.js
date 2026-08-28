const templateService = require('../services/template.services')

const saveAsTemplate = async (req, res) => {
    try {
        const template = await templateService.saveAsTemplate(
            req.params.id,
            req.body.name,
            req.user.id
        )
        return res.status(201).json({
            message: 'Template saved successfully.',
            template,
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        })
    }
}

const getTemplates = async (req, res) => {
    try {
        const templates = await templateService.getTemplates()
        return res.status(200).json(templates)
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        })
    }
}

const createFromTemplate = async (req, res) => {
    try {
        const curriculum = await templateService.createCurriculumFromTemplate(
            req.params.templateId,
            req.body,
            req.user.id
        )
        return res.status(201).json({
            message: 'Curriculum created from template successfully.',
            curriculum,
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        })
    }
}

const exportCurriculum = async (req, res) => {
    try {
        const data = await templateService.exportCurriculum(req.params.id)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        })
    }
}

const importCurriculum = async (req, res) => {
    try {
        const curriculum = await templateService.importCurriculum(req.body, req.user.id)
        return res.status(201).json({
            message: 'Curriculum imported successfully.',
            curriculum,
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        })
    }
}

module.exports = {
    saveAsTemplate,
    getTemplates,
    createFromTemplate,
    exportCurriculum,
    importCurriculum,
}
