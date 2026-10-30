"use client";

import { useState } from "react";
import Image from "next/image";

export interface PartnerOffer {
    name: string;
    category: string;
    offer: string;
    code?: string;
    href?: string;
    logo?: string;
    logoSurface?: "dark" | "light";
    showName?: boolean;
}

interface PartnersCarouselProps {
    partners: PartnerOffer[];
    labels: {
        copy: string;
        copied: string;
        visit: string;
        code: string;
        previous: string;
        next: string;
        goTo: string;
    };
}

function PartnerCard({
    partner,
    labels,
}: {
    partner: PartnerOffer;
    labels: PartnersCarouselProps["labels"];
}) {
    const [copied, setCopied] = useState(false);

    const copyCode = async () => {
        if (!partner.code) return;

        try {
            await navigator.clipboard.writeText(partner.code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            setCopied(false);
        }
    };

    const logo = partner.logo ? (
        <div className={`relative mb-5 h-36 overflow-hidden rounded-xl ${partner.logoSurface === "light" ? "bg-white" : "bg-black"}`}>
            <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 80vw, 320px"
            />
        </div>
    ) : null;

    return (
        <article className="flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-[#1c1c1c] p-6">
            {logo}
            <p className="w-fit rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-orange-300">
                {partner.category}
            </p>
            {(!partner.logo || partner.showName) && (
                <h3 className="mt-4 text-2xl font-semibold">{partner.name}</h3>
            )}
            <p className={`${partner.logo ? "mt-4" : "mt-2"} flex-1 text-sm leading-relaxed text-gray-400`}>{partner.offer}</p>

            {partner.code && (
                <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-dashed border-orange-500/40 bg-orange-500/10 px-4 py-3">
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-300">
                            {labels.code}
                        </p>
                        <p className="mt-1 truncate text-base font-semibold tracking-[0.18em] text-white">
                            {partner.code}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={copyCode}
                        className="shrink-0 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-white transition-colors hover:border-orange-500 hover:bg-orange-500"
                    >
                        {copied ? labels.copied : labels.copy}
                    </button>
                </div>
            )}

            {partner.href && (
                <a
                    href={partner.href}
                    target={partner.href.startsWith("http") ? "_blank" : undefined}
                    rel={partner.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="mt-4 text-sm font-semibold text-orange-400 transition-colors hover:text-orange-300"
                >
                    {labels.visit}
                </a>
            )}
        </article>
    );
}

export default function PartnersCarousel({ partners, labels }: PartnersCarouselProps) {
    const loop = partners.length > 1 ? [...partners, ...partners] : partners;
    const duration = Math.max(partners.length, 1) * 12;

    return (
        <div className="group mt-10 overflow-hidden">
            <div
                className="flex w-max items-stretch animate-scroll motion-reduce:animate-none group-hover:[animation-play-state:paused]"
                style={partners.length > 1 ? { animationDuration: `${duration}s` } : undefined}
            >
                {loop.map((partner, index) => (
                    <div
                        key={`${partner.name}-${index}`}
                        className="w-[280px] shrink-0 pr-8 sm:w-[340px] sm:pr-14"
                    >
                        <PartnerCard partner={partner} labels={labels} />
                    </div>
                ))}
            </div>
        </div>
    );
}
