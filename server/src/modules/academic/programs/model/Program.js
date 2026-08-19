const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
    {
        programCode: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
            unique: true,
        },

        programName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

       

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required: true,
        },
        programLevel: {
            type: String,
            enum: ['College'],
            required: true,
        },

        durationYears: {
            type: Number,
            required: true,
            min: 1,
        },

        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },

        description: {
            type: String,
            default: '',
            trim: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model('Program', programSchema)