"use client";

import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";

interface CourselyWidgetProps {
    showHeader?: boolean;
}

const CourselyWidget: React.FC<CourselyWidgetProps> = ({ showHeader = true }) => {
    const { t } = useTranslation("courselyWidgetTranslation");

    useEffect(() => {
        const scriptId = 'coursely-script';
        const containerId = 'container-iframe';
        let timer: ReturnType<typeof setTimeout> | undefined;

        const cleanup = () => {
            if (timer) clearTimeout(timer);

            const scriptToRemove = document.getElementById(scriptId);
            if (scriptToRemove) scriptToRemove.remove();

            const container = document.getElementById(containerId);
            if (container) container.innerHTML = '';
        };

        cleanup();

        timer = setTimeout(() => {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://app.coursely.se/scripts/activityLoader.js";
            script.defer = true;
            document.body.appendChild(script);
        }, 100);

        return cleanup;
    }, []);

    return (
        <section className={`py-8 ${showHeader ? 'sm:py-24' : ''} bg-transparent w-full`}>
            {/* Här lägger vi till Global CSS som "hackar" widgetens utseende.
               Vi tvingar den att använda sidans typsnitt och stylar om knapparna.
            */}
            <style jsx global>{`
                /* Tvinga widgeten att använda sidans typsnitt */
                #container-iframe {
                    font-family: inherit !important;
                }
                
                /* Styla rubriker i widgeten om de finns */
                #container-iframe h1, 
                #container-iframe h2, 
                #container-iframe h3 {
                    color: #ffffff !important;
                    font-weight: 700 !important;
                }

                /* Styla "Boka"-knapparna för att se ut som Fuego-knappar */
                #container-iframe button, 
                #container-iframe .btn, 
                #container-iframe a.button {
                    background-color: #f97316 !important; /* Orange-500 */
                    color: white !important;
                    border-radius: 9999px !important; /* Fullt rundade hörn */
                    border: none !important;
                    padding: 10px 24px !important;
                    font-weight: bold !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.05em !important;
                    transition: all 0.3s ease !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                }

                /* Hover-effekt på knapparna */
                #container-iframe button:hover, 
                #container-iframe .btn:hover, 
                #container-iframe a.button:hover {
                    background-color: #ea580c !important; /* Orange-600 */
                    transform: scale(1.05) !important;
                    box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.4) !important;
                }

                /* Justera input-fält om de finns */
                #container-iframe input, 
                #container-iframe select {
                    background-color: #333 !important;
                    color: white !important;
                    border: 1px solid #555 !important;
                    border-radius: 8px !important;
                    padding: 8px !important;
                }
            `}</style>

            <div className="container mx-auto max-w-6xl px-4">

                {/* Header (valbar) */}
                {showHeader && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl sm:text-5xl font-bold text-orange-500 mb-4 font-serif">
                            {t('widgetTitle', { defaultValue: 'Våra Kurser & Schema' })}
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            {t('widgetDescription', {
                                defaultValue:
                                    'Boka din plats i våra kommande kurser. Välj den nivå som passar dig bäst.'
                            })}
                        </p>
                    </div>
                )}

                <div
                    id="container-iframe"
                    className="bg-transparent rounded-2xl w-full min-h-[600px]"
                    data-client-id="FuegoDance"
                    data-filter=""
                    data-view-mode="grid"
                    data-city-name=""
                    data-dance=""
                    data-group="type"
                    data-group-sorting="startdate"
                    data-activity-type="Course"
                    data-hide-filter="true"
                    data-period=""
                    data-show-sub-events="false"
                    data-show-parent-event="true"

                    suppressHydrationWarning={true}

                    // --- STYLING KONFIGURATION ---
                    // "transparent" gör att den smälter ihop med din bakgrund
                    data-background-color="transparent"

                    // Samma mörka färg som dina andra kort (#262626)
                    data-card-background-color="#262626"

                    // Vit text
                    data-text-color="#ffffff"

                    // En väldigt subtil vit kant (10% opacitet) istället för stark orange
                    data-border-color="rgba(255, 255, 255, 0.1)"
                />
            </div>
        </section>
    );
};

export default CourselyWidget;