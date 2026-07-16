const express = require("express");
const router = express.Router();

const {sendCode} = require("../controllers/verification.controller");

router.post('/send',sendCode);

module.exports = router;