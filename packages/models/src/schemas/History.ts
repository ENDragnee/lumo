import mongoose, { Schema, Document, model} from "mongoose";

export interface HistoryDocument extends Document {
    user_id: Schema.Types.ObjectId;
    content_id: Schema.Types.ObjectId;
    viewed_at: Date;
    starred_status: Boolean;
    starred_at: Date;
}

const HistorySchema = new Schema<HistoryDocument>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content_id: {
        type: Schema.Types.ObjectId,
        ref: 'Content',
        required: true
    },
    starred_status: {
        type: Boolean,
        default: false
    },
    starred_at: {
        type: Date,
        default: Date.now
    },
    viewed_at: {
        type: Date,
        default: Date.now
    }
})

const History = mongoose.models.History || model<HistoryDocument>('History', HistorySchema);
export default History;