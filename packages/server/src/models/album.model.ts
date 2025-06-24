import mongoose, { Document } from "mongoose";
import { IUser } from "./user.model";
import { IPhoto } from "./photo.model";

enum SharingOptions {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}

export interface IAlbum extends Document {
    title: string;
    description: string;
    user: IUser;
    sharing: SharingOptions;
    collaborators?: IUser[];
    photos?: IPhoto[];
    updatedAt: Date;
    createdAt: Date;
}

const AlbumSchema = new mongoose.Schema<IAlbum>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sharing: {
        type: String,
        enum: Object.values(SharingOptions),
        required: true
    },
    collaborators: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
    },
    photos: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Photo"
    }
}, {timestamps: true});

export const AlbumModel = mongoose.model<IAlbum>("Album", AlbumSchema);