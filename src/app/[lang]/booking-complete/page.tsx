"use client";

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaInstagram, FaFacebook, FaArrowRight } from "react-icons/fa";

export default function BookingCompletePage() {
    // Prova att ändra "bookingCompleteTranslation" till "aboutTranslation"
    // om du flyttar texterna dit.
    const { t, i18n } = useTranslation("bookingCompleteTranslation");
    const searchParams = useSearchParams();
    const currentLang = i18n.language || "sv";
    const bookingId = searchParams.get("booking_id");

    useEffect(() => {
        // Logga för att se om filen laddats
        console.log("Namespace laddat:", i18n.hasResourceBundle(currentLang, "bookingCompleteTranslation"));

        if (bookingId) {
            console.log("Spårning aktiverad för bokning:", bookingId);
            // Christoffers spårningskod här...
        }
    }, [bookingId, i18n, currentLang]);

    return (
        <main className="relative min-h-screen flex items-center justify-center px-4 pt-20">
            <div className="w-full max-w-2xl bg-[#121212]/90 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-2xl shadow-2xl text-center">

                <div className="flex justify-center mb-6">
                    <FaCheckCircle className="text-[#f26722] text-6xl md:text-7xl" />
                </div>

                {/* Om t() returnerar nyckeln, visas "bookingComplete.title" */}
                <h1 className="font-playfair text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
                    {t("bookingComplete.title")}
                </h1>

                <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
                    {t("bookingComplete.description")}
                </p>

                {bookingId && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-10 inline-block">
            <span className="text-gray-400 text-xs uppercase tracking-[0.2em] block mb-1">
              Referensnummer
            </span>
                        <span className="text-[#f26722] font-mono text-2xl font-bold tracking-wider">
              #{bookingId}
            </span>
                    </div>
                )}

                <hr className="border-white/10 mb-10" />

                <div className="space-y-6">
                    <h2 className="font-playfair text-xl text-white uppercase tracking-widest">
                        {t("bookingComplete.nextStepsTitle")}
                    </h2>
                    <p className="text-gray-400 text-sm italic">
                        {t("bookingComplete.socialText")}
                    </p>

                    <div className="flex justify-center gap-6">
                        <a href="https://instagram.com/fuegodanceschool" target="_blank" className="text-white hover:text-[#f26722] transition-colors text-3xl">
                            <FaInstagram />
                        </a>
                        <a href="https://facebook.com/fuegodschool" target="_blank" className="text-white hover:text-[#f26722] transition-colors text-3xl">
                            <FaFacebook />
                        </a>
                    </div>
                </div>

                <div className="mt-12">
                    <Link
                        href={`/${currentLang}`}
                        className="inline-flex items-center gap-2 border border-[#f26722] text-[#f26722] px-10 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-[#f26722] hover:text-white transition-all group"
                    >
                        TILLBAKA TILL HEM <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </main>
    );
}