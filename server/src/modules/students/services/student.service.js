const Section = require('../../academic/section/models/section.models');
const Student = require('../models/Student');
const StudentSubject = require('../../studentsubject/models/studentsubject.models');


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
};