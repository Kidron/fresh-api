import mongoose from 'mongoose';
import { Config } from './types/config';


export async function connectDB() {
    return await mongoose.connect(Config.DB_STRING);
}