import mongoose, { Document, Schema } from "mongoose";

export interface IPhoto extends Document {
    filename: string;
    mimetype: string;
    url: string;
    publicId: string;
    user: mongoose.Types.ObjectId;
    albums?: mongoose.Types.ObjectId[];
    updatedAt: Date;
    createdAt: Date;
}

export const PhotoSchema = new Schema<IPhoto>({
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
    publicId: {
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
