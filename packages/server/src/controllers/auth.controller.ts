import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const createUser = async (req: Request, res: Response) => {
    try {
        const user = await AuthService.createUser(req.body);

        res.status(201).json(
            new ApiResponse(201, "User account created successfully")
        );
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(
                new ApiError(error.status, error.message)
            );
            throw new ApiError(error.status, error.message);
        }

        res.status(500).json(
            new ApiError(500, "Error creating user account")
        );
        throw new ApiError(500, "Error creating user account");
    }
}

export const AuthController = { createUser };
