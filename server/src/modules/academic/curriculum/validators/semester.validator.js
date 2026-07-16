const CurriculumSubject = require("../models/curriculum.subject.models");
const SubjectPrerequisite = require("../../prerequisites/models/prerequisites.models");

const semesterValidator = async (curriculumId) => {

    const curriculumSubjects =
        await CurriculumSubject.find({
            curriculum: curriculumId,
        }).populate(
            "subject",
            "subjectCode"
        );

    const errors = [];

    const lookup = new Map();

    curriculumSubjects.forEach(item => {

        lookup.set(

            String(item.subject._id),

            item

        );

    });

    for (const item of curriculumSubjects) {

        const prerequisites =
            await SubjectPrerequisite.find({

                subject: item.subject._id,

                status: "Active",

            });

        for (const prerequisite of prerequisites) {

            const prerequisiteSubject =
                lookup.get(
                    String(prerequisite.requiredSubject)
                );

            if (!prerequisiteSubject) {

                continue;

            }

            const prerequisiteLevel =
                prerequisiteSubject.yearLevel * 10 +
                prerequisiteSubject.semester;

            const currentLevel =
                item.yearLevel * 10 +
                item.semester;

            if (
                prerequisiteLevel >= currentLevel
            ) {

                errors.push(

                    `${item.subject.subjectCode} has a prerequisite scheduled after or in the same semester.`

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

module.exports = semesterValidator;