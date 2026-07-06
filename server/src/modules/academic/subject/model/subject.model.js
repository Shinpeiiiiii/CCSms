const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    subjectCode: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        unique: true,
    },

    subjectName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
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

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

module.exports = mongoose.model('Subject', subjectSchema)