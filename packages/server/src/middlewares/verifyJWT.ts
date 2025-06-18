import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AccessTokenPayload } from "../types/token-payloads";
import { ApiError } from "../utils/ApiError";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.sendStatus(401).json({
            error: "Unauthorized request"
        })
        throw new ApiError(401, "Unauthorized request");
    } else {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
            if (err) return res.sendStatus(403);
            req.user = (decoded as AccessTokenPayload)?.id;
            next();
        });
    }
}
