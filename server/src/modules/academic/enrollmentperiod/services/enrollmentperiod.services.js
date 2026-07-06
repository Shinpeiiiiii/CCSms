const EnrollmentPeriod = require('../models/enrollmentperiod.model');
const AcademicYear = require('../../academicyear/models/academicyear.model');

const createEnrollmentPeriod = async (data) => {

    const academicYear = await AcademicYear.findById(data.academicYear)

    if (!academicYear) {
        throw new Error('Academic Year not found.')
    }

    if (academicYear.status === 'Archived') {
        throw new Error('Cannot create an Enrollment Period for an archived Academic Year.')
    }

    if (new Date(data.applicationStart) >= new Date(data.applicationEnd)) {
        throw new Error('Application start date must be earlier than the application end date.')
    }

    const existingEnrollment = await EnrollmentPeriod.findOne({
        enrollmentName: data.enrollmentName,
        academicYear: data.academicYear,
    })

    if (existingEnrollment) {
        throw new Error(
            'An Enrollment Period with this name already exists for the selected Academic Year.'
        )
    }



    return await EnrollmentPeriod.create({
        ...data,
        enrollmentCode,
        status: 'Draft',
    })
}

const getEnrollmentPeriod = async () => {

    return await EnrollmentPeriod
        .find()
        .populate('academicYear', 'academicYearName status')
        .populate('createdBy', 'firstName lastName')
        .sort({
            createdAt: -1,
        })

}

const getEnrollmentPeriodById = async (id) => {

    const enrollmentPeriod = await EnrollmentPeriod
        .findById(id)
        .populate('academicYear')
        .populate('createdBy', 'firstName lastName')

    if (!enrollmentPeriod) {
        throw new Error('Enrollment Period not found.')
    }

    return enrollmentPeriod

}

const updateEnrollmentPeriod = async (id, data) => {

    const enrollmentPeriod = await EnrollmentPeriod.findById(id)

    if (!enrollmentPeriod) {
        throw new Error('Enrollment Period not found.')
    }

    if (enrollmentPeriod.status !== 'Draft') {
        throw new Error('Only Draft Enrollment Periods can be updated.')
    }

    if (
        data.applicationStart &&
        data.applicationEnd &&
        new Date(data.applicationStart) >= new Date(data.applicationEnd)
    ) {
        throw new Error(
            'Application start date must be earlier than the application end date.'
        )
    }

    return await EnrollmentPeriod.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    )

}

const publishEnrollmentPeriod = async (id) => {

    const enrollmentPeriod = await EnrollmentPeriod.findById(id)

    if (!enrollmentPeriod) {
        throw new Error('Enrollment Period not found.')
    }

    if (enrollmentPeriod.status !== 'Draft') {
        throw new Error(
            'Only Draft Enrollment Periods can be published.'
        )
    }

    enrollmentPeriod.status = 'Published'

    await enrollmentPeriod.save()

    return enrollmentPeriod

}

const openEnrollmentPeriod = async (id) => {

    const enrollmentPeriod = await EnrollmentPeriod.findById(id)

    if (!enrollmentPeriod) {
        throw new Error('Enrollment Period not found.')
    }

    if (enrollmentPeriod.status !== 'Published') {
        throw new Error(
            'Only Published Enrollment Periods can be opened.'
        )
    }

    const existingOpen = await EnrollmentPeriod.findOne({
        status: 'Open',
    })

    if (existingOpen) {
        throw new Error(
            'Another Enrollment Period is already open.'
        )
    }

    enrollmentPeriod.status = 'Open'

    await enrollmentPeriod.save()

    return enrollmentPeriod

}

const closeEnrollmentPeriod = async (id) => {

    const enrollmentPeriod = await EnrollmentPeriod.findById(id)

    if (!enrollmentPeriod) {
        throw new Error('Enrollment Period not found.')
    }

    if (enrollmentPeriod.status !== 'Open') {
        throw new Error(
            'Only Open Enrollment Periods can be closed.'
        )
    }

    enrollmentPeriod.status = 'Closed'

    await enrollmentPeriod.save()

    return enrollmentPeriod

}

const archiveEnrollmentPeriod = async (id) => {

    const enrollmentPeriod = await EnrollmentPeriod.findById(id)

    if (!enrollmentPeriod) {
        throw new Error('Enrollment Period not found.')
    }

    if (enrollmentPeriod.status !== 'Closed') {
        throw new Error(
            'Only Closed Enrollment Periods can be archived.'
        )
    }

    enrollmentPeriod.status = 'Archived'

    await enrollmentPeriod.save()

    return enrollmentPeriod

}

const getCurrentEnrollmentPeriod = async () => {

    return await EnrollmentPeriod
        .findOne({
            status: 'Open',
        })
        .populate('academicYear')

}

module.exports = {
    createEnrollmentPeriod,
    getEnrollmentPeriod,
    getEnrollmentPeriodById,
    updateEnrollmentPeriod,
    publishEnrollmentPeriod,
    openEnrollmentPeriod,
    closeEnrollmentPeriod,
    archiveEnrollmentPeriod,
    getCurrentEnrollmentPeriod,
}