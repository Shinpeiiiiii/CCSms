const studentSubjectService = require("../services/studentsubject.services.js");

const generateLoad = async (req, res) => {

    try {
        const result = await studentSubjectService.generateLoad( req.body.studentId);
        return res.status(201).json({ success: true, message: "Student load generated successfully.", data: result,});
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message, });
    }
};
const getStudentLoad = async (req,res) => {
    try{
        const result = await studentSubjectService.getStudentLoad(req.params.studentId);
        return res.json({ success:true, data:result,});
    }catch(error){
        return res.status(400).json({ success:false, message:error.message,});
    }
};

const getMySubjects = async (req, res) => {
    try{
        const result = await studentSubjectService.getMySubjects(req.params.studentId)
        return res.json({success: true, data: result,});
    }catch(error){
        return res.status(400).json({ success: false, message:error.message, });
    }
}
const removeSubjects = async (req, res) => {
    try{
        const result = await studentSubjectService.removeSubjects(req.params.studentId)
        return res.json({success: true, data: result,});
    }catch(error){
        return res.status(400).json({ success: false, message: error.message});
    }
}

module.exports = {generateLoad, getStudentLoad, getMySubjects, removeSubjects};