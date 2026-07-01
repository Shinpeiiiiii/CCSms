const app = require('./src/app');
const rateLimit = require('express-rate-limit')
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
    windowMs: 15 *60 * 1000,
    max: 100,

    message: {
        message: 'Too many request. Try again later!',
    },

    standardHeaders: true,

    legacyHeaders: false,
})
app.use(limiter)
const accountRoutes = require('./src/modules/accounts/routes/account.routes')
app.use('/api/accounts',accountRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})