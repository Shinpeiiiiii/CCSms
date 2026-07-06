const enrollmentPeriodService = require('../services/enrollmentperiod.services');

const createEnrollmentPeriod = async (req, res) => {

    try {

        const enrollmentPeriod =
            await enrollmentPeriodService.createEnrollmentPeriod({
                ...req.body,
                createdBy: req.user.id,
            })

        return res.status(201).json({
            message: 'Enrollment Period created successfully.',
            enrollmentPeriod,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const getEnrollmentPeriod = async (req, res) => {

    try {

        const enrollmentPeriod =
            await enrollmentPeriodService.getEnrollmentPeriod()

        return res.status(200).json(enrollmentPeriod)

    } catch (error) {

        return res.status(500).json({
            message: error.message,
        })

    }

}

const getEnrollmentPeriodById = async (req, res) => {

    try {

        const enrollmentPeriod =
            await enrollmentPeriodService.getEnrollmentPeriodById(
                req.params.id
            )

        return res.status(200).json(enrollmentPeriod)

    } catch (error) {

        return res.status(404).json({
            message: error.message,
        })

    }

}

const getCurrentEnrollmentPeriod = async (req, res) => {

    try {

        const enrollmentPeriod =
            await enrollmentPeriodService.getCurrentEnrollmentPeriod()

        return res.status(200).json(enrollmentPeriod)

    } catch (error) {

        return res.status(500).json({
            message: error.message,
        })

    }

}

const updateEnrollmentPeriod = async (req, res) => {

    try {

        const enrollmentPeriod =
            await enrollmentPeriodService.updateEnrollmentPeriod(
                req.params.id,
                req.body
            )

        return res.status(200).json({
            message: 'Enrollment Period updated successfully.',
            enrollmentPeriod,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const publishEnrollmentPeriod = async (req, res) => {

    try {

        const enrollmentPeriod =
            await enrollmentPeriodService.publishEnrollmentPeriod(
                req.params.id
            )

        return res.status(200).json({
            message: 'Enrollment Period published successfully.',
            enrollmentPeriod,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const openEnrollmentPeriod = async (req, res) => {

    try {

        const enrollmentPeriod =
            await enrollmentPeriodService.openEnrollmentPeriod(
                req.params.id
            )

        return res.status(200).json({
            message: 'Enrollment Period opened successfully.',
            enrollmentPeriod,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const closeEnrollmentPeriod = async (req, res) => {

    try {

        const enrollmentPeriod =
            await enrollmentPeriodService.closeEnrollmentPeriod(
                req.params.id
            )

        return res.status(200).json({
            message: 'Enrollment Period closed successfully.',
            enrollmentPeriod,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

const archiveEnrollmentPeriod = async (req, res) => {

    try {

        const enrollmentPeriod =
            await enrollmentPeriodService.archiveEnrollmentPeriod(
                req.params.id
            )

        return res.status(200).json({
            message: 'Enrollment Period archived successfully.',
            enrollmentPeriod,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }

}

module.exports = {
    createEnrollmentPeriod,
    getEnrollmentPeriod,
    getEnrollmentPeriodById,
    getCurrentEnrollmentPeriod,
    updateEnrollmentPeriod,
    publishEnrollmentPeriod,
    openEnrollmentPeriod,
    closeEnrollmentPeriod,
    archiveEnrollmentPeriod,
}