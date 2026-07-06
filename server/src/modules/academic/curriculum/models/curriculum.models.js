const mongoose = require('mongoose');

const curriculumSchema = new mongoose.Schema(
    {
        curriculumCode: {
            type: String,
            required: true,
            unique: true,
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
        }

    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Curriculum', curriculumSchema)