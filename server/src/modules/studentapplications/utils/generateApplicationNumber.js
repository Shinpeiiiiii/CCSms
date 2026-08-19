const StudentApplication = require("../models/studentapplication.models");

const generateApplicationNumber =  async () => {
    const year = new Date().getFullYear();

    const latest = await StudentApplication.findOne({
        applicationNumber: {
            $regex: `^APP-${year}`
        }
    })
    .sort({applicationNumber: -1});

    let next = 1;

    if(latest){
        const lastNumber = parseInt(latest.applicationNumber.split("-")[2], 10); 
        next = lastNumber + 1;
    }

    return `APP-${year}-${String(next).padStart(6, "0")}`;

};

module.exports = generateApplicationNumber;