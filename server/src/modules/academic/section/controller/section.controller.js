const sectionService = require('../services/section.services');

const createSection = async (req, res) => {

    try {

        const section =
            await sectionService.createSection({

                ...req.body,

                createdBy: req.user.id,

            })

        return res.status(201).json({

            message: 'Section created successfully.',

            section,

        })

    } catch (error) {

        return res.status(400).json({

            message: error.message,

        })

    }

}

const getSection = async (req, res) => {

    try {

        const sections =
            await sectionService.getSection()

        return res.status(200).json(sections)

    } catch (error) {

        return res.status(500).json({

            message: error.message,

        })

    }

}

const getSectionById = async (req, res) => {

    try {

        const section =
            await sectionService.getSectionById(
                req.params.id
            )

        return res.status(200).json(section)

    } catch (error) {

        return res.status(404).json({

            message: error.message,

        })

    }

}

const updateSection = async (req, res) => {

    try {

        const section =
            await sectionService.updateSection(

                req.params.id,

                req.body

            )

        return res.status(200).json({
            message: 'Section updated successfully.',
            section,
        })

    } catch (error) {

        return res.status(400).json({

            message: error.message,

        })

    }

}

const openSection = async (req, res) => {

    try {

        const result = await sectionService.openSection(
            req.params.id
        )

        return res.status(200).json({
            message: 'Section opened successfully.',
            section: result.section,
            generatedSubjects: result.generatedSubjects || 0,
        })

    } catch (error) {

        return res.status(400).json({

            message: error.message,

        })

    }

}

const closeSection = async (req, res) => {

    try {

        const section =
            await sectionService.closeSection(
                req.params.id
            )

        return res.status(200).json({
            message: 'Section closed successfully.',
            section,
        })

    } catch (error) {

        return res.status(400).json({

            message: error.message,

        })

    }

}

const archiveSection = async (req, res) => {

    try {

        const section =
            await sectionService.archiveSection(
                req.params.id
            )

        return res.status(200).json({
            message: 'Section archived successfully.',
            section,
        })

    } catch (error) {

        return res.status(400).json({

            message: error.message,

        })

    }

}

const deleteSection = async (req, res) => {

    try {

        await sectionService.deleteSection(
            req.params.id
        )

        return res.status(200).json({
            message: 'Section deleted successfully.',
        })

    } catch (error) {

        return res.status(400).json({

            message: error.message,

        })

    }

}

module.exports = {

    createSection,

    getSection,

    getSectionById,

    updateSection,

    openSection,

    closeSection,

    archiveSection,

    deleteSection,

}
