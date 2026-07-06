const Program = require("../model/Program");
const Department = require("../../department/models/Department");

const getProgram = async () => {
    return await Program.find()
    .populate(
        'department', 'departmentCode departmentName'
    )
    .populate(
        'createdBy',
        'firstName lastName'
    )
    .sort({ 
        programName: 1,
    })
}

const getProgramById = async (id) => {
    const program = await Program.findById(id)
    .populate('department')
    .populate(
        'createdBy',
        'firstName lastName'
    )

    if (!program) {
        throw new Error("Program not found.");
    }

    return program;
}

const createProgram = async (data, userId) => {
    const existingProgramCode = await Program.findOne({
        programCode: data.programCode.toUpperCase(),
    })

    if(existingProgramCode){
        throw new Error("Program code already exists.")
    }

    const existingProgramName = await Program.findOne({
        programName: data.programName,
    })

    if(existingProgramName){
        throw new Error("Program name already exists.")
    }
    const department = await Department.findById(data.department)

    if (!department) {
        throw new Error("Department not found.")
    }

    return await Program.create({
        ...data, programCode: data.programCode.toUpperCase(),
        createdBy: userId
    });
};

const updateProgram = async (id, data) => {
    const program = await Program.findById(id)

    if (!program) {
        throw new Error('Program not found.')
    }

    if (data.programCode) {

        const existingProgramCode =
            await Program.findOne({
                programCode: data.programCode.toUpperCase(),
                _id: { $ne: id },
            })

        if (existingProgramCode) {
            throw new Error(
                'Program code already exists.'
            )
        }

        data.programCode =
            data.programCode.toUpperCase()

    }

    if (data.programName) {

        const existingProgramName =
            await Program.findOne({
                programName: data.programName,
                _id: { $ne: id },
            })

        if (existingProgramName) {
            throw new Error(
                'Program name already exists.'
            )
        }

    }

    if (data.department) {

        const department =
            await Department.findById(data.department)

        if (!department) {
            throw new Error('Department not found.')
        }

        if (department.status !== 'Active') {
            throw new Error(
                'Department is inactive.'
            )
        }

    }

    return await Program.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    )
}

const deleteProgram = async (id) => {

    const program = await Program.findById(id)

    if (!program) {
        throw new Error('Program not found.')
    }

    /*
        Future validation:

        - Prevent deletion if
          Curriculum exists.

        - Prevent deletion if
          Students are enrolled.

        - Prevent deletion if
          Sections exist.
    */

    return await Program.findByIdAndDelete(id)
};

module.exports = {getProgram, getProgramById,createProgram,updateProgram,deleteProgram}