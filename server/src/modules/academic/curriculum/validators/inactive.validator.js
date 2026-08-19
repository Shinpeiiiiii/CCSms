const CurriculumSubject = require("../models/curriculum.subject.models");

const inactiveValidator = async (curriculumId) => {

    const curriculumSubjects =
        await CurriculumSubject.find({
            curriculum: curriculumId,
        })
        .populate(
            "subject",
            "subjectCode subjectName status"
        );

    const errors = [];

    for (const item of curriculumSubjects) {

        if (!item.subject) {

            errors.push(
                "A curriculum subject references a subject that no longer exists."
            );

            continue;

        }

        if (item.subject.status !== "Active") {

            errors.push(

                `${item.subject.subjectCode} - ${item.subject.subjectName} is inactive.`

            );

        }

    }

    return {

        valid: errors.length === 0,

        errors,

        warnings: [],

    };

};

module.exports = inactiveValidator;