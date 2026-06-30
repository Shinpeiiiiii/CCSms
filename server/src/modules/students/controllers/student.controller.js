const Student = require('../models/Student')

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
        const students = await Student.find()
        return res.status(200).json(students)

    }catch(error){
        return res.status(500).json({message: error.message})
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

module.exports = {
    createStudent,
    getStudents,
    deleteStudent,
    updateStudent
}