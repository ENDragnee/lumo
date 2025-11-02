// /models/Institution.ts
import mongoose, { Document, Model, Types } from 'mongoose';

export interface IInstitution extends Document {
  _id: string;
  name: string;
  owner: Types.ObjectId;
  admins: Types.ObjectId[];
  members: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  portalKey: string;
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'canceled';
  branding: {
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string; // Added secondary color
  };
  description?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  parentInstitution?: Types.ObjectId | null; 
}

const InstitutionSchema = new mongoose.Schema<IInstitution>({
  name: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  portalKey: { type: String, required: true, unique: true },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'trialing', 'past_due', 'canceled'],
    default: 'trialing',
  },
  branding: {
    logoUrl: { type: String },
    primaryColor: { type: String, default: '#2563eb' },
    secondaryColor: { type: String, default: '#1e40af' },
  },
  description: { type: String },
  website: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  address: { type: String },
  parentInstitution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    default: null, 
    index: true,
  },
}, { timestamps: true });

InstitutionSchema.index({ members: 1 });

const Institution: Model<IInstitution> =
  mongoose.models.Institution || mongoose.model<IInstitution>('Institution', InstitutionSchema);

export default Institution;
