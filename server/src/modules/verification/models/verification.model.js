const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        code: {
            type: String,
            required: true,
        },

        purpose: {
            type: String,
            enum: [
                "Enrollment Application",
                "Password Reset",
                "Email Change",
            ],
            required: true,
        },

        verified: {
            type: Boolean,
            default: false,
        },

        attempts: {
            type: Number,
            default: 0,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Automatically delete expired OTPs
verificationSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

module.exports = mongoose.model(
    "Verification",
    verificationSchema
);