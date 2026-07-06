const academicYearService = require('../services/academicyear.services');

const createAcademicYear = async (req, res) => {
    try {
        const academicYear = await academicYearService.createAcademicYear({
            ...req.body, createdBy: req.user.id
        })
        return res.status(201).json({ message: 'Academic Year created successfully', data: academicYear })
        console.log(req.user)
    }catch (error) {
        return res.status(400).json({ message: error.message })
    }
}
const getAcademicYear = async (req, res) => {
    try {
        const academicYear = await academicYearService.getAcademicYear()
        return res.status(200).json({ data: academicYear })
    }catch (error) {
        return res.status(404).json({ message: error.message })
    }

}

const getCurrentAcademicYear = async (req, res) => {
    try{
        const academicYear = await academicYearService.getCurrentAcademicYear()
        return res.status(200).json({ data: academicYear })


    }catch (error) {
        return res.status(404).json({ message: error.message })
    }
}

const getAcademicYearById = async (req, res) => {
    console.log("Fetching Academic Year by ID:", req.params.id);
    try {
        const academicYear = await academicYearService.getAcademicYearById(req.params.id)
        console.log("Academic Year fetched:", academicYear);
        return res.status(200).json({ data: academicYear })

    }catch (error) {
        return res.status(404).json({ message: error.message })
    }

}

const updateAcademicYear = async (req, res) => {
    try {
        const academicYear = await academicYearService.updateAcademicYear(req.params.id, req.body)
        return res.status(200).json({ message: 'Academic Year updated successfully', data: academicYear })


    }catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const publishAcademicYear = async (req, res) => {
    try {
        const academicYear = await academicYearService.publishAcademicYear(req.params.id)
        return res.status(200).json({ message: 'Academic Year published successfully', data: academicYear })
    }catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const activateAcademicYear = async (req, res) => {
    try {
        const academicYear = await academicYearService.activateAcademicYear(req.params.id)
        return res.status(200).json({ message: 'Academic Year activated successfully', data: academicYear })
    }catch (error) {
        return res.status(400).json({ message: error.message })
    }

}

const archiveAcademicYear = async (req, res) => {
    try {
        const academicYear = await academicYearService.archiveAcademicYear(req.params.id)
        return res.status(200).json({ message: 'Academic Year archived successfully', data: academicYear })
    }catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

module.exports = {
    createAcademicYear,
    getAcademicYear,
    getCurrentAcademicYear,
    getAcademicYearById,
    updateAcademicYear,
    publishAcademicYear,
    activateAcademicYear,
    archiveAcademicYear
}