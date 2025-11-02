// /models/InstitutionMember.ts
import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type InstitutionRole = 'owner' | 'admin' | 'member' | 'creator' | 'teacher';
export type MembershipStatus = 'active' | 'pending' | 'revoked';

export interface IInstitutionMember extends Document {
  institutionId: Types.ObjectId;
  userId: Types.ObjectId;
  role: InstitutionRole;
  status: MembershipStatus;
  joinedAt: Date;
  metadata: Record<string, any>; // Flexible metadata object
}

const InstitutionMemberSchema = new Schema<IInstitutionMember>({
  institutionId: {
    type: Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
    index: true, // Index for fast lookups by institution
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Index for fast lookups by user
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'member'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'revoked'],
    default: 'active',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  // Mongoose's 'Mixed' type allows for a completely flexible object.
  // It's powerful but use with caution. Perfect for your use case.
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Create a compound unique index to ensure a user can only have one entry per institution.
InstitutionMemberSchema.index({ institutionId: 1, userId: 1 }, { unique: true });

const InstitutionMember: Model<IInstitutionMember> =
  mongoose.models.InstitutionMember || mongoose.model<IInstitutionMember>('InstitutionMember', InstitutionMemberSchema);

export default InstitutionMember;
