const Section = require('../../academic/section/models/section.models');
const Student = require('../models/Student');
const StudentSubject = require('../../studentsubject/models/studentsubject.models');
const SectionSubject = require('../../sectionsubject/models/sectionsubject.model');
const Attendance = require('../../attendance/models/attendance.model');

const findStudentByUser = async (userId) => {
    const student = await Student.findOne({ user: userId });
    if (!student) throw new Error('Student not found.');
    return student;
};

const round2 = (n) => (n == null ? null : Math.round(n * 100) / 100);

const computeGpa = (subjects) => {
    let weightedSum = 0;
    let totalUnits = 0;
    subjects.forEach((s) => {
        if (s.finalGrade != null && s.units) {
            weightedSum += s.finalGrade * s.units;
            totalUnits += s.units;
        }
    });
    return round2(totalUnits > 0 ? weightedSum / totalUnits : null);
};

const getMyGrades = async (userId) => {
    const student = await findStudentByUser(userId)
        .populate('program', 'programName')
        .populate('section', 'sectionCode sectionName');

    const records = await StudentSubject.find({ student: student._id })
        .populate('subject', 'subjectCode subjectName units')
        .populate('section', 'sectionCode sectionName')
        .sort({ semester: 1, 'subject.subjectCode': 1 });

    const semesterMap = {};
    records.forEach((r) => {
        if (!semesterMap[r.semester]) semesterMap[r.semester] = [];
        semesterMap[r.semester].push(r);
    });

    const semesters = Object.keys(semesterMap)
        .sort()
        .map((sem) => ({
            semester: sem,
            units: (semesterMap[sem] || []).reduce((s, r) => s + (r.units || 0), 0),
            gpa: computeGpa(semesterMap[sem]),
            subjects: semesterMap[sem].map((r) => ({
                _id: r._id,
                subject: r.subject,
                section: r.section,
                units: r.units,
                prelimGrade: r.prelimGrade,
                midtermGrade: r.midtermGrade,
                finalsGrade: r.finalsGrade,
                finalGrade: r.finalGrade,
                remarks: r.remarks,
                status: r.status,
                yearLevel: r.yearLevel,
            })),
        }));

    const allSubjects = records.map((r) => r);
    return {
        student: {
            studentNumber: student.studentNumber,
            fullName: `${student.firstName} ${student.lastName}`,
            program: student.program?.programName || 'N/A',
            section: student.section?.sectionName || 'Unassigned',
        },
        overallGpa: computeGpa(allSubjects),
        semesters,
    };
};

const getMySchedule = async (userId) => {
    const student = await findStudentByUser(userId).populate(
        'section',
        'sectionCode sectionName'
    );
    if (!student.section) {
        return { section: null, schedule: [] };
    }

    const schedule = await SectionSubject.find({
        section: student.section._id,
        status: 'Scheduled',
    })
        .populate('subject', 'subjectCode subjectName totalUnits')
        .populate('instructor', 'firstName lastName')
        .sort({ day: 1, startTime: 1 });

    return {
        section: student.section,
        semester: schedule[0]?.semester || null,
        schedule,
    };
};

const getMyAttendance = async (userId) => {
    const student = await findStudentByUser(userId);

    const records = await Attendance.find({ student: student._id })
        .populate({
            path: 'sectionSubject',
            populate: [
                { path: 'subject', select: 'subjectCode subjectName' },
                { path: 'section', select: 'sectionCode sectionName' },
            ],
        })
        .sort({ date: -1 });

    const perSubject = {};
    const totals = { Present: 0, Absent: 0, Late: 0, Excused: 0, total: 0 };

    records.forEach((r) => {
        if (r.status) totals[r.status]++;
        totals.total++;
        const key = String(r.sectionSubject?._id);
        if (!r.sectionSubject) return;
        if (!perSubject[key]) {
            perSubject[key] = {
                sectionSubject: r.sectionSubject,
                days: new Set(),
                Present: 0,
                Absent: 0,
                Late: 0,
                Excused: 0,
                total: 0,
            };
        }
        perSubject[key][r.status]++;
        perSubject[key].total++;
        perSubject[key].days.add(r.date.toISOString().split('T')[0]);
    });

    const attendanceRate =
        totals.total > 0
            ? round2((totals.Present / totals.total) * 100)
            : null;

    return {
        student: {
            studentNumber: student.studentNumber,
            fullName: `${student.firstName} ${student.lastName}`,
        },
        totals,
        attendanceRate,
        subjects: Object.values(perSubject).map((s) => ({
            ...s,
            days: s.days.size,
            rate: s.total > 0 ? round2((s.Present / s.total) * 100) : null,
        })),
        records: records.slice(0, 100).map((r) => ({
            _id: r._id,
            date: r.date,
            status: r.status,
            remarks: r.remarks,
            subject: r.sectionSubject?.subject,
            section: r.sectionSubject?.section,
        })),
    };
};


const getDashboard = async (userId) => {
    const student = await Student.findOne({
        user: userId,
    })
    .populate("program", "programName")
    .populate("section", "sectionCode sectionName yearLevel");

    if (!student) {
        throw new Error("Student not found.");
    }

    const enrolledSubjects = await StudentSubject.countDocuments({
        student: student._id,
    });

    return {
        studentNumber: student.studentNumber,
        fullName: `${student.firstName} ${student.lastName}`,
        program: student.program?.programName || 'N/A',
        section: student.section?.sectionName || 'Unassigned',
        yearLevel: student.yearLevel || 'N/A',
        enrolledSubjects,
        status: student.status,
    };
};  

const getMyProfile = async (id) => {
    const student = await Student.findOne({ user: id })
    .populate("program", "programName")
    .populate("section", "sectionName");

    if (!student) {
        throw new Error("Student not found.");
    }

    return student;
};

const updateMyProfile = async (userId, data) => {
    const student = await Student.findOne({
        user: userId,
    });

    if (!student) {
        throw new Error("Student not found.");
    }

    student.contactNumber = data.contactNumber ?? student.contactNumber;
    student.address = data.address ?? student.address;
    student.photo = data.photo ?? student.photo;

    await student.save();
    return student;
};

const assignSection = async (studentId, sectionId) => {
    const student = await Student.findById(studentId);

    if (!student) {
        throw new Error('Not found.');
    }

    const section = await Section.findById(sectionId).populate('curriculum');

    if (!section) {
        throw new Error('Section not found.');
    }

    if (section.curriculum.program.toString() !== student.program.toString()) {
        throw new Error('Section does not belong to the students program.');
    }

    student.section = section._id;
    student.yearLevel = section.yearLevel;

    await student.save();

    return await Student.findById(student._id)
        .populate('program', 'programName')
        .populate('section', "sectionCode sectionName yearLevel");
};

const getStudents = async () => {
  return await Student.find()
    .populate({
      path: 'program',
      select: 'programName programCode department',
      populate: {
        path: 'department',
        select: 'departmentName departmentCode'
      }
    })
    .populate('section', 'sectionCode sectionName yearLevel')
    .sort({ createdAt: -1 });
}
module.exports = {
    getDashboard,
    getMyProfile,
    updateMyProfile,
    assignSection,
    getStudents,
    getMyGrades,
    getMySchedule,
    getMyAttendance,
};