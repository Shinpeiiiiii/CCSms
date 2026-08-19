const express = require("express");
const router = express.Router();

const {sendCode, verifyCode} = require("../controllers/verification.controller");

router.post('/send',sendCode);
router.post('/verify', verifyCode);

module.exports = router;