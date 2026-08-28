const Attendance = require("../models/attendance.model");
const SectionSubject = require("../../sectionsubject/models/sectionsubject.model");
const Student = require("../../students/models/Student");

const markAttendance = async (sectionSubjectId, date, records, markedBy) => {
    const sectionSubject = await SectionSubject.findById(sectionSubjectId);
    if (!sectionSubject) {
        throw new Error("Section subject not found.");
    }

    const results = await Promise.all(
        records.map(async ({ studentId, status, remarks }) => {
            return await Attendance.findOneAndUpdate(
                {
                    sectionSubject: sectionSubjectId,
                    student: studentId,
                    date: new Date(date),
                },
                {
                    status,
                    remarks: remarks || "",
                    markedBy,
                },
                { upsert: true, new: true, runValidators: true }
            );
        })
    );

    return results;
};

const getAttendanceByDate = async (sectionSubjectId, date) => {
    const sectionSubject = await SectionSubject.findById(sectionSubjectId)
        .populate("subject", "subjectCode subjectName")
        .populate("section", "sectionCode sectionName");

    if (!sectionSubject) {
        throw new Error("Section subject not found.");
    }

    const students = await Student.find({
        section: sectionSubject.section._id,
        status: "Active",
    })
    .select("studentNumber firstName lastName")
    .sort({ lastName: 1 });

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const attendanceRecords = await Attendance.find({
        sectionSubject: sectionSubjectId,
        date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("student", "studentNumber firstName lastName");

    const attendanceMap = {};
    attendanceRecords.forEach((a) => {
        attendanceMap[a.student?._id?.toString()] = {
            _id: a._id,
            status: a.status,
            remarks: a.remarks,
        };
    });

    return {
        sectionSubject: {
            _id: sectionSubject._id,
            subject: sectionSubject.subject,
            section: sectionSubject.section,
            day: sectionSubject.day,
            startTime: sectionSubject.startTime,
            endTime: sectionSubject.endTime,
            room: sectionSubject.room,
        },
        date,
        students: students.map((s) => ({
            _id: s._id,
            student: s,
            attendance: attendanceMap[s._id?.toString()] || null,
        })),
    };
};

const getAttendanceSummary = async (sectionSubjectId) => {
    const sectionSubject = await SectionSubject.findById(sectionSubjectId)
        .populate("subject", "subjectCode subjectName")
        .populate("section", "sectionCode sectionName");

    if (!sectionSubject) {
        throw new Error("Section subject not found.");
    }

    const students = await Student.find({
        section: sectionSubject.section._id,
        status: "Active",
    })
    .select("studentNumber firstName lastName")
    .sort({ lastName: 1 });

    const records = await Attendance.find({ sectionSubject: sectionSubjectId })
        .populate("student", "studentNumber firstName lastName");

    const studentMap = {};
    students.forEach((s) => {
        studentMap[s._id.toString()] = {
            student: s,
            Present: 0,
            Absent: 0,
            Late: 0,
            Excused: 0,
            total: 0,
        };
    });

    records.forEach((r) => {
        const sid = r.student?._id?.toString();
        if (!sid || !studentMap[sid]) return;
        studentMap[sid][r.status]++;
        studentMap[sid].total++;
    });

    const uniqueDates = [...new Set(records.map((r) => r.date?.toISOString()?.split("T")[0]))];

    return {
        sectionSubject: {
            _id: sectionSubject._id,
            subject: sectionSubject.subject,
            section: sectionSubject.section,
            day: sectionSubject.day,
            startTime: sectionSubject.startTime,
            endTime: sectionSubject.endTime,
            room: sectionSubject.room,
        },
        totalSessions: uniqueDates.length,
        students: Object.values(studentMap),
    };
};

const getAttendanceCalendar = async (sectionSubjectId, year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const records = await Attendance.find({
        sectionSubject: sectionSubjectId,
        date: { $gte: startDate, $lte: endDate },
    });

    const dateMap = {};
    records.forEach((r) => {
        const key = r.date.toISOString().split('T')[0];
        if (!dateMap[key]) {
            dateMap[key] = { date: key, count: 0, Present: 0, Absent: 0, Late: 0, Excused: 0 };
        }
        dateMap[key].count++;
        dateMap[key][r.status]++;
    });

    return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
};

const getMyAttendance = async (userId) => {
    const records = await Attendance.find({ markedBy: userId })
        .populate({
            path: "sectionSubject",
            populate: [
                { path: "subject", select: "subjectCode subjectName" },
                { path: "section", select: "sectionCode sectionName" },
            ],
        })
        .sort({ date: -1 })
        .limit(50);

    return records;
};

module.exports = {
    markAttendance,
    getAttendanceByDate,
    getAttendanceSummary,
    getAttendanceCalendar,
    getMyAttendance,
};
