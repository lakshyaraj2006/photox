import { CollaboratorService } from "../services/collaborator.service";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const checkCollaboration = async (req: Request, res: Response) => {
    try {
        const isCollaborator = await CollaboratorService.checkCollboration(req.params.albumId, req.user!);

        res.status(200).json(
            new ApiResponse(200, "Collaborator status fetched", isCollaborator)
        )
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(
                new ApiError(error.status, error.message)
            );
            throw new ApiError(error.status, error.message);
        }

        res.status(500).json(
            new ApiError(500, "Error fetching collaborator status")
        );
        throw new ApiError(500, "Error fetching collaborator status");
    }
}

export const CollaboratorController = { checkCollaboration };