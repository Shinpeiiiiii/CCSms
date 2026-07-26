const mongoose = require('mongoose');

const sectionSubjectSchema = new mongoose.Schema({
    section:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
        required:true,
    },

    subject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject",
        required:true,
    },

    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null,
    },

    room:{
        type:String,
        default:"",
        trim:true,
    },

    semester:{
        type: Number,
        enum: [1, 2, 3],
        required: true,
    },

    day:{
        type:String,
        enum:[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
        ],
        default:"",
    },

    startTime:{
        type:String,
        default:"",
    },

    endTime:{
        type:String,
        default:"",
    },

    status:{
        type:String,
        enum:[
            "Scheduled",
            "Cancelled",
        ],
        default:"Scheduled",
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

},
{
    timestamps:true,
});

// Prevent duplicate schedule
sectionSubjectSchema.index({
    section:1,
    subject:1,
    day:1,
    startTime:1,
    endTime:1,
},{
    unique:true,
});

module.exports = mongoose.model("SectionSubject", sectionSubjectSchema);