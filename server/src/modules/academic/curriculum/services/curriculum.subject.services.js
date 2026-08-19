const mongoose = require('mongoose')
const Curriculum = require('../models/curriculum.models')
const CurriculumSubject = require('../models/curriculum.subject.models')
const Subject = require('../../subject/model/subject.model')
const { clearCache } = require('../../../../utils/cache.helper')

const getNextDisplayOrder = async (curriculumId, yearLevel, semester) => {
    const maxOrder = await CurriculumSubject
        .find({ curriculum: curriculumId, yearLevel, semester })
        .sort({ displayOrder: -1 })
        .limit(1)
        .select('displayOrder');

    return (maxOrder[0]?.displayOrder || 0) + 1;
};

const addSubjectToCurriculum = async (curriculumId, data) => {
    const resolvedCurriculumId = curriculumId || data?.curriculumId || data?.curriculum;

    if (!resolvedCurriculumId) {
        throw new Error('Curriculum ID is required.')
    }

    const curriculum = await Curriculum.findById(resolvedCurriculumId)

    if (!curriculum) {
        throw new Error('Curriculum not found.')
    }

    if (curriculum.status !== 'Draft') {
        throw new Error(
            'Only draft curriculums can be modified.'
        )
    }

    const subject = await Subject.findById(data.subject)

    if (!subject) {
        throw new Error('Subject not found.')
    }

    const existing =
        await CurriculumSubject.findOne({
            curriculum: resolvedCurriculumId,
            subject: data.subject,
        })

    if (existing) {
        throw new Error(
            'Subject already exists in this curriculum.'
        )
    }

    const displayOrder = data.displayOrder || await getNextDisplayOrder(resolvedCurriculumId, data.yearLevel, data.semester);

    const created = await CurriculumSubject.create({
        curriculum: resolvedCurriculumId,
        ...data,
        displayOrder,
    })

    await clearCache('curriculumSubjects', `curriculum:${resolvedCurriculumId}`)

    return created

}

const getCurriculumStructure = async (curriculumId) => {
    const subjects = await CurriculumSubject.find({
        curriculum: curriculumId,
    })
        .populate('subject', 'subjectCode subjectName units lectureHours laboratoryHours subjectCategory')
        .sort({ yearLevel: 1, semester: 1, displayOrder: 1 });

    const structure = {};

    for (const item of subjects) {
        const yearKey = `Year ${item.yearLevel}`;
        const semKey = `Semester ${item.semester}`;

        if (!structure[yearKey]) {
            structure[yearKey] = {};
        }
        if (!structure[yearKey][semKey]) {
            structure[yearKey][semKey] = [];
        }

        structure[yearKey][semKey].push({
            _id: item._id,
            subject: item.subject,
            yearLevel: item.yearLevel,
            semester: item.semester,
            displayOrder: item.displayOrder,
            isRequired: item.isRequired,
            prerequisites: item.prerequisites,
        });
    }

    return structure;
};

const getCurriculumSubject = async (curriculumId) => {

    if (!mongoose.Types.ObjectId.isValid(curriculumId)) {
        return []
    }

    return await CurriculumSubject.find({
        curriculum: curriculumId,
    })
        .populate(
            'subject',
            'subjectCode subjectName units'
        )
        .sort({
            yearLevel: 1,
            semester: 1,
            displayOrder: 1,
        })

}

const updateCurriculumSubject = async (
    id,
    data
) => {

    const curriculumSubject =
        await CurriculumSubject.findById(id)
            .populate('curriculum')

    if (!curriculumSubject) {
        throw new Error(
            'Curriculum Subject not found.'
        )
    }

    if (
        curriculumSubject.curriculum.status !==
        'Draft'
    ) {
        throw new Error(
            'Published curriculums cannot be modified.'
        )
    }

    const updated = await CurriculumSubject.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    )

    await clearCache('curriculumSubjects', `curriculum:${updated.curriculum}`)

    return updated

}

const removeCurriculumSubject =
async (id) => {

    const curriculumSubject =
        await CurriculumSubject.findById(id)
            .populate('curriculum')

    if (!curriculumSubject) {
        throw new Error(
            'Curriculum Subject not found.'
        )
    }

    if (
        curriculumSubject.curriculum.status !==
        'Draft'
    ) {
        throw new Error(
            'Published curriculums cannot be modified.'
        )
    }

    await CurriculumSubject.findByIdAndDelete(id)

    await clearCache('curriculumSubjects', `curriculum:${curriculumSubject.curriculum}`)

}

const bulkAddSubjectToCurriculum = async (
    curriculumId,
    subjects
) => {

    const curriculum = await Curriculum.findById(curriculumId)

    if (!curriculum) {
        throw new Error('Curriculum not found.')
    }

    if (curriculum.status !== 'Draft') {
        throw new Error(
            'Only draft curriculums can be modified.'
        )
    }

    const documents = []

    for (const item of subjects) {

        const subject = await Subject.findById(item.subject)

        if (!subject) {
            throw new Error(
                `Subject ${item.subject} not found.`
            )
        }

        const existing =
            await CurriculumSubject.findOne({
                curriculum: curriculumId,
                subject: item.subject,
            })

        if (existing) {
            throw new Error(
                `${subject.subjectCode} already exists in this curriculum.`
            )
        }

        const displayOrder = item.displayOrder || await getNextDisplayOrder(curriculumId, item.yearLevel, item.semester);

        documents.push({
            curriculum: curriculumId,
            ...item,
            displayOrder,
        })

    }

    const result = await CurriculumSubject.insertMany(
        documents
    )

    await clearCache('curriculumSubjects', `curriculum:${curriculumId}`)

    return result

}

module.exports = {
    addSubjectToCurriculum,
    getCurriculumSubject,
    updateCurriculumSubject,
    removeCurriculumSubject,
    bulkAddSubjectToCurriculum,
    getNextDisplayOrder,
}
