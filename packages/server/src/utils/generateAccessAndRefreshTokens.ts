import jwt from "jsonwebtoken";
import "dotenv/config";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export function generateAccessAndRefreshTokens(id: string, email: string) {
    if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
        throw Error("Token secrets are missing");
    }
    
    const accessToken = jwt.sign({ email, id }, ACCESS_TOKEN_SECRET, { expiresIn: '15min' });
    const refreshToken = jwt.sign({ id }, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

    return { accessToken, refreshToken };

}