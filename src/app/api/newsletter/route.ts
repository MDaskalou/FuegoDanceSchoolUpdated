import { NextResponse } from "next/server";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
    const { email, language = "sv", source = "footer" } = await request.json();

    if (typeof email !== "string" || !emailRegex.test(email)) {
        return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    const webhookUrl = process.env.GOOGLE_SHEETS_NEWSLETTER_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn("GOOGLE_SHEETS_NEWSLETTER_WEBHOOK_URL is not configured");
        return NextResponse.json({ message: "Newsletter is not configured" }, { status: 503 });
    }

    const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.trim().toLowerCase(),
            language,
            source,
            consent: true,
            submittedAt: new Date().toISOString(),
        }),
    });

    if (!response.ok) {
        return NextResponse.json({ message: "Could not save subscription" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
}
