const mongoose = require('mongoose')

const sectionSchema = new mongoose.Schema(
    {
        sectionCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        sectionName: {
            type: String,
            required: true,
            trim: true,
        },

        curriculum: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Curriculum',
            required: true,
        },

        academicYear: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AcademicYear',
            required: true,
        },

        yearLevel: {
            type: Number,
            enum: [1, 2, 3, 4],
            required: true,
        },

        capacity: {
            type: Number,
            required: true,
            min: 1,
            default: 40,
        },

        adviser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        status: {
            type: String,
            enum: [
                'Planning',
                'Open',
                'Closed',
                'Archived',
            ],
            default: 'Planning',
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

    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model(
    'Section',
    sectionSchema
)