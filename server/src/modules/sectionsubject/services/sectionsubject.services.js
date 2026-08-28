const SectionSubject = require("../models/sectionsubject.model");
const Section = require("../../academic/section/models/section.models")
const CurriculumSubject = require("../../academic/curriculum/models/curriculum.subject.models")
const StudentSubject = require("../../studentsubject/models/studentsubject.models")
const Student = require("../../students/models/Student")


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

const getTeacherSchedule = async (teacherId) => {
    return await SectionSubject.find({
        instructor: teacherId,
        status: "Scheduled",
    })
    .populate("subject", "subjectCode subjectName lectureUnits laboratoryUnits totalUnits")
    .populate("section", "sectionCode sectionName yearLevel academicYear")
    .sort({ day: 1, startTime: 1 });
};

const getTeacherDashboard = async (teacherId) => {
    const classes = await SectionSubject.find({
        instructor: teacherId,
        status: "Scheduled",
    })
    .populate("subject", "subjectCode subjectName totalUnits")
    .populate("section", "sectionCode sectionName yearLevel");

    const totalSubjects = [...new Set(classes.map(c => c.subject?._id?.toString()))].filter(Boolean).length;
    const totalSections = [...new Set(classes.map(c => c.section?._id?.toString()))].filter(Boolean).length;
    const totalUnits = classes.reduce((sum, c) => sum + (c.subject?.totalUnits || 0), 0);

    let totalStudents = 0;
    const classesWithCount = await Promise.all(
        classes.map(async (c) => {
            const studentCount = await Student.countDocuments({
                section: c.section?._id,
                status: "Active",
            });
            totalStudents += studentCount;
            return {
                _id: c._id,
                subject: c.subject,
                section: c.section,
                day: c.day,
                startTime: c.startTime,
                endTime: c.endTime,
                room: c.room,
                studentCount,
            };
        })
    );

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = daysOfWeek[new Date().getDay()];
    const todayClasses = classesWithCount
        .filter(c => c.day === today)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return {
        stats: { totalSubjects, totalSections, totalUnits, totalStudents },
        todayClasses,
        allClasses: classesWithCount,
    };
};

const getTeacherClasses = async (teacherId) => {
    const classes = await SectionSubject.find({
        instructor: teacherId,
        status: "Scheduled",
    })
    .populate("subject", "subjectCode subjectName totalUnits")
    .populate("section", "sectionCode sectionName yearLevel");

    return await Promise.all(
        classes.map(async (c) => {
            const studentCount = await Student.countDocuments({
                section: c.section?._id,
                status: "Active",
            });
            return {
                _id: c._id,
                subject: c.subject,
                section: c.section,
                day: c.day,
                startTime: c.startTime,
                endTime: c.endTime,
                room: c.room,
                studentCount,
            };
        })
    );
};

const getClassStudents = async (sectionSubjectId) => {
    const sectionSubject = await SectionSubject.findById(sectionSubjectId)
        .populate("subject", "subjectCode subjectName")
        .populate("section", "sectionCode sectionName");

    if (!sectionSubject) {
        throw new Error("Section subject not found.");
    }

    const students = await Student.find({
        section: sectionSubject.section._id,
        status: "Active",
    })
    .select("studentNumber firstName lastName email status yearLevel studentType")
    .sort({ lastName: 1 });

    return {
        sectionSubject: {
            _id: sectionSubject._id,
            subject: sectionSubject.subject,
            section: sectionSubject.section,
            day: sectionSubject.day,
            startTime: sectionSubject.startTime,
            endTime: sectionSubject.endTime,
            room: sectionSubject.room,
        },
        students: students.map(s => ({
            _id: s._id,
            student: s,
            units: null,
            finalGrade: null,
            remarks: null,
        })),
    };
};

const getClassGrades = async (sectionSubjectId) => {
    const sectionSubject = await SectionSubject.findById(sectionSubjectId)
        .populate("subject", "subjectCode subjectName")
        .populate("section", "sectionCode sectionName");

    if (!sectionSubject) {
        throw new Error("Section subject not found.");
    }

    const enrollments = await StudentSubject.find({
        section: sectionSubject.section._id,
        subject: sectionSubject.subject._id,
    })
    .populate("student", "studentNumber firstName lastName")
    .sort({ "student.lastName": 1 });

    return {
        sectionSubject: {
            _id: sectionSubject._id,
            subject: sectionSubject.subject,
            section: sectionSubject.section,
            day: sectionSubject.day,
            startTime: sectionSubject.startTime,
            endTime: sectionSubject.endTime,
            room: sectionSubject.room,
        },
        grades: enrollments.map(e => ({
            _id: e._id,
            student: e.student,
            units: e.units,
            finalGrade: e.finalGrade,
            remarks: e.remarks,
            status: e.status,
        })),
    };
};

const updateGrades = async (sectionSubjectId, gradesArray) => {
    const sectionSubject = await SectionSubject.findById(sectionSubjectId);
    if (!sectionSubject) {
        throw new Error("Section subject not found.");
    }

    const results = await Promise.all(
        gradesArray.map(async ({ studentSubjectId, finalGrade }) => {
            const updates = { finalGrade };

            if (finalGrade !== null && finalGrade !== undefined) {
                updates.remarks = finalGrade >= 75 ? "Passed" : "Failed";
                updates.status = finalGrade >= 75 ? "Completed" : "Failed";
            } else {
                updates.remarks = null;
                updates.status = "Loaded";
            }

            return await StudentSubject.findByIdAndUpdate(studentSubjectId, updates, { new: true })
                .populate("student", "studentNumber firstName lastName");
        })
    );

    return results.map(r => ({
        _id: r._id,
        student: r.student,
        finalGrade: r.finalGrade,
        remarks: r.remarks,
        status: r.status,
        units: r.units,
    }));
};

module.exports = {
    updateSectionSubject,
    generateSectionSubjects,
    getSectionSubjects,
    createSchedule,
    getSectionSchedule,
    deleteSchedule,
    getTeacherSchedule,
    getTeacherDashboard,
    getTeacherClasses,
    getClassStudents,
    getClassGrades,
    updateGrades,
};
