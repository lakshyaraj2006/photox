import mongoose, { Document } from "mongoose";

export interface IAlbum extends Document {
    title: string;
    description: string;
    user: mongoose.Types.ObjectId;
    collaborators?: mongoose.Types.ObjectId[];
    photos?: mongoose.Types.ObjectId[];
    updatedAt: Date;
    createdAt: Date;
}

export const AlbumSchema = new mongoose.Schema<IAlbum>({
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
    collaborators: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
    },
    photos: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Photo"
    }
}, {timestamps: true});

AlbumSchema.virtual('thumbnail', {
    ref: 'Photo',
    localField: 'photos',
    foreignField: '_id',
    justOne: true,
    options: { sort: { _id: 1 } }
});

AlbumSchema.set('toJSON', { virtuals: true, transform: (_doc, ret) => {
    delete ret.photos;
    return ret;
} });
AlbumSchema.set('toObject', { virtuals: true });

export const AlbumModel = mongoose.model<IAlbum>("Album", AlbumSchema);