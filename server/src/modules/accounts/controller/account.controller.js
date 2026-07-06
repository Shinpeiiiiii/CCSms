const accountService = require('../services/account.services')

const createAccount = async (req,res) => {
    try{
        const account = await accountService.createAccount(req.body)

        return res.status(201).json({
            message: 'Account created successfully.',
            account,
        })

    }catch(error){
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

module.exports = {createAccount, getAccount, getAccountById}