// models/UserSettings.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INotificationPreferences {
  studyReminders: boolean;
  achievements: boolean;
  deadlines: boolean;
  streaks: boolean;
  social: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // "HH:MM" format
    end: string;   // "HH:MM" format
  };
  frequency: "immediate" | "batched" | "daily";
}

export interface IUserSettings extends Document {
  userId: Schema.Types.ObjectId;
  notifications: INotificationPreferences;
  // Future settings can be added here
}

const UserSettingsSchema = new Schema<IUserSettings>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  notifications: {
    studyReminders: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true },
    deadlines: { type: Boolean, default: true },
    streaks: { type: Boolean, default: true },
    social: { type: Boolean, default: false },
    quietHours: {
      enabled: { type: Boolean, default: false },
      start: { type: String, default: '22:00' },
      end: { type: String, default: '08:00' },
    },
    frequency: {
      type: String,
      enum: ["immediate", "batched", "daily"],
      default: 'immediate',
    },
  },
}, {
  timestamps: true
});

const UserSettings: Model<IUserSettings> = 
  mongoose.models.UserSettings || 
  mongoose.model('UserSettings', UserSettingsSchema);

export default UserSettings;
