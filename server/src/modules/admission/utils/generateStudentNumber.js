const Student = require("../../students/models/Student");

const generateStudentNumber = async () => {

    const year = new Date().getFullYear();

    const latest = await Student.findOne({
        studentNumber: {
            $regex: `^${year}-`,
        },
    }).sort({
        studentNumber: -1,
    });

    let next = 1;

    if (latest) {

        const lastNumber = parseInt(
            latest.studentNumber.split("-")[1],
            10
        );

        next = lastNumber + 1;

    }

    return `${year}-${String(next).padStart(6, "0")}`;

};

module.exports = generateStudentNumber;