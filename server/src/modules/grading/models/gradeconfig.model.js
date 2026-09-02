const mongoose = require('mongoose');

const configCategorySchema = new mongoose.Schema(
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

const gradeConfigSchema = new mongoose.Schema(
    {
        sectionSubject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SectionSubject',
            required: true,
            unique: true,
        },
        scheme: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GradingScheme',
            default: null,
        },
        categories: {
            type: [configCategorySchema],
            default: [],
        },
        termWeights: {
            prelim: { type: Number, default: 1 / 3 },
            midterm: { type: Number, default: 1 / 3 },
            finals: { type: Number, default: 1 / 3 },
        },
        passingGrade: {
            type: Number,
            default: 75,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('GradeConfig', gradeConfigSchema);
