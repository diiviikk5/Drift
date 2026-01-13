import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = 'force-dynamic';

// Your email to receive notifications
const NOTIFY_EMAIL = "divikstudy100@gmail.com";

// In-memory counter
let signupCount = 0;

// Send notification email to Admin
async function sendNotificationEmail(userEmail) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return;

    try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
            from: "Drift Admin <admin@dvkk.dev>",
            to: NOTIFY_EMAIL,
            subject: "🎉 New Drift Waitlist Signup",
            html: `
        <div style="font-family: monospace; max-width: 500px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #fafafa;">
          <div style="border: 3px solid #c9ff00; padding: 20px;">
            <h2 style="color: #c9ff00; margin: 0 0 20px 0;">NEW SIGNUP 🎉</h2>
            <p style="margin: 0; color: #888; font-size: 12px;">EMAIL</p>
            <p style="margin: 8px 0 0 0; color: #fafafa; font-size: 18px;">${userEmail}</p>
          </div>
        </div>
      `,
        });
    } catch (error) {
        console.error("❌ Admin notification failed:", error);
    }
}

// Send welcome email to User
async function sendWelcomeEmail(userEmail) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return { success: false, error: "No API key" };

    try {
        const resend = new Resend(apiKey);
        const result = await resend.emails.send({
            from: "Divik from Drift <hello@dvkk.dev>",
            to: userEmail,
            subject: "Thank you for Your interest in Drift! - Divik", // User's custom subject
            html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff; color: #0a0a0a; font-size: 14px;">
          <h1 style="font-size: 24px; font-weight: 800; text-transform: uppercase; margin-bottom: 24px; border-bottom: 4px solid #c9ff00; padding-bottom: 10px; display: inline-block;">
            DRIFT is Now on Your Browser and Desktop (beta)
          </h1>
          
          <p style="font-size: 14px; line-height: 1.6; color: #444; margin-bottom: 16px;">
            I was totally not ready for 1000 visitors, 200 followers and 20 github stars for Drift and totally not for it being #5 product of the day. But here we are.
          </p>

          <p style="font-size: 14px; line-height: 1.6; color: #444; margin-bottom: 16px;">
            I realised i did not make the desktop app for such a scale where people use it daily, But now With the Browser Version you can. Its Out Now and You can Customize your zooms with speed and intensity.
          </p>

          <p style="font-size: 14px; line-height: 1.6; color: #444; margin-bottom: 24px;">
            Thank you for Making Drift something more than a little Side project!
          </p>

          <div style="margin: 32px 0;">
            <a href="https://drift.dvkk.dev/recorder" style="background: #c9ff00; color: #000; text-decoration: none; padding: 12px 24px; font-weight: bold; border: 2px solid #000; display: inline-block; font-family: monospace; text-transform: uppercase;">
              Launch Browser App ->
            </a>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #444; margin-bottom: 16px;">
            Additionally Drift is open source and you can contribute to it <a href="https://github.com/diiviikk5/Drift" style="color: #000; font-weight: bold;">here</a>. I will be releasing the detailed documentation soon!
          </p>

          <p style="font-family: monospace; font-size: 14px; font-weight: bold; margin-bottom: 32px;">
            Happy Recording.
          </p>
          
          <p style="font-size: 14px; color: #888;">
            - Divik
          </p>

           <!-- Placeholder for the image. You need to host the screenshot online and replace this URL to see it in emails. -->
           <!-- <img src="https://your-hosted-image-url.com/drift-highlight.png" style="width: 100%; border: 2px solid #000; margin-top: 20px;" alt="Drift Browser Version" /> -->

          <div style="margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 20px;">
            <a href="https://twitter.com/diiviikk5" style="color: #888; text-decoration: none; font-size: 12px; margin-right: 15px;">Twitter</a>
            <a href="https://github.com/diiviikk5/Drift" style="color: #888; text-decoration: none; font-size: 12px;">GitHub</a>
          </div>
        </div>
      `,
        });
        console.log("✅ Welcome email sent:", result);
        return { success: true, result };
    } catch (error) {
        console.error("❌ Welcome email failed:", error);
        return { success: false, error: error.message };
    }
}

// GET - Return count
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

        console.log(`📝 New signup attempt: ${normalizedEmail}`);

        // 1. Send admin notification (fire and forget)
        sendNotificationEmail(normalizedEmail);

        // 2. Send welcome email to user (wait for result to report status)
        const emailResult = await sendWelcomeEmail(normalizedEmail);

        console.log("📧 Email result:", emailResult);

        return NextResponse.json({
            success: true,
            message: "Successfully joined the waitlist!",
            count: signupCount,
            emailSent: emailResult.success,
        });
    } catch (error) {
        console.error("❌ Waitlist error:", error);
        return NextResponse.json(
            { success: false, error: "Something went wrong" },
            { status: 500 }
        );
    }
}
