const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.databaseURI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Drop legacy index if it exists
        try {
            await conn.connection.collection('tables').dropIndex('tableNo_1');
            console.log('✅ Legacy index tableNo_1 dropped successfully');
        } catch (err) {
            // Ignore error if index doesn't exist
            if (err.code !== 27) {
                console.log('ℹ️ Note on index drop:', err.message);
            }
        }
    } catch (error) {
        console.log(`❌ Database connection failed: ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB;