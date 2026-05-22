import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      phoneNumber,
      facebookLink,
      email,
      address,
      deliveryDate,
      items,
      total,
      specialInstructions
    } = body;

const emailContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
  
  <div style="background: #8B1A1A; padding: 24px; text-align: center;">
    <h1 style="color: #C9A84C; margin: 0; font-size: 24px;">🎂 Conie Bakes</h1>
    <p style="color: #F5F0E8; margin: 4px 0 0;">New Order Received</p>
  </div>

  <div style="padding: 24px;">

    <h2 style="color: #8B1A1A; border-bottom: 1px solid #eee; padding-bottom: 8px;">Customer Details</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 6px 0; color: #666; width: 120px;"><strong>Name</strong></td><td>${customerName}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;"><strong>Phone</strong></td><td>${phoneNumber}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;"><strong>Facebook</strong></td><td>${facebookLink}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;"><strong>Email</strong></td><td>${email || 'Not provided'}</td></tr>
    </table>

    <h2 style="color: #8B1A1A; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 24px;">Delivery Details</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 6px 0; color: #666; width: 120px;"><strong>Address</strong></td><td>${address}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;"><strong>Date</strong></td><td>${deliveryDate}</td></tr>
    </table>

    <h2 style="color: #8B1A1A; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 24px;">Order Summary</h2>
    <table style="width: 100%; border-collapse: collapse;">
      ${items.map((item: any) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <strong>${item.productName}</strong><br/>
          <span style="color: #666; font-size: 14px;">${item.variantLabel} x${item.quantity}</span>
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: bold;">
          ₱${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>`).join('')}
      <tr>
        <td style="padding: 12px 0;"><strong style="font-size: 16px;">Total</strong></td>
        <td style="padding: 12px 0; text-align: right; color: #8B1A1A; font-size: 18px; font-weight: bold;">₱${total.toLocaleString()}</td>
      </tr>
    </table>

    <h2 style="color: #8B1A1A; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 24px;">Special Instructions</h2>
    <p style="color: #444; background: #f9f9f9; padding: 12px; border-radius: 4px; margin: 0;">${specialInstructions || 'None'}</p>

  </div>

  <div style="background: #f5f0e8; padding: 16px; text-align: center; font-size: 13px; color: #666;">
    Order placed via <a href="https://coniebakes.vercel.app" style="color: #8B1A1A;">coniebakes.vercel.app</a><br/>
    Please contact the customer via Facebook or mobile to confirm.
  </div>

</div>
`;
    console.log('📬 [EMAIL SYSTEM] Simulated Email Notification to Owner:');
    console.log('==================================================');
    console.log(emailContent);
    console.log('==================================================');

    const apiKey = process.env.RESEND_API_KEY;
    const isMockKey = !apiKey || apiKey.trim() === '' || apiKey.includes('MockKeyForTesting');

    if (isMockKey) {
      console.warn('⚠️ Using Mock Resend API Key. Email logged to terminal but not sent.');
      return NextResponse.json({ success: true, message: 'Simulated order email sent successfully (Mock Mode).' });
    }

    // Initialize Resend
    const resend = new Resend(apiKey);

    // Send transaction email to owner
    const data = await resend.emails.send({
      from: 'Conie Bakes <onboarding@resend.dev>',
      to: process.env.RESEND_TO_EMAIL ?? 'moirachelseyburbos@gmail.com',
      subject: `New Order Request from ${customerName} 🎂`,
      html: emailContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Error sending order email via Resend:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error sending email' }, { status: 500 });
  }
}
