import { IUser, UserModel } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import bcrypt from "bcryptjs";

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

    // TODO: remove hardcoded value for image
    userData.image = "https://ik.imagekit.io/nzh9ygzzs/user_kbvaqm.png?updatedAt=1750214536503";
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    user = await UserModel.create({ ...userData, password: hashedPassword });

    return user;
}

export const AuthService = { createUser };
