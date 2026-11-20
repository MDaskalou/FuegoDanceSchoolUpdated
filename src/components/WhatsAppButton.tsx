"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useTranslation } from "react-i18next";

type Props = {
    /** Phone in international format without +, spaces, or leading 0, e.g. "46739598665" */
    phone?: string;
    /** Prefills the WhatsApp chat composer */
    message?: string;
    /** Accessible label / hover tooltip */
    label?: string;
};

export default function WhatsAppButton({
    phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
    message,
    label,
}: Props) {
    const { t } = useTranslation("footerTranslation");

    if (!phone) return null;

    const resolvedLabel = label ?? t("whatsappLabel", { defaultValue: "Chatta med oss" });
    const resolvedMessage =
        message ??
        t("whatsappMessage", {
            defaultValue: "Hej Fuego Dance School! Jag har en fråga om era kurser.",
        });

    const href = `https://wa.me/${phone}?text=${encodeURIComponent(resolvedMessage)}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={resolvedLabel}
            className="group fixed bottom-6 right-6 z-50 flex items-center gap-2"
        >
            <span className="pointer-events-none hidden rounded-full border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-sm font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 sm:inline-block">
                {resolvedLabel}
            </span>

            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]">
                <FaWhatsapp className="relative h-8 w-8" aria-hidden />
            </span>
        </a>
    );
}
