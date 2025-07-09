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

const createAlbum = async (req: Request, res: Response) => {
    try {
        const {title, description, photos} = req.body;

        const data = await AlbumService.createAlbum(title, description, photos, req.user!);

        res.status(201).json(
            new ApiResponse(201, "User album created")
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
            new ApiError(500, "Error creating user album")
        );
        throw new ApiError(500, "Error creating user album");
    }
}

const updateAlbum = async (req: Request, res: Response) => {
    try {
        const {title, description} = req.body;
        const albumId = req.params.albumId;

        const data = await AlbumService.updateAlbum(title, description, albumId, req.user!);

        res.status(200).json(
            new ApiResponse(200, "User album updated")
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
            new ApiError(500, "Error updating user album")
        );
        throw new ApiError(500, "Error updating user album");
    }
}

const deleteAlbum = async (req: Request, res: Response) => {
    try {
        const albumId = req.params.albumId;

        const data = await AlbumService.deleteAlbum(albumId, req.user!);

        res.status(200).json(
            new ApiResponse(200, "User album deleted")
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
            new ApiError(500, "Error deleting user album")
        );
        throw new ApiError(500, "Error deleting user album");
    }
}

const addPhotosToAlbum = async (req: Request, res: Response) => {
    try {
        const albumId = req.params.albumId;
        const {photos} = req.body;

        const data = await AlbumService.addPhotosToAlbum(photos, albumId, req.user!);

        res.status(200).json(
            new ApiResponse(200, "Photos added to album")
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
            new ApiError(500, "Error adding photos to album")
        );
        throw new ApiError(500, "Error adding photos to album");
    }
}

export const AlbumController = { getUserAlbums, getAlbum, createAlbum, updateAlbum, deleteAlbum, addPhotosToAlbum };