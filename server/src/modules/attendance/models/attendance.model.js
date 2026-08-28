const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    sectionSubject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SectionSubject",
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Late", "Excused"],
        required: true,
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    remarks: {
        type: String,
        default: "",
    },
}, { timestamps: true });

attendanceSchema.index(
    { sectionSubject: 1, student: 1, date: 1 },
    { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
