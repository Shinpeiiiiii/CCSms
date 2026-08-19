const Subject =
require("../../subject/model/subject.model");

const validateSubject = async (
    subjectId
) => {

    const errors = [];

    const warnings = [];

    const subject =
        await Subject.findById(subjectId);

    if (!subject) {

        errors.push(
            "Subject not found."
        );

        return {

            valid: false,

            errors,

            warnings,

        };

    }

    if (subject.status !== "Active") {

        errors.push(
            "Subject is inactive."
        );

    }

    if (!subject.isCurrentVersion) {

        warnings.push(
            "This is not the latest subject version."
        );

    }

    return {

        valid: errors.length === 0,

        errors,

        warnings,

        subject,

    };

};

module.exports = validateSubject;