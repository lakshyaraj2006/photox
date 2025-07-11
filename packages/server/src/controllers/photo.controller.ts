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

const deletePhoto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await PhotoService.deletePhoto(req.user!, id);
        res.status(200).json(
            new ApiResponse(200, "Image deleted successfully")
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
            new ApiError(500, "Error deleting user photo")
        );
        throw new ApiError(500, "Error deleting user photo");
    }
}

const getPhoto = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        const data = await PhotoService.getPhoto(id);

        res.status(200).json(
            new ApiResponse(200, "User photo fetched", data)
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
            new ApiError(500, "Error fetching user photo")
        );
        throw new ApiError(500, "Error fetching user photo");
    }
}

export const PhotoController = { getUserPhotos, uploadPhoto, deletePhoto, getPhoto };
