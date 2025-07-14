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

export const collaboratorInvite = async (req: Request, res: Response) => {
    try {
        const response = await CollaboratorService.collaborationInvite(req.params.albumId, req.body.email);

        res.status(200).json(
            new ApiResponse(200, "Invititation sent to user's email")
        )
    } catch(error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(
                new ApiError(error.status, error.message)
            );
            throw new ApiError(error.status, error.message);
        }

        res.status(500).json(
            new ApiError(500, "Error sending invitation")
        );
        throw new ApiError(500, "Error sending invitation");
    }
}

export const acceptInvite = async (req: Request, res: Response) => {
    try {
        const response = await CollaboratorService.acceptInvite(req.params.token, req.params.albumId);

        res.status(200).json(
            new ApiResponse(200, "You have been added to collaborators")
        )
    } catch(error) {
        if (error instanceof ApiError) {
            res.status(error.status).json(
                new ApiError(error.status, error.message)
            );
            throw new ApiError(error.status, error.message);
        }

        res.status(500).json(
            new ApiError(500, "Error adding you as collaborator")
        );
        throw new ApiError(500, "Error adding you as collaborator");
    }
}

export const CollaboratorController = { checkCollaboration, collaboratorInvite, acceptInvite };