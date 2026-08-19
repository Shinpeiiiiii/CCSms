require('dotenv').config()
const mongoose = require('mongoose')

const bcrypt = require('bcrypt')
const User = require(
    './src/modules/auth/models/User'
)

mongoose.connect(process.env.MONGO_URI)

const seedAdmin = async() => {
    try{
        const existingAdmin = await User.findOne({
            email: 'seddy012345@gmail.com'
        })

        if(existingAdmin){
            console.log('Admin already exist.')
            process.exit()

        }

        const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD,10)
        const admin = await User.create({
            firstName: 'sed',
            lastName: 'sed',
            email: 'seddy012345@gmail.com',
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            mustChangePassword: false,
        })

        console.log('Admin created',admin.email)
        process.exit()

    }catch(error){
        console.error(error)
        process.exit()
    }
}

seedAdmin()