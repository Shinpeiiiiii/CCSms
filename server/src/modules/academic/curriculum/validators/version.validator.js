const CurriculumSubject = require("../models/curriculum.subject.models");
const Subject = require("../../subject/model/subject.model");

const versionValidator = async (curriculumId) => {

    const curriculumSubjects =
        await CurriculumSubject.find({
            curriculum: curriculumId,
        }).populate("subject");

    const warnings = [];

    for (const item of curriculumSubjects) {

        const latest =
            await Subject.findOne({

                subjectCode:
                    item.subject.subjectCode,

                isCurrentVersion: true,

            });

        if (

            latest &&

            latest.version >

            item.subject.version

        ) {

            warnings.push(

                `${item.subject.subjectCode} is using Version ${item.subject.version}. Latest is Version ${latest.version}.`

            );

        }

    }

    return {

        valid: true,

        errors: [],

        warnings,

    };

};

module.exports = versionValidator;