// src/app/[lang]/values/layout.tsx
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Våra Kärnvärden | Fuego Dance School',
    description: 'Läs om Fuego Dance Schools kärnvärden: gemenskap, utveckling, glädje och teknik.',
};

export default function ValuesLayout({ children }: { children: React.ReactNode }) {
    return (
        <>{children}</>
    );
}