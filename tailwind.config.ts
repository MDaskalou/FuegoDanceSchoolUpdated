import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'fuego-orange': '#f26722',
                'fuego-orange-darker': '#c2521c',
            },
            fontFamily: {
                'playfair': ['Playfair Display', 'serif'],
                'great-vibes': ['Great Vibes', 'cursive'],
            },
            keyframes: {
                fadeSlideUp: {
                    '0%': {opacity: '0', transform: 'translateY(20px)'},
                    '100%': {opacity: '1', transform: 'translateY(0)'},
                },
            },
            animation: {
                'fadeSlideUp': 'fadeSlideUp 0.6s ease-out forwards',

                // Animation för Huvudrubrik (Startar direkt)
                'hero-title': 'fadeSlideUp 0.8s ease-out forwards',

                // Animation för Underrubrik (Startar efter 0.2s)
                'hero-subtitle': 'fadeSlideUp 0.8s ease-out 0.2s forwards',

                // Animation för CTA-gruppen (Startar efter 0.4s)
                'hero-cta': 'fadeSlideUp 0.8s ease-out 0.4s forwards',
            }
        }
    },
    plugins: [],
}

export default config