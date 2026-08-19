const Section = require('../../academic/section/models/section.models')
const Curriculum = require('../../academic/curriculum/models/curriculum.models')
const CurriculumSubject = require('../../academic/curriculum/models/curriculum.subject.models')
const SectionSubject = require('../models/sectionsubject.model')
const { clearCache } = require('../../../utils/cache.helper')

const generateSectionSubjects = async (sectionId) => {
    const section = await Section.findById(sectionId)
        .populate('curriculum')
        .populate('academicYear')

    if (!section) {
        throw new Error('Section not found.')
    }

    if (!section.curriculum) {
        return []
    }

    const curriculumSubjects = await CurriculumSubject.find({
        curriculum: section.curriculum._id,
        yearLevel: section.yearLevel,
    }).populate('subject')

    if (!curriculumSubjects.length) {
        return []
    }

    const existing = await SectionSubject.find({
        section: section._id,
    })

    if (existing.length > 0) {
        return existing
    }

    const docs = curriculumSubjects.map(cs => ({
        section: section._id,
        subject: cs.subject._id,
        semester: cs.semester,
        status: 'Scheduled',
        createdBy: section.createdBy,
    }))

    const created = await SectionSubject.insertMany(docs)

    await clearCache('sectionSubjects', `section:${section._id}`)

    return created

}

const regenerateSectionSubjects = async (sectionId) => {
    await SectionSubject.deleteMany({ section: sectionId })
    return generateSectionSubjects(sectionId)
}

module.exports = {
    generateSectionSubjects,
    regenerateSectionSubjects,
}
