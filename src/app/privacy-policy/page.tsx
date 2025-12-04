import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Integritetspolicy & Cookies | Fuego Dance School',
    description: 'Information om hur Fuego Dance School hanterar dina personuppgifter och cookies.',
};

export default function PrivacyPolicy() {
    return (
        <section className="bg-[#121212] text-gray-300 py-20 px-4 min-h-screen">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Rubrik */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Integritetspolicy & Cookies
                    </h1>
                    <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
                </div>

                {/* Innehåll */}
                <div className="space-y-6 leading-relaxed">

                    <section>
                        <h2 className="text-xl text-white font-bold mb-3">1. Om oss</h2>
                        <p>
                            Fuego Dance School värnar om din personliga integritet. Denna policy förklarar hur vi samlar in och använder cookies och data för att förbättra din upplevelse på vår hemsida.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl text-white font-bold mb-3">2. Vad är cookies?</h2>
                        <p>
                            En cookie (kaka) är en liten textfil som webbplatsen du besöker begär att få spara på din dator, surfplatta eller mobiltelefon. Cookies används för att ge dig som besökare tillgång till olika funktioner, samt för att vi ska kunna mäta trafiken på sajten.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl text-white font-bold mb-3">3. Hur använder vi cookies?</h2>
                        <p>Vi använder cookies för tre huvudändamål:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>
                                <strong className="text-white">Nödvändiga cookies:</strong> Dessa krävs för att webbplatsen ska fungera tekniskt (t.ex. för att komma ihåg dina val i cookie-bannern).
                            </li>
                            <li>
                                <strong className="text-white">Analys & Prestanda:</strong> Vi använder verktyg som Google Analytics (via Google Tag Manager) för att se hur besökare använder sidan. Detta hjälper oss att förbättra strukturen och innehållet. Informationen är anonymiserad.
                            </li>
                            <li>
                                <strong className="text-white">Marknadsföring:</strong> Dessa cookies används för att kunna visa relevanta annonser för dig på andra plattformar (t.ex. sociala medier) baserat på ditt besök hos oss.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl text-white font-bold mb-3">4. Hantera dina inställningar</h2>
                        <p>
                            Du kan när som helst ändra ditt samtycke. Om du vill återkalla ditt godkännande för analys eller marknadsföring kan du göra det genom att rensa dina cookies i webbläsaren, vilket gör att cookie-bannern visas på nytt vid nästa laddning.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl text-white font-bold mb-3">5. Kontakt</h2>
                        <p>
                            Om du har frågor angående vår hantering av cookies eller personuppgifter är du välkommen att kontakta oss.
                        </p>
                        <p className="mt-2 text-orange-400">
                            Email: info@fuegodanceschool.se<br />
                            Plats: Göteborg, Sverige
                        </p>
                    </section>

                </div>
            </div>
        </section>
    );
}