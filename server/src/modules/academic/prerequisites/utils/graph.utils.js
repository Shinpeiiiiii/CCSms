const subjectPrerequisite = require("../models/prerequisites.models")

const hasPath = async(
    startSubjectId,
    targetSubjectId,
    visited = new Set()
) => {
    if(startSubjectId.toString() === targetSubjectId.toString()){
        return true;
    }

    if(visited.has(startSubjectId.toString())){
        return false;
    }

    visited.add(startSubjectId.toString())

    const prerequisites = await subjectPrerequisite.find({
        subject: startSubjectId,
        status: "Active"
    });


    for (const prerequisite of prerequisites){
        const found = await hasPath(prerequisite.requiredSubject,
            targetSubjectId, visited
        );

        if(found){
            return true;
        }
    }

    return false;
};

module.exports = {hasPath};