// src/app/[lang]/FAQpage/layout.tsx
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Vanliga Frågor | Fuego Dance School',
    description: 'Hitta svar på vanliga frågor om kurser, priser, drop-in och det praktiska kring Fuego Dance School.',
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
    return (
        <>{children}</>
    );
}