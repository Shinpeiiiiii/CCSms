const ApplicationTimeline = require("../models/applicationTimeline.models");

const addTimeline = async ({
    application,
    action,
    description,
    performedBy=null,
    visibility="Public",
}) => {
    return await ApplicationTimeline.create({
        application,action,description,performedBy,visibility,
    });
};

module.exports = {addTimeline};