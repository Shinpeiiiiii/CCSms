const mongoose = require('mongoose');

const SOURCE_ENUM = ['manual', 'import', 'google-classroom'];

const gradeScoreSchema = new mongoose.Schema(
    {
        gradeItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GradeItem',
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        score: {
            type: Number,
            required: true,
            min: 0,
        },
        source: {
            type: String,
            enum: SOURCE_ENUM,
            default: 'manual',
        },
        externalId: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

gradeScoreSchema.index({ gradeItem: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('GradeScore', gradeScoreSchema);
module.exports.SOURCE_ENUM = SOURCE_ENUM;
