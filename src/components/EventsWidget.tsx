"use client";

import React, { useEffect, useRef } from 'react';

const EventsWidget: React.FC = () => {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const existingScript = document.getElementById('coursely-events-loader');
        if (existingScript) existingScript.remove();

        const script = document.createElement('script');
        script.id = 'coursely-events-loader';
        script.src = "https://app.coursely.se/scripts/activityLoader.js";
        document.head.appendChild(script);
    }, []);

    return (
        <div className="p-4">
            <div
                id="coursely-events-container"
                className="container-iframe w-full"
                style={{ border: 'none', borderRadius: '4px', minHeight: '600px' }}
                data-client-id="FuegoDance"
                data-filter=""
                data-view-mode="list"
                data-city-name=""
                data-dance=""
                data-group="type"
                data-group-sorting="startdate"
                data-activity-type="Event"
                data-hide-filter="true"
                data-period=""
                data-show-sub-events="true"
                data-show-parent-event="true"
                suppressHydrationWarning={true}
            />
        </div>
    );
};

export default EventsWidget;