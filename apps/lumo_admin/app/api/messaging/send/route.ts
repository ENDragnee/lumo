import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email-server';

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

    const { recipientEmails, subject, message }: {
      recipientEmails: string[];
      subject: string;
      message: string;
    } = await req.json();

    if (!recipientEmails || recipientEmails.length === 0 || !subject || !message) {
      return new NextResponse('Missing required fields: recipients, subject, and message are required.', { status: 400 });
    }

    // You can add more advanced HTML formatting here if desired
    const emailHtml = `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <p>You have received a message from an administrator at <strong>${session.institution.name}</strong>.</p>
        <div style="padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        <p style="font-size: 12px; color: #666;">
          Please do not reply directly to this email. This is a notification-only message.
        </p>
      </div>
    `;

    // Send email to all recipients
    await sendEmail({
      to: recipientEmails.join(', '), // Nodemailer can handle a comma-separated list
      subject: subject,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully.' });

  } catch (error) {
    console.error('[MESSAGING_SEND_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
