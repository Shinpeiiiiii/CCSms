const duplicateValidator = require("./duplicate.validator");
const inactiveValidator = require("./inactive.validator");
const prerequisiteValidator = require("./prerequisite.validator");
const displayOrderValidator = require("./displayOrder.validator");
const semesterValidator = require("./semester.validator");
const versionValidator = require("./version.validator");

const validateCurriculum = async (curriculumId) => {

    const validators = [

        duplicateValidator,

        inactiveValidator,

        prerequisiteValidator,

        displayOrderValidator,

        semesterValidator,

        versionValidator,

    ];

    const errors = [];
    const warnings = [];

    for (const validator of validators) {

        const result =
            await validator(curriculumId);

        errors.push(...result.errors);

        warnings.push(...result.warnings);

    }

    return {

        valid: errors.length === 0,

        errors,

        warnings,

    };

};

module.exports = validateCurriculum;