import mongoose from "mongoose";
import { AlbumModel } from "../models/album.model"
import { PhotoModel } from "../models/photo.model";
import { ApiError } from "../utils/ApiError";
import { UserModel } from "../models/user.model";

const getUserAlbums = async (userId: string) => {
    const albums = await AlbumModel.find({ user: userId })
        .populate(
            {
                path: 'user',
                select: '_id name username image'
            }
        );

    const populatedAlbums = await Promise.all(
        albums.map(async (album) => {
            const photos = album.photos as mongoose.Types.ObjectId[] | undefined;

            if (Array.isArray(photos) && photos.length > 0) {
                const firstPhotoId = photos[0];
                const populatedPhoto = await PhotoModel.findById(firstPhotoId)
                    .select('_id filename mimetype url');

                album.photos = populatedPhoto ? [populatedPhoto] as any : [];
            } else {
                album.photos = [];
            }
            return album;
        })
    );

    return populatedAlbums;
}

const getAlbum = async (albumId: string) => {
    if (!mongoose.isValidObjectId(albumId)) throw new ApiError(400, "Invalid album id")
    const album = await AlbumModel.findById(albumId)
        .populate(
            {
                path: 'user',
                select: '_id name username image'
            }
        );

    if (!album) throw new ApiError(404, "Album was not found!") 

    if (album.photos?.length) {
        await album.populate({
            path: 'photos',
            select: '_id filename url user',
            populate: {
                path: 'user',
                select: '_id name username image'
            }
        });
    }

    if (album.collaborators?.length) {
        await album.populate({
            path: 'collaborators',
            select: '_id name username image'
        });
    }

    return album;
}

const createAlbum = async (title: string, description: string, photos: string[] | null, userId: string) => {
    if (title.length === 0 || description.length === 0)
        throw new ApiError(400, "Title and description are required")
    let newAlbum;

    if (!photos) {
        newAlbum = await AlbumModel.create({ title, description, user: userId });
    } else {

        if (!photos?.every((elem) => mongoose.isValidObjectId(elem)))
            throw new ApiError(400, "Photo(s) must have valid id");

        // Remove duplicates from photos (in req.body) (if any)
        const uniquePhotoIds = [...new Set(photos.map(id => id))];

        newAlbum = await AlbumModel.create(
            {
                title,
                description,
                photos: uniquePhotoIds,
                user: userId
            },
        );

        // Add the album id to all the photos
        for (let i = 0; i < uniquePhotoIds.length; i++) {
            await PhotoModel.findByIdAndUpdate(uniquePhotoIds[i], {
                $push: { albums: newAlbum.id }
            })
        }
    }

    await UserModel.findByIdAndUpdate(userId, {
        $push: {
            albums: newAlbum.id
        }
    })

    return newAlbum;
}

const updateAlbum = async (title: string | null, description: string | null, albumId: string, userId: string) => {
    if (!mongoose.isValidObjectId(albumId) || !mongoose.isValidObjectId(userId))
        throw new ApiError(400, "Invalid user id or album id")

    let album = await AlbumModel.findById(albumId);

    const isOwner = album?.user.toString() === userId;
    const isCollaborator = album?.collaborators?.includes(new mongoose.Types.ObjectId(userId));

    if (!isOwner && !isCollaborator) throw new ApiError(401, "You cannot update album info");

    album = await AlbumModel.findByIdAndUpdate(albumId, {
        $set: { title: title ?? album?.title, description: description ?? album?.description }
    })

    return album;
}

export const AlbumService = { getUserAlbums, getAlbum, createAlbum, updateAlbum };