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
Hi Conie Bakes! 🎂

New order from ${customerName}

Contact: ${phoneNumber} | ${facebookLink} | ${email || 'None'}
Delivery: ${address} on ${deliveryDate}

Order:
${items.map((item: any) => `- ${item.productName} — ${item.variantLabel} x${item.quantity} — ₱${(item.price * item.quantity).toLocaleString()}`).join('\n')}

Total: ₱${total.toLocaleString()}

Notes: ${specialInstructions || 'None'}
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
      to: 'coniebakes@gmail.com', // Replace with owner's email in production
      subject: `New Order Request from ${customerName} 🎂`,
      text: emailContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Error sending order email via Resend:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error sending email' }, { status: 500 });
  }
}
