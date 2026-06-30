const programService = require("../services/program.services");

const createProgram = async (req, res, next) => {

    try {

        const program = await programService.createProgram(req.body, req.userId)

        res.status(201).json({
            success: true,
            message: "Program created successfully",
            data: program
        });


    } catch (error) {
        next(error);
        console.error(error);
    }

};

const getProgram = async (req, res, next) => {
    try {

        const programs = await programService.getProgram();

        res.status(200).json(programs);

    } catch (error) {
        next(error);
    }
};

const getProgramById = async (req, res, next) => {
    try {

        const program = await programService.getProgramById(req.params.id);

        res.status(200).json({
            success: true,
            data: program,
        });

    } catch (error) {
        next(error);
    }
};

const updateProgram = async (req, res, next) => {
    try {

        const program = await programService.updateProgram(
            req.params.id,
            req.body,
            req.userId
        );

        res.status(200).json({
            success: true,
            message: "Program updated successfully.",
            data: program,
        });

    } catch (error) {
        next(error);
    }
};

const deleteProgram = async (req, res, next) => {
    try {

        await programService.deleteProgram(req.params.id);

        res.status(200).json({
            success: true,
            message: "Program deleted successfully.",
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {createProgram,getProgram,getProgramById,updateProgram,deleteProgram}