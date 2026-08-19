const curriculumSubjectService = require('../services/curriculum.subject.services')

const addSubjectToCurriculum = async (req, res) => {

    try {
        const curriculumId = req.params.curriculumId || req.body?.curriculumId || req.body?.curriculum;

        const curriculumSubject =
            await curriculumSubjectService.addSubjectToCurriculum(
                curriculumId,
                req.body
            )

        return res.status(201).json({
            message: 'Subject added to curriculum successfully.',
            curriculumSubject,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const bulkAddSubjectToCurriculum = async (req, res) => {

    try {

        const subjects =
            await curriculumSubjectService.bulkAddSubjectToCurriculum(
                req.params.curriculumId,
                req.body
            )

        return res.status(201).json({
            message: 'Subjects added successfully.',
            subjects,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const getCurriculumSubject = async (req, res) => {

    try {

        const curriculumSubjects =
            await curriculumSubjectService.getCurriculumSubject(
                req.params.curriculumId
            )

        return res.status(200).json(curriculumSubjects)

    } catch (error) {

        return res.status(500).json({
            message: error.message,
        })

    }

}

const getCurriculumStructure = async (req, res) => {

    try {

        const structure =
            await curriculumSubjectService.getCurriculumStructure(
                req.params.curriculumId
            )

        return res.status(200).json(structure)

    } catch (error) {

        return res.status(500).json({
            message: error.message,
        })

    }

}

const updateCurriculumSubject = async (req, res) => {

    try {

        const curriculumSubject =
            await curriculumSubjectService.updateCurriculumSubject(
                req.params.id,
                req.body
            )

        return res.status(200).json({
            message: 'Curriculum subject updated successfully.',
            curriculumSubject,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const removeCurriculumSubject = async (req, res) => {

    try {

        await curriculumSubjectService.removeCurriculumSubject(
            req.params.id
        )

        return res.status(200).json({
            message: 'Curriculum subject removed successfully.',
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

module.exports = {

    addSubjectToCurriculum,

    bulkAddSubjectToCurriculum,

    getCurriculumSubject,

    getCurriculumStructure,

    updateCurriculumSubject,

    removeCurriculumSubject,

}
