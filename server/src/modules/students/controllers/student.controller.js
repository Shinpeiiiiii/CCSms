const Student = require('../models/Student')
const studentService = require('../services/student.service')
const StudentSubject = require('../../studentsubject/models/studentsubject.models');
const CurriculumSubject = require('../../academic/curriculum/models/curriculum.subject.models');
const EnrollmentPeriod = require('../../academic/enrollmentperiod/models/enrollmentperiod.model');

const createStudent = async (req, res) =>{

    try{
        console.log("Body",req.body)
        const student = await Student.create(req.body)

        console.log("CREATED:",student)
        return res.status(201).json(student)

    }catch(error){

        console.log(error)
        res.status(500).json({message: error.message})
    }
}

const getStudents = async (req,res) => {
    try{
       // const students = await Student.find()
       //     .populate('program', 'programCode programName')
       //     .populate('section', 'sectionCode sectionName yearLevel')
        const students = await studentService.getStudents();
        return res.status(200).json({
            success: true,
            data: students,
        })

    }catch(error){
        return res.status(500).json({success: false ,message: error.message})
    }
}

const deleteStudent = async (req,res) => {
    try{
        const {id} = req.params
        await Student.findByIdAndDelete(req.params.id)
        res.status(204).json()
    }catch(error){
        res.status(500).json({message: error.message})
    }   
}

const updateStudent = async (req,res) => {
    try{
        const {id} = req.params
        const student = await Student.findByIdAndUpdate(id, req.body, {new: true})
        res.json(student)
    }catch(error){
        res.status(500).json({message: error.message})
    }   
}
const getDashboard = async (req, res) => {

    try {
        const dashboard =
            await studentService.getDashboard(
                req.user.id
            );
        res.json(dashboard);
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


const getMySubjects = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user.id })
            .populate("program", "programName")
            .populate({
                path: "section",
                populate: {
                    path: "curriculum",
                },
            });

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        let subjects = [];

        if (student.section) {
            const section = student.section;

            const curriculumSubjects = await CurriculumSubject.find({
                curriculum: section.curriculum?._id,
                yearLevel: section.yearLevel,
            }).populate("subject", "subjectCode subjectName description units");

            const enrollmentPeriod = await EnrollmentPeriod.findOne({
                status: "Open",
            });

            subjects = curriculumSubjects.map((cs) => ({
                _id: cs._id,
                subject: cs.subject,
                section: section,
                enrollmentPeriod: enrollmentPeriod?._id || null,
                yearLevel: section.yearLevel,
                units: cs.subject?.units || 0,
                status: "Loaded",
                createdAt: new Date(),
            }));
        }

        return res.json({ success: true, data: subjects });
    } catch (error) {
        return res.status(500).json({ sucess: false, message: error.message });
    }
};

const getMyProfile = async (req, res) => {

    try {
        const student =
            await studentService.getMyProfile(
                req.user.id
            );
        res.json(student);
    }
    catch (error) {
        res.status(400).json({success: false,
            message: error.message,
        });
    }
};

const updateMyProfile = async (req, res) => {

    try {
        const student =
            await studentService.updateMyProfile(
                req.user.id,
                req.body
            );
        res.json(student);
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

const assignSection = async (req, res) => {
    try{
        const result = await studentService.assignSection(req.params.id, req.body.sectionId);
        return res.status(200).json({
            success: true,
            message: "Section assigned successfully.",
            data: result,
        });

    }catch(error){
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    createStudent,
    getStudents,
    deleteStudent,
    updateStudent, getMyProfile, updateMyProfile, getDashboard, getMySubjects, assignSection,
}