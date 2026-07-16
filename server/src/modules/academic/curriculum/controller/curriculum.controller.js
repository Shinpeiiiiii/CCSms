const curriculumService = require('../services/curriculum.services')

const createCurriculum = async (req, res) => {

    try {

        const curriculum =
            await curriculumService.createCurriculum({
                ...req.body,
                createdBy: req.user.id,
            })

        return res.status(201).json({
            message: 'Curriculum created successfully.',
            curriculum,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const getCurriculum = async (req, res) => {

    try {

        const curriculums =
            await curriculumService.getCurriculum()

        return res.status(200).json(curriculums)

    } catch (error) {

        return res.status(500).json({
            message: error.message,
        })

    }

}

const getCurriculumById = async (req, res) => {

    try {

        const curriculum =
            await curriculumService.getCurriculumById(
                req.params.id
            )

        return res.status(200).json(curriculum)

    } catch (error) {

        return res.status(404).json({
            message: error.message,
        })

    }

}

const updateCurriculum = async (req, res) => {

    try {

        const curriculum =
            await curriculumService.updateCurriculum(
                req.params.id,
                req.body
            )

        return res.status(200).json({
            message: 'Curriculum updated successfully.',
            curriculum,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const publishCurriculum = async (req, res) => {

    try {

        const curriculum =
            await curriculumService.publishCurriculum(
                req.params.id
            )

        return res.status(200).json({
            message: 'Curriculum published successfully.',
            curriculum,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const archiveCurriculum = async (req, res) => {

    try {

        const curriculum =
            await curriculumService.archiveCurriculum(
                req.params.id
            )

        return res.status(200).json({
            message: 'Curriculum archived successfully.',
            curriculum,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}
const createNewVersion = async (req, res) => {

    try {

        const curriculum =
            await curriculumService.createNewVersion(
                req.params.id,
                req.body,
                req.user.id
            );

        return res.status(201).json({
            message: "Curriculum version created successfully.",
            curriculum,
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        });

    }

};

const getVersionHistory = async (req, res) => {

    try {

        const history =
            await curriculumService.getVersionHistory(
                req.params.id
            );

        return res.status(200).json(history);

    } catch (error) {

        return res.status(404).json({
            message: error.message,
        });

    }

};

module.exports = {

    createCurriculum,
    getCurriculum,
    getCurriculumById,
    updateCurriculum,
    publishCurriculum,
    archiveCurriculum,
    createNewVersion,
    getVersionHistory

}