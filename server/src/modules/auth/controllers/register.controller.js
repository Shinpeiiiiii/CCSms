const bcrypt = require('bcrypt')

const User = require('../../auth/models/User')

const register = async (req, res) => {
  try {
    const { email, password } = req.body

    const existingUser = await User.findOne({
      email,
    })

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      })
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    )

    const user = await User.create({
      email,
      password: hashedPassword,
    })

    res.status(201).json({
      message: 'User created',
      user,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = register