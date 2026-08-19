const mongoose = require("mongoose");

const studentApplicationSchema = new mongoose.Schema(
{
    applicationNumber: {
        type: String,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },

    emailVerified: {
        type: Boolean,
        default: false,
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

    // Personal details added for enrollment form
    firstName: {
        type: String,
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    sex: {
        type: String,
        enum: ["Male", "Female"],
    },
    birthDate: {
        type: Date,
    },
    civilStatus: {
        type: String,
        default: "Single",
    },
    nationality: {
        type: String,
        default: "Filipino",
    },
    contactNumber: {
        type: String,
    },
    address: {
        type: String,
    },
    program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        default: null,
    },
    yearLevel: {
        type: Number,
        default: 1,
    },
    studentType: {
        type: String,
        enum: ["Regular", "Irregular", "Transferee", "Returnee"],
        default: "Regular",
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "Under Review",
            "Needs Revision",
            "Approved",
            "Rejected",
        ],
        default: "Pending",
    },
    remarks: {
        type: String,
        default: "",
    },

    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    reviewedAt: Date,
},
{
    timestamps:true,
});

module.exports = mongoose.model(
    "Application",
    studentApplicationSchema,
);