const validateSubject =
    require("./subject.validator");

const validateCurriculum =
    require("./curriculum.validator");

const validatePrerequisite =
    require("./prerequisite.validator");

const validateDuplicate =
    require("./duplicate.validator");

const validateStatus =
    require("./status.validator");

const validateEligibility = async (data) => {

    const {

        studentId,

        curriculumId,

        subjectId,

        academicRecordEntries = [],

    } = data;

    const errors = [];

    const warnings = [];

    // Subject

    const subjectResult =
        await validateSubject(subjectId);

    errors.push(...subjectResult.errors);

    warnings.push(...subjectResult.warnings);

    // Curriculum

    const curriculumResult =
        await validateCurriculum(
            curriculumId,
            subjectId
        );

    errors.push(...curriculumResult.errors);

    warnings.push(...curriculumResult.warnings);

    // Prerequisite

    const prerequisiteResult =
        await validatePrerequisite(
            subjectId,
            academicRecordEntries
        );

    errors.push(...prerequisiteResult.errors);

    warnings.push(...prerequisiteResult.warnings);

    // Duplicate

    const duplicateResult =
        await validateDuplicate(
            studentId,
            subjectId
        );

    errors.push(...duplicateResult.errors);

    warnings.push(...duplicateResult.warnings);

    // Status

    const statusResult =
        await validateStatus(
            studentId
        );

    errors.push(...statusResult.errors);

    warnings.push(...statusResult.warnings);

    return {

        eligible: errors.length === 0,

        errors,

        warnings,

    };

};

module.exports = validateEligibility;