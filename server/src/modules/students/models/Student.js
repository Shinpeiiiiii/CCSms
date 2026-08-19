const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
    {
        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentApplication",
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        // Permanent school ID
        studentNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        
        firstName: {
            type: String,
            required: true,
        },
        middleName: {
            type: String,
        },
        lastName: {
            type: String,
            required: true,
        },
        sex: {
            type: String,
            enum: ["Male", "Female"],
            required: true,
        },
        birthDate: {
            type: Date,
            required: true,
        },
        civilStatus: {
            type: String,
            default: "Single",
        },
        nationality: {
            type: String,
            default: "Filipino",
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        program: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Program",
            required: true,
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
            enum: [
                "Regular",
                "Irregular",
                "Transferee",
                "Returnee",
            ],
            default: "Regular",
        },
        status: {
            type: String,
            enum: [
                "Active",
                "Inactive",
                "Graduated",
                "Dropped",
                "Transferred",
            ],
            default: "Active",
        },
        admittedAt: {
            type: Date,
            default: Date.now,
        },
        photo: {
            type: String,
            default: "",
        },
    },
        {
            timestamps: true,
        }
    
)

module.exports = mongoose.model('Student', studentSchema)