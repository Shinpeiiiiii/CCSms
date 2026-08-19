const prerequisiteService =
require("../../prerequisites/services/prerequisites.services");

const validatePrerequisite = async (

    subjectId,

    academicRecordEntries = []

) => {

    const errors = [];

    const warnings = [];

    const result =
        await prerequisiteService.checkPrerequisiteMet(

            subjectId,

            academicRecordEntries

        );

    if (!result.eligible) {

        for (const item of result.unmetPrerequisites) {

            errors.push(

                `Missing prerequisite: ${item.requiredSubject.subjectCode} - ${item.requiredSubject.subjectName}`

            );

        }

    }

    return {

        valid: result.eligible,

        errors,

        warnings,

    };

};

module.exports = validatePrerequisite;