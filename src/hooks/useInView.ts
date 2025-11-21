// src/hooks/useInView.ts
import { useState, useEffect, useRef } from 'react';

// Denna hook använder Intersection Observer för att detektera när ett element är synligt
export const useInView = (threshold: number = 0.1) => {
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const currentRef = ref.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Om elementet är synligt (intersecting) och vi inte redan har markerat det som synligt
                if (entry.isIntersecting && !inView) {
                    setInView(true);
                }
            },
            { threshold }
        );

        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, inView]);

    return { ref, inView };
};