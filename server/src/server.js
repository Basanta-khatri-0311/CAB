const app = require('./app.js');
const dotenv = require('dotenv');
dotenv.config()

const connectDB = require('../config/db.js');
const PORT = process.env.PORT || 3000;



// Wrap in an async function
const startServer = async () => {
    try {
        await connectDB();
        console.log('Database Connected');

        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();