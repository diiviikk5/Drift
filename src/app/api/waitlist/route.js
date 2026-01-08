import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Resend } from "resend";

// Path to store waitlist data
const WAITLIST_FILE = path.join(process.cwd(), "waitlist.json");

// Your email to receive notifications
const NOTIFY_EMAIL = "divikstudy100@gmail.com";

// Helper to read waitlist
function getWaitlist() {
    try {
        if (fs.existsSync(WAITLIST_FILE)) {
            const data = fs.readFileSync(WAITLIST_FILE, "utf-8");
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Error reading waitlist:", error);
    }
    return [];
}

// Helper to save waitlist
function saveWaitlist(waitlist) {
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify(waitlist, null, 2));
}

// Send notification email
async function sendNotificationEmail(email, position) {
    const apiKey = process.env.RESEND_API_KEY;

    console.log("🔑 RESEND_API_KEY exists:", !!apiKey);

    if (!apiKey) {
        console.log("📧 Resend not configured. New signup:", email);
        console.log("   Add RESEND_API_KEY to your .env.local file");
        return;
    }

    const resend = new Resend(apiKey);

    try {
        await resend.emails.send({
            from: "Drift <hello@dvkk.dev>",
            to: NOTIFY_EMAIL,
            subject: `🎉 New Drift Waitlist Signup #${position}`,
            html: `
        <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #6366f1; margin-bottom: 20px;">New Waitlist Signup!</h2>
          <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">Email</p>
            <p style="margin: 8px 0 0 0; color: #0f172a; font-size: 18px; font-weight: 600;">${email}</p>
          </div>
          <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">Position</p>
            <p style="margin: 8px 0 0 0; color: #6366f1; font-size: 24px; font-weight: 700;">#${position}</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
            Sent from Drift Waitlist
          </p>
        </div>
      `,
        });
        console.log("✅ Notification email sent for:", email);
    } catch (error) {
        console.error("❌ Failed to send email:", error);
    }
}

// GET - Retrieve waitlist count (public) and all entries (for you)
export async function GET(request) {
    const waitlist = getWaitlist();

    // Check if requesting full list (add ?full=true for admin access)
    const { searchParams } = new URL(request.url);
    const showFull = searchParams.get("full") === "true";

    if (showFull) {
        return NextResponse.json({
            success: true,
            count: waitlist.length,
            emails: waitlist,
        });
    }

    // Public endpoint just returns count
    return NextResponse.json({
        success: true,
        count: waitlist.length,
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
        const waitlist = getWaitlist();

        // Check if already registered
        const existingEntry = waitlist.find((entry) => entry.email === normalizedEmail);
        if (existingEntry) {
            return NextResponse.json({
                success: true,
                message: "You're already on the waitlist!",
                alreadyRegistered: true,
                count: waitlist.length,
            });
        }

        // Add new entry
        const position = waitlist.length + 1;
        const newEntry = {
            email: normalizedEmail,
            registeredAt: new Date().toISOString(),
            position: position,
        };
        waitlist.push(newEntry);
        saveWaitlist(waitlist);

        console.log(`✅ New waitlist signup: ${normalizedEmail} (Total: ${waitlist.length})`);

        // Send notification email (async, don't wait)
        sendNotificationEmail(normalizedEmail, position);

        return NextResponse.json({
            success: true,
            message: "Successfully joined the waitlist!",
            position: position,
            count: waitlist.length,
        });
    } catch (error) {
        console.error("Waitlist error:", error);
        return NextResponse.json(
            { success: false, error: "Something went wrong" },
            { status: 500 }
        );
    }
}
