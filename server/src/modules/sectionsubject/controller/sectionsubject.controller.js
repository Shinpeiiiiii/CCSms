const sectionsubjectService = require('../services/sectionsubject.services');

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
    try{
        const schedule = await sectionsubjectService.getSectionSchedule(req.params.id);
        return res.status(201).json({
            success: true,
            data: schedule,
        });

    }catch(error){
        return res.status(401).json({
            success: false,
            message: error.message,
        });
        
    }
};

const updateSchedule = async (id, data) => {

};

const deleteSchedule = async (id) => {

};

module.exports = {
    createSchedule,
    getSectionSchedule,
    updateSchedule,
    deleteSchedule,
};