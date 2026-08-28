const attendanceService = require("../services/attendance.services");

const markAttendance = async (req, res) => {
    try {
        const { sectionSubjectId, date, records } = req.body;
        const result = await attendanceService.markAttendance(
            sectionSubjectId,
            date,
            records,
            req.user.id
        );
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getAttendanceByDate = async (req, res) => {
    try {
        const result = await attendanceService.getAttendanceByDate(
            req.params.sectionSubjectId,
            req.params.date
        );
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getAttendanceSummary = async (req, res) => {
    try {
        const result = await attendanceService.getAttendanceSummary(
            req.params.sectionSubjectId
        );
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getAttendanceCalendar = async (req, res) => {
    try {
        const { year, month } = req.query;
        const result = await attendanceService.getAttendanceCalendar(
            req.params.sectionSubjectId,
            parseInt(year),
            parseInt(month)
        );
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getMyAttendance = async (req, res) => {
    try {
        const result = await attendanceService.getMyAttendance(req.user.id);
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    markAttendance,
    getAttendanceByDate,
    getAttendanceSummary,
    getAttendanceCalendar,
    getMyAttendance,
};
