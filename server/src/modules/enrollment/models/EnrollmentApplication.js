const mongoose = require('mongoose')

const enrollmentSchema = new mongoose.Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    email: String,
    program: String,
    yearlevel: String,

    status:{
        type: String,
        default: 'pending',
    },
},  {
    timestamps: true,
})


module.exports = mongoose.model('EnrollmentApplication',enrollmentSchema)