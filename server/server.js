const dotenv = require('dotenv')
const app = require('./src/app');
const rateLimit = require('express-rate-limit')
const PORT = process.env.PORT || 5000;
const { connectRedis } = require("./src/config/redis")

const limiter = rateLimit({
    windowMs: 15 *60 * 1000,
    max: 100,
    message: { message: 'Too many request. Try again later!',},
    standardHeaders: true,
    legacyHeaders: false,
})
app.use(limiter)
const accountRoutes = require('./src/modules/accounts/routes/account.routes')
app.use('/api/accounts',accountRoutes)

const start = async () => {
    try{
        await connectRedis();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        });
    }catch(error){
        console.error("Failed to start server:", error)
        process.exit(1);
    }
}

start();

