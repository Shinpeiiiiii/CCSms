const sectionsubjectService = require('../services/sectionsubject.services');

const updateSectionSubject = async (req, res) => {

    try {
        const result =
            await sectionsubjectService.updateSectionSubject(
                req.params.id,
                req.body
            );
        return res.json(result);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
const generatesectionSubject = async (req, res) => {
    try{
        const result = await sectionsubjectService.generateSectionSubjects(
            req.params.sectionId,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: result
        })
    }catch(error){
        return res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}
const getSectionSubjects = async (req, res) => {
    try {

        const subjects =
            await sectionsubjectService.getSectionSubjects(
                req.params.sectionId
            );

        return res.json(subjects);

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        });

    }
};

const createSchedule = async (req, res) => {
    try{
        const schedule = await sectionsubjectService.createSchedule({
            ...req.body,
            createdBy: req.user.id,
        });

        return res.status(201).json({
            success: true,
            message: "Section scheduled successfully.",
            data: schedule,
        });
    }catch(error){
        return res.status(400).json({
            success: false,
            message: error.message,
        })
    }
};

const getSectionSchedule = async (req, res) => {
    try {
        const schedule = await sectionsubjectService.getSectionSchedule(req.params.id);
        return res.status(200).json({
            success: true,
            data: schedule,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteSchedule = async (req, res) => {
    try {
        await sectionsubjectService.deleteSchedule(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Section subject deleted successfully.",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    updateSectionSubject,
    generatesectionSubject,
    getSectionSubjects,
    createSchedule,
    getSectionSchedule,
    deleteSchedule,
};