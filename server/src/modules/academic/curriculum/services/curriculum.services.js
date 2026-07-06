const Curriculum = require('../models/curriculum.models')
const CurriculumSubject = require('../models/curriculum.subject.models')

const Program = require('../../programs/model/Program')
const AcademicYear = require('../../academicyear/models/academicyear.model')
const Subject = require('../../subject/model/subject.model')

const createCurriculum = async (data) => {

    const existingCode = await Curriculum.findOne({
        curriculumCode: data.curriculumCode.toUpperCase(),
    })

    if (existingCode) {
        throw new Error('Curriculum code already exists.')
    }

    const program = await Program.findById(data.program)

    if (!program) {
        throw new Error('Program not found.')
    }

    const academicYear =
        await AcademicYear.findById(data.academicYear)

    if (!academicYear) {
        throw new Error('Academic Year not found.')
    }

    return await Curriculum.create({
        ...data,
        curriculumCode:
            data.curriculumCode.toUpperCase(),
    })

}

const getCurriculum = async () => {

    return await Curriculum.find()
        .populate(
            'program',
            'programCode programName'
        )
        .populate(
            'academicYear',
            'academicYearName'
        )
        .sort({
            curriculumName: 1,
        })

}


const getCurriculumById = async (id) => {

    const curriculum =
        await Curriculum.findById(id)
            .populate('program')
            .populate('academicYear')

    if (!curriculum) {
        throw new Error(
            'Curriculum not found.'
        )
    }

    return curriculum

}

const updateCurriculum = async (id, data) => {

    const curriculum = await Curriculum.findById(id)

    if (!curriculum) {
        throw new Error('Curriculum not found.')
    }

    if (curriculum.status !== 'Draft') {
        throw new Error(
            'Only draft curriculums can be updated.'
        )
    }

    if (data.program) {

        const program = await Program.findById(data.program)

        if (!program) {
            throw new Error('Program not found.')
        }

    }

    if (data.academicYear) {

        const academicYear = await AcademicYear.findById(
            data.academicYear
        )

        if (!academicYear) {
            throw new Error('Academic Year not found.')
        }

    }

    if (
        data.curriculumCode &&
        data.curriculumCode.toUpperCase() !== curriculum.curriculumCode
    ) {

        const existing = await Curriculum.findOne({
            curriculumCode: data.curriculumCode.toUpperCase(),
            _id: { $ne: id },
        })

        if (existing) {
            throw new Error(
                'Curriculum code already exists.'
            )
        }

        data.curriculumCode =
            data.curriculumCode.toUpperCase()

    }

    return await Curriculum.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    )

}

const publishCurriculum = async (id) => {

    const curriculum = await Curriculum.findById(id)

    if (!curriculum) {
        throw new Error('Curriculum not found.')
    }

    if (curriculum.status === 'Published') {
        throw new Error(
            'Curriculum is already published.'
        )
    }

    const totalSubjects =
        await CurriculumSubject.countDocuments({
            curriculum: id,
        })

    if (totalSubjects === 0) {
        throw new Error(
            'Cannot publish a curriculum without assigned subjects.'
        )
    }

    curriculum.status = 'Published'

    await curriculum.save()

    return curriculum

}

const archiveCurriculum = async (id) => {

    const curriculum = await Curriculum.findById(id)

    if (!curriculum) {
        throw new Error('Curriculum not found.')
    }

    if (curriculum.status === 'Archived') {
        throw new Error(
            'Curriculum is already archived.'
        )
    }

    curriculum.status = 'Archived'

    await curriculum.save()

    return curriculum

}



module.exports = {

    createCurriculum,
    getCurriculum,
    getCurriculumById,
    updateCurriculum,
    publishCurriculum,
    archiveCurriculum,


}

