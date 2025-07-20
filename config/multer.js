import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.config";


const storage=new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "ecommerce",
        allowedFormats: ["jpg", "png", "jpeg"],
    }
})

export const upload = multer({ storage: storage });