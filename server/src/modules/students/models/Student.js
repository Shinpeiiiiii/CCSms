const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        MiddleName: {
            type: String,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        degreeProgram: {
            type: String,
            required: true,
        },
        yearLevel: {
            type: String,
            required: true,
        },

    },
        {
            timestamps: true,
        }
    
)

module.exports = mongoose.model('Student', studentSchema)
