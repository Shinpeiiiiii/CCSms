const mongoose = require('mongoose')

const enrollmentPeriodSchema = new mongoose.Schema(
    {
        enrollmentPeriodName: {
            type: String,
            required: true,
            //unique: true,
            trim: true,
        },
        academicYear: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AcademicYear',
            required: true,
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
                'Published',
                'Open',
                'Closed',
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

module.exports = mongoose.model('EnrollmentPeriod', enrollmentPeriodSchema)