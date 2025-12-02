// src/components/CourselyWidget.tsx
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
        <section className="py-16 sm:py-24 bg-transparent">
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
                    className="bg-transparent rounded-2xl min-h-[600px] w-full"
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

                    data-background-color="#000000"
                    data-card-background-color="#1a1a1a"
                    data-text-color="#ffffff"
                    data-border-color="#ff6600"

                />
            </div>
        </section>
    );
};

export default CourselyWidget;
