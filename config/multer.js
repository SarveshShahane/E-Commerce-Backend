import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.config.js";


const storage=new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "ecommerce",
        allowedFormats: ["jpg", "png", "jpeg"],
    }
})

const upload = multer({ storage: storage });
export default upload;