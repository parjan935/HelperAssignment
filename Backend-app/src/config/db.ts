import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { log } from 'console'

dotenv.config()

const MONGO_URI: string = process.env.MONGO_URI as string
const connectDB = async () => {
    await mongoose.connect(MONGO_URI)
        .then(() => {
            log('mongoDB connected!')
        })
        .catch(() => {
            log('error connecting to mongoDB')
        })
}

export default connectDB;