const Curriculum = require('../models/curriculum.models')
const CurriculumSubject = require('../models/curriculum.subject.models')

const Program = require('../../programs/model/Program')
const AcademicYear = require('../../academicyear/models/academicyear.model')
const Subject = require('../../subject/model/subject.model')
const { clearCache } = require('../../../../utils/cache.helper')
const validateCurriculum = require('../validators/curriculum.validator')

const enforceLock = async (curriculumId, userId) => {
    const curriculum = await Curriculum.findById(curriculumId);
    if (!curriculum) return;
    if (!curriculum.lock?.lockedBy) return;
    if (curriculum.lock.lockedAt && Date.now() - curriculum.lock.lockedAt > 4 * 60 * 60 * 1000) {
        await Curriculum.findByIdAndUpdate(curriculumId, { lock: { lockedBy: null, lockedAt: null } });
        return;
    }
    if (String(curriculum.lock.lockedBy) !== String(userId)) {
        throw new Error('This curriculum is locked by another user.');
    }
};

const releaseLock = async (curriculumId) => {
    await Curriculum.findByIdAndUpdate(curriculumId, { lock: { lockedBy: null, lockedAt: null } });
};

const createCurriculum = async (data) => {

    const existingCode = await Curriculum.findOne({
        curriculumCode: data.curriculumCode.toUpperCase(),
        isCurrentVersion: true,
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

    const curriculum = await Curriculum.create({
        ...data,
        curriculumCode:
            data.curriculumCode.toUpperCase(),
    })

    await clearCache('curriculums');

    return curriculum

}

const getCurriculum = async () => {

    return await Curriculum.find({
        isCurrentVersion: true,
    })
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

    const curriculum = await Curriculum.findOne({
        _id: id, isCurrentVersion: true,
    })

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
            _id: { $ne: id }, isCurrentVersion: true,
        })

        if (existing) {
            throw new Error(
                'Curriculum code already exists.'
            )
        }

        data.curriculumCode =
            data.curriculumCode.toUpperCase()

    }

    const updated = await Curriculum.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    )

    await clearCache('curriculums', `curriculum:${id}`)

    return updated

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
    if (!curriculum.isCurrentVersion) {
        throw new Error("Only the current curriculum version can be published.");
    }

    const validation = await validateCurriculum(id);

    if (!validation.valid) {
        const err = new Error("Curriculum validation failed.")
        err.errors = validation.errors
        err.warnings = validation.warnings
        throw err
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

    await clearCache('curriculums', `curriculum:${id}`)

    return curriculum

}

const archiveCurriculum = async (id) => {

    const curriculum = await Curriculum.findById(id)

    if (!curriculum) {
        throw new Error('Curriculum not found.')
    }
    if (!curriculum.isCurrentVersion) {
    throw new Error(
        "Historical curriculum versions cannot be archived."
    );
}

    if (curriculum.status === 'Archived') {
        throw new Error(
            'Curriculum is already archived.'
        )
    }

    curriculum.status = 'Archived'

    await curriculum.save()

    await clearCache('curriculums', `curriculum:${id}`)

    return curriculum

}
const createNewVersion = async (
    curriculumId,
    data,
    userId
) => {

    const curriculum =
        await Curriculum.findById(curriculumId);

    if (!curriculum) {
        throw new Error("Curriculum not found.");
    }

    if (!curriculum.isCurrentVersion) {
        throw new Error(
            "Only the current curriculum version can be versioned."
        );
    }

    const existingCode =
        await Curriculum.findOne({
            curriculumCode: data.curriculumCode.toUpperCase(),
            _id: { $ne: curriculumId },
            isCurrentVersion: true,
        });

    if (existingCode) {
        throw new Error(
            "Curriculum code already exists."
        );
    }

    curriculum.isCurrentVersion = false;

    await curriculum.save();

    const newCurriculum =
        await Curriculum.create({

            curriculumCode:
                data.curriculumCode.toUpperCase(),

            curriculumName:
                data.curriculumName,

            program:
                data.program,

            academicYear:
                data.academicYear,

            totalYears:
                data.totalYears,

            remarks:
                data.remarks,

            status: "Draft",

            version:
                curriculum.version + 1,

            parentCurriculum:
                curriculum.parentCurriculum ||
                curriculum._id,

            isCurrentVersion: true,

            createdBy: userId,

        });

    const curriculumSubjects =
        await CurriculumSubject.find({
            curriculum: curriculumId,
        });

    const oldIdToNewId = new Map();

    for (const item of curriculumSubjects) {

        const created = await CurriculumSubject.create({

            curriculum:
                newCurriculum._id,

            subject:
                item.subject,

            yearLevel:
                item.yearLevel,

            semester:
                item.semester,

            prerequisites: [],

            isRequired:
                item.isRequired,

            displayOrder:
                item.displayOrder,

        });

        oldIdToNewId.set(String(item._id), String(created._id));

    }

    for (const item of curriculumSubjects) {

        if (!item.prerequisites?.length) continue;

        const newId = oldIdToNewId.get(String(item._id));
        if (!newId) continue;

        const mapped = item.prerequisites
            .map(oldPrereqId => oldIdToNewId.get(String(oldPrereqId)))
            .filter(Boolean);

        await CurriculumSubject.findByIdAndUpdate(newId, {
            prerequisites: mapped,
        });

    }

    await clearCache('curriculums', `curriculum:${curriculumId}`);

    return newCurriculum;

};

const getVersionHistory = async (
    curriculumId
) => {

    const curriculum =
        await Curriculum.findById(curriculumId);

    if (!curriculum) {
        throw new Error(
            "Curriculum not found."
        );
    }

    const rootId =
        curriculum.parentCurriculum ||
        curriculum._id;

    return await Curriculum.find({

        $or: [

            {
                _id: rootId,
            },

            {
                parentCurriculum: rootId,
            },

        ],

    })

    .populate(
        "program",
        "programCode programName"
    )

    .populate(
        "academicYear",
        "academicYearName"
    )

    .populate(
        "createdBy",
        "firstName lastName"
    )

    .sort({
        version: -1,
    });

};


module.exports = {

    createCurriculum,
    getCurriculum,
    getCurriculumById,
    updateCurriculum,
    publishCurriculum,
    archiveCurriculum,
    createNewVersion,
    getVersionHistory,
}
const autoStructureCurriculum = async (curriculumId, subjectGroups) => {
    const curriculum = await Curriculum.findById(curriculumId);
    if (!curriculum) {
        throw new Error('Curriculum not found.');
    }

    if (curriculum.status !== 'Draft') {
        throw new Error('Only draft curriculums can be modified.');
    }

    const createdSubjects = [];

    for (const group of subjectGroups) {
        const { yearLevel, semester, subjects } = group;

        if (!yearLevel || !semester || !subjects?.length) {
            continue;
        }

        for (let i = 0; i < subjects.length; i++) {
            const subject = await Subject.findById(subjects[i].subjectId || subjects[i]);
            if (!subject) {
                throw new Error('Subject not found: ' + (subjects[i].subjectId || subjects[i]));
            }

            const existing = await CurriculumSubject.findOne({
                curriculum: curriculumId,
                subject: subject._id,
            });

            if (existing) {
                continue;
            }

            const maxOrder = await CurriculumSubject
                .find({ curriculum: curriculumId, yearLevel, semester })
                .sort({ displayOrder: -1 })
                .limit(1)
                .select('displayOrder');

            const displayOrder = (maxOrder[0]?.displayOrder || 0) + 1;

            const created = await CurriculumSubject.create({
                curriculum: curriculumId,
                subject: subject._id,
                yearLevel,
                semester,
                displayOrder,
                isRequired: subjects[i].isRequired ?? true,
                prerequisites: subjects[i].prerequisites || [],
            });

            createdSubjects.push(created);
        }
    }

    await clearCache('curriculums', 'curriculum:' + curriculumId);

    return createdSubjects;
};

module.exports = {
    createCurriculum,
    getCurriculum,
    getCurriculumById,
    updateCurriculum,
    publishCurriculum,
    archiveCurriculum,
    createNewVersion,
    getVersionHistory,
    autoStructureCurriculum,
}
