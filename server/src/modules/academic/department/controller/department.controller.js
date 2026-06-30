const departmentService = require("../services/department.services");
 
const createDepartment = async (req, res) => {

    try {

        const department =
            await departmentService.createDepartment({
                ...req.body,
                createdBy: req.user.id,
            })

        res.status(201).json({
            message: 'Department created successfully.',
            department,
        })

    } catch (error) {

        res.status(400).json({
            message: error.message,
        })
    }
}

const getDepartment = async (req, res) => {
    try{
        const departments = await departmentService.getDepartment()

        return res.status(200).json(departments)

    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

const updateDepartment = async (req, res) => {

    try {

        const department = await departmentService.updateDepartment(
            req.params.id,
            req.body
        )

        return res.status(200).json({
            message: 'Department updated successfully.',
            department,
        })

    } catch (error) {

        console.error(error)

        return res.status(400).json({
            message: error.message,
        })

    }

}

const deleteDepartment = async (req, res) => {

    try {

        await departmentService.deleteDepartment(req.params.id)

        return res.status(200).json({
            message: 'Department deleted successfully.',
        })

    } catch (error) {

        console.error(error)

        return res.status(400).json({
            message: error.message,
        })

    }

}

module.exports = {
    createDepartment,
    getDepartment,
    updateDepartment,
    deleteDepartment,
}