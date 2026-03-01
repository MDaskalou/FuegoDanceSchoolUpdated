/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    trailingSlash: true,

    // Lägg till detta block:
    async redirects() {
        return [
            {
                source: '/',
                destination: '/sv/', // Notera snedstrecket i slutet pga trailingSlash: true
                permanent: true,
            },
        ]
    },

    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'behold.pictures' },
            { protocol: 'https', hostname: 'scontent-*.cdninstagram.com' },
            { protocol: 'https', hostname: '*.cdninstagram.com' },
        ],
    },
};

export default nextConfig;