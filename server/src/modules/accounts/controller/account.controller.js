const accountService = require('../services/account.services')

const getTeachers = async (req, res) => {
    try{
        const teachers = await accountService.getTeachers();
        return res.status(200).json({
            success: true,
            message: teachers,
        });
    }catch(error){
        console.error('get teachers error', error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const createAccount = async (req,res) => {
    try{
        const account = await accountService.createAccount(req.body)

        return res.status(201).json({
            message: 'Account created successfully. An activation email has been sent.',
            account: {
                id: account._id,
                firstName: account.firstName,
                middleName: account.middleName,
                lastName: account.lastName,
                email: account.email,
                role: account.role,
                isActive: account.isActive,
            },
        })

    }catch(error){
        return res.status(400).json({
            message: error.message,
        })
    }
};
const activateAccount = async (req, res) => {
    try {
        const { token, password } = req.body

        if (!token || !password) {
            return res.status(400).json({
                message: 'Token and password are required.',
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long.',
            })
        }

        const user = await accountService.activateAccount(token, password)

        return res.status(200).json({
            message: 'Account activated successfully. You can now log in.',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        })
    }
};
const getAccountById = async (req, res, next) => {
    try{
        const account = await accountService.getUserById(req.params.id)
        return res.status(200).json(account)
    }catch(error){
        return res.status(404).json({
            message: error.message
        })
    }
};

const getAccount = async (req, res, next) => {
    try{
        const account = await accountService.getAccount();

        res.status(200).json(account);

    }catch(error){
        return res.status(400).json({
            message: error.message,
        })
    }
};

const updateAccount = async (req, res) => {
    try {
        const account = await accountService.updateAccount(req.params.id, req.body);
        return res.status(200).json({
            message: 'Account updated successfully.',
            account,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        await accountService.deleteAccount(req.params.id);
        return res.status(200).json({
            message: 'Account deleted successfully.',
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

module.exports = {getTeachers ,createAccount, activateAccount, updateAccount, deleteAccount, getAccount, getAccountById}