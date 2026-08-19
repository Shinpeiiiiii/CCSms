const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    subjectCode: {type: String,required: true,trim: true, uppercase: true,},

    subjectName: {
        type: String,
        required: true,
        trim: true,
    },

    units: {
        type: Number,
        required: true,
        min: 1,
    },

    lectureHours: {
        type: Number,
        required: true,
        min: 0,
    },

    laboratoryHours: {
        type: Number,
        required: true,
        min: 0,
    },

    subjectCategory: {
        type: String,
        enum: [
            'Core', 
            'Elective',
            'Major',
            'General Education',
            'Specialization',
            'OJT',
        ],
        required: true,
    },

    description: {
        type: String,
        default: '',
        trim: true,
    },

    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    version: {
        type: Number,
        default: 1,
    },
    parentSubject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        default: null   
    },
    isCurrentVersion: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},{
    timestamps: true,
})

subjectSchema.index(
    {
        subjectCode: 1,
        version: 1,
    }
);

subjectSchema.index({
    parentSubject: 1,
});

subjectSchema.index({
    isCurrentVersion: 1,
});

module.exports = mongoose.model('Subject', subjectSchema)