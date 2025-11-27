"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface InstagramPost {
    id: string;
    permalink: string;
    mediaUrl: string;
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    caption?: string;
    thumbnailUrl?: string;
    sizes?: {
        medium?: {
            mediaUrl: string;
        };
    };
}

export default function InstagramFeed() {
    const [posts, setPosts] = useState<InstagramPost[]>([]);

    useEffect(() => {
        fetch('https://feeds.behold.so/daT1Zg8lPxObGxbPOfjh')
            .then((res) => res.json())
            .then((data) => {
                if (data.posts) {
                    setPosts(data.posts);
                }
            })
            .catch((err) => console.error("Kunde inte hämta Instagram:", err));
    }, []);

    if (posts.length === 0) return null;

    // VIKTIGT: Här duplicerar vi listan (6+6) för att skapa loopen
    const duplicatedPosts = [...posts, ...posts];

    return (
        <section className="bg-[#1C1C1C] py-16 overflow-hidden">
            <div className="container mx-auto px-4 mb-10">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#E87321] mb-2">
                        Följ oss på Instagram
                    </h2>
                    <Link
                        href="https://www.instagram.com/fuegodanceschool/"
                        target="_blank"
                        className="text-gray-300 hover:text-white transition-colors text-lg"
                    >
                        @fuegodanceschool
                    </Link>
                </div>
            </div>

            {/* SCROLL-CONTAINER */}
            <div className="relative w-full">
                {/* Här används 'animate-scroll' som du lade in i Tailwind.
                    hover:[animation-play-state:paused] gör att den stannar när man pekar på den. */}
                <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">

                    {duplicatedPosts.map((post, index) => (
                        // Vi använder index i key för att vi har dubbletter av samma ID nu
                        <div key={`${post.id}-${index}`} className="mx-4">
                            <Link
                                href={post.permalink}
                                target="_blank"
                                className="block relative w-72 aspect-[4/5] overflow-hidden rounded-lg bg-gray-800 group"
                            >
                                <Image
                                    src={post.sizes?.medium?.mediaUrl || post.thumbnailUrl || post.mediaUrl}
                                    alt={post.caption ? post.caption.slice(0, 50) : "Instagram post"}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="300px"
                                    unoptimized={true}
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-semibold px-4 py-2 border border-white rounded-full">
                                        Visa
                                    </span>
                                </div>

                                {/* Ikoner */}
                                <div className="absolute top-2 right-2 text-white drop-shadow-md">
                                    {post.mediaType === 'VIDEO' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {post.mediaType === 'CAROUSEL_ALBUM' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}