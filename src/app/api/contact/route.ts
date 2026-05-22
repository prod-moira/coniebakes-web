import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, inquiryType, message, feedbackConsent } = body;
    const consentLabel = inquiryType === 'Feedback' ? (feedbackConsent ? 'Yes' : 'No') : 'N/A';

const emailContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
  
  <div style="background: #8B1A1A; padding: 24px; text-align: center;">
    <h1 style="color: #F5F0E8; margin: 0; font-size: 24px; font-family:Times New Roman, serif;">Conie Bakes</h1>
    <p style="color: #C9A84C; margin: 4px 0 0;">New ${inquiryType}</p>
  </div>

  <div style="padding: 24px;">

    <h2 style="color: #8B1A1A; border-bottom: 1px solid #eee; padding-bottom: 8px;">Sender Details</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 6px 0; color: #666; width: 120px;"><strong>Name</strong></td><td>${name}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;"><strong>Email</strong></td><td>${email}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;"><strong>Phone</strong></td><td>${phone || 'Not provided'}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;"><strong>Feedback consent</strong></td><td>${consentLabel}</td></tr>
    </table>

    <h2 style="color: #8B1A1A; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 24px;">Message</h2>
    <p style="color: #444; background: #f9f9f9; padding: 12px; border-radius: 4px; margin: 0; white-space: pre-wrap;">${message}</p>

  </div>

  <div style="background: #f5f0e8; padding: 16px; text-align: center; font-size: 13px; color: #666;">
    Sent via <a href="https://coniebakes.vercel.app/contact" style="color: #8B1A1A;">coniebakes.vercel.app/contact</a>
  </div>

</div>
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
      to: process.env.RESEND_TO_EMAIL ?? 'moirachelseyburbos@gmail.com',
      subject: `New ${inquiryType} from ${name} ✉️`,
      html: emailContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Error sending contact email via Resend:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error sending inquiry email' }, { status: 500 });
  }
}
