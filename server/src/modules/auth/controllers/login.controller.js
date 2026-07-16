const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

const Max_Attempts = 5
const LockDuration = 15 * 60 * 1000 //15 mins

const login = async (req, res) => {
  try {

    //console.log('BODY:',req.body)
    const { email, password } = req.body
    const user = await User.findOne({email})
    const invalidCredentialsResponse = () => res.status(400).json({message: 'Invalid email and password.'})
    console.log('FOUND USER',user)


    if (!user) {
      return invalidCredentialsResponse()
    }

    if(user.lockUntil && user.lockUntil > Date.now()){
      const minsleft = Math.ceil((user.lockUntil - Date.now()) / 60000)
      return res.status(429).json({
        message: `Too many failed attempts. Try again in ${minsleft} minute(s).`,
      })
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if(!isMatch){
      user.failedLoginAttempts += 1

      if(user.failedLoginAttempts >= Max_Attempts){
        user.lockUntil = new Date(Date.now() + LockDuration)
      }

      await user.save()
      return invalidCredentialsResponse()
    }

    user.failedLoginAttempts = 0
    user.lockUntil = null
    user.tokenVersion += 1;
    await user.save();

    console.log('PASSWORD MATCH',isMatch)

    const {
        generateAccessToken,
        generateRefreshToken,
    } = require("../../../utils/token");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken",refreshToken,{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      secure: true,
      maxAge: 5 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      accessToken,

      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    })
  }catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = login