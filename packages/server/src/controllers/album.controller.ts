import { Request, Response } from "express";
import { AlbumService } from "../services/album.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

const getUserAlbums = async (req: Request, res: Response) => {
    try {
        const data = await AlbumService.getUserAlbums(req.user!);

        res.status(200).json(
            new ApiResponse(200, "User albums fetched", data)
        )
    } catch (error) {
        console.log(error)
        if (error instanceof ApiError) {
            res.status(error.status).json(
                new ApiError(error.status, error.message)
            );
            throw new ApiError(error.status, error.message);
        }

        res.status(500).json(
            new ApiError(500, "Error fetching user albums")
        );
        throw new ApiError(500, "Error fetching user albums");
    }
}

const getAlbum = async (req: Request, res: Response) => {
    try {
        const data = await AlbumService.getAlbum(req.params.albumId);

        res.status(200).json(
            new ApiResponse(200, "User albums fetched", data)
        )
    } catch (error) {
        console.log(error)
        if (error instanceof ApiError) {
            res.status(error.status).json(
                new ApiError(error.status, error.message)
            );
            throw new ApiError(error.status, error.message);
        }

        res.status(500).json(
            new ApiError(500, "Error fetching user album")
        );
        throw new ApiError(500, "Error fetching user album");
    }
}

export const AlbumController = { getUserAlbums, getAlbum };