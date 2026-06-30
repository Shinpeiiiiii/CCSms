const bcrypt = require('bcrypt')
const User = require('../../auth/models/User')

const createAccount = async (req,res) => {
    try{
        console.log('CREATE ACCOUNT CONTROLLER HIT')
        const {
            firstName,lastName,email,password,role,
        } = req.body

        const existingUser = await User.findOne({email,})

        if(existingUser){
            return res.status(400).json({
                message: 'Email already exist.',
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
        })

        res.status(201).json({
            message: 'Account created successfully', user,
        })


    }catch(error){
        console.error(error)
    }
}

module.exports = {createAccount}