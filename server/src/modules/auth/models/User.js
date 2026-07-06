const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true

    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
    },

    password: {
        type: String,
        requried:true,
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
    tokenVersion:{
        type: Number,
        default: 0,
    },
   
}, {
    timestamps: true,
})


module.exports = mongoose.model('User',userSchema)
