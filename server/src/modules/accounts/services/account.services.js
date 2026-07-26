const User = require('../../auth/models/User')
const bcrypt = require('bcrypt')
const { generateActivationToken, sendAccountActivationEmail } = require('../utils/sendActivationEmail')


const getTeachers = async () => {
    return await User.find({
        role: 'teacher',
    }, {
        password: 0,
        refreshToken: 0,
    }).sort({
        firstName: 1,
    });
}
const getUserById = async (id) => {
    try{
        const accountuser = await User.findById(id)
        if(!accountuser){
            return null
        }
        return accountuser;
    }catch(error){
        throw error;
    }
}

const createAccount = async (data) => {

    const existingUser = await User.findOne({
        email: data.email,
    })

    if (existingUser) {
        throw new Error('Email already exists.')
    }

    const totalUsers = await User.countDocuments()
    const isFirstUser = totalUsers === 0

    const activationToken = isFirstUser ? null : generateActivationToken()
    const activationExpires = isFirstUser ? null : new Date(Date.now() + 24 * 60 * 60 * 1000)
    const isActive = isFirstUser ? true : false
    const mustChangePassword = isFirstUser ? false : true

    const user = await User.create({
        firstName: data.firstName,
        middleName: data.middleName || '',
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        isActive,
        activationToken,
        activationExpires,
        mustChangePassword,
    })

    if (!isFirstUser) {
        try {
            await sendAccountActivationEmail(user.email, user.firstName, activationToken)
        } catch (emailError) {
            console.error('Failed to send activation email:', emailError)
        }
    }

    return user
}

const activateAccount = async (token, newPassword) => {
    const user = await User.findOne({
        activationToken: token,
        activationExpires: { $gt: Date.now() },
        isActive: false,
    })

    if (!user) {
        throw new Error('Invalid or expired activation token.')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword
    user.isActive = true
    user.activationToken = null
    user.activationExpires = null
    user.mustChangePassword = false

    await user.save()

    return user
}

const getAccountTeachers = async () => {
    return await User.find({
        role: 'teacher',
        isActive: true,
    }, {
        password: 0,
        refreshToken: 0,
    }).sort({
        firstName: 1,
    });
}

const getAccount = async () => {

    return await User.find()
        .select('-password -refreshToken -activationToken')
        .sort({
            createdAt: -1,
        })

}

const getAccountById = async (id) => {

    const account = await User.findById(id)
        .select('-password -refreshToken -activationToken')

    if (!account) {
        throw new Error('Account not found.')
    }

    return account

}

const updateAccount = async (id, data) => {
    const account = await User.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    ).select('-password -refreshToken -activationToken');

    if (!account) {
        throw new Error('Account not found.');
    }

    return account;
};

const deleteAccount = async (id) => {
    const account = await User.findById(id);
    if (!account) {
        throw new Error('Account not found.');
    }

    await User.findByIdAndDelete(id);
};

module.exports = {getTeachers, createAccount, activateAccount, getAccountTeachers, updateAccount, deleteAccount, getAccount, getAccountById}