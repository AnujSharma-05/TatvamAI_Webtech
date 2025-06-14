import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("\nMongoDB connected successfully !! DB HOST:", connectionInstance.connection.host);
         
    } catch(error){
        console.log("MongoDB connection failed ", error);
        process.exit(1); // Exit process with failure
    }
}

export default connectDB;