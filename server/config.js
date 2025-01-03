const dotenv  = require('dotenv');
dotenv.config();

const appConfigs = {
    PORT: process.env.PORT || 8000,
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/task-manager"
}

module.exports = appConfigs;