const Student = require("../../students/models/Student");
const Section = require("../../academic/section/models/section.models");
const CurriculumSubject = require("../../academic/curriculum/models/curriculum.subject.models");
const EnrollmentPeriod = require("../../academic/enrollmentperiod/models/enrollmentperiod.model");
const StudentSubject = require("../models/studentsubject.models");

const generateLoad = async (studentID) => {
    const student = await Student.findById(studentID).populate("section");

    if(!student){
        throw new Error("Student not found.")
    }

    if(!student.section){
        throw new Error("Student is not assigned to any section.")
    }

    const section = await Section.findById(student.section)
    .populate("curriculum")
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
  
    const curriculumsubjects = await CurriculumSubject.find({
        curriculum: section.curriculum._id,
        yearLevel: section.yearLevel,
        semester: enrollmentPeriod.semester,
    }).populate("subject");

    if(!curriculumsubjects.length){
        throw new Error("No curriculum subjects found.");
    }

    const existing = await StudentSubject.find({
        student: student._id, enrollmentPeriod: enrollmentPeriod._id,
    });

    if (existing.length) {
        throw new Error(
            "Student already has generated subjects for this semester."
        );
    }
    const documents = curriculumSubjects.map(item => ({
        student: student._id,
        section: section._id,
        subject: item.subject._id,
        academicYear: enrollmentPeriod.academicYear,
        yearLevel: section.yearLevel,
        semester: enrollmentPeriod.semester,
        units: item.subject.units,
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