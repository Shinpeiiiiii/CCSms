const AcademicYear = require('../models/academicyear.model')

const createAcademicYear = async (data) => {
    const startYear = data.academicYearName.split('-')[0]
    const academicYearCode = `AY${startYear}`

    const existingName =
    await AcademicYear.findOne({
        academicYearName: data.academicYearName,
    })

    if (existingName) {
        throw new Error('Academic Year already exists.')
    }

    const existingCode =
    await AcademicYear.findOne({
        academicYearCode,
    })

    if (existingCode) {
        throw new Error('Academic Year code already exists.')
    }
    const overlappingAcademicYear =
    await AcademicYear.findOne({
        startDate: { $lte: data.endDate },
        endDate: { $gte: data.startDate },
    })

    if (overlappingAcademicYear) {
        throw new Error(
            'Academic Year dates overlap with an existing Academic Year.'
        )
    }
    console.log(data)

    return await AcademicYear.create({
        ...data, academicYearCode, status: 'Draft',createdBy: data.createdBy
    });

    
}

const getAcademicYear = async () => {
     return await AcademicYear.find().sort({
        startDate: -1,
    })
}

const updateAcademicYear = async (id, data) => {
    const academicYear = await AcademicYear.findById(id)

    if (!academicYear) {
        throw new Error('Academic Year not found.')
    }

    if (
        data.startDate &&
        data.endDate &&
        new Date(data.startDate) >= new Date(data.endDate)
    ) {
        throw new Error('Start date must be earlier than the end date.')
    }

    if (data.academicYearName) {

        const duplicate = await AcademicYear.findOne({
            academicYearName: data.academicYearName,
            _id: { $ne: id },
        })

        if (duplicate) {
            throw new Error('Academic Year already exists.')
        }

        const startYear = data.academicYearName.split('-')[0]

        data.academicYearCode = `AY${startYear}`
    }

    if (data.startDate || data.endDate) {

        const overlapping = await AcademicYear.findOne({
            _id: { $ne: id },
            startDate: {
                $lte: data.endDate || academicYear.endDate,
            },
            endDate: {
                $gte: data.startDate || academicYear.startDate,
            },
        })

        if (overlapping) {
            throw new Error(
                'Academic Year dates overlap with another Academic Year.'
            )
        }
    }

    return await AcademicYear.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    )
}

const activateAcademicYear = async (id) => {
    const academicYear = await AcademicYear.findById(id)

    if (!academicYear) {
        throw new Error('Academic Year not found.')
    }

    if (academicYear.status !== 'Upcoming') {
        throw new Error(
            'Only Upcoming Academic Years can be activated.'
        )
    }

    await AcademicYear.updateMany(
        { status: 'Active' },
        { status: 'Completed' }
    )

    academicYear.status = 'Active'

    await academicYear.save()

    return academicYear
}

const archiveAcademicYear = async (id) => {
    const academicYear = await AcademicYear.findById(id)

    if (!academicYear) {
        throw new Error('Academic Year not found.')
    }

    if (academicYear.status !== 'Completed') {
        throw new Error(
            'Only Completed Academic Years can be archived.'
        )
    }

    academicYear.status = 'Archived'

    await academicYear.save()

    return academicYear
}

const publishAcademicYear = async (id) => {

    const academicYear = await AcademicYear.findById(id)

    if (!academicYear) {
        throw new Error('Academic Year not found.')
    }

    if (academicYear.status !== 'Draft') {
        throw new Error(
            'Only Draft Academic Years can be published.'
        )
    }

    academicYear.status = 'Upcoming'

    await academicYear.save()

    return academicYear
}

const getCurrentAcademicYear = async () => {
    const academicYear = await AcademicYear.findOne({ status: 'Active' })

    if(!academicYear) {
        throw new Error('No active academic year found.')
    }

    return academicYear
}

const getAcademicYearById = async (id) => {
    const academicYear = await AcademicYear.findById(id)
    return academicYear
    
    if(!academicYear) {
        throw new Error('Academic Year not found.')
    }
}

module.exports = {
    createAcademicYear,
    getAcademicYear,
    updateAcademicYear,
    activateAcademicYear,
    publishAcademicYear,
    archiveAcademicYear,
    getAcademicYearById,
    getCurrentAcademicYear,
}