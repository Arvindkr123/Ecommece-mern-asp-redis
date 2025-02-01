import mongoose from "mongoose";
import { config } from "../config/config.js";

const databaseConnectionHandler = async () => {
    try {
        const connection = await mongoose.connect(config.MONGO_URI);
        console.log("Database connection established at", connection.connection.host)
    } catch (error) {
        process.exit(1)
    }
}

export default databaseConnectionHandler