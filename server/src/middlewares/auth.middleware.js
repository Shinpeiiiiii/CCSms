const jwt = require('jsonwebtoken')

const authMiddleware = async (req,res,next) => {

    console.log("Authorization Header:", req.headers.authorization);

    try{
        const authHeader = req.headers.authorization

        if(!authHeader || !authHeader.startsWith('Bearer')){
            return res.status(401).json({
                message: 'No token provided',
            })
        }

        const token = authHeader.split(' ')[1]

        const decoded = jwt.verify(token,process.env.JWT_ACCESS_SECRET)

        req.user = decoded
        next()

        if(decoded.tokenVersion !== req.user.tokenVersion){
            return res.status(401).json({
                message: 'Token has been invalidated. Please log in again.',
            })
        }

    }catch(error){
        console.error(error)

        return res.status(401).json({
            message: 'Invalid token'
        })
    }
}


module.exports = authMiddleware