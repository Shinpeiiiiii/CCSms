const mongoose = require("mongoose");

const applicationTimelineSchema = new mongoose.Schema({
    application:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"StudentApplication",
        required:true,
    },

    action:{
        type:String,
        required:true,
    },

    description:{
        type:String,
        default:"",
    },

    performedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null,
    },

    visibility:{
        type:String,
        enum:[
            "Public",
            "Internal",
        ],
        default:"Public",
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model("ApplicationTimeline", applicationTimelineSchema);