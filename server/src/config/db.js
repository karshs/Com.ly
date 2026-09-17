const mongoose  = require('mongoose');

async function connectDB() {
    try {

        const conn  = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongo DB is connected : ${conn.connection.host}`);
        
    } catch (error) {
        console.error(`Cant connect to DB :  ${error.message}`);
        process.exit(1);

    }
}

module.exports = connectDB;