import mongoose, { Schema, Document, model} from "mongoose";

interface FavouriteDocument extends Document {
    user_id: Schema.Types.ObjectId;
    content_id: Schema.Types.ObjectId;
    starred_at: Date;
}

const FavouriteSchema = new Schema<FavouriteDocument>({
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
    starred_at: {
        type: Date,
        default: Date.now
    }
})

const Favourite = mongoose.models.Favourite || model<FavouriteDocument>('Favourite', FavouriteSchema);
export default Favourite;