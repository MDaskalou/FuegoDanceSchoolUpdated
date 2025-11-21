// src/components/CourselyWidget.tsx
"use client";

import React, { useEffect } from 'react';

// Denna komponent innehåller den statiska HTML-behållaren och laddar det externa skriptet.
const CourselyWidget = () => {

    // VIKTIGT: Vi använder useEffect för att lägga till skriptet.
    // Detta garanterar att DOM-elementet (div:en) finns innan skriptet försöker köra.
    useEffect(() => {
        const scriptId = 'coursely-script';

        // Förhindra att skriptet laddas om ifall komponenten renderas på nytt
        if (document.getElementById(scriptId)) {
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://app.coursely.se/scripts/activityLoader.js";
        script.defer = true;

        // Lägg till skriptet i slutet av body
        document.body.appendChild(script);

        // Cleanup funktion
        return () => {
            // OBS: Vi tar normalt inte bort skriptet vid cleanup om det laddar in en iframe
            // Men detta är god praxis för att undvika DOM-minnesläckor.
            // document.body.removeChild(script);
        };
    }, []);


    return (
        <div className="mx-auto max-w-5xl py-12 px-4">
            {/* Coursely Widget Placeholder */}
            <div
                id="container-iframe"
                style={{ border: 'none', borderRadius: '4px' }}
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
                // FIX: Ignorera Hydration Error på detta element
                suppressHydrationWarning={true}
            >
            </div>
        </div>
    );
};

export default CourselyWidget;