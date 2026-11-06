// src/app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText, type CoreMessage } from 'ai';

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 1000;

type RateLimitEntry = {
    count: number;
    resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

// Uppdaterad FAQ med dina nya standardvärden
const faqData = {
    "Allmänt": [
        { "q": "Vad är Bachata Sensual?", "a": "Bachata Sensual är en modern och uttrycksfull stil av bachata som skapades i Spanien. Den kännetecknas av mjuka, flytande rörelser som kroppsvågor och isoleringar." },
        { "q": "Jag har aldrig dansat förut – passar era kurser för mig?", "a": "Absolut! Våra nybörjarkurser är utformade för dig som aldrig har tagit ett danssteg tidigare." },
        { "q": "Erbjuder ni privatlektioner?", "a": "Ja! Du kan boka privatlektioner. Gå till fliken 'Instruktörer' för att läsa mer och kontakta den instruktör du är intresserad av." }
    ],
    "Praktiskt": [
        { "q": "Behöver jag komma med partner?", "a": "Nej! Du kan komma själv. Vi roterar partners så att alla får dansa med alla." },
        { "q": "Vad ska jag ha på mig?", "a": "Bekväma kläder du kan röra dig fritt i. Sneakers eller dansskor med glid fungerar bra." }
    ],
    "Kurser och tider": [
        { "q": "Hur lång är varje kurs?", "a": "Just nu kör vi en workshop vecka 49 och 50. Varje nivå är 2 veckor, måndag till torsdag kl 18:30–20:30." },
        { "q": "Har ni drop-in?", "a": "Inte på våra kurser, där anmäler du dig till hela perioden. Sunday Social Dance på söndagar kl. 15–18 köps som ett eget tillfälle för 80 kr, och medlemmar får 50 % rabatt." }
    ],
    "Priser och rabatter": [
        { "q": "Vad kostar kurserna?", "a": "Workshopen vecka 49 och 50 kostar 500 kr för 2 veckor. Par betalar 900 kr. Studenter får 10% rabatt." },
        { "q": "Erbjuder ni rabatter?", "a": "Ja! Studentrabatt 10%. Par betalar 900 kr för 2 veckor istället för 500 kr per person. Rabatter kan ej kombineras." },
        { "q": "Hur får jag halvkursrabatt?", "a": "Halvkursrabatten gäller inte workshopen vecka 49 och 50. Den har fast pris: 500 kr för 2 veckor, eller 900 kr för par." },
        {"q": "Hur fungerar parrabatten?", "a": "Par betalar 900 kr för 2 veckor, istället för 500 kr per person." }
    ],
    "Anmälan": [
        { "q": "Hur anmäler jag mig?", "a": "Du kan anmäla dig via vår 'Kurs'-sida (klicka på 'Boka nu') eller via sidan 'Våra Kurser'." }
    ]
};

const faqString = JSON.stringify(faqData, null, 2);

const systemPrompt = `Du är en hjälpsam och entusiastisk assistent för Fuego Dance School. 
Svara kortfattat och trevligt på svenska.

VIKTIG INFORMATION OM KURSER:
- Just nu kör vi en workshop vecka 49 och 50.
- Varje nivå är 2 veckor, måndag till torsdag kl 18:30–20:30.
- Pris: 500 kr för 2 veckor. Par: 900 kr. Studentrabatt: 10%.
- Inte på våra kurser, där anmäler du dig till hela perioden. Sunday Social Dance på söndagar kl. 15–18 köps som ett eget tillfälle för 80 kr, och medlemmar får 50 % rabatt.
- Be användaren kolla schemat för dagar och nivåer.

ANVÄND DENNA FAQ FÖR SVAR:
${faqString}

INSTRUKTIONER:
- Om användaren frågar om kurslängd, nämn workshopen vecka 49 och 50: 2 veckor, kl 18:30–20:30.
- Om information saknas, be dem kontakta info@fuegodanceschool.se.`;

function jsonError(message: string, status: number) {
    return new Response(JSON.stringify({ error: message }), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

function getClientIp(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0]?.trim() || 'unknown';
    }
    return req.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitStore.get(ip);

    if (!entry || now >= entry.resetAt) {
        rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }

    if (entry.count >= RATE_LIMIT_MAX) {
        return true;
    }

    entry.count += 1;
    return false;
}

function parseMessages(raw: unknown): CoreMessage[] | null {
    if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) {
        return null;
    }

    const messages: CoreMessage[] = [];

    for (const item of raw) {
        if (!item || typeof item !== 'object') return null;

        const role = (item as { role?: unknown }).role;
        const content = (item as { content?: unknown }).content;

        if (role !== 'user' && role !== 'assistant') return null;
        if (typeof content !== 'string') return null;
        if (content.length === 0 || content.length > MAX_CONTENT_LENGTH) return null;

        messages.push({ role, content });
    }

    return messages;
}

export async function POST(req: Request) {
    try {
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            return jsonError('Chat is not configured', 503);
        }

        const ip = getClientIp(req);
        if (isRateLimited(ip)) {
            return jsonError('Too many requests. Please try again later.', 429);
        }

        let body: unknown;
        try {
            body = await req.json();
        } catch {
            return jsonError('Invalid JSON body', 400);
        }

        const messages = parseMessages(
            body && typeof body === 'object' ? (body as { messages?: unknown }).messages : undefined
        );

        if (!messages) {
            return jsonError('Invalid messages', 400);
        }

        const result = await streamText({
            model: google('gemini-2.0-flash'),
            system: systemPrompt,
            messages,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error('[/api/chat] Error:', error);
        return jsonError('Internal server error', 500);
    }
}
