// /models/Institution.ts
import mongoose, { Document, Model, Types } from 'mongoose';

export interface IInstitution extends Document {
  _id: string;
  name: string;
  owner: Types.ObjectId; // The user who created/owns the institution
  admins: Types.ObjectId[]; // Users who can manage members and settings
  members: Types.ObjectId[]; // All users associated (teachers, creators)
  createdAt: Date;
  updatedAt: Date;
  portalKey: string;
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'canceled';
  branding: {
    logoUrl?: string;
    primaryColor?: string;
  };
}

const InstitutionSchema = new mongoose.Schema<IInstitution>({
  name: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  portalKey: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'trialing', 'past_due', 'canceled'],
    default: 'trialing',
  },
  branding: {
    logoUrl: { type: String },
    primaryColor: { type: String },
  },
}, { timestamps: true }); // `timestamps: true` automatically handles createdAt/updatedAt

InstitutionSchema.index({ members: 1 });

const Institution: Model<IInstitution> =
  mongoose.models.Institution || mongoose.model<IInstitution>('Institution', InstitutionSchema);

export default Institution;
