const CurriculumSubject = require("../models/curriculum.subject.models");

const displayOrderValidator = async (curriculumId) => {

    const subjects =
        await CurriculumSubject.find({
            curriculum: curriculumId,
        }).populate(
            "subject",
            "subjectCode"
        );

    const errors = [];

    const groups = {};

    for (const item of subjects) {

        const key =
            `${item.yearLevel}-${item.semester}`;

        if (!groups[key]) {

            groups[key] = [];

        }

        groups[key].push(item);

    }

    for (const key in groups) {

        const used = new Set();

        for (const item of groups[key]) {

            if (
                used.has(item.displayOrder)
            ) {

                errors.push(

                    `Duplicate display order (${item.displayOrder}) in Year ${item.yearLevel} Semester ${item.semester}.`

                );

            }

            used.add(item.displayOrder);

        }

    }

    return {

        valid: errors.length === 0,

        errors,

        warnings: [],

    };

};

module.exports = displayOrderValidator;