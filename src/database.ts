import mongoose from 'mongoose';


export async function connectDB() {
    if (!process.env.DB_STRING) throw new Error("Connection string undefined");
    await mongoose.connect(process.env.DB_STRING);
}