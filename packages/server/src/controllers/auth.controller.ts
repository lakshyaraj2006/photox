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

const loginUser = async (req: Request, res: Response) => {
    try {
        const { accessToken, refreshToken, userId } = await AuthService.loginUser(req.body);

        res.cookie('refreshtoken', refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        })

        res.status(201).json(
            new ApiResponse(201, "Loggedin successfully", { accessToken, userId })
        );
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(
                new ApiError(error.status, error.message)
            );
            throw new ApiError(error.status, error.message);
        }

        res.status(500).json(
            new ApiError(500, "Error authenticating user")
        );
        throw new ApiError(500, "Error authenticating user");
    }
}

const refreshToken = async (req: Request, res: Response) => {
    try {
        const { accessToken, refreshToken, userId } = await AuthService.refreshToken(req.cookies['refreshtoken']);

        res.cookie('refreshtoken', refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        })

        res.status(200).json(
            new ApiResponse(200, "Refreshed token", { accessToken, userId })
        );
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(
                new ApiError(error.status, error.message)
            );
            throw new ApiError(error.status, error.message);
        }

        res.status(500).json(
            new ApiError(500, "Error refreshing tokens")
        );
        throw new ApiError(500, "Error refreshing tokens");
    }
}
const logoutUser = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    try {
        const refreshtoken = cookies['refreshtoken'];

        if (!refreshtoken) {
            res.status(401).json(
                new ApiError(401, "Unauthorized request")
            );
            throw new ApiError(401, "Unauthorized request");
        } else {
            res.clearCookie('refreshtoken');
            res.status(200).json(
                new ApiResponse(200, "Logged out successfully")
            );
        }
    } catch (error) {
        res.status(500).json(
            new ApiError(500, "Some error occurred")
        );
        throw new ApiError(500, "Some error occurred");
    }
}

export const AuthController = { createUser, loginUser, refreshToken, logoutUser };
