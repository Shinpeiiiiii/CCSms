const Student = require("../../students/models/Student");
const Section = require("../../academic/section/models/section.models");
const EnrollmentPeriod = require("../../academic/enrollmentperiod/models/enrollmentperiod.model");
const StudentSubject = require("../models/studentsubject.models");
const SectionSubject = require("../../sectionsubject/models/sectionsubject.model");


const generateLoad = async (studentID) => {
    const student = await Student.findById(studentID).populate("section");

    if(!student){
        throw new Error("Student not found.")
    }

    if(!student.section){
        throw new Error("Student is not assigned to any section.")
    }

    const section = await Section.findById(student.section)
    .populate("academicYear");

    if(!section){
        throw new Error("Section not found.")
    }

    const enrollmentPeriod = await EnrollmentPeriod.findOne({
        status: "Open",
    });

    if(!enrollmentPeriod){
        throw new Error("Theres no open enrollment period.");
    }
   
    const sectionSubjects = await SectionSubject.find({
        section: section._id,
    }).populate("subject");

    if(!sectionSubjects.length){
        throw new Error("No section subjects found for this section.");
    }

    const existing = await StudentSubject.find({
        student: student._id, enrollmentPeriod: enrollmentPeriod._id,
    });

    if (existing.length) {
        throw new Error(
            "Student already has generated subjects for this semester."
        );
    }

    const documents = sectionSubjects.map(ss => ({
        student: student._id,
        section: ss.section,
        subject: ss.subject._id,
        enrollmentPeriod: enrollmentPeriod._id,
        academicYear: enrollmentPeriod.academicYear,
        yearLevel: section.yearLevel,
        semester: ss.semester || enrollmentPeriod.semester,
        units: ss.subject?.units || 0,
        status: "Loaded",
    }));

    await StudentSubject.insertMany(documents);

    return await StudentSubject.find({
        student: student._id,
    })
    .populate("subject")
    .populate("section")
    .populate({ path: "enrollmentPeriod", populate: { path: "academicYear",},});
}

const getStudentLoad = async (studentId) => {

    const student = await Student.findById(studentId);

    if (!student) {
        throw new Error("Student not found.");
    }

    return await StudentSubject.find({
        student: studentId,
    })
    .populate("subject")
    .populate("section")
    .populate({ path: "enrollmentPeriod", populate:{ path:"academicYear",},})
    .sort({ createdAt:1,});

};

const getMySubjects = async(studentId)=>{

    const student = await Student.findOne({ user:studentId,});

    if(!student){
        throw new Error("Student profile not found.");
    }

    return await StudentSubject.find({student: student._id,})
    .populate("subject")
    .populate("section")
    .populate({path:"enrollmentPeriod",
        populate:{ path:"academicYear",},
    });
};

const removeSubjects = async(studentId) => {
    const subject = await StudentSubject.findById(studentId);

    if(!subject){
        throw new Error('Student subject not found.');
    }

    await subject.deleteOne();
}

module.exports = {generateLoad, getStudentLoad, getMySubjects, removeSubjects};