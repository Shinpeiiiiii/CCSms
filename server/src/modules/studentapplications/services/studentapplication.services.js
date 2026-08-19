const StudentApplication = require("../models/studentapplication.models");
const EnrollmentPeriod = require("../../academic/enrollmentperiod/models/enrollmentperiod.model");
const generateApplicationNumber = require("../utils/generateApplicationNumber");
const User = require("../../auth/models/User");
const Student = require("../../students/models/Student");
const bcrypt = require("bcrypt");
const generateStudentNumber = require("../../admission/utils/generateStudentNumber");
const generateTemporaryPassword = require("../../admission/utils/generateTempororyPassword");
const sendWelcomeEmail = require("../../admission/utils/sendWelcomeEmail");


const startApplication = async (email) => {

    const enrollmentPeriod =
        await EnrollmentPeriod.findOne({
            status: "Open",
        })
        .populate("academicYear");

    if (!enrollmentPeriod) {
        throw new Error("Enrollment is currently closed.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("This email is already registered. Please login instead.");
    }

    const existing = await StudentApplication.findOne({
            email,
            enrollmentPeriod: enrollmentPeriod._id,
        });

    if (existing) {
        return existing;
    }

    const applicationNumber = await generateApplicationNumber();

    return await StudentApplication.create({
        applicationNumber,
        email,
        emailVerified: true,
        enrollmentPeriod: enrollmentPeriod._id,
        academicYear: enrollmentPeriod.academicYear._id,
    });

};

const getPendingApplications = async () => {
    return await StudentApplication.find({status: "Pending",})
    .populate("program", "programName")
    .populate("academicYear", "academicYearName")
    .sort({createdAt: -1,});
}

const getApplications = async (filter = {}) => {
    return await StudentApplication.find(filter)
    .populate("program", "programName")
    .populate("academicYear", "academicYearName")
    .sort({createdAt: -1,});
}

const getApplicationById = async (id) => {
    const application = await StudentApplication.findById(id)
    .populate("program")
    .populate("academicYear");

    if(!application){
        throw new Error("Application not found.");
    }

    return application;
}

const submitApplication = async (id, data) => {
    const application = await StudentApplication.findById(id);
    if (!application) {
        throw new Error("Application not found.");
    }

    if (application.status !== "Pending" && application.status !== "Needs Revision") {
        throw new Error("Application cannot be modified at this stage.");
    }

    // Update details
    application.firstName = data.firstName;
    application.middleName = data.middleName || "";
    application.lastName = data.lastName;
    application.sex = data.sex;
    application.birthDate = data.birthDate;
    application.civilStatus = data.civilStatus || "Single";
    application.nationality = data.nationality || "Filipino";
    application.contactNumber = data.contactNumber;
    application.address = data.address;
    application.program = data.program;
    application.studentType = data.studentType || "Regular";

    // If it was "Needs Revision", reset status to "Pending"
    if (application.status === "Needs Revision") {
        application.status = "Pending";
    }

    await application.save();
    return application;
};

const approveApplication = async (id, reviewedBy) => {
    const application = await StudentApplication.findById(id)
    .populate("program")
    .populate("academicYear");

    if(!application){
        throw new Error("Application not found.");
    }

    if(application.status !== "Pending"){
        throw new Error("Only pending applications can be approved.");
    }

    // Clean up half-created/orphaned records from previous failed approval attempts (e.g. SMTP email send failures)
    const orphanStudent = await Student.findOne({ application: application._id });
    if (orphanStudent) {
        await Student.deleteOne({ _id: orphanStudent._id });
    }
    const orphanUser = await User.findOne({ email: application.email });
    if (orphanUser) {
        await User.deleteOne({ _id: orphanUser._id });
    }

    const existingUser = await User.findOne({email: application.email});
    if (existingUser) {
        throw new Error("A user with this email already exists.");
    }

    // Generate Student Number
    const studentNumber = await generateStudentNumber();
    // Generate Temporary Password
    const temporaryPassword = generateTemporaryPassword();
    // Hash Password
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
    // Create User first
    const user = await User.create({
        firstName: application.firstName,
        middleName: application.middleName,
        lastName: application.lastName,
        email: application.email,
        password: hashedPassword,
        role: "student",
        mustChangePassword: true,
    });

    try {
        // Create Student second, passing the user ID
        const student = await Student.create({
            application: application._id,
            user: user._id,
            studentNumber,
            firstName: application.firstName,
            middleName: application.middleName,
            lastName: application.lastName,
            sex: application.sex,
            birthDate: application.birthDate,
            civilStatus: application.civilStatus,
            nationality: application.nationality,
            email: application.email,
            contactNumber: application.contactNumber,
            address: application.address,
            program: application.program?._id || application.program,
            section: application.section,
            yearLevel: application.yearLevel,
            studentType: application.studentType,
            status: "Active", // Default status for new students is Active
            academicYear: application.academicYear?._id || application.academicYear,
            admittedAt: new Date(),
        });

        // Send Welcome Email (wrapped in try-catch so it won't block approval on SMTP failures)
        try {
            await sendWelcomeEmail({
                to: application.email,
                fullName: `${application.firstName} ${application.lastName}`,
                studentNumber,
                temporaryPassword,
            });
        } catch (emailError) {
            console.error("Welcome email failed to send, but proceeding with approval:", emailError);
        }

        //Save application status
        application.student = student._id;
        application.status = "Approved";
        application.reviewedBy = reviewedBy;
        application.reviewedAt = new Date();
        await application.save();
        return {application, student, temporaryPassword};
    } catch (error) {
        // Compensating transaction: remove the user we just created
        // so we don't leave an orphan record if anything fails after it.
        try {
            await User.deleteOne({ _id: user._id });
        } catch (cleanupError) {
            console.error("Failed to cleanup orphan user after approval failure:", cleanupError);
        }
        throw error;
    }
}

const rejectApplication = async(id, remarks, reviewedBy) => {
    const application = await StudentApplication.findById(id);

    if (!application) {
        throw new Error("Application not found.");
    }

    if (application.status !== "Pending") {
        throw new Error("Only pending applications can be rejected.");
    }

    application.status = "Rejected";
    application.remarks = remarks;
    application.reviewedBy = reviewedBy;
    application.reviewedAt = new Date();

    await application.save();

    return application;
}

const requestRevision = async (id, remarks, reviewedBy) => {
    const application = await StudentApplication.findById(id);

    if (!application) { throw new Error("Application not found.");}

    if (application.status !== "Pending") {
        throw new Error("Only pending applications can be revised.");
    }

    application.status = "Needs Revision";
    application.remarks = remarks;
    application.reviewedBy = reviewedBy;
    application.reviewedAt = new Date();

    await application.save();

    return application;
};

const trackApplication = async (trackingNumber) => {
    if (!trackingNumber) {
        throw new Error("Tracking number is required.");
    }
    const cleanNumber = trackingNumber.trim();
    const application = await StudentApplication.findOne({
        applicationNumber: { $regex: new RegExp(`^${cleanNumber}$`, "i") }
    })
    .populate("program", "programName programCode")
    .populate("academicYear", "academicYearName");

    if (!application) {
        throw new Error("No application found matching that tracking number.");
    }

    return {
        _id: application._id,
        applicationNumber: application.applicationNumber,
        firstName: application.firstName,
        middleName: application.middleName,
        lastName: application.lastName,
        email: application.email,
        program: application.program,
        academicYear: application.academicYear,
        studentType: application.studentType,
        status: application.status,
        remarks: application.remarks,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
        reviewedAt: application.reviewedAt
    };
};

module.exports = {
    startApplication, getPendingApplications, getApplications, getApplicationById, submitApplication, approveApplication, rejectApplication, requestRevision, trackApplication,
};