import { NextResponse } from "next/server";
import { Resend } from "resend";

// Your email to receive notifications
const NOTIFY_EMAIL = "divikstudy100@gmail.com";

// In-memory counter
let signupCount = 0;

// Send notification email
async function sendNotificationEmail(email) {
    const apiKey = process.env.RESEND_API_KEY;

    console.log("🔑 RESEND_API_KEY exists:", !!apiKey);
    console.log("🔑 Key starts with:", apiKey ? apiKey.substring(0, 10) : "N/A");

    if (!apiKey) {
        console.log("❌ No RESEND_API_KEY found");
        return { success: false, error: "No API key" };
    }

    try {
        const resend = new Resend(apiKey);

        const result = await resend.emails.send({
            from: "Drift <noreply@dvkk.dev>",
            to: NOTIFY_EMAIL,
            subject: "🎉 New Drift Waitlist Signup",
            html: `
        <div style="font-family: monospace; max-width: 500px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #fafafa;">
          <div style="border: 3px solid #c9ff00; padding: 20px;">
            <h2 style="color: #c9ff00; margin: 0 0 20px 0;">NEW SIGNUP 🎉</h2>
            <p style="margin: 0; color: #888; font-size: 12px;">EMAIL</p>
            <p style="margin: 8px 0 0 0; color: #fafafa; font-size: 18px;">${email}</p>
          </div>
        </div>
      `,
        });

        console.log("✅ Email sent successfully:", result);
        return { success: true, result };
    } catch (error) {
        console.error("❌ Email send error:", error);
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

        // Send notification email and wait for result
        const emailResult = await sendNotificationEmail(normalizedEmail);

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
