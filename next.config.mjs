// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    // --- PRODUKTION / BUILD INSTÄLLNINGAR ---
    // Avkommentera dessa rader INNAN du kör 'npm run build'

    // output: 'export',
    // basePath: '/FuegoDanceSchoolUpdated',

    trailingSlash: true,

    images: {
        // Denna del behövs för att Next.js ska lita på bilderna från Behold & Instagram
        // Det behövs BÅDE lokalt och i produktion (om du inte kör unoptimized)
        remotePatterns: [
            { protocol: 'https', hostname: 'behold.pictures' },
            { protocol: 'https', hostname: 'scontent-*.cdninstagram.com' },
            { protocol: 'https', hostname: '*.cdninstagram.com' },
        ],

        // Avkommentera denna rad INNAN du kör 'npm run build' för Static Export
        // unoptimized: true,
    },
};

export default nextConfig;