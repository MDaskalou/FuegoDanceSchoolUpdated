// src/app/[lang]/openhouse/layout.tsx
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Föranmälan till Vinterkurserna | Fuego Dance School',
    description: 'Anmäl dig i förväg till kommande Bachata-kurser och välj din nivå och roll.',
};

export default function OpenHouseLayout({ children }: { children: React.ReactNode }) {
    return (
        <>{children}</>
    );
}