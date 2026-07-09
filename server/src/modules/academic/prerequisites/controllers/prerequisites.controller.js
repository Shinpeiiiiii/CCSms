const prerequisiteService = require("../services/prerequisites.services")

const createPrerequisite = async (req, res) => {
    try{
        const prerequisite = prerequisiteService.createPrerequisite(req.body, req.user.id);
        return res.status(201).json(prerequisite);
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
}

const getPrerequisite = async (req, res) => {
    try{
        const data = await prerequisiteService.getPrerequisite();
        res.json(data);

    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }

}

const getPrerequisiteById = async (req, res) => {
    try{
        const data = await prerequisiteService.getPrerequisiteById(req.params.id);
        res.json(data);

    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }

}

const updatePrerequisite = async (req, res) => {
    try{
        const data = prerequisiteService.updatePrerequisite(req.params.id, req.body, req.user.id);

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
    deactivatePrerequisite
};