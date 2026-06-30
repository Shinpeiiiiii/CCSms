const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema(
    {
        departmentCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        departmentName: {
            type: String,
            required: true,
            trim: true,
        },

        descriptions: {
            type: String,
            default: '',
            trim: true,
        },

        departmentHead: {
            type: String,
            required: true,
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
        },
    }, {
    timestamps: true,
}

)

module.exports = mongoose.model('Department', departmentSchema)