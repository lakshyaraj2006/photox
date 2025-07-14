import mongoose, {Schema, Document} from "mongoose";

export interface IInvitation extends Document {
    token: string,
    tokenExpiry: Date,
    albumId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    updatedAt: Date,
    createdAt: Date
}

const InvitationSchema = new Schema<IInvitation>({
    token: {
        type: String,
        required: true
    },
    tokenExpiry: {
        type: Date,
        required: true
    },
    albumId: {
        type: Schema.Types.ObjectId,
        ref: 'Album',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {timestamps: true});

InvitationSchema.index({tokenExpiry: 1}, {expireAfterSeconds: 0});

export const InvitationModel = mongoose.model<IInvitation>("Invitation", InvitationSchema);