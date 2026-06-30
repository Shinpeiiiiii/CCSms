const EnrollmentApplication = require('../models/EnrollmentApplication')

const createApplication = async (req, res) => {
    try {
        const { firstName, middleName, lastName, email, program, yearlevel, yearLevel } = req.body
        const application = await EnrollmentApplication.create({
            firstName,
            middleName,
            lastName,
            email,
            program,
            yearlevel: yearlevel || yearLevel,
        })

        res.status(201).json(application)
    } catch(error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to submit application'
        })
    }   
}

const getApplications = async (req, res) => {
    try {
        const applications = await EnrollmentApplication.find()
        res.json(applications)
    } catch(error) {
        console.error(error)
        res.status(500).json({
            message: 'Failed to fetch applications'
        })
    }
}

const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' })
        }

        const application = await EnrollmentApplication.findById(id)
        if (!application) {
            return res.status(404).json({ message: 'Application not found' })
        }

        application.status = status
        await application.save()

        if (status === 'accepted') {
            const Student = require('../../students/models/Student')
            const existingStudent = await Student.findOne({ email: application.email })
            if (!existingStudent) {
                await Student.create({
                    firstName: application.firstName,
                    MiddleName: application.middleName,
                    lastName: application.lastName,
                    email: application.email,
                    degreeProgram: application.program,
                    yearLevel: application.yearlevel,
                })
            }
        }

        res.json(application)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Failed to update application status'
        })
    }
}

module.exports = { createApplication, getApplications, updateApplicationStatus }