const mongoose = require('mongoose')

const subjectAssignmentSchema = new mongoose.Schema(
    {
        section:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section',
            requried: true,
        },

        curriculumSubject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CurriculumSubject',
            required: true,
        },

        status: {
            type: String,
            enum: [
                'Assigned',
                'Cancelled',
            ],
            default: 'Assigned',
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

module.exports = mongoose.model('SubjectAssignment', subjectAssignmentSchema)