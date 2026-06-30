const mongoose = require('mongoose')

const academicYearSchema = new mongoose.Schema(
    {
        academicYearCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },

        academicYearName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: [
                'Draft',
                'Upcoming',
                'Active',
                'Completed',
                'Archived',
            ],
            default: 'Draft',
        },

        remarks: {
            type: String,
            default: '',
            trim: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('AcademicYear', academicYearSchema)