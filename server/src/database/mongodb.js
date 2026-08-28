const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        const dbName = mongoose.connection.name || '(unknown)';
        console.log(`MongoDB connected successfully to database: ${dbName}`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

module.exports = connectDB