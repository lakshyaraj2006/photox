import { JwtPayload } from "jsonwebtoken";

export interface AccessTokenPayload extends JwtPayload {
    email: string;
    id: string;
}

export interface RefreshTokenPayload extends JwtPayload {
    id: string;
}