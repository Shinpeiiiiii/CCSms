const Department = require("../models/Department");

const createDepartment = async (data) => {

    const existingDepartment = await Department.findOne({
        departmentCode: data.departmentCode.toUpperCase(),
    })

    if (existingDepartment) {
        throw new Error('Department code already exists.')
    }

    return await Department.create({
        ...data,
        departmentCode: data.departmentCode.toUpperCase(),
    })
}

const getDepartment = async () => {

    return await Department.find().sort({
        departmentName: 1,
    })
}


const updateDepartment = async (id, data) => {
    const department = await Department.findById(id)

        if (!department) {
        throw new Error('Department not found.')
    }

    return await Department.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    )
}

const deleteDepartment = async (id) =>{
    const department = await Department.findById(id)

    if(!department){
        throw new Error('Department not found.')
    }

    return await Department.findByIdAndDelete(id)
}

module.exports = { createDepartment, getDepartment, updateDepartment, deleteDepartment }