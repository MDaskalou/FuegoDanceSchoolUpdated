"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

const galleryImages = [
    "/img/About/About6.jpg",
    "/img/About/About7.jpg",
    "/img/About/About8.jpg",
    "/img/About/Aboutleft1.jpg",
    "/img/About/Aboutright1.jpg",
];

export default function FuegoGalleryStrip() {
    const { t } = useTranslation("aboutTranslation");

    return (
        <section className="bg-[#171717] px-4 pb-20 text-white sm:pb-28">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-orange-400">
                            {t("galleryEyebrow")}
                        </p>
                        <h2 className="text-3xl font-bold sm:text-4xl">
                            {t("galleryTitle")}
                        </h2>
                    </div>
                    <p className="max-w-xl text-sm leading-relaxed text-gray-400 sm:text-right">
                        {t("galleryDescription")}
                    </p>
                </div>

                <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
                    {galleryImages.map((src, index) => (
                        <div
                            key={src}
                            className="relative h-64 min-w-[72vw] overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] sm:h-72 sm:min-w-0"
                        >
                            <Image
                                src={src}
                                alt={t("galleryImageAlt", { index: index + 1 })}
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                                sizes="(max-width: 640px) 72vw, 20vw"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
