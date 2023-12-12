const mongoose = require('mongoose');

function connect() {
    try {
        mongoose.set('strictQuery', true);
        mongoose.connect(process.env.MONGODB_HOST || "mongodb://127.0.0.1:27017/file_sharing");
        console.log("DB connected!");
    } catch (e) {
        throw new Error("DB connection error - " + e);
    }
}

module.exports = connect