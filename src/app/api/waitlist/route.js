import { NextResponse } from "next/server";
import { Resend } from "resend";

// Your email to receive notifications
const NOTIFY_EMAIL = "divikstudy100@gmail.com";

// In-memory counter (resets on cold start, but that's fine for a waitlist)
let signupCount = 0;

// Send notification email
async function sendNotificationEmail(email, position) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.log("📧 Resend not configured. New signup:", email);
        return false;
    }

    const resend = new Resend(apiKey);

    try {
        await resend.emails.send({
            from: "Drift <noreply@send.dvkk.dev>",
            to: NOTIFY_EMAIL,
            subject: `🎉 New Drift Waitlist Signup`,
            html: `
        <div style="font-family: 'Space Mono', monospace; max-width: 500px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #fafafa;">
          <div style="border: 3px solid #c9ff00; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #c9ff00; margin: 0 0 20px 0; font-size: 24px;">NEW SIGNUP 🎉</h2>
            <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase;">Email</p>
            <p style="margin: 8px 0 0 0; color: #fafafa; font-size: 18px; font-weight: 600;">${email}</p>
          </div>
          <p style="color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">
            Sent from Drift Waitlist
          </p>
        </div>
      `,
        });
        console.log("✅ Notification email sent for:", email);
        return true;
    } catch (error) {
        console.error("❌ Failed to send email:", error);
        return false;
    }
}

// GET - Return success (count is just for display)
export async function GET() {
    return NextResponse.json({
        success: true,
        count: signupCount,
    });
}

// POST - Add email to waitlist
export async function POST(request) {
    try {
        const { email } = await request.json();

        // Validate email
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { success: false, error: "Invalid email address" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();
        signupCount++;

        console.log(`✅ New waitlist signup: ${normalizedEmail}`);

        // Send notification email
        sendNotificationEmail(normalizedEmail, signupCount);

        return NextResponse.json({
            success: true,
            message: "Successfully joined the waitlist!",
            count: signupCount,
        });
    } catch (error) {
        console.error("Waitlist error:", error);
        return NextResponse.json(
            { success: false, error: "Something went wrong" },
            { status: 500 }
        );
    }
}
