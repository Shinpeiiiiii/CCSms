const Section = require('../models/section.models')

const Curriculum = require('../../curriculum/models/curriculum.models')

const AcademicYear = require('../../academicyear/models/academicyear.model')

const Student = require('../../../students/models/Student')

const SectionSubject = require('../../../sectionsubject/models/sectionsubject.model')

const { generateSectionSubjects } = require('../../../sectionsubject/services/generate-section-subjects')

const createSection = async (data) => {

    const existingSection =
        await Section.findOne({
            sectionCode: data.sectionCode.toUpperCase(),
        })

    if (existingSection) {
        throw new Error(
            'Section code already exists.'
        )
    }
    const curriculum = await Curriculum.findById(data.curriculum)
    if (!curriculum) {
        throw new Error('Curriculum not found.')
    }

    if (curriculum.status !== 'Published') {
        throw new Error(
            'Only published curriculums can create sections.'
        )
    }

    const academicYear =
        await AcademicYear.findById(
            data.academicYear
        )

    if (!academicYear) {
        throw new Error(
            'Academic Year not found.'
        )
    }

    if (!curriculum.academicYear.equals(academicYear._id)) 
    {
        throw new Error('Curriculum and Academic Year do not match.')
    }

    return await Section.create({
        ...data,
        sectionCode: data.sectionCode.toUpperCase(),
    })

}

const getSection = async () => {

    const sections = await Section.find()
        .populate({
            path: 'curriculum',
            select: 'curriculumCode curriculumName program',
            populate: {
                path: 'program',
                select: 'programName programCode',
            },
        })
        .populate('academicYear', 'academicYearName')
        .populate('adviser', 'firstName lastName email')
        .sort({ createdAt: -1 })

    const counts = await Student.aggregate([
        {
            $match: {
                section: { $ne: null },
            },
        },
        {
            $group: {
                _id: '$section',
                enrolledCount: { $sum: 1 },
            },
        },
    ])

    const sectionSubjectCounts = await SectionSubject.aggregate([
        {
            $group: {
                _id: '$section',
                generatedSubjectCount: { $sum: 1 },
            },
        },
    ])

    const sectionSubjectMap = new Map(sectionSubjectCounts.map((c) => [c._id.toString(), c.generatedSubjectCount]))

    const countMap = new Map(counts.map((c) => [c._id.toString(), c.enrolledCount]))

    return sections.map((section) => ({
        ...section.toObject(),
        enrolledCount: countMap.get(section._id.toString()) || 0,
        generatedSubjectCount: sectionSubjectMap.get(section._id.toString()) || 0,
    }))

}

const getSectionById = async (id) => {

    const section = await Section.findById(id)
        .populate(
            'curriculum'
        )
        .populate(
            'academicYear'
        )
        .populate(
            'adviser',
            'firstName lastName email role'
        )

    if (!section) {
        throw new Error('Section not found.')
    }

    return section

}

const updateSection = async (
    id,
    data
) => {

    const section = await Section.findById(id)

    if (!section) {
        throw new Error('Section not found.')
    }

    if (section.status !== 'Planning') {
        throw new Error(
            'Only planning sections can be updated.'
        )
    }

    if (data.sectionCode) {

        const existing =
            await Section.findOne({
                sectionCode:
                    data.sectionCode.toUpperCase(),
                _id: { $ne: id },
            })

        if (existing) {
            throw new Error(
                'Section code already exists.'
            )
        }

        data.sectionCode =
            data.sectionCode.toUpperCase()

    }

    if (data.curriculum) {

        const curriculum =
            await Curriculum.findById(
                data.curriculum
            )

        if (!curriculum) {
            throw new Error(
                'Curriculum not found.'
            )
        }

        if (
            curriculum.status !==
            'Published'
        ) {
            throw new Error(
                'Curriculum must be published.'
            )
        }

    }

    if (data.academicYear) {

        const academicYear =
            await AcademicYear.findById(
                data.academicYear
            )

        if (!academicYear) {
            throw new Error(
                'Academic Year not found.'
            )
        }

    }

    return await Section.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    )

}

const openSection = async (id) => {

    const section = await Section.findById(id)

    if (!section) {
        throw new Error(
            'Section not found.'
        )
    }

    if (section.status !== 'Planning') {
        throw new Error(
            'Only planning sections can be opened.'
        )
    }

    section.status = 'Open'

    await section.save()

    let generatedSubjects = 0

    if (section.curriculum) {
        const generated = await generateSectionSubjects(id)
        generatedSubjects = generated.length
    }

    return {
        section,
        generatedSubjects,
    }

}

const closeSection = async (id) => {

    const section = await Section.findById(id)

    if (!section) {
        throw new Error(
            'Section not found.'
        )
    }

    if (section.status !== 'Open') {
        throw new Error(
            'Only open sections can be closed.'
        )
    }

    section.status = 'Closed'

    await section.save()

    return section

}

const archiveSection = async (id) => {

    const section = await Section.findById(id)

    if (!section) {
        throw new Error(
            'Section not found.'
        )
    }

    if (section.status === 'Archived') {
        throw new Error(
            'Section is already archived.'
        )
    }

    section.status = 'Archived'

    await section.save()

    return section

}

const deleteSection = async (id) => {

    const section = await Section.findById(id)

    if (!section) {
        throw new Error(
            'Section not found.'
        )
    }

    if (section.status !== 'Planning') {
        throw new Error(
            'Only planning sections can be deleted.'
        )
    }

    await Section.findByIdAndDelete(id)

}

module.exports = {
    createSection,
    getSection,
    getSectionById,
    updateSection,
    openSection,
    closeSection,
    archiveSection,
    deleteSection
}