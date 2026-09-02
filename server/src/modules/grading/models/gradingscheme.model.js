const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },
        label: {
            type: String,
            required: true,
            trim: true,
        },
        weight: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
    },
    { _id: false }
);

const gradingSchemeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
        categories: {
            type: [categorySchema],
            default: [],
        },
        termWeights: {
            prelim: {
                type: Number,
                default: 1 / 3,
            },
            midterm: {
                type: Number,
                default: 1 / 3,
            },
            finals: {
                type: Number,
                default: 1 / 3,
            },
        },
        passingGrade: {
            type: Number,
            default: 75,
        },
        status: {
            type: String,
            enum: ['Draft', 'Published', 'Archived'],
            default: 'Draft',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('GradingScheme', gradingSchemeSchema);
