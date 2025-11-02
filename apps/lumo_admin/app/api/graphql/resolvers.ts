// /app/api/graphql/resolvers.ts

import { Types } from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Institution from '@/models/Institution';
import { GraphQLError } from 'graphql';
import { subDays } from 'date-fns';
import { getServerSession, Session } from 'next-auth';
import InstitutionMember from '@/models/InstitutionMember';
import Content from '@/models/Content';
import Performance from '@/models/Performance';
import Interaction from '@/models/Interaction';
import Invitation from '@/models/Invitation';
import { hashPassword, verifyPassword } from '@/lib/password-utils'; // You'll need these utils

interface ContextValue {
  session?: Session | null;
}

const getInstitutionIdFromContext = (context: ContextValue): Types.ObjectId => {
  const institutionId = context.session?.institution?.id;
  if (!institutionId) {
    throw new GraphQLError('Institution not found in session. Please log in again.', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return new Types.ObjectId(institutionId);
};
export const resolvers = {
  Query: {
    // Resolver for the "me" query
    me: async (_: any, __: any, context: ContextValue) => {
      // 1. Check for authentication from the context.
      // TypeScript now correctly infers the type of `context.session.user.id`.
      if (!context.session?.user?.id) {
        throw new GraphQLError('Authentication required. Please log in.', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // 2. Fetch data from the database
      await connectDB();
      // The `user.id` is a string, which is valid for the ObjectId constructor.
      // The deprecation warning is a false positive in this context.
      const userId = new Types.ObjectId(context.session.user.id);
      const user = await User.findById(userId).lean();

      if (!user) {
        throw new GraphQLError('User not found.', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return user;
    },

    // Resolver for the "myInstitution" query
    myInstitution: async (_: any, __: any, context: ContextValue) => {
      // 1. Check for authentication
      if (!context.session?.user?.id) {
        throw new GraphQLError('Authentication required. Please log in.', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // 2. Fetch data
      await connectDB();
      const userId = new Types.ObjectId(context.session.user.id);

      // Find the institution where the current user is an admin or owner
      const institution = await Institution.findOne({
        $or: [{ owner: userId }, { admins: userId }]
      })
      .populate('owner') // Replace the 'owner' ObjectId with the full User document
      .populate('admins') // Replace the 'admins' ObjectIds with full User documents
      .populate('members') // Replace the 'members' ObjectIds with full User documents
      .lean();

      if (!institution) {
          throw new GraphQLError('Institution not found or you do not have access.', {
              extensions: { code: 'FORBIDDEN' },
          });
      }
      return institution;
    },
    getDashboardStats: async (_: any, __: any, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);

      // --- 1. Fetch Total Enrolled Users ---
      // Users are considered "enrolled" if their membership status is 'active'.
      const totalEnrolledUsers = await InstitutionMember.countDocuments({
        institutionId: institutionId,
        status: 'active',
      });
      
      // (For "change" value, you'd need to compare with a previous period, e.g., last month)
      // For now, we'll use a placeholder for change.
      const enrolledUsersStat = { value: totalEnrolledUsers.toString(), change: 12 };

      // --- 2. Fetch Pending Registrations ---
      // Users are "pending" if their membership status is 'pending'.
      const pendingRegistrations = await InstitutionMember.countDocuments({
        institutionId: institutionId,
        status: 'pending',
      });
      const pendingRegistrationsStat = { value: pendingRegistrations.toString(), change: 8 };

      // --- 3. Fetch Published Content Modules ---
      // Content is "published" if it belongs to the institution and is not a draft or in the trash.
      const publishedContentModules = await Content.countDocuments({
        institutionId: institutionId,
        isDraft: false,
        isTrash: false,
      });
      const contentModulesStat = { value: publishedContentModules.toString(), change: 5 };

      // --- 4. Fetch Average User Progress ---
      // This is the most complex one. We'll use an aggregation pipeline on the Performance model.
      const progressAggregation = await Performance.aggregate([
        // Stage 1: Match performance records of users who are members of the institution.
        {
          $lookup: {
            from: 'institutionmembers', // The actual collection name in MongoDB (plural, lowercase)
            localField: 'userId',
            foreignField: 'userId',
            as: 'membership'
          }
        },
        { $unwind: '$membership' },
        { 
          $match: {
            'membership.institutionId': institutionId
          }
        },
        // Stage 2: Group all matching records and calculate the average 'understandingScore'.
        {
          $group: {
            _id: null, // Group all documents into one
            averageScore: { $avg: '$understandingScore' }
          }
        }
      ]);

      // The result is an array, get the first element if it exists.
      const avgProgress = progressAggregation.length > 0 ? progressAggregation[0].averageScore : 0;
      const averageUserProgressStat = {
        value: `${Math.round(avgProgress)}%`,
        change: 3
      };

      // --- 5. Assemble the final response object ---
      return {
        totalEnrolledUsers: enrolledUsersStat,
        pendingRegistrations: pendingRegistrationsStat,
        publishedContentModules: contentModulesStat,
        averageUserProgress: averageUserProgressStat,
      };
    },

    getRecentActivity: async (_: any, { limit = 5 }: { limit?: number }, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);

      // 1. Find all user IDs that belong to the current institution.
      const members = await InstitutionMember.find({ institutionId }).select('userId').lean();
      const memberUserIds = members.map(member => member.userId);

      if (memberUserIds.length === 0) {
        return []; // No members, so no activity
      }

      // 2. Find the most recent interactions from those users.
      const recentInteractions = await Interaction.find({
        userId: { $in: memberUserIds }
      })
      .sort({ timestamp: -1 }) // Get the most recent first
      .limit(limit) // Limit the number of results
      .populate({ path: 'userId', model: User, select: 'name email profileImage' })
      .populate({ path: 'contentId', model: Content, select: 'title' })
      .lean();

      // 3. Map the raw interaction data to the `ActivityItem` shape for the GraphQL response.
      return recentInteractions.map(interaction => {
        // Ensure populated fields exist to prevent errors
        if (!interaction.userId || !interaction.contentId) {
          return null;
        }

        return {
          id: interaction._id,
          eventType: interaction.eventType,
          timestamp: (interaction.timestamp as Date).toISOString(),
          user: interaction.userId,
          content: interaction.contentId,
        };
      }).filter(Boolean); // Filter out any null entries from failed populations
    },
    
    getContentStats: async (_: any, __: any, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);

      const totalContent = await Content.countDocuments({ institutionId, isTrash: false });
      const publishedCount = await Content.countDocuments({ institutionId, isTrash: false, isDraft: false });

      const engagementAgg = await Performance.aggregate([
        {
          $lookup: {
            from: 'contents', localField: 'contentId', foreignField: '_id', as: 'contentDoc'
          }
        },
        { $unwind: '$contentDoc' },
        { $match: { 'contentDoc.institutionId': institutionId } },
        {
          $group: {
            _id: null,
            averageEngagement: { $avg: '$understandingScore' }
          }
        }
      ]);
      const averageEngagement = engagementAgg[0]?.averageEngagement || 0;

      return {
        totalContent,
        publishedCount,
        averageEngagement: parseFloat(averageEngagement.toFixed(2)),
      };
    },

    getContentModules: async (_: any, __: any, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);
      
      const totalMembers = await InstitutionMember.countDocuments({ institutionId, status: 'active' });

      const modules = await Content.find({ institutionId, isTrash: false })
        .sort({ order: 'asc' })
        .populate('createdBy', 'name')
        .lean();

      return modules.map(module => {
        const completions = module.userEngagement?.completions || 0;
        const engagementRate = totalMembers > 0 ? (completions / totalMembers) * 100 : 0;

        return {
          id: module._id,
          title: module.title,
          description: module.description || '',
          status: module.isDraft ? "Draft" : "Published",
          creationDate: (module.createdAt as Date).toISOString(),
          engagementRate: parseFloat(engagementRate.toFixed(2)),
          category: module.tags,
          author: module.createdBy,
          enrolledUsers: completions, // Simplified to users who completed
          order: module.order,
        };
      });
    },
    getUserManagementData: async (_: any, __: any, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);

      // --- 1. Fetch User Stats ---
      const totalUsers = await InstitutionMember.countDocuments({ institutionId });
      const activeUsers = await InstitutionMember.countDocuments({ institutionId, status: 'active' });
      const pendingUsers = await InstitutionMember.countDocuments({ institutionId, status: 'pending' });

      // --- 2. Fetch Average Performance for ALL active users ---
      const performanceAgg = await InstitutionMember.aggregate([
        { $match: { institutionId, status: 'active' } },
        {
          $lookup: {
            from: 'performances', localField: 'userId', foreignField: 'userId', as: 'performanceRecords'
          }
        },
        { $unwind: { path: '$performanceRecords', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: null,
            avgPerformance: { $avg: '$performanceRecords.understandingScore' }
          }
        }
      ]);
      const averagePerformance = performanceAgg[0]?.avgPerformance || 0;
      
      const stats = { totalUsers, activeUsers, pendingUsers, averagePerformance };

      // --- 3. Fetch Detailed User List with individual performance ---
      const usersData = await InstitutionMember.aggregate([
        { $match: { institutionId } },
        { $sort: { createdAt: -1 } },
        {
          $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userDoc' }
        },
        { $unwind: '$userDoc' },
        {
          $lookup: { from: 'performances', localField: 'userId', foreignField: 'userId', as: 'performanceRecords' }
        },
        {
          $project: {
            userId: '$userDoc._id',
            name: '$userDoc.name',
            email: '$userDoc.email',
            profileImage: '$userDoc.profileImage',
            registrationDate: '$createdAt',
            status: '$status',
            businessName: '$metadata.businessName', // Assuming you store this in metadata
            tin: '$metadata.tin',
            averagePerformance: { $avg: '$performanceRecords.understandingScore' }
          }
        }
      ]);

      const users = usersData.map(u => ({
        ...u,
        averagePerformance: u.averagePerformance || 0,
      }));

      return { stats, users };
    },
    
    getUserDetail: async (_: any, { userId }: { userId: string }, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);
      const userObjectId = new Types.ObjectId(userId);

      // 1. Get user and membership details, ensuring user belongs to the institution
      const member = await InstitutionMember.findOne({ userId: userObjectId, institutionId }).populate('userId').lean();
      if (!member) throw new GraphQLError('User not found in this institution.');

      // The user document is populated within the member object
      const user = member.userId as any;

      // 2. Fetch all necessary data for this user concurrently
      const [performanceRecords, allContentCount, userInteractions] = await Promise.all([
          Performance.find({ userId: userObjectId }).populate('contentId', 'title').lean(),
          Content.countDocuments({ institutionId, isTrash: false }),
          Interaction.find({ userId: userObjectId }).sort({ timestamp: -1 }).limit(10).populate('contentId', 'title').lean()
      ]);
      
      // 3. Calculate aggregate stats
      const totalTimeSpentSeconds = performanceRecords.reduce((acc, p) => acc + p.totalTimeSeconds, 0);
      const completedModulesCount = performanceRecords.filter(p => p.understandingLevel === 'mastered').length;
      const overallAveragePerformance = performanceRecords.length > 0
        ? performanceRecords.reduce((acc, p) => acc + p.understandingScore, 0) / performanceRecords.length
        : 0;
      
      return {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        registrationDate: (member.createdAt as Date).toISOString(),
        status: member.status,
        businessName: member.metadata?.businessName || 'N/A',
        tin: member.metadata?.tin || 'N/A',
        phone: user.phone || 'N/A',
        address: user.address || 'N/A',
        overallAveragePerformance: Math.round(overallAveragePerformance),
        totalModulesCount: allContentCount,
        completedModulesCount,
        totalTimeSpentSeconds,
        modulePerformance: performanceRecords.map(p => ({
          contentId: (p.contentId as any)?._id.toString(),
          title: (p.contentId as any)?.title || 'Deleted Content',
          performanceScore: p.understandingScore,
          status: p.understandingLevel,
          timeSpentSeconds: p.totalTimeSeconds,
        })),
        activityTimeline: userInteractions.map(i => ({
          id: i._id.toString(),
          eventType: i.eventType,
          timestamp: (i.timestamp as Date).toISOString(),
          user: user, // user object is already available
          content: i.contentId,
        })),
      };
    },
    getAnalyticsData: async (_: any, __: any, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);

      // --- 1. Fetch Core Data Concurrently ---
      const [allMembers, allContent, allPerformances, activeLearnerIds] = await Promise.all([
        InstitutionMember.find({ institutionId, status: 'active' }).lean(),
        Content.find({ institutionId, isTrash: false }).lean(),
        Performance.find({}).populate({ path: 'contentId', match: { institutionId } }).lean(),
        Interaction.distinct('userId', { timestamp: { $gte: subDays(new Date(), 30) } })
      ]);
      
      // Filter performances to only those whose content belongs to the institution
      const institutionPerformances = allPerformances.filter(p => p.contentId);
      const totalActiveUsers = allMembers.length;

      // --- 2. Calculate Overview Stats ---
      const totalEngagement = institutionPerformances.length > 0
        ? institutionPerformances.reduce((sum, p) => sum + p.understandingScore, 0) / institutionPerformances.length
        : 0;
      
      const totalTime = institutionPerformances.reduce((sum, p) => sum + p.totalTimeSeconds, 0);
      const avgStudyTimeHours = institutionPerformances.length > 0 ? (totalTime / institutionPerformances.length) / 3600 : 0;
      
      const completedPerformances = institutionPerformances.filter(p => p.understandingLevel === 'mastered').length;
      const avgCompletionRate = institutionPerformances.length > 0 ? (completedPerformances / institutionPerformances.length) * 100 : 0;
      
      const overviewStats = {
        averageEngagement: totalEngagement,
        averageCompletionRate: avgCompletionRate,
        activeLearners: activeLearnerIds.length,
        averageStudyTimeHours: avgStudyTimeHours,
      };

      // --- 3. Calculate Content-Specific Analytics ---
      const contentAnalyticsMap = new Map();
      for (const content of allContent) {
        contentAnalyticsMap.set(content._id.toString(), {
          contentId: content._id.toString(),
          title: content.title,
          performances: [],
        });
      }
      for (const perf of institutionPerformances) {
        const contentId = (perf.contentId as any)._id.toString();
        if (contentAnalyticsMap.has(contentId)) {
          contentAnalyticsMap.get(contentId).performances.push(perf);
        }
      }

      const contentAnalytics = Array.from(contentAnalyticsMap.values()).map(data => {
        const perfCount = data.performances.length;
        const completions = data.performances.filter((p: any) => p.understandingLevel === 'mastered').length;
        const totalScore = data.performances.reduce((sum: number, p: any) => sum + p.understandingScore, 0);
        const totalTime = data.performances.reduce((sum: number, p: any) => sum + p.totalTimeSeconds, 0);

        return {
          contentId: data.contentId,
          title: data.title,
          enrolledUsers: perfCount,
          completionRate: perfCount > 0 ? (completions / perfCount) * 100 : 0,
          avgScore: perfCount > 0 ? totalScore / perfCount : 0,
          avgTimeSpentHours: perfCount > 0 ? (totalTime / perfCount) / 3600 : 0,
        };
      });

      // --- 4. Calculate User Segmentation ---
      const userPerformanceMap = new Map();
      for (const perf of institutionPerformances) {
        const userId = perf.userId.toString();
        if (!userPerformanceMap.has(userId)) userPerformanceMap.set(userId, { scores: [] });
        userPerformanceMap.get(userId).scores.push(perf.understandingScore);
      }
      
      let highPerformers = 0, averagePerformers = 0, strugglingUsers = 0;
      for (const [userId, data] of userPerformanceMap.entries()) {
        const avgScore = data.scores.reduce((a: number, b: number) => a + b, 0) / data.scores.length;
        if (avgScore >= 85) highPerformers++;
        else if (avgScore >= 60) averagePerformers++;
        else strugglingUsers++;
      }
      
      const engagedUserIds = new Set(Array.from(userPerformanceMap.keys()));
      const allMemberIds = new Set(allMembers.map(m => m.userId.toString()));
      const inactiveUsers = allMembers.filter(m => !engagedUserIds.has(m.userId.toString())).length;

      const userAnalytics = [
        { category: "High Performers", count: highPerformers, percentage: totalActiveUsers > 0 ? (highPerformers / totalActiveUsers) * 100 : 0 },
        { category: "Average Progress", count: averagePerformers, percentage: totalActiveUsers > 0 ? (averagePerformers / totalActiveUsers) * 100 : 0 },
        { category: "Struggling Users", count: strugglingUsers, percentage: totalActiveUsers > 0 ? (strugglingUsers / totalActiveUsers) * 100 : 0 },
        { category: "Inactive Users", count: inactiveUsers, percentage: totalActiveUsers > 0 ? (inactiveUsers / totalActiveUsers) * 100 : 0 },
      ];

      return { overviewStats, contentAnalytics, userAnalytics };
    },

    getSettingsData: async (_: any, __: any, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);

      const institution = await Institution.findById(institutionId).lean();
      if (!institution) {
        throw new GraphQLError("Institution not found.");
      }
      
      return {
        name: institution.name,
        description: institution.description,
        website: institution.website,
        contactEmail: institution.contactEmail,
        contactPhone: institution.contactPhone,
        address: institution.address,
        branding: {
          logoUrl: institution.branding.logoUrl,
          primaryColor: institution.branding.primaryColor,
          secondaryColor: institution.branding.secondaryColor,
        },
      };
    },
    getInvitationDetails: async (_: any, __: any, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);

      const invitations = await Invitation.find({ institutionId })
        .populate('sentBy', 'name profileImage') // Populate sender's info
        .sort({ createdAt: -1 }) // Show newest first
        .lean();

      return invitations.map(invite => ({
        id: invite._id,
        email: invite.email,
        role: invite.role,
        status: invite.status,
        sentBy: invite.sentBy,
        sentDate: (invite.createdAt as Date).toISOString(),
        expiresAt: (invite.expiresAt as Date).toISOString(),
      }));
    },
    getInvitationPageData: async (_: any, __: any, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);

      // 1. Fetch all invitations for the institution
      const allInvitations = await Invitation.find({ institutionId })
        .populate('sentBy', 'name profileImage')
        .sort({ createdAt: -1 })
        .lean();

      // 2. Calculate Stats
      const totalInvites = allInvitations.length;
      const counts = allInvitations.reduce((acc, invite) => {
          acc[invite.status] = (acc[invite.status] || 0) + 1;
          return acc;
        }, { pending: 0, accepted: 0, expired: 0 } as Record<string, number>);

      const stats = {
        totalInvites,
        pendingCount: counts.pending,
        acceptedCount: counts.accepted,
        expiredCount: counts.expired,
        pendingPercentage: totalInvites > 0 ? (counts.pending / totalInvites) * 100 : 0,
        acceptedPercentage: totalInvites > 0 ? (counts.accepted / totalInvites) * 100 : 0,
      };

      // 3. Map the invitation details (as before)
      const mappedInvitations = allInvitations.map(invite => ({
        id: invite._id,
        email: invite.email,
        role: invite.role,
        status: invite.status,
        sentBy: invite.sentBy,
        sentDate: (invite.createdAt as Date).toISOString(),
        expiresAt: (invite.expiresAt as Date).toISOString(),
      }));

      // 4. Return the complete data package
      return {
        stats,
        invitations: mappedInvitations,
      };
    },
    getSubInstitutions: async (_: any, __: any, context: ContextValue) => {
      await connectDB();
      const parentInstitutionId = getInstitutionIdFromContext(context);

      const subInstitutions = await Institution.find({ parentInstitution: parentInstitutionId })
        .populate('owner', 'name email profileImage')
        .lean();

      // For each sub-institution, we can fetch its member count.
      // This can be optimized, but is fine for a moderate number of sub-institutions.
      const results = await Promise.all(subInstitutions.map(async (inst) => {
        const memberCount = await InstitutionMember.countDocuments({ institutionId: inst._id });
        return {
          id: inst._id,
          name: inst.name,
          owner: inst.owner,
          memberCount,
          createdAt: (inst.createdAt as Date).toISOString(),
          subscriptionStatus: inst.subscriptionStatus,
          portalKey: inst.portalKey,
        };
      }));

      return results;
    },
  },

  Mutation: {
    // Your future mutations will go here. For now, it's empty.
    createContentModule: async (_:any, { input }: { input: { title: string } }, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);
      const userId = new Types.ObjectId(context.session?.user?.id);

      // Find the highest current order number to place the new module at the end
      const highestOrderContent = await Content.findOne({ institutionId }).sort({ order: -1 });
      const newOrder = (highestOrderContent?.order || -1) + 1;

      const newContent = new Content({
        title: input.title,
        institutionId,
        createdBy: userId,
        isDraft: true,
        order: newOrder,
      });

      await newContent.save();
      
      // We need to return the data in the shape of ContentModule
      return {
        id: newContent._id,
        title: newContent.title,
        status: "Draft",
        creationDate: newContent.createdAt.toISOString(),
        engagementRate: 0,
        category: [],
        author: { id: userId, name: context.session?.user?.name || '' },
        enrolledUsers: 0,
        order: newContent.order,
      };
    },

    deleteContentModules: async (_:any, { ids }: { ids: string[] }, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);

      const result = await Content.updateMany(
        { _id: { $in: ids }, institutionId }, // Security check
        { $set: { isTrash: true } }
      );
      
      return result.modifiedCount > 0;
    },

    updateContentStatus: async(_:any, {ids, isDraft}: { ids: string[], isDraft: boolean }, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);

      const result = await Content.updateMany(
        { _id: { $in: ids }, institutionId },
        { $set: { isDraft: isDraft} }
      );
      return result.modifiedCount > 0;
    },
    
    updateContentOrder: async (_:any, { orderedIds }: { orderedIds: string[] }, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);
      
      const updates = orderedIds.map((id, index) => 
        Content.updateOne(
          { _id: id, institutionId }, // Security check
          { $set: { order: index } }
        )
      );
      
      await Promise.all(updates);

      return true;
    },
    updateUserStatus: async (_: any, { input }: { input: { userId: string, status: 'active' | 'revoked' } }, context: ContextValue) =>{
        await connectDB();
        const institutionId = getInstitutionIdFromContext(context);
        const userObjectId = new Types.ObjectId(input.userId);

        const updatedMember = await InstitutionMember.findOneAndUpdate(
            { userId: userObjectId, institutionId },
            { $set: { status: input.status } },
            { new: true } // Return the updated document
        ).populate('userId').lean();
        
        if (!updatedMember) {
            throw new GraphQLError("Failed to update user status or user not found.");
        }
        
        // Return data in the shape of InstitutionUser
        const userDoc = updatedMember.userId as any;
        // You would need a sub-query to get average performance here for a perfect return,
        // but for now, we'll return 0 as a placeholder.
        return {
            userId: userDoc._id,
            name: userDoc.name,
            email: userDoc.email,
            profileImage: userDoc.profileImage,
            registrationDate: (updatedMember.createdAt as Date).toISOString(),
            status: updatedMember.status,
            businessName: updatedMember.metadata?.businessName || 'N/A',
            tin: updatedMember.metadata?.tin || 'N/A',
            averagePerformance: 0
        };
    },
    updateSettings: async (_: any, { input }: { input: any }, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);

      // Construct the update object to avoid passing undefined fields
      const updateData: any = {};
      if (input.name) updateData.name = input.name;
      if (input.description) updateData.description = input.description;
      if (input.website) updateData.website = input.website;
      if (input.contactEmail) updateData.contactEmail = input.contactEmail;
      if (input.contactPhone) updateData.contactPhone = input.contactPhone;
      if (input.address) updateData.address = input.address;
      if (input.primaryColor) updateData['branding.primaryColor'] = input.primaryColor;
      if (input.secondaryColor) updateData['branding.secondaryColor'] = input.secondaryColor;

      const updatedInstitution = await Institution.findByIdAndUpdate(
        institutionId,
        { $set: updateData },
        { new: true } // Return the updated document
      ).lean();

      if (!updatedInstitution) {
        throw new GraphQLError("Failed to update settings.");
      }
      
      // Map the result to the SettingsData type
      return {
        name: updatedInstitution.name,
        description: updatedInstitution.description,
        website: updatedInstitution.website,
        contactEmail: updatedInstitution.contactEmail,
        contactPhone: updatedInstitution.contactPhone,
        address: updatedInstitution.address,
        branding: updatedInstitution.branding,
      };
    },

    changePassword: async (_: any, { input }: { input: { currentPassword: string, newPassword: string } }, context: ContextValue) =>{
      await connectDB();
      if (!context.session?.user?.id) {
        throw new GraphQLError("You must be logged in to change your password.");
      }
      
      const userId = new Types.ObjectId(context.session.user.id);
      const user = await User.findById(userId);

      if (!user || !user.password_hash) {
        throw new GraphQLError("User not found or password not set.");
      }
      
      // 1. Verify the current password
      const isPasswordValid = await verifyPassword(input.currentPassword, user.password_hash);
      if (!isPasswordValid) {
        throw new GraphQLError("Incorrect current password.");
      }
      
      // 2. Hash the new password
      const newHashedPassword = await hashPassword(input.newPassword);
      
      // 3. Update the user's password
      user.password_hash = newHashedPassword;
      await user.save();
      
      return true;
    },
    
    revokeInvitation: async (_: any, { invitationId }: { invitationId: string }, context: ContextValue) => {
      await connectDB();
      const institutionId = getInstitutionIdFromContext(context);

      // Security check: ensure the invitation belongs to the admin's institution
      const result = await Invitation.deleteOne({
        _id: new Types.ObjectId(invitationId),
        institutionId: institutionId,
      });

      if (result.deletedCount === 0) {
        throw new GraphQLError('Invitation not found or you do not have permission to revoke it.');
      }
      
      return true;
    },
     createSubInstitution: async (_: any, { input }: { input: any }, context: ContextValue) => {
      await connectDB();
      const parentInstitutionId = getInstitutionIdFromContext(context);
      const sessionUser = context.session?.user;
      
      if (!sessionUser) {
        throw new GraphQLError("Authentication required.", { extensions: { code: 'UNAUTHENTICATED' } });
      }

      // 1. Find the user who will be the owner of the new sub-institution
      const owner = await User.findOne({ email: input.ownerEmail });
      if (!owner) {
        throw new GraphQLError(`User with email ${input.ownerEmail} not found. They must have an account first.`);
      }

      // 2. Check for portalKey uniqueness
      const existingPortalKey = await Institution.findOne({ portalKey: input.portalKey });
      if (existingPortalKey) {
        throw new GraphQLError("Portal Key is already in use. Please choose another one.");
      }

      // 3. Create the new sub-institution
      const newSubInstitution = new Institution({
        name: input.name,
        owner: owner._id,
        portalKey: input.portalKey,
        parentInstitution: parentInstitutionId,
        subscriptionStatus: 'trialing', // Default status
      });
      await newSubInstitution.save();

      // 4. Automatically add the owner as a member
      await new InstitutionMember({
        institutionId: newSubInstitution._id,
        userId: owner._id,
        role: 'owner',
        status: 'active',
      }).save();

      return {
        id: newSubInstitution._id,
        name: newSubInstitution.name,
        owner: owner,
        memberCount: 1, // Starts with one member (the owner)
        createdAt: newSubInstitution.createdAt.toISOString(),
        subscriptionStatus: newSubInstitution.subscriptionStatus,
      };
    },

    updateSubInstitutionStatus: async (_: any, { input }: { input: any }, context: ContextValue) => {
      await connectDB();
      const parentInstitutionId = getInstitutionIdFromContext(context);

      // Security check: ensure the institution being updated is a child of the admin's institution
      const subInstitution = await Institution.findOneAndUpdate(
        { _id: input.institutionId, parentInstitution: parentInstitutionId },
        { $set: { subscriptionStatus: input.status } },
        { new: true }
      ).populate('owner', 'name email profileImage');

      if (!subInstitution) {
        throw new GraphQLError("Sub-institution not found or you do not have permission to modify it.");
      }
      
      const memberCount = await InstitutionMember.countDocuments({ institutionId: subInstitution._id });

      return {
        id: subInstitution._id,
        name: subInstitution.name,
        owner: subInstitution.owner,
        memberCount,
        createdAt: subInstitution.createdAt.toISOString(),
        subscriptionStatus: subInstitution.subscriptionStatus,
      };
    },
    updateSubInstitution: async (_: any, { input }: { input: any }, context: ContextValue) => {
        await connectDB();
        const parentInstitutionId = getInstitutionIdFromContext(context);
        
        // Security check: Only allow updates to sub-institutions of the current parent
        const updatedInstitution = await Institution.findOneAndUpdate(
            { _id: input.institutionId, parentInstitution: parentInstitutionId },
            { $set: { name: input.name } },
            { new: true }
        ).populate('owner', 'name email profileImage');

        if (!updatedInstitution) {
            throw new GraphQLError("Sub-institution not found or you do not have permission to edit it.");
        }

        const memberCount = await InstitutionMember.countDocuments({ institutionId: updatedInstitution._id });

        return {
          id: updatedInstitution._id,
          name: updatedInstitution.name,
          owner: updatedInstitution.owner,
          memberCount,
          createdAt: updatedInstitution.createdAt.toISOString(),
          subscriptionStatus: updatedInstitution.subscriptionStatus,
          portalKey: updatedInstitution.portalKey,
        };
    },
    deleteSubInstitution: async (_: any, { institutionId }: { institutionId: string }, context: ContextValue) => {
      await connectDB();
      const parentInstitutionId = getInstitutionIdFromContext(context);
      const subInstitutionObjectId = new Types.ObjectId(institutionId);

      // 1. Security Check: Verify the institution is a child of the current admin's institution
      const institutionToDelete = await Institution.findOne({
        _id: subInstitutionObjectId,
        parentInstitution: parentInstitutionId,
      });

      if (!institutionToDelete) {
        throw new GraphQLError("Sub-institution not found or you do not have permission to delete it.", {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      // 2. Perform Cascading Deletes (remove all data associated with the sub-institution)
      // This is crucial to prevent orphaned data in your database.
      console.log(`Starting deletion for sub-institution ID: ${institutionId}`);
      
      // Find all user IDs belonging to this sub-institution
      const members = await InstitutionMember.find({ institutionId: subInstitutionObjectId }).select('userId');
      const userIds = members.map(m => m.userId);

      // Delete members, invitations, content, etc.
      await InstitutionMember.deleteMany({ institutionId: subInstitutionObjectId });
      await Invitation.deleteMany({ institutionId: subInstitutionObjectId });
      await Content.deleteMany({ institutionId: subInstitutionObjectId });
      
      // 3. Delete the sub-institution itself
      await Institution.deleteOne({ _id: subInstitutionObjectId });
      
      console.log(`Successfully deleted sub-institution ID: ${institutionId} and its associated data.`);
      
      return true;
    },
  },
};
