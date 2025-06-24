import mongoose, { Document, Schema } from "mongoose";
import { IPhoto } from "./photo.model";
import { IAlbum } from "./album.model";

export interface IUser extends Document {
    name: string;
    username: string;
    image: string;
    email: string;
    password: string;
    photos?: IPhoto[];
    albums?: IAlbum[];
    updatedAt: Date;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    photos: {
        type: [Schema.Types.ObjectId],
        ref: "Photo"
    },
    albums: {
        type: [Schema.Types.ObjectId],
        ref: "Album"
    }
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>("User", UserSchema);
