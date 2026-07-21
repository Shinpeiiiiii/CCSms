const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
{
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true,
    },

    academicYear:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"AcademicYear",
        required:true,
    },

    enrollmentPeriod:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"EnrollmentPeriod",
        required:true,
    },

    section:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
    },

    semester:{
        type:Number,
        enum:[1,2,3],
        required:true,
    },

    status:{
        type:String,
        enum:[
            "Pending",
            "Assessed",
            "Paid",
            "Enrolled",
            "Cancelled",
        ],
        default:"Pending",
    },

    enrolledAt:{
        type:Date,
    },
},
{
    timestamps:true,
});

module.exports =
mongoose.model(
    "Enrollment",
    enrollmentSchema
);