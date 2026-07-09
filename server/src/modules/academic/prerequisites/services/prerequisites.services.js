const subjectPrerequisites = require('../models/prerequisites.models')
const Subject = require('../../subject/model/subject.model')
const { hasPath } = require('../utils/graph.utils')

const createPrerequisite = async (data, userID) => {
    const{
        subject, requiredSubject, type, minimumGrade
    } = data;

    //If the subject exist
    const subjectExist = await Subject.findOne({
        id: subject,
        status: "Active"
    });

    if(!subjectExist){
        throw new Error("Subject not found")
    }

    //If requried subject exist
    const requiredsubjectExist = await Subject.findOne({
        id: requiredSubject,
        status: "Active"
    });

    if(!requiredsubjectExist){
        throw new Error("Required subject not found");
    }

    //Cannot be reference itself

    if(subject.toString() === requiredSubject.toString()){
        throw new Error("Subject cannot be own its prerequisite")
    }

    //Duplicate validation
    const duplicate = await subjectPrerequisites.findOne({
        subject, requiredSubject, status: "Active"
    });

    if(duplicate){
        throw new Error("Prerequisites already exist")
    }

    const createCycle = await hasPath(requiredSubject, subject);

    if(createCycle){
        throw new Error("This prerequisites create a circular dependecy.")
    }

    const prerequisite = await subjectPrerequisites.create({
        subject, requiredSubject, minimumGrade, createdBy: userID, createdAt: userID
    })

    return prerequisite.populate(["subject", "requiredSubject"])

}


const getPrerequisite = async () => {

    return await subjectPrerequisites.find({
        status: "Active"
    })
        .populate("subject")
        .populate("requiredSubject")
        .sort({
            createdAt: -1
        });

};

const getPrerequisiteById = async (id) => {

    const prerequisite =
        await subjectPrerequisites.findById(id)
            .populate("subject")
            .populate("requiredSubject");

    if (!prerequisite) {
        throw new Error("Prerequisite not found.");
    }

    return prerequisite;

};

const updatePrerequisite = async (
    id,
    data,
    userId
) => {

    const prerequisite =
        await subjectPrerequisites.findById(id);

    if (!prerequisite) {
        throw new Error("Prerequisite not found.");
    }

    Object.assign(prerequisite, data);

    prerequisite.updatedBy = userId;

    await prerequisite.save();

    return prerequisite.populate([
        "subject",
        "requiredSubject"
    ]);

};


const deactivatePrerequisite = async (
    id,
    userId
) => {

    const prerequisite =
        await subjectPrerequisites.findById(id);

    if (!prerequisite) {
        throw new Error("Prerequisite not found.");
    }

    prerequisite.status = "Inactive";
    prerequisite.updatedBy = userId;

    await prerequisite.save();

    return prerequisite;

};


module.exports = {
    createPrerequisite,
    getPrerequisite,
    getPrerequisiteById,
    updatePrerequisite,
    deactivatePrerequisite
};