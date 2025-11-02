// @/model/Subscribtion.ts
import mongoose, { Document, Types } from "mongoose";

export interface ISubscribtion extends Document{
    userId: Types.ObjectId;
    creatorId: Types.ObjectId;
    isSubscribed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SubscribtionSchema = new mongoose.Schema<ISubscribtion>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    isSubscribed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Subscribtion = mongoose.models.Subscribtion || mongoose.model<ISubscribtion>('Subscribtion', SubscribtionSchema);
export default Subscribtion;
