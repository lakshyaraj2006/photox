import mongoose, { Document, Schema } from "mongoose";
import { IAlbum } from "./album.model";
import { IUser } from "./user.model";

export interface IPhoto extends Document {
    filename: string;
    mimetype: string;
    url: string;
    user: IUser;
    albums?: IAlbum[];
    updatedAt: Date;
    createdAt: Date;
}

const PhotoSchema = new Schema<IPhoto>({
    filename: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    albums: {
        type: [Schema.Types.ObjectId],
        ref: "Album"
    }
}, {timestamps: true});

export const PhotoModel = mongoose.model<IPhoto>("Photo", PhotoSchema);
