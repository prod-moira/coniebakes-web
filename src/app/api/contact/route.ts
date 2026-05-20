import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, inquiryType, message } = body;

    const emailContent = `
New ${inquiryType} from ${name}

Contact: ${email} | ${phone || ''}

Message:
${message}
    `;

    console.log('📬 [EMAIL SYSTEM] Simulated Inquiry Email to Owner:');
    console.log('==================================================');
    console.log(emailContent);
    console.log('==================================================');

    const apiKey = process.env.RESEND_API_KEY;
    const isMockKey = !apiKey || apiKey.trim() === '' || apiKey.includes('MockKeyForTesting');

    if (isMockKey) {
      console.warn('⚠️ Using Mock Resend API Key. Inquiry email logged to terminal but not sent.');
      return NextResponse.json({ success: true, message: 'Simulated inquiry email sent successfully (Mock Mode).' });
    }

    // Initialize Resend
    const resend = new Resend(apiKey);

    // Send transaction email to owner
    const data = await resend.emails.send({
      from: 'Conie Bakes Inquiries <onboarding@resend.dev>',
      to: 'coniebakes@gmail.com', // Replace with owner's email in production
      subject: `New ${inquiryType} from ${name} ✉️`,
      text: emailContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Error sending contact email via Resend:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error sending inquiry email' }, { status: 500 });
  }
}
