const mongoose = require('mongoose')

const subjcetPrerequisitesSchema = new mongoose.Schema({

    subject: {type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true},
    requiredSubject: {type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true},
    type: {type: String, enum: ["Prerequisite", "Corerequisite"], default: "Prerequisite"},
    minimumGrade: {type: Number, default: 75, min: 60, max: 100},
    status: {type: String, enum: ["Active", "Inactive"], default: "Active"},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    updatedBy: {type: mongoose.Schema.Types.ObjectId, ref:"User"}

}, {
    timestamps: true
});

subjcetPrerequisitesSchema.index(
    {
        subject: 1,requiredSubject: 1
    },
    {
        unique: true
    }
);

subjcetPrerequisitesSchema.index({ subject: 1 });
subjcetPrerequisitesSchema.index({ requiredSubject: 1 });
subjcetPrerequisitesSchema.index({ status: 1 });

module.exports = mongoose.model("SubjectPrerequisite", subjcetPrerequisitesSchema);