const mongoose = require('mongoose')

const curriculumSubjectSchema = new mongoose.Schema(
{
    curriculum: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curriculum',
        required: true,
    },

    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },

    yearLevel: {
        type: Number,
        required: true,
        min: 1,
    },

    semester: {
        type: Number,
        enum: [1, 2, 3],
        required: true,
    },

    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CurriculumSubject',
    }],

    isRequired: {
        type: Boolean,
        default: true,
    },

    displayOrder: {
        type: Number,
        default: 1,
    }

},
{
    timestamps: true,
})

curriculumSubjectSchema.index({
    curriculum: 1,
    subject: 1
}, {
    unique: true,
})

module.exports = mongoose.model(
    'CurriculumSubject',
    curriculumSubjectSchema
)