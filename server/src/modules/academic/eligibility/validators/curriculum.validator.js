const Curriculum = require("../../curriculum/models/curriculum.models");
const CurriculumSubject = require("../../curriculum/models/curriculum.subject.models");

const validateCurriculum = async (
    curriculumId,
    subjectId
) => {

    const errors = [];
    const warnings = [];

    const curriculum = await Curriculum.findById(curriculumId);

    if (!curriculum) {

        errors.push("Curriculum not found.");

        return {
            valid: false,
            errors,
            warnings,
        };

    }

    if (curriculum.status !== "Published") {

        errors.push(
            "Curriculum is not published."
        );

    }

    if (!curriculum.isCurrentVersion) {

        warnings.push(
            "Curriculum is not the latest version."
        );

    }

    const curriculumSubject =
        await CurriculumSubject.findOne({

            curriculum: curriculumId,

            subject: subjectId,

        });

    if (!curriculumSubject) {

        errors.push(
            "Subject is not part of this curriculum."
        );

    }

    return {

        valid: errors.length === 0,

        errors,

        warnings,

        curriculum,

        curriculumSubject,

    };

};

module.exports = validateCurriculum;