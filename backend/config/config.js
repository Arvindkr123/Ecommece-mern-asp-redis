import dotenv from "dotenv"
import path from "path"
const __dirname = path.resolve();


dotenv.config({
    path: path.join(__dirname, '.env')
});

export const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    STRIP_SECRET_KEY: process.env.STRIP_SECRET_KEY,
    CLIENT_URL: process.env.CLIENT_URL,
}
