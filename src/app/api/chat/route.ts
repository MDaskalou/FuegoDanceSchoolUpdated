// src/app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

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
        { "q": "Hur lång är varje kurs?", "a": "Som standard är våra kurser 12 veckor långa, men längden kan variera beroende på specifik kurs. Varje lektion är 1 timme lång." },
        { "q": "Har ni drop-in?", "a": "Nej, men första lektionen är alltid gratis så att du kan prova på innan du bestämmer dig." }
    ],
    "Priser och rabatter": [
        { "q": "Vad kostar kurserna?", "a": "1 kurs = 1600 kr, 2 kurser = 2600 kr, 3 kurser = 3600 kr. Se vår prislista för detaljer." },
        { "q": "Erbjuder ni rabatter?", "a": "Ja! Vi har studentrabatt (10%), parrabatt (15%) och rabatt för dig som går varannan vecka (35%). Rabatter kan ej kombineras." },
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
- Notera att kurslängden kan variera under vilken period det är, så be användaren kolla schemat för exakta detaljer.

ANVÄND DENNA FAQ FÖR SVAR:
${faqString}

INSTRUKTIONER:
- Om användaren frågar om kurslängd, nämna att standarden är 12 veckor (1 timme/lektion) men att det kan variera.
- Om information saknas, be dem kontakta info@fuegodanceschool.se.`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const messages = body.messages || [];

        if (messages.length === 0) {
            return new Response(JSON.stringify({ error: 'No messages' }), { status: 400 });
        }

        const result = await streamText({
            model: google('gemini-2.0-flash'),
            system: systemPrompt,
            messages: messages,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error('[/api/chat] Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}