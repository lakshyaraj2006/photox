import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    username: string;
    image: string;
    email: string;
    password: string;
    photos?: mongoose.Types.ObjectId[];
    albums?: mongoose.Types.ObjectId[];
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
        default: 'https://res.cloudinary.com/dfubkk4o0/image/upload/v1733205975/user_kbvaqm.png'
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
