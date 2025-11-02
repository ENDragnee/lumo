import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import { sendEmail } from '@/lib/email-server';
import Invitation from '@/models/Invitation';
import InstitutionMember from '@/models/InstitutionMember';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';
import { encrypt } from '@/lib/crypto-utils';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user ||
      !session.institution?.id ||
      !['owner', 'admin'].includes(session.institution.role)
    ) {
      return new NextResponse('Unauthorized: Access is denied.', { status: 401 });
    }

    await connectDB();
    const { emails, role }: { emails: string[], role: 'admin' | 'member' } = await req.json();

    if (role === 'admin' && session.institution.role !== 'owner') {
      return new NextResponse('Forbidden: Only the institution owner can invite new admins.', { status: 403 });
    }

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return new NextResponse('Emails are required', { status: 400 });
    }

    const results = [];
    for (const email of emails) {
      // 1. Perform pre-checks without any database writes
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const isMember = await InstitutionMember.findOne({
          userId: existingUser._id,
          institutionId: session.institution.id,
        });
        if (isMember) {
          results.push({ email, status: 'error', message: 'User is already a member.' });
          continue;
        }
      }
      
      const existingInvite = await Invitation.findOne({ email, institutionId: session.institution.id, status: 'pending' });
      if (existingInvite) {
        results.push({ email, status: 'pending', message: 'An invitation is already pending for this email.' });
        continue;
      }

      // ✨ --- LOGIC CHANGE: EMAIL FIRST, SAVE LATER --- ✨
      
      // 2. Create invitation object in memory (don't save yet)
      const newInvite = new Invitation({
        institutionId: session.institution.id,
        email,
        sentBy: session.user.id,
        role,
      });

      // 3. Encrypt the raw token for the URL
      const encryptedToken = encrypt(newInvite.token);
      const invitationLink = `https://easy-learning-two.vercel.app/institution/${newInvite.institutionId}?token=${encryptedToken}`;
      
      // 4. Craft the beautiful email
      const emailHtml = `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>You're Invited to Join ${session.institution.name} on Lumo</h2>
          <p>Hello,</p>
          <p>
            You have been personally invited by the team at <strong>${session.institution.name}</strong> to join them on <strong>Lumo</strong>,
            a modern, centralized learning platform designed to enhance your skills and knowledge.
          </p>
          <p>To accept your invitation and create your account, please click the button below:</p>
          <a href="${invitationLink}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Accept Invitation
          </a>
          <p style="font-size: 12px; color: #666;">
            If you did not expect this invitation, you can safely ignore this email. This link will expire in 7 days.
          </p>
        </div>
      `;

      // 5. Try to send the email. Only save to DB on success.
      try {
        await sendEmail({
          to: email,
          subject: `Your Invitation to Join ${session.institution.name} on Lumo`,
          html: emailHtml,
        });

        // SUCCESS: Email sent, now save the invitation to the database
        await newInvite.save();
        results.push({ email, status: 'success', message: 'Invitation sent successfully.' });

      } catch (emailError) {
        console.error(`Failed to send email to ${email}:`, emailError);
        // FAILURE: Do not save to DB. Report the failure.
        results.push({ email, status: 'error', message: 'Failed to send email.' });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('[INVITATION_SEND_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
