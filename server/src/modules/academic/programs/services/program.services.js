const Program = require("../model/Program");
const Department = require("../../department/models/Department");

const getProgram = async () => {
    return await Program.find().populate("department", "departmentCode departmentName ").sort({ createdAt: -1 })
}

const getProgramById = async (id) => {
    const program = await Program.findById(id).populate("department", "departmentCode departmentName ")
    if (!program) {
        throw new Error("Program not found.");
    }

    return program;
}

const createProgram = async (data, userId) => {
    const department = await Department.findById(data.department)

    if (!department) {
        throw new Error("Department not found.")
    }

    const duplicateCode = await Program.findOne({ programCode: data.programCode });

    if (duplicateCode) {
        throw new Error("Program code already exists.")
    }

    const duplicateName = await Program.findOne({ programName: data.programName });

    if (duplicateName) {
        throw new Error("Program name already exists.")
    }

    return await Program.create({
        ...data,
        createdBy: userId
    });
};

const updateProgram = async (id, payload) => {
    const { programCode, programName, description, department, status } = payload

    const existingProgram = await Program.findById(id)
    if (!existingProgram) {
        throw new Error("Program not found")
    }

    //Validate department
    if(department){
        const existingDepartment = await Department.findById(department);

        if(!existingDepartment){
            throw new Error("Department not found.")
        }

    }

    //check duplicate program code
    if(programCode){
        const duplicateCode = await Program.findOne({
            programCode, _id: {$ne: id},
        });


        if(duplicateCode){
            throw new Error("Program code already exist.")
        }
    }
    //Check duplicate program name
    if(programName){

        const duplicateName = await Program.findOne({
            programName, _id: {ne: id},
        });

        if(duplicateName){
            throw new Error("Program name already exist.")
        }

    }
    existingProgram.programCode = programCode || existingProgram.programCode
    existingProgram.programName = programName || existingProgram.programName
    existingProgram.description = description || existingProgram.description
    existingProgram.department = department || existingProgram.department
    existingProgram.status = status || existingProgram.status

    return await existingProgram.save()
}

const deleteProgram = async (id) => {

    const program = await Program.findById(id);

    if (!program) {
        throw new Error("Program not found.");
    }

    await program.deleteOne();
};

module.exports = {getProgram, getProgramById,createProgram,updateProgram,deleteProgram}