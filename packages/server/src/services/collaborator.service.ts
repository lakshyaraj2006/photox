import mongoose from "mongoose";
import { AlbumModel } from "../models/album.model";
import { ApiError } from "../utils/ApiError";
import { sendEmail } from "../utils/sendEmail";
import { InvitationModel } from "../models/invitation.model";
import { UserModel } from "../models/user.model";
import crypto from "crypto";

const checkCollboration = async (albumId: string, userId: string) => {
    if (!mongoose.isValidObjectId(albumId) || !mongoose.isValidObjectId(userId))
        throw new ApiError(400, "Invalid user id or album id")

    const album = await AlbumModel.findById(albumId);

    if (!album) throw new ApiError(404, "Album was not found!");

    if (album.user.toString() === userId) return true;

    const isCollaborator = album?.collaborators?.includes(new mongoose.Types.ObjectId(userId));

    return isCollaborator;
}

const collaborationInvite = async (albumId: string, email: string) => {
    if (!albumId || !email) throw new ApiError(400, "Album or user id are required");

    if (!mongoose.isValidObjectId(albumId))
        throw new ApiError(400, "Invalid album or user id");

    const album = await AlbumModel.findById(albumId);
    const user = await UserModel.findOne({ email });

    if (!album) throw new ApiError(404, "Album was not found");
    if (!user) throw new ApiError(404, "User was not found");

    if (album.user.toString() === user.id)
        throw new ApiError(400, "Owners can't be collaborators!");

    if (album.collaborators?.includes(user.id))
        throw new ApiError(400, "User already added as collaborator")

    let invitation = await InvitationModel.findOne({ albumId, userId: user.id });

    if (!invitation || invitation.tokenExpiry < new Date()) {
        const token = crypto.randomUUID();
        invitation = await InvitationModel.create({
            albumId,
            userId: user.id,
            token,
            tokenExpiry: new Date(Date.now() + 8 * 60 * 60 * 1000)
        });

        const htmlTemplate = `<html>
        <head>
            <title>Join ${album.title.slice(20) + "..."} album</title>
        </head>

        <body style="font-family: sans-serif;">
        <h3>Hi, ${user.username}</h3>

        <p>You have been invited to join the <em><strong>${album.title}</strong></em></p>
        <p>Click on the given link to join the album</p>

        Link to join: <a href="${process.env.FRONTEND_URL}/collaborate/${token}?album=${album.id}" target="_blank">Click Here</a>

        <strong>OR</strong>

        <p>Paste the url manually: ${process.env.FRONTEND_URL}/collaborate/${token}?album=${album.id}</p>

        <p style="color: red;">This link will expire in 8 hours</p>
        
        </body>
        </html>`;

        const response = await sendEmail(email, `Join ${album.title.slice(20) + "..."} album`, htmlTemplate);

        if (response) return invitation;
    }

    return invitation;
}

const acceptInvite = async (token: string, albumId: string) => {
    if (!token || !albumId) throw new ApiError(400, "Token or album id are required");

    if (!mongoose.isValidObjectId(albumId)) throw new ApiError(400, "Invalid album id");

    const invitation = await InvitationModel.findOne({ token, albumId });

    if (!invitation) throw new ApiError(404, "Invalid or expired invitation! Please contact the owner.")

    await AlbumModel.findByIdAndUpdate(albumId, {
        $push: {collaborators: invitation.userId}
    });

    await invitation.deleteOne();

    return true;
}

const removeCollaborator = async (albumId: string, userId: string) => {
    if (!albumId || !userId) throw new ApiError(400, "Album or user id are required");

    if (!mongoose.isValidObjectId(albumId) || !mongoose.isValidObjectId(userId))
        throw new ApiError(400, "Invalid album or user id");

    const album = await AlbumModel.findById(albumId);

    if (!album) throw new ApiError(404, "Album was not found!");

    const isOwner = album?.user.toString() === userId;

    if (!isOwner) throw new ApiError(401, "You cannot remove collaborator!");

    await AlbumModel.findByIdAndUpdate(albumId, {
        $pull: { collaborators: userId }
    });

    return true;
}

export const CollaboratorService = { checkCollboration, collaborationInvite, acceptInvite, removeCollaborator };
