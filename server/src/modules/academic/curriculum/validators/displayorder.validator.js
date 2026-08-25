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

        const duplicates = new Set();

        for (const item of groups[key]) {

            if (
                used.has(item.displayOrder)
            ) {

                duplicates.add(item.displayOrder);

            }

            used.add(item.displayOrder);

        }

        for (const displayOrder of duplicates) {

            errors.push(

                `Duplicate display order (${displayOrder}) in Year ${groups[key][0].yearLevel} Semester ${groups[key][0].semester}.`

            );

        }

    }

    return {

        valid: errors.length === 0,

        errors,

        warnings: [],

    };

};

module.exports = displayOrderValidator;