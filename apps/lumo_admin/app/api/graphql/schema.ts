// /app/api/graphql/schema.ts

// The #graphql comment provides syntax highlighting
export const typeDefs = `#graphql
  # Represents a user in the system
  type User {
    id: ID!
    name: String!
    email: String!
    profileImage: String # This was missing in your last schema but needed by the resolver
  }
  
  type InvitationDetails {
    id: ID!
    email: String!
    role: String! # 'admin' or 'member'
    status: String! # 'pending', 'accepted', 'expired'
    sentBy: User!
    sentDate: String! # ISO Date String
    expiresAt: String! # ISO Date String
  }

  # Represents an institution with its related users
  type Institution {
    id: ID!
    name: String!
    owner: User!
    admins: [User!]!
    members: [User!]!
    portalKey: String!
  }
  
  # A single stat card value with an optional change metric.
  type StatValue {
    value: String!
    change: Int
  }
  
  # The main container for all dashboard statistics.
  type DashboardStats {
    totalEnrolledUsers: StatValue!
    pendingRegistrations: StatValue!
    publishedContentModules: StatValue!
    averageUserProgress: StatValue!
  }

  # A simplified representation of a content module for the activity feed.
  type ActivityContent {
    id: ID!
    title: String!
  }

  # Represents a single item in the activity feed.
  type ActivityItem {
    id: ID!
    eventType: String!
    timestamp: String! # ISO Date String
    user: User!
    content: ActivityContent! # Now this type is correctly defined
  }
  # Represents a detailed content module for the data table and organize page
  type ContentModule {
    id: ID!
    title: String!
    description: String
    status: String! # "Published" or "Draft"
    creationDate: String! # ISO Date
    engagementRate: Float!
    category: [String!]!
    author: User
    enrolledUsers: Int!
    order: Int!
  }

  # Represents the aggregate stats for the content page
  type ContentStats {
    totalContent: Int!
    publishedCount: Int!
    averageEngagement: Float!
  }

  # Input type for creating a new content module
  input CreateContentInput {
    title: String!
  }
  
  # Input type for updating the order of modules
  input UpdateOrderInput {
    id: ID!
    order: Int!
  }

  type UserManagementStats {
    totalUsers: Int!
    activeUsers: Int!
    pendingUsers: Int!
    averagePerformance: Float!
  }

  type InstitutionUser {
    userId: ID!
    name: String!
    email: String!
    profileImage: String
    registrationDate: String!
    status: String! # e.g., 'active', 'pending'
    averagePerformance: Float!
    businessName: String
    tin: String
  }

  type SubInstitution {
    id: ID!
    name: String!
    owner: User!
    memberCount: Int!
    createdAt: String!
    subscriptionStatus: String!
    portalKey: String! 
  }
  
  type UserManagementPageData {
    stats: UserManagementStats!
    users: [InstitutionUser!]!
  }
  
  type UserModulePerformance { # Renamed from UserModuleProgress for clarity
    contentId: ID!
    title: String!
    performanceScore: Float!
    status: String! # e.g., 'mastered', 'good'
    timeSpentSeconds: Int!
  }
  
  type UserDetail {
    userId: ID!
    name: String!
    email: String!
    profileImage: String
    registrationDate: String!
    status: String!
    businessName: String
    tin: String
    phone: String
    address: String
    overallAveragePerformance: Float!
    totalModulesCount: Int!
    completedModulesCount: Int!
    totalTimeSpentSeconds: Int!
    modulePerformance: [UserModulePerformance!]! # Updated name
    activityTimeline: [ActivityItem!]!
  }
  
  input UpdateUserStatusInput {
    userId: ID!
    status: String! # "active" or "revoked"
  }

  # Stats for the overview cards at the top of the analytics page.
  type AnalyticsOverviewStats {
    averageEngagement: Float!
    averageCompletionRate: Float!
    activeLearners: Int!
    averageStudyTimeHours: Float!
  }

  # Detailed performance metrics for a single content module.
  type ContentPerformanceMetric {
    contentId: ID!
    title: String!
    completionRate: Float!
    avgTimeSpentHours: Float!
    enrolledUsers: Int!
    avgScore: Float!
  }

  # A segment of users grouped by performance level.
  type UserPerformanceSegment {
    category: String! # e.g., "High Performers"
    count: Int!
    percentage: Float!
  }
  
  # The single, comprehensive data payload for the entire analytics page.
  type AnalyticsPageData {
    overviewStats: AnalyticsOverviewStats!
    contentAnalytics: [ContentPerformanceMetric!]!
    userAnalytics: [UserPerformanceSegment!]!
  }

  type BrandingSettings {
    logoUrl: String
    primaryColor: String
    secondaryColor: String
  }
  
  # Represents all editable settings for an institution
  type SettingsData {
    name: String!
    description: String
    website: String
    contactEmail: String
    contactPhone: String
    address: String
    branding: BrandingSettings!
  }
  
  # Input type for updating the general and branding settings
  input UpdateSettingsInput {
    name: String
    description: String
    website: String
    contactEmail: String
    contactPhone: String
    address: String
    primaryColor: String
    secondaryColor: String
    # logoUrl will be handled by a separate mutation for file uploads
  }
  
  # Input type for changing the user's password
  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }
  
  type InvitationStats {
    totalInvites: Int!
    pendingCount: Int!
    acceptedCount: Int!
    expiredCount: Int!
    pendingPercentage: Float!
    acceptedPercentage: Float!
  }

  type InvitationPageData {
    stats: InvitationStats!
    invitations: [InvitationDetails!]!
  }

  input UpdateUserStatusInput {
    userId: ID!
    # ✨ DOCS UPDATE: Now accepts more statuses
    status: String! # e.g., "active", "revoked", "finished"
  }

  # Input for creating a new sub-institution
  input CreateSubInstitutionInput {
    name: String!
    ownerEmail: String!
    portalKey: String! # A unique identifier for the sub-institution's portal
  }

  input UpdateSubInstitutionInput {
    institutionId: ID!
    name: String!
  }

  # Input for updating a sub-institution's status
  input UpdateSubInstitutionStatusInput {
    institutionId: ID!
    status: String! # e.g., 'active', 'trialing', 'past_due', 'canceled'
  }


  type Query {
    me: User
    myInstitution: Institution
    getDashboardStats: DashboardStats!
    getRecentActivity(limit: Int): [ActivityItem!]!
    getContentModules: [ContentModule!]!
    getContentStats: ContentStats!
    getUserManagementData: UserManagementPageData!
    getUserDetail(userId: ID!): UserDetail!
    getAnalyticsData: AnalyticsPageData!
    getSettingsData: SettingsData!
    getInvitationDetails: [InvitationDetails!]!
    getInvitationPageData: InvitationPageData!
    getSubInstitutions: [SubInstitution!]!
  }

  # Defines all the mutations (write operations) available
  type Mutation {
    # Example mutation: update the logged-in user's profile
    createContentModule(input: CreateContentInput!): ContentModule!
    updateContentOrder(orderedIds: [ID!]!): Boolean!
    deleteContentModules(ids: [ID!]!): Boolean!
    updateContentStatus(ids: [ID!]!, isDraft: Boolean!): Boolean!
    updateUserStatus(input: UpdateUserStatusInput!): InstitutionUser!
    updateSettings(input: UpdateSettingsInput!): SettingsData!
    changePassword(input: ChangePasswordInput!): Boolean!
    revokeInvitation(invitationId: ID!): Boolean!
    createSubInstitution(input: CreateSubInstitutionInput!): SubInstitution!
    updateSubInstitutionStatus(input: UpdateSubInstitutionStatusInput!): SubInstitution!
    updateSubInstitution(input: UpdateSubInstitutionInput!): SubInstitution!
    deleteSubInstitution(institutionId: ID!): Boolean!
  }
`;
