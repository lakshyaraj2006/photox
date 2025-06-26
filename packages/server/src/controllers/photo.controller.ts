import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { PhotoService } from "../services/photo.service";
import { ApiResponse } from "../utils/ApiResponse";

const getUserPhotos = async (req: Request, res: Response) => {
    try {
        const data = await PhotoService.getUserPhotos(req.user!);

        res.status(200).json(
            new ApiResponse(200, "User photos fetched", data)
        )
    } catch (error) {
        console.log(error)
        if (error instanceof ApiError) {
            res.status(error.status).json(
                new ApiError(error.status, error.message)
            );
            throw new ApiError(error.status, error.message);
        }

        res.status(500).json(
            new ApiError(500, "Error fetching user photos")
        );
        throw new ApiError(500, "Error fetching user photos");
    }
}

const uploadPhoto = async (req: Request, res: Response) => {
    try {
        const file = req.file;

        if (!file) {
            res.status(400).json(
                new ApiError(400, "Image file required")
            );
            throw new ApiError(400, "Image file required");
        }

        const photo = await PhotoService.uploadPhoto(req.user!, file);
        res.status(200).json(
            new ApiResponse(200, "Image uploaded successfully", photo)
        );
    } catch (error) {
        console.log(error)
        if (error instanceof ApiError) {
            res.status(error.status).json(
                new ApiError(error.status, error.message)
            );
            throw new ApiError(error.status, error.message);
        }

        res.status(500).json(
            new ApiError(500, "Error fetching user photos")
        );
        throw new ApiError(500, "Error fetching user photos");
    }
}

export const PhotoController = { getUserPhotos, uploadPhoto };
