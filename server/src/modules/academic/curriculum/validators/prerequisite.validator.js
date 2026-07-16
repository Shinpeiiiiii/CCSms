const CurriculumSubject = require("../models/curriculum.subject.models");
const SubjectPrerequisite = require("../../prerequisites/models/prerequisites.models");

const prerequisiteValidator = async (curriculumId) => {

    const curriculumSubjects =
        await CurriculumSubject.find({
            curriculum: curriculumId,
        }).populate(
            "subject",
            "subjectCode subjectName"
        );

    const subjectIds = new Set(
        curriculumSubjects.map(item =>
            String(item.subject._id)
        )
    );

    const errors = [];

    for (const item of curriculumSubjects) {

        const prerequisites =
            await SubjectPrerequisite.find({

                subject: item.subject._id,

                status: "Active",

                type: "Prerequisite",

            }).populate(
                "requiredSubject",
                "subjectCode subjectName"
            );

        for (const prerequisite of prerequisites) {

            if (
                !subjectIds.has(
                    String(prerequisite.requiredSubject._id)
                )
            ) {

                errors.push(

                    `${item.subject.subjectCode} requires ${prerequisite.requiredSubject.subjectCode}, but it does not exist in this curriculum.`

                );

            }

        }

    }

    return {

        valid: errors.length === 0,

        errors,

        warnings: [],

    };

};

module.exports = prerequisiteValidator;