import { v2 as cloundinary } from 'cloudinary';
import fs from 'fs';
import "dotenv/config";

cloundinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath: string, userId: string, recursiveFolderPath: string | null = null) => {
    try {
        if (!localFilePath) return null;

        const response = await cloundinary.uploader.upload(localFilePath, {
            folder: `PhotoX/${userId}/${recursiveFolderPath && recursiveFolderPath}`,
            resource_type: 'image'
        });
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export { cloundinary, uploadOnCloudinary };
