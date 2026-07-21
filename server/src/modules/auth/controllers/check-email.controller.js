const User = require('../models/User')

const checkEmail = async (req, res) => {
  try {
    const { email } = req.query
    if (!email) {
      return res.status(400).json({ message: 'Email query parameter is required.' })
    }

    // Basic regex validation of email format in backend
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' })
    }

    // Query case-insensitively
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') } 
    })
    
    if (user) {
      return res.status(200).json({ exists: true, message: 'User exists.' })
    } else {
      return res.status(200).json({ exists: false, message: 'User does not exist.' })
    }
  } catch (error) {
    console.error('Error checking email:', error)
    return res.status(500).json({ message: 'Server error checking email.' })
  }
}

module.exports = checkEmail
