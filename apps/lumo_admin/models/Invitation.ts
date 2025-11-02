import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import crypto from 'crypto'; // For generating a secure token

export type InvitationStatus = 'pending' | 'accepted' | 'expired';

export interface IInvitation extends Document {
  institutionId: Types.ObjectId;
  email: string;
  sentBy: Types.ObjectId;
  role: 'admin' | 'member';
  token: string;
  status: InvitationStatus;
  expiresAt: Date;
  createdAt: Date;
}

const InvitationSchema = new Schema<IInvitation>({
  institutionId: {
    type: Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  sentBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member',
  },
  token: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomBytes(32).toString('hex'), // Secure random token
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'expired'],
    default: 'pending',
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    index: { expires: '1s' }, // Automatically remove expired invitations if needed
  }
}, {
  timestamps: true,
});

// Compound index to prevent sending multiple pending invites to the same email for the same institution
InvitationSchema.index({ institutionId: 1, email: 1, status: 1 });

const Invitation: Model<IInvitation> =
  mongoose.models.Invitation || mongoose.model<IInvitation>('Invitation', InvitationSchema);

export default Invitation;
