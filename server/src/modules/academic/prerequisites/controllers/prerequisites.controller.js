const prerequisiteService = require("../services/prerequisites.services")

const createPrerequisite = async (req, res) => {
    try{
        const prerequisite = await prerequisiteService.createPrerequisite({
            ...req.body, 
            createdBy: req.user.id,
        });
        return res.status(201).json({
            message: 'Prerequisite create successfully!',
            prerequisite,
        });
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
}

const getPrerequisite = async (req, res) => {
    try{
        const { curriculum } = req.query
        const data = await prerequisiteService.getPrerequisite(curriculum)
        res.json(data);

    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }

}
const getPrerequisiteBySubject = async (req, res) => {
    try{
        const prerequisites = await prerequisiteService.getPrerequisiteBySubject(req.params.subjectId)

        return res.status(200).json(prerequisites)
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
}

const getPrerequisiteById = async (req, res) => {
    try{
        const data = await prerequisiteService.getPrerequisiteById(req.params.id);
        return res.json(data);

    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }

}
//
const checkEligibility = async (req, res) => {
    try{
        const {academicRecordEntries} = req.body

        const result = await prerequisiteService.checkPrerequisiteMet(req.params.subjectId, academicRecordEntries || [])

        return res.status(200).json(result)
    }catch(error){
        return res.status(200).json({
            message: error.message
        })
    }
}
const updatePrerequisite = async (req, res) => {
    try{
        const data = await prerequisiteService.updatePrerequisite(req.params.id, req.body, req.user.id);

        res.json(data);
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
}

const deactivatePrerequisite = async (req, res) => {
    try{
        const data = await prerequisiteService.deactivatePrerequisite(req.params.id, req.user.id)
        res.json(data);    
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
    
}

module.exports = {
    createPrerequisite,
    getPrerequisite,
    getPrerequisiteById,
    updatePrerequisite,
    deactivatePrerequisite,
    checkEligibility,
    getPrerequisiteBySubject,
};