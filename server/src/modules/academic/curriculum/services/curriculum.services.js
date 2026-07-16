const Curriculum = require('../models/curriculum.models')
const CurriculumSubject = require('../models/curriculum.subject.models')

const Program = require('../../programs/model/Program')
const AcademicYear = require('../../academicyear/models/academicyear.model')
const Subject = require('../../subject/model/subject.model')

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
    console.log(data);
    return await Curriculum.create({
        ...data,
        curriculumCode:
            data.curriculumCode.toUpperCase(),
    })

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
    if (!curriculum.isCurrentVersion) {
        throw new Error("Only the current curriculum version can be published."
        );

     // 👇 Validate the curriculum before publishing
    const validation = await validateCurriculum(id);

    if (!validation.valid) {
        throw new Error({
            message: "Curriculum validation failed.",
            errors: validation.errors,
            warnings: validation.warnings,
        });
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

    for (const item of curriculumSubjects) {

        await CurriculumSubject.create({

            curriculum:
                newCurriculum._id,

            subject:
                item.subject,

            yearLevel:
                item.yearLevel,

            semester:
                item.semester,

            prerequisites:
                item.prerequisites,

            isRequired:
                item.isRequired,

            displayOrder:
                item.displayOrder,

        });

    }

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