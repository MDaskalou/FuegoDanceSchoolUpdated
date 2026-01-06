import React from 'react';
import OpenHouseForm from '@/components/OpenHouseForm';

export default function OpenHousePage() {
    return (
        <main className="min-h-screen pt-24 bg-transparent text-white">
            {/* Komponenten kommer nu ärva översättningarna från layoutens provider */}
            <OpenHouseForm />
        </main>
    );
}