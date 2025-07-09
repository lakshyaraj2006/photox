import { IUser, UserModel } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import bcrypt from "bcryptjs";
import { generateAccessAndRefreshTokens } from "../utils/generateAccessAndRefreshTokens";
import { RefreshTokenPayload } from "../types/token-payloads";
import jwt from "jsonwebtoken";

const createUser = async (
    userData: Pick<IUser, "name" | "username" | "image" | "email" | "password">
) => {
    let user = await UserModel.findOne({
        $or: [
            { username: userData.username },
            { email: userData.email }
        ]
    });

    if (user) {
        throw new ApiError(400, "Username or email already taken!");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    user = await UserModel.create({ ...userData, password: hashedPassword });

    return user;
}

const loginUser = async (
    userData: { identifier: string, password: string }
) => {
    const usernameRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/;
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

    let user;

    if (userData.identifier.match(usernameRegex)) {
        user = await UserModel.findOne({ username: userData.identifier });
    } else if (userData.identifier.match(emailRegex)) {
        user = await UserModel.findOne({ email: userData.identifier });
    }

    if (user) {
        const isValid = await bcrypt.compare(userData.password, user.password);

        if (isValid) {

            try {
                const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user.id, user.email);

                return { accessToken, refreshToken, userId: user.id };

            } catch (error: Error | any) {
                throw new ApiError(500, error.message);
            }

        } else {
            throw new ApiError(400, "Invalid password!")
        }
    } else {
        throw new ApiError(404, "User not found!")
    }

}

const refreshToken = async (refreshToken: string) => {
    const { id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as RefreshTokenPayload;

    const user = await UserModel.findById(id);

    if (user) {
        const { accessToken, refreshToken } = generateAccessAndRefreshTokens(id, user?.email);
        return { accessToken, refreshToken, userId: user.id };
    } else {
        throw new ApiError(404, "User not found")
    }
}

export const AuthService = { createUser, loginUser, refreshToken };
