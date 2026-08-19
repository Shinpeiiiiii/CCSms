const SectionSubject = require("../models/sectionsubject.model");
const Section = require("../../academic/section/models/section.models")
const CurriculumSubject = require("../../academic/curriculum/models/curriculum.subject.models")


const updateSectionSubject = async (id, payload) => {
    const sectionsubject = await SectionSubject.findById(id)
    if (!sectionsubject) {
        throw new Error("Section subject not found.");
    }

    if (payload.instructor !== undefined) {
        sectionsubject.instructor = payload.instructor;
    }

    if (payload.room !== undefined) {
        sectionsubject.room = payload.room;
    }

    if (payload.day !== undefined) {
        sectionsubject.day = payload.day;
    }

    if (payload.startTime !== undefined) {
        sectionsubject.startTime = payload.startTime;
    }

    if (payload.endTime !== undefined) {
        sectionsubject.endTime = payload.endTime;
    }

    if (payload.status !== undefined) {
        sectionsubject.status = payload.status;
    }

    if (payload.day || payload.startTime || payload.endTime) {
        const conflict = await SectionSubject.findOne({
            _id: { $ne: id },
            section: sectionsubject.section,
            subject: sectionsubject.subject,
            day: sectionsubject.day,
            startTime: sectionsubject.startTime,
            endTime: sectionsubject.endTime,
        });

        if (conflict) {
            throw new Error('Schedule conflict: another section subject already occupies this time slot.');
        }
    }

    await sectionsubject.save();

    return await SectionSubject.findById(id)
        .populate("subject", "subjectCode subjectName lectureUnits laboratoryUnits totalUnits")
        .populate("instructor", "firstName lastName");
}
const generateSectionSubjects = async (sectionId, createdBy) => {
    const section = await Section.findById(sectionId).populate('curriculum')
    if(!section){
        throw new Error('Section not found.')
    }
    const existing = await SectionSubject.countDocuments({
        section: sectionId
    })

    if(existing > 0){
        throw new Error('Section subjects have already been generated.')
    }

    const curriculumSubjects = await CurriculumSubject.find({
        curriculum: section.curriculum._id,
        yearLevel: section.yearLevel
    }).populate('subject')

    if(curriculumSubjects.length === 0){
        throw new Error('No curriculum  subjects found.')
    }

    const validCurriculumSubjects = curriculumSubjects.filter(cs => cs.subject);
    if (validCurriculumSubjects.length === 0) {
        throw new Error('No valid curriculum subjects found.');
    }

    const sectionSubjects = validCurriculumSubjects.map(cs => ({
        section: section._id,
        subject: cs.subject._id,
        semester: cs.semester,
        createdBy,
    }));

    await SectionSubject.insertMany(sectionSubjects)
    return {message: 'Section subjects generated successfully.'}
}

const getSectionSubjects = async (sectionId) => {

    return await SectionSubject.find({
        section: sectionId,
    })
    .populate(
        "subject",
        "subjectCode subjectName lectureUnits laboratoryUnits totalUnits"
    )
    .populate(
        "instructor",
        "firstName lastName"
    )
    .sort({
        semester: 1,
        "subject.subjectCode": 1,
    });

};

const createSchedule = async (data) => {
    const existing = await SectionSubject.findOne({
        section: data.section,
        subject: data.subject,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
    });

    if (existing) {
        throw new Error('This section already has this subject scheduled at the selected time.');
    }

    return await SectionSubject.create(data);
};

const getSectionSchedule = async (sectionId) => {
    return await SectionSubject.find({ section:sectionId,})
    .populate("subject","subjectCode subjectName lectureUnits laboratoryUnits totalUnits")
    .populate("instructor","firstName lastName")
    .sort({ day:1, startTime:1,});
};


const deleteSchedule = async (id) => {
    const sectionsubject = await SectionSubject.findById(id);
    if (!sectionsubject) {
        throw new Error("Section subject not found.");
    }
    await SectionSubject.findByIdAndDelete(id);
};

module.exports = {
    updateSectionSubject,
    generateSectionSubjects,
    getSectionSubjects,
    createSchedule,
    getSectionSchedule,
    deleteSchedule,
};
