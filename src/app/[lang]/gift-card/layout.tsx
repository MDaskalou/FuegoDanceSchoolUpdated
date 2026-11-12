import type { Metadata } from "next";
import { GIFT_CARD_IMAGE_PATH } from "@/lib/giftCard";
import { SITE_URL, buildPageMetadata, normalizeLang } from "@/lib/seo";

export async function generateMetadata({
    params,
}: {
    params: { lang: string };
}): Promise<Metadata> {
    const lang = normalizeLang(params.lang);
    const isEnglish = lang === "en";
    const title = {
        sv: "Presentkort till Bachata-kurs i Göteborg",
        en: "Gift Card for Bachata Courses in Gothenburg",
    };
    const description = {
        sv: "Köp presentkort till Fuego Dance School i Göteborg. Gäller Bachata-kurser, workshops och fester. Välj 1 000, 2 000, 3 000 kr eller eget belopp.",
        en: "Buy a Fuego Dance School gift card in Gothenburg. Valid for Bachata courses, workshops and parties. Choose 1,000, 2,000, 3,000 SEK or your own amount.",
    };
    const base = buildPageMetadata({
        lang,
        pathAfterLang: "gift-card",
        title,
        description,
    });

    return {
        ...base,
        keywords: isEnglish
            ? [
                  "gift card",
                  "dance gift card Gothenburg",
                  "Bachata gift card",
                  "Fuego Dance School",
              ]
            : [
                  "presentkort",
                  "presentkort dans Göteborg",
                  "presentkort Bachata",
                  "presentkort danskurs",
                  "Fuego Dance School",
              ],
        openGraph: {
            title: isEnglish ? title.en : title.sv,
            description: isEnglish ? description.en : description.sv,
            url: `${SITE_URL}/${lang}/gift-card/`,
            siteName: "Fuego Dance School",
            images: [
                {
                    url: GIFT_CARD_IMAGE_PATH,
                    width: 1024,
                    height: 576,
                    alt: isEnglish
                        ? "Fuego Dance School gift card"
                        : "Fuego Dance School presentkort",
                },
            ],
            locale: isEnglish ? "en_US" : "sv_SE",
            type: "website",
        },
    };
}

export default function GiftCardLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
