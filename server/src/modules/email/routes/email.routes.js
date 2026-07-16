const express = require("express");
const router = express.Router();

const {
    sendTestEmail,
} = require("../controllers/test.controller");

router.post("/test", sendTestEmail);

module.exports = router;