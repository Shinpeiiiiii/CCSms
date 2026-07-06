const User = require('../../auth/models/User')
const bcrypt = require('bcrypt')


const getUserById = async (id) => {
    try{
        const accountuser = await user.findById(id)

        if(!accountuser){
            return null
        }

        return accountuser;
    }catch(error){
        throw new error;
    }


}

const createAccount = async (data) => {

    const existingUser = await User.findOne({
        email: data.email,
    })

    if (existingUser) {
        throw new Error('Email already exists.')
    }

    const hashedPassword = await bcrypt.hash(data.password,10)

    return await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        role: data.role,
    })
}

const getAccount = async () => {

    return await User.find()
        .select('-password')
        .sort({
            createdAt: -1,
        })

}

const getAccountById = async (id) => {

    const account = await User.findById(id)
        .select('-password')

    if (!account) {
        throw new Error('Account not found.')
    }

    return account

}
module.exports = {createAccount, getAccount, getAccountById}