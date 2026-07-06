const programService = require("../services/program.services");

const createProgram = async (req, res) => {

    try {

        const program = await programService.createProgram({ ...req.body, createdBy: req.userId });

        res.status(201).json({
            message: "Program created successfully",
            program,
        });


    } catch (error) {
        return res.status(400).json({
            message: error.message,
        })
    }

};

const getProgram = async (req, res, next) => {
    try {

        const programs = await programService.getProgram();

        res.status(200).json(programs);

    } catch (error) {
         return res.status(500).json({
            message: error.message,
        })
    }
};

const getProgramById = async (req, res, next) => {

    try {
        const program = await programService.getProgramById(req.params.id)
        return res.status(200).json(program)
    } catch (error) {
        return res.status(404).json({
            message: error.message,
        })
    }
};

const updateProgram = async (req, res, next) => {
    try {

        const program = await programService.updateProgram(
            req.params.id,
            req.body
        )

        return res.status(200).json({
            message: 'Program updated successfully.',
            program,
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })
    }
};

const deleteProgram = async (req, res, next) => {
    
    try {

        await programService.deleteProgram(req.params.id)

        return res.status(200).json({
            message: 'Program deleted successfully.',
        })

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        })

    }
};

module.exports = {createProgram,getProgram,getProgramById,updateProgram,deleteProgram}