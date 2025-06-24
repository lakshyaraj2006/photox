import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/photox");
        console.log("Connected to database");
    } catch (error) {
        console.log("Error connecting to database", error);
        process.exit(1);
    }
}
