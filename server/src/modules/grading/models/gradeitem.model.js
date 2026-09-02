const mongoose = require('mongoose');

const TERM_ENUM = ['prelim', 'midterm', 'finals'];

const gradeItemSchema = new mongoose.Schema(
    {
        sectionSubject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SectionSubject',
            required: true,
        },
        term: {
            type: String,
            enum: TERM_ENUM,
            required: true,
        },
        category: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        possible: {
            type: Number,
            required: true,
            min: 1,
        },
        dueDate: {
            type: Date,
            default: null,
        },
        isGroup: {
            type: Boolean,
            default: false,
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GradeGroup',
            default: null,
        },
        baseScore: {
            type: Number,
            default: null,
        },
        externalId: {
            type: String,
            default: null,
        },
        externalType: {
            type: String,
            enum: ['classroom_coursework', null],
            default: null,
        },
    },
    { timestamps: true }
);

gradeItemSchema.index({ sectionSubject: 1, term: 1, category: 1 });

module.exports = mongoose.model('GradeItem', gradeItemSchema);
module.exports.TERM_ENUM = TERM_ENUM;
