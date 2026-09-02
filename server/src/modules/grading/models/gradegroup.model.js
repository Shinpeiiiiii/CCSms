const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        adjustment: {
            type: Number,
            default: 0,
        },
    },
    { _id: false }
);

const gradeGroupSchema = new mongoose.Schema(
    {
        sectionSubject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SectionSubject',
            required: true,
        },
        name: {
            type: String,
            trim: true,
            default: '',
        },
        members: {
            type: [groupMemberSchema],
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('GradeGroup', gradeGroupSchema);
