import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { UserService } from "../services/user.service";
import { ApiResponse } from "../utils/ApiResponse";

const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await UserService.getUserProfile(req.user!);

        res.status(200).json(
            new ApiResponse(200, "User profile fetched", user)
        )
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(
                new ApiError(error.status, error.message)
            );
            throw new ApiError(error.status, error.message);
        }

        res.status(500).json(
            new ApiError(500, "Error fetching user profile")
        );
        throw new ApiError(500, "Error fetching user profile");
    }
}

const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const userData = { name: req.body.name as string, file: req.file };

        const user = await UserService.updateUserProfile(req.user!, userData);
        res.status(200).json(
            new ApiResponse(200, "User profile updated", user)
        )
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(
                new ApiError(error.status, error.message)
            );
            throw new ApiError(error.status, error.message);
        }

        res.status(500).json(
            new ApiError(500, "Error updating user profile")
        );
        throw new ApiError(500, "Error updating user profile");
    }
}

export const UserController = { getUserProfile, updateUserProfile };
