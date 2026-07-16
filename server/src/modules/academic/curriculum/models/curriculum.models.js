const mongoose = require('mongoose');

const curriculumSchema = new mongoose.Schema(
    {
        curriculumCode: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },

        curriculumName: {
            type: String,
            required: true,
            trim: true,
        },

        program: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Program',
            required: true,
        },

        academicYear: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AcademicYear',
            required: true,
        },

        totalYears: {
            type: Number,
            required: true,
            min: 1,
        },

        status: {
            type: String,
            enum: [
                'Draft',
                'Published',
                'Archived'
            ],
            default: 'Draft',
        },

        remarks: {
            type: String,
            default: '',
            trim: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        version: {
            type: Number,
            default: 1,
        },

        parentCurriculum: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Curriculum",
            default: null,
        },

        isCurrentVersion: {
            type: Boolean,
            default: true,
        },

    },
    {
        timestamps: true,
    }
)


curriculumSchema.index({
    isCurrentVersion: 1,
});

curriculumSchema.index({
    parentCurriculum: 1,
});

curriculumSchema.index({
    program: 1,
});

curriculumSchema.index({
    academicYear: 1,
});
module.exports = mongoose.model('Curriculum', curriculumSchema)