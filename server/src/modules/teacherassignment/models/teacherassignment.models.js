const mongoose = require('mongoose')

const teacherAssignmentSchema = new mongoose.Schema(
    {
        subjectAssignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubjectAssignment',
            required: true,
        },

        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        status: {
            type: String,
            enum: [
                'Assigned',
                'Unassigned',
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

module.exports = mongoose.model(
    'TeacherAssignment',
    teacherAssignmentSchema
)