const mongoose = require('mongoose')

const studentSubjectSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },

    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
    },

    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true,
    },

    enrollmentPeriod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EnrollmentPeriod",
        required: true,
    },

    academicYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicYear",
        required: true,
    },
    
    yearLevel: {
        type: Number,
        required: true,
    },

    semester: {
        type: String,
        required: true,
    },

    units: {
        type: Number,
        required: true,
        default: 0,
    },

    status: {
        type: String,
        enum: [
            "Loaded", "Dropped", "Completed", "Failed", "Withdrawn", 
        ],

        default: "Loaded",
    },

    finalGrade: {
        type: Number,
        default: null,
    },

    remarks: {
        type: String,
        enum: [
            "Passed", "Failed", "Incomplete", null,
        ],
        default: null,
    },
},

    {
        timestamps: true,
    }
);

studentSubjectSchema.index({

    student:1,

    subject:1,

    academicYear:1,

    semester:1,

},{
    unique:true,
});

module.exports = mongoose.model("StudentSubject", studentSubjectSchema);