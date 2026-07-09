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
    //console.log('FOUND USER',user)


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

    const token = jwt.sign(
      {
        id: user._id,role: user.role, tokenVersion: user.tokenVersion,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '15m',
      },
      console.log(user.role)
    )

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = login