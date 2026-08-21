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
        { "q": "Hur lång är varje kurs?", "a": "Våra kurser är 12 veckor långa med 1 lektion i veckan på 1 timme." },
        { "q": "Har ni drop-in?", "a": "Nej, vi har inga drop-in-klasser just nu." }
    ],
    "Priser och rabatter": [
        { "q": "Vad kostar kurserna?", "a": "1 kurs = 1600 kr, 2 kurser = 2800 kr, 3 kurser = 4000 kr, 4 kurser = 5200 kr och 5 kurser = 6400 kr. Se vår prislista för detaljer." },
        { "q": "Erbjuder ni rabatter?", "a": "Ja! Vi har studentrabatt (10%), parrabatt (15%) och rabatt för dig som går varannan vecka (35%). Rabatter kan ej kombineras." },
        { "q": "Hur får jag halvkursrabatt?", "a": "Mejla info@fuegodanceschool.se, skriv vilken kurs du vill gå och att du vill gå en halvkurs. Då får du en rabattkod som du lägger in när du anmäler dig." },
        {"q": "Hur fungerar parrabatten?", "a": "För att få parrabatten måste ni anmäla er tillsammans i samma kurs. Ni kan inte anmäla er i olika kurser. Kontakta oss för mer information." }
    ],
    "Anmälan": [
        { "q": "Hur anmäler jag mig?", "a": "Du kan anmäla dig via vår 'Kurs'-sida (klicka på 'Boka nu') eller via sidan 'Våra Kurser'." }
    ]
};

const faqString = JSON.stringify(faqData, null, 2);

const systemPrompt = `Du är en hjälpsam och entusiastisk assistent för Fuego Dance School. 
Svara kortfattat och trevligt på svenska.

VIKTIG INFORMATION OM KURSER:
- Standardlängden för en kurs är 12 veckor.
- Varje lektion är 1 timme lång.
- Vi har inga drop-in-klasser just nu.
- Notera att kurslängden kan variera under vilken period det är, så be användaren kolla schemat för exakta detaljer.

ANVÄND DENNA FAQ FÖR SVAR:
${faqString}

INSTRUKTIONER:
- Om användaren frågar om kurslängd, nämna att standarden är 12 veckor (1 timme/lektion) men att det kan variera.
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
