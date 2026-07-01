const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

const login = async (req, res) => {
  try {

    console.log('BODY:',req.body)
    const { email, password } = req.body

    const user = await User.findOne({email})

    console.log('FOUND USER',user)


    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      })
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    user.tokenVersion += 1;
    await user.save();

    console.log('PASSWORD MATCH',isMatch)

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid Password',
      })
    }

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