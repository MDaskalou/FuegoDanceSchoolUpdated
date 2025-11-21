// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    // NYCKEL FÖR STATISK EXPORT (MÅSTE VARA MED FÖR GITHUB PAGES)
    output: 'export',

    // NÖDVÄNDIGT: Ange basökvägen så att alla tillgångar (CSS/JS) laddas korrekt.
    // Detta baseras på ditt arkivnamn: /FuegoDanceSchoolUpdated
    basePath: '/FuegoDanceSchoolUpdated',

    // NÖDVÄNDIGT: Inaktiverar bildoptimering vid statisk export,
    // eftersom Next.js standardoptimering kräver en server.
    images: {
        unoptimized: true,
    },

    // Du kan behålla trailingSlash om du vill ha /example/ istället för /example
    trailingSlash: true,
};

export default nextConfig;