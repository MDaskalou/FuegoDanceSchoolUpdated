import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY; // Eller vad din variabel heter

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await response.json();

    return NextResponse.json(data);
}