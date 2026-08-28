const mongoose = require('mongoose');

const templateSubjectSchema = new mongoose.Schema(
    {
        subjectCode: {
            type: String,
            required: true,
            trim: true,
        },
        subjectName: {
            type: String,
            required: true,
            trim: true,
        },
        yearLevel: {
            type: Number,
            required: true,
            min: 1,
        },
        semester: {
            type: Number,
            required: true,
            enum: [1, 2, 3],
        },
        units: {
            type: Number,
            required: true,
            min: 0,
        },
        prerequisites: [
            {
                type: String,
                trim: true,
            },
        ],
    },
    { _id: false }
);

const templateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        program: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Program',
            required: true,
        },
        totalYears: {
            type: Number,
            required: true,
            min: 1,
        },
        subjects: [templateSubjectSchema],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

templateSchema.index({
    program: 1,
});

module.exports = mongoose.model('CurriculumTemplate', templateSchema);
