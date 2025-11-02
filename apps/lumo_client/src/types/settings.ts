// types/settings.ts

// The shape of the Notification Preferences object
export interface INotificationPreferences {
  studyReminders: boolean;
  achievements: boolean;
  deadlines: boolean;
  streaks: boolean;
  social: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: "immediate" | "batched" | "daily";
}

// The shape of a single populated subscription object
export interface IPopulatedSubscription {
    _id: string;
    creatorId: {
        _id: string;
        name: string;
        profileImage?: string;
    };
    // ... other subscription fields if needed
}

// This is the main data structure for the entire settings page
export interface UserSettingsData {
  profile: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
    bio?: string;
    institution?: string;
    createdAt: string;
    // We add the provider to know if the user can change their password
    provider?: 'credentials' | 'google'; 
  };
  notifications: INotificationPreferences;
  subscriptions: IPopulatedSubscription[];
}
