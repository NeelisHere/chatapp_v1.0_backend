const mongoose = require('mongoose')
const colors = require('colors')

const connection_options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI, connection_options)
        console.log(`MongoDB connected: ${connection.host}`.yellow.bold)
    } catch (error) {
        console.log(`[Error]: ${error.message}`.red.bold)
    }
}

module.exports = connectDB