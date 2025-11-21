// src/app/[lang]/instructors/layout.ts
import { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Instruktörer | Fuego Dance School',
    description: 'Möt instruktörerna som leder dig genom våra Bachata-kurser och workshops. Läs om deras bakgrund och specialområden.',
};

export default function InstructorsLayout({
                                              children,
                                          }: {
    children: ReactNode;
}) {
    return <>{children}</>;
}