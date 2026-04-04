"use client";

import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";

interface CourselyWidgetProps {
    showHeader?: boolean;
    activityType?: "Course" | "Event";
    title?: string;
}

const CourselyWidget: React.FC<CourselyWidgetProps> = ({
                                                           showHeader = true,
                                                           activityType = "Course",
                                                           title,
                                                       }) => {
    const { t } = useTranslation("courselyWidgetTranslation");

    useEffect(() => {
        const scriptId = 'coursely-activity-loader';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://app.coursely.se/scripts/activityLoader.js";
            script.defer = true;
            document.head.appendChild(script);
        }
    }, []);

    const defaultTitle = activityType === "Event"
        ? t('widgetTitleEvents', { defaultValue: 'Events & Workshops' })
        : t('widgetTitle', { defaultValue: 'Våra Kurser & Schema' });

    return (
        <section className={`py-8 ${showHeader ? 'sm:py-24' : ''} bg-transparent w-full`}>
            <style>{`
                .container-iframe {
                    font-family: inherit !important;
                    min-height: 600px;
                }
                .container-iframe button,
                .container-iframe .btn {
                    background-color: #f97316 !important;
                    border-radius: 9999px !important;
                    transition: all 0.3s ease !important;
                }
                .container-iframe button:hover {
                    background-color: #ea580c !important;
                    transform: scale(1.02);
                }
            `}</style>

            <div className="container mx-auto max-w-6xl px-4">
                {showHeader && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl sm:text-5xl font-bold text-orange-500 mb-4 font-serif">
                            {title ?? defaultTitle}
                        </h2>
                    </div>
                )}

                <div
                    id="container-iframe"
                    className="container-iframe bg-transparent rounded-2xl w-full"
                    data-client-id="FuegoDance"
                    data-filter=""
                    data-view-mode={activityType === "Event" ? "list" : "grid"}
                    data-city-name=""
                    data-dance=""
                    data-group="type"
                    data-group-sorting="startdate"
                    data-activity-type={activityType}
                    data-hide-filter="true"
                    data-period=""
                    data-show-sub-events="false"
                    data-show-parent-event="true"
                    suppressHydrationWarning={true}
                    data-background-color="transparent"
                    data-card-background-color="#262626"
                    data-text-color="#ffffff"
                    data-border-color="rgba(255, 255, 255, 0.1)"
                />
            </div>
        </section>
    );
};

export default CourselyWidget;