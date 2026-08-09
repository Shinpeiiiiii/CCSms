const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        default: '',
        trim: true,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: [
            'admin',
            'registrar',
            'teacher',
            'student',
        ],
        default: 'teacher',
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    activationToken: {
        type: String,
        default: null,
    },
    activationExpires: {
        type: Date,
        default: null,
    },
    tokenVersion: {
        type: Number,
        default: 0,
    },
    failedLoginAttempts: {
        type: Number,
        default: 0,
    },
    lockUntil: {
        type: Date,
        default: null,
    },
    mustChangePassword: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
})


module.exports = mongoose.model('User',userSchema)
