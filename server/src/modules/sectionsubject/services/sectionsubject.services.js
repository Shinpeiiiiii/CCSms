const SectionSubject = require("../models/sectionsubject.model");

const createSchedule = async (data) => {
    const existing = await SectionSubject.findOne({
        section: data.section,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
    });

    if(existing){
        throw new Error('This section already has a class at the selected time.');
    }

    return await SectionSubject.create(data);
};

const getSectionSchedule = async (sectionId) => {
    return await SectionSubject.find({ section:sectionId,})
    .populate("subject","subjectCode subjectName units")
    .populate("faculty","firstName lastName")
    .sort({ day:1, startTime:1,});
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