"use client";

import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";

interface CourselyWidgetProps {
    showHeader?: boolean;
}

const CourselyWidget: React.FC<CourselyWidgetProps> = ({ showHeader = true }) => {
    const { t } = useTranslation("courselyWidgetTranslation");

    useEffect(() => {
        const scriptId = 'coursely-activity-loader';

        // Kontrollera om skriptet redan finns för att undvika dubletter
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://app.coursely.se/scripts/activityLoader.js";
            script.defer = true;
            document.head.appendChild(script);
        }

        // Cleanup: Vi tar inte bort skriptet vid unmount i Next.js (SPA-liknande)
        // eftersom det ofta behövs om man navigerar tillbaka till sidan.
    }, []);

    return (
        <section className={`py-8 ${showHeader ? 'sm:py-24' : ''} bg-transparent w-full`}>
            <style jsx global>{`
                /* Behåller din befintliga styling för att matcha Fuego-temat */
                #container-iframe {
                    font-family: inherit !important;
                    min-height: 600px;
                }

                #container-iframe button,
                #container-iframe .btn {
                    background-color: #f97316 !important;
                    border-radius: 9999px !important;
                    transition: all 0.3s ease !important;
                }

                #container-iframe button:hover {
                    background-color: #ea580c !important;
                    transform: scale(1.02);
                }
            `}</style>

            <div className="container mx-auto max-w-6xl px-4">
                {showHeader && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl sm:text-5xl font-bold text-orange-500 mb-4 font-serif">
                            {t('widgetTitle', { defaultValue: 'Våra Kurser & Schema' })}
                        </h2>
                    </div>
                )}

                {/* Här är den uppdaterade DIV:en med alla nya attribut från bilden */}
                <div
                    id="container-iframe"
                    className="container-iframe bg-transparent rounded-2xl w-full"
                    // Attribut från din nya kodbild:
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

                    // React-specifikt
                    suppressHydrationWarning={true}

                    // Din anpassade styling
                    data-background-color="transparent"
                    data-card-background-color="#262626"
                    data-text-color="#ffffff"
                    data-border-color="rgba(255, 255, 255, 0.1)"
                ></div>
            </div>
        </section>
    );
};

export default CourselyWidget;