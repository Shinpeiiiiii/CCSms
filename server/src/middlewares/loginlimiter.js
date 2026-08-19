const rateLimiter = require('express-rate-limit')

module.exports = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 100 requests per windowMs
    message: {
        message: 'Too many login attempts from this IP, please try again after 15 minutes'
    },
    ipv6Subnet: 56,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    standardHeaders: true, // Enable the `RateLimit-*` headers
})

