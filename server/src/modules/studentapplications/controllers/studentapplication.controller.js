const service = require("../services/studentapplication.services");

const startApplication = async (req, res) => {
    try{
        const application = await service.startApplication( req.body.email);

        return res.status(201).json({
            message: "Application created successfully.",application,
        });
    }
    catch(error){
        return res.status(400).json({ message:error.message,});
    }
}

const getPendingApplications = async (req, res) => {
    try{
        const filter = {};
        if (req.query.status) {
            // Map accepted to Approved for DB consistency, rejected to Rejected
            if (req.query.status === "accepted") {
                filter.status = "Approved";
            } else if (req.query.status === "rejected") {
                filter.status = "Rejected";
            } else if (req.query.status === "pending") {
                filter.status = "Pending";
            } else if (req.query.status === "needs-revision") {
                filter.status = "Needs Revision";
            } else {
                filter.status = req.query.status;
            }
        }
        const application = await service.getApplications(filter);
        res.json(application);

    }catch(error){
        res.status(500).json({message: error.message})
    }
}

const getApplicationById = async (req, res) => {
    try{
        const application = await service.getApplicationById(req.params.id);
        res.json(application);

    }catch(error){
        res.status(404).json({
            message: error.message
        })
    }
}

const submitApplication = async (req, res) => {
    try {
        const application = await service.submitApplication(req.params.id, req.body);
        return res.status(200).json({
            message: "Application submitted successfully.",
            application,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const approveApplication = async (req, res) => {

    try {

        const application =
            await service.approveApplication(
                req.params.id,
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message: "Application approved successfully.",
            data: application,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};

const rejectApplication = async (req, res) => {

    try {

        const application =
            await service.rejectApplication(
                req.params.id,
                req.body.remarks,
                req.user.id
            );

        res.status(200).json({
            success: true,
            message: "Application rejected.",
            data: application,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};
const requestRevision = async (req, res) => {

    try {

        const application = await service.requestRevision(
                req.params.id,
                req.body.remarks,
                req.user.id
            );

        res.status(200).json({ success: true ,message: "Revision requested.", data: application,});

    } catch (error) {
        res.status(400).json({ success: false, message: error.message,});
    }

};

const trackApplication = async (req, res) => {
    try {
        const trackingNumber = req.params.trackingNumber || req.query.number;
        const application = await service.trackApplication(trackingNumber);
        return res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {startApplication, getPendingApplications, getApplicationById, submitApplication,
    approveApplication, rejectApplication, requestRevision, trackApplication,
};