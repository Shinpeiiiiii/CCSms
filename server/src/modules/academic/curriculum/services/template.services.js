const Curriculum = require('../models/curriculum.models')
const CurriculumSubject = require('../models/curriculum.subject.models')
const CurriculumTemplate = require('../models/template.models')
const Program = require('../../programs/model/Program')
const AcademicYear = require('../../academicyear/models/academicyear.model')
const Subject = require('../../subject/model/subject.model')
const { clearCache } = require('../../../../utils/cache.helper')

const saveAsTemplate = async (curriculumId, name, userId) => {
    const curriculum = await Curriculum.findById(curriculumId)
        .populate('program', 'programCode programName')
        .populate('academicYear', 'academicYearName')

    if (!curriculum) {
        throw new Error('Curriculum not found.')
    }

    const subjects = await CurriculumSubject.find({ curriculum: curriculumId })
        .populate('subject', 'subjectCode subjectName units lectureHours laboratoryHours subjectCategory')
        .sort({ yearLevel: 1, semester: 1, displayOrder: 1 })

    const templateSubjects = subjects.map((item) => ({
        subjectCode: item.subject?.subjectCode || '',
        subjectName: item.subject?.subjectName || '',
        yearLevel: item.yearLevel,
        semester: item.semester,
        units: item.subject?.units || 0,
        prerequisites: [],
    }))

    const template = await CurriculumTemplate.create({
        name,
        program: curriculum.program._id,
        totalYears: curriculum.totalYears,
        subjects: templateSubjects,
        createdBy: userId,
    })

    return template
}

const getTemplates = async () => {
    return await CurriculumTemplate.find()
        .populate('program', 'programCode programName')
        .populate('createdBy', 'firstName lastName')
        .sort({ name: 1 })
}

const createCurriculumFromTemplate = async (templateId, data, userId) => {
    const template = await CurriculumTemplate.findById(templateId)
        .populate('program', 'programCode programName')

    if (!template) {
        throw new Error('Template not found.')
    }

    const program = await Program.findById(data.program || template.program._id)
    if (!program) {
        throw new Error('Program not found.')
    }

    const academicYear = await AcademicYear.findById(data.academicYear)
    if (!academicYear) {
        throw new Error('Academic Year not found.')
    }

    const existingCode = await Curriculum.findOne({
        curriculumCode: data.curriculumCode.toUpperCase(),
        isCurrentVersion: true,
    })

    if (existingCode) {
        throw new Error('Curriculum code already exists.')
    }

    const curriculum = await Curriculum.create({
        curriculumCode: data.curriculumCode.toUpperCase(),
        curriculumName: data.curriculumName || template.name,
        program: program._id,
        academicYear: academicYear._id,
        totalYears: data.totalYears || template.totalYears,
        status: 'Draft',
        version: 1,
        isCurrentVersion: true,
        createdBy: userId,
        remarks: data.remarks || '',
    })

    const subjectMap = new Map()

    for (const item of template.subjects) {
        const subject = await Subject.findOne({ subjectCode: item.subjectCode })
        if (!subject) {
            continue
        }

        const created = await CurriculumSubject.create({
            curriculum: curriculum._id,
            subject: subject._id,
            yearLevel: item.yearLevel,
            semester: item.semester,
            displayOrder: item.yearLevel * 10 + item.semester,
            isRequired: true,
            prerequisites: [],
        })

        subjectMap.set(item.subjectCode, created._id)
    }

    const createdSubjects = await CurriculumSubject.find({ curriculum: curriculum._id })
        .populate('subject', 'subjectCode')

    for (const created of createdSubjects) {
        if (!created.subject) continue

        const templateItem = template.subjects.find(
            (s) => s.subjectCode === created.subject.subjectCode
        )
        if (!templateItem || !templateItem.prerequisites?.length) continue

        const mappedPrereqs = templateItem.prerequisites
            .map((code) => subjectMap.get(code))
            .filter(Boolean)

        if (mappedPrereqs.length > 0) {
            created.prerequisites = mappedPrereqs
            await created.save()
        }
    }

    await clearCache('curriculums', `curriculum:${curriculum._id}`)
    await clearCache('curriculumSubjects', `curriculum:${curriculum._id}`)

    return curriculum
}

const exportCurriculum = async (id) => {
    const curriculum = await Curriculum.findById(id)
        .populate('program', 'programCode programName')
        .populate('academicYear', 'academicYearName')

    if (!curriculum) {
        throw new Error('Curriculum not found.')
    }

    const subjects = await CurriculumSubject.find({ curriculum: id })
        .populate('subject', 'subjectCode subjectName units')
        .sort({ yearLevel: 1, semester: 1, displayOrder: 1 })

    return {
        curriculumCode: curriculum.curriculumCode,
        curriculumName: curriculum.curriculumName,
        program: curriculum.program?.programCode || '',
        programName: curriculum.program?.programName || '',
        academicYear: curriculum.academicYear?.academicYearName || '',
        totalYears: curriculum.totalYears,
        remarks: curriculum.remarks || '',
        subjects: subjects.map((item) => ({
            subjectCode: item.subject?.subjectCode || '',
            subjectName: item.subject?.subjectName || '',
            yearLevel: item.yearLevel,
            semester: item.semester,
            units: item.subject?.units || 0,
            prerequisites: [],
        })),
    }
}

const importCurriculum = async (payload, userId) => {
    const {
        curriculumCode,
        curriculumName,
        program,
        academicYear,
        totalYears,
        remarks,
        subjects,
    } = payload

    if (!curriculumCode || !curriculumName || !program || !academicYear || !totalYears) {
        throw new Error('Missing required curriculum fields.')
    }

    const programDoc = await Program.findById(program)
    if (!programDoc) {
        throw new Error('Program not found.')
    }

    const academicYearDoc = await AcademicYear.findById(academicYear)
    if (!academicYearDoc) {
        throw new Error('Academic Year not found.')
    }

    const existingCode = await Curriculum.findOne({
        curriculumCode: curriculumCode.toUpperCase(),
        isCurrentVersion: true,
    })

    if (existingCode) {
        throw new Error('Curriculum code already exists.')
    }

    const curriculum = await Curriculum.create({
        curriculumCode: curriculumCode.toUpperCase(),
        curriculumName,
        program,
        academicYear,
        totalYears,
        status: 'Draft',
        version: 1,
        isCurrentVersion: true,
        createdBy: userId,
        remarks: remarks || '',
    })

    const subjectMap = new Map()

    if (Array.isArray(subjects)) {
        for (const item of subjects) {
            if (!item.subjectCode) continue

            const subject = await Subject.findOne({ subjectCode: item.subjectCode })
            if (!subject) {
                continue
            }

            const created = await CurriculumSubject.create({
                curriculum: curriculum._id,
                subject: subject._id,
                yearLevel: item.yearLevel || 1,
                semester: item.semester || 1,
                displayOrder: (item.yearLevel || 1) * 10 + (item.semester || 1),
                isRequired: true,
                prerequisites: [],
            })

            subjectMap.set(item.subjectCode, created._id)
        }

        const createdSubjects = await CurriculumSubject.find({ curriculum: curriculum._id })
            .populate('subject', 'subjectCode')

        for (const created of createdSubjects) {
            if (!created.subject) continue

            const templateItem = subjects.find(
                (s) => s.subjectCode === created.subject.subjectCode
            )
            if (!templateItem || !templateItem.prerequisites?.length) continue

            const mappedPrereqs = templateItem.prerequisites
                .map((code) => subjectMap.get(code))
                .filter(Boolean)

            if (mappedPrereqs.length > 0) {
                created.prerequisites = mappedPrereqs
                await created.save()
            }
        }
    }

    await clearCache('curriculums', `curriculum:${curriculum._id}`)
    await clearCache('curriculumSubjects', `curriculum:${curriculum._id}`)

    return curriculum
}

module.exports = {
    saveAsTemplate,
    getTemplates,
    createCurriculumFromTemplate,
    exportCurriculum,
    importCurriculum,
}
