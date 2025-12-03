"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaCalendarAlt, FaBook, FaTags, FaStar, FaUsers, FaHeart, FaQuestion } from "react-icons/fa";

// --- Hook: Göm navbar vid scroll (TypeScript-version) ---
function useHideOnScroll(offset: number = 80): boolean {
    const [hidden, setHidden] = useState(false);
    const lastY = useRef<number>(0);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            const goingDown = y > lastY.current;
            setHidden(goingDown && y > offset);
            lastY.current = y;
        };
        // Använder "passive: true" för bättre prestanda vid scroll
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [offset]);

    return hidden;
}

// --- BAS STYLING: Använd 'nav-link-base' som definierats via @apply i globals.css ---
const NAV_LINK_BASE = "nav-link-base"; // Enkel klassnamn

// Bas-styling för ikoner (används inom `nav-link-base` för mobil)
const ICON_STYLE = "icon-style";

// --- Huvudkomponent ---
export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // NYTT: State för att hantera "fade-in" av texten
    const [mounted, setMounted] = useState(false);

    const { t, i18n } = useTranslation("navbarTranslation");
    const currentLang = i18n.language;

    const router = useRouter();
    const pathname = usePathname();

    const hidden = useHideOnScroll(80);
    const navRef = useRef<HTMLElement>(null);

    // Effekt: Lyssna på scroll för att ändra navbar-bakgrund
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Effekt: Hantera client-side mounting för att undvika flimmer
    useEffect(() => {
        setIsClient(true);
        // Samma delay-trick som i Hero för att säkerställa att översättningen är laddad
        const timer = setTimeout(() => {
            setMounted(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Effekt: Lås body-scroll när mobilmenyn är öppen
    useEffect(() => {
        const { style } = document.documentElement;
        style.overflow = isMenuOpen ? "hidden" : "";
        return () => { style.overflow = ""; };
    }, [isMenuOpen]);

    // Effekt: Stäng menyn vid sidbyte
    useEffect(() => {
        if (isMenuOpen) {
            const timer = setTimeout(() => {
                setIsMenuOpen(false);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [pathname, isMenuOpen]);

    // Effekt: Stäng menyn med "Escape"-tangenten
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsMenuOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Funktion: Byt språk (Next.js-anpassad)
    const handleLanguageChange = () => {
        const newLang = currentLang === "sv" ? "en" : "sv";
        i18n.changeLanguage(newLang);

        const pathSegments = pathname.split('/').filter(Boolean);
        const pathWithoutLang = pathSegments.length > 1 ? `/${pathSegments.slice(1).join('/')}` : '/';

        router.push(`/${newLang}${pathWithoutLang}`);
    };

    // Funktion: Hantera "aktiv" länk-styling
    const getLinkClass = (href: string) => {
        const active = "text-orange-500 font-bold md:after:scale-x-100";
        const inactive = "text-gray-300 md:text-gray-400";
        const fullHref = `/${currentLang}${href}`;
        return `${NAV_LINK_BASE} ${pathname.startsWith(fullHref) ? active : inactive}`;
    };

    // Funktion: Hantera "aktiv" scroll-länk-styling
    const getScrollBtnClass = () => {
        const langHomepage = `/${currentLang}`;
        const inactive = "text-gray-300 md:text-gray-400";
        return `${NAV_LINK_BASE} ${inactive}`;
    };

    return (
        <header
            ref={navRef}
            role="banner"
            aria-label="Huvudnavigering"
            className={`
                fixed top-0 left-0 z-[1000] flex h-[80px] w-full items-center justify-between px-4
                text-white transition-all duration-300 ease-in-out will-change-transform md:px-10
                ${hidden ? "-translate-y-full" : "translate-y-0"}
                ${isScrolled
                ? "bg-gradient-to-r from-[#1b1b1b] to-[#311a18] shadow-2xl"
                : "bg-gradient-to-r from-[#1f1f1f] to-[#3a1f1d]"}
            `}
        >
            {/* === LOGO (Visas alltid direkt) === */}
            <Link href={`/${currentLang}`} className="flex shrink-0 cursor-pointer items-center gap-2.5">
                <Image
                    src="/img/Navbar/FuegoLogoimg.png"
                    alt="Fuego logo"
                    width={60}
                    height={60}
                    priority
                    className="rounded-full drop-shadow-[0_0_4px_#f26722]"
                />
                <div className="text-2xl leading-tight" aria-label="Fuego Dance School">
                    <div className="font-playfair font-bold text-orange-500">Fuego </div>
                    <div className="ml-1.5 font-greatvibes text-xl text-white">Dance School</div>
                </div>
            </Link>

            {/* === Språk & Hamburgare === */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={handleLanguageChange}
                    aria-label={currentLang === "sv" ? t("switchLangEN") : t("switchLangSV")}
                    className="
                        inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10
                        text-xs font-bold uppercase text-white transition-all duration-100 ease-in-out
                        hover:bg-white/20 active:scale-95 active:opacity-90
                        focus:outline-none focus:border-orange-500 md:ml-4
                    "
                >
                    {isClient ? (currentLang === "sv" ? "EN" : "SV") : "SV"}
                </button>

                <button
                    type="button"
                    aria-expanded={isMenuOpen}
                    aria-controls="main-nav"
                    onClick={() => setIsMenuOpen((v) => !v)}
                    aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
                    className="
                        z-[1002] border-none bg-transparent text-3xl text-white
                        transition-all duration-100 ease-in-out active:scale-95 active:opacity-90 md:hidden
                    "
                >
                    {isMenuOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* === NAV-LÄNKAR WRAPPER === */}
            <div className="md:flex md:flex-1 md:justify-center">
                <nav
                    id="main-nav"
                    role="navigation"
                    className={`
                        fixed top-0 left-0 z-[1001] flex h-screen w-screen flex-col items-center
                        justify-center bg-black/95 pt-20 backdrop-blur-md transition-opacity
                        md:static md:h-auto md:w-auto md:flex-row md:items-center 
                        md:bg-transparent md:p-0 md:backdrop-blur-none
                        ${isMenuOpen ? "flex animate-fadeSlideUp" : "hidden md:flex"}
                    `}
                >
                    {/* HÄR ÄR FIXEN:
                        Vi lägger till 'transition-opacity' och styr opaciteten med 'mounted'.
                        Detta gör att länkarna är osynliga tills språket är laddat.
                    */}
                    <ul className={`
                        m-0 flex list-none flex-col items-center gap-4 p-0 md:flex-row md:gap-7
                        transition-opacity duration-500 ease-out
                        ${mounted ? 'opacity-100' : 'opacity-0'}
                    `}>
                        {/* --- Scroll-länkar --- */}
                        <li><Link href={`/${currentLang}/#heroreel`} className={getScrollBtnClass()}><FaHome className={ICON_STYLE} /> {t("nav.home")}</Link></li>
                        <li><Link href={`/${currentLang}/#schedule`} className={getScrollBtnClass()}><FaCalendarAlt className={ICON_STYLE} /> {t("nav.schedule")}</Link></li>
                        <li>
                            <Link
                                href={`/${currentLang}/courses`}
                                className={`
                                    ${getScrollBtnClass()}
                                    nav-link-cta rounded-full bg-orange-500 !text-white px-6 py-3
                                    transition-all duration-200 ease-in-out hover:scale-105
                                    hover:translate-x-0 hover:shadow-[0_6px_15px_rgba(242,103,34,.4)]
                                    md:font-bold md:hover:bg-orange-300 md:hover:translate-y-[-2px]
                                `}
                            >
                                <FaBook className={ICON_STYLE} /> {t("nav.courses")}
                            </Link>
                        </li>
                        <li><Link href={`/${currentLang}/#prices`} className={getScrollBtnClass()}><FaTags className={ICON_STYLE} /> {t("nav.prices")}</Link></li>
                        <li><Link href={`/${currentLang}/#events`} className={getScrollBtnClass()}><FaStar className={ICON_STYLE} /> {t("nav.events")}</Link></li>

                        {/* --- Vanliga sid-länkar --- */}
                        <li><Link href={`/${currentLang}/instructors`} className={getLinkClass("/instructors")}><FaUsers className={ICON_STYLE} /> {t("nav.instructors")}</Link></li>
                        <li><Link href={`/${currentLang}/values`} className={getLinkClass("/values")}><FaHeart className={ICON_STYLE} /> {t("nav.values")}</Link></li>
                        <li><Link href={`/${currentLang}/FAQpage`} className={getLinkClass("/FAQpage")}><FaQuestion className={ICON_STYLE} /> {t("nav.faq")}</Link></li>
                    </ul>
                </nav>
            </div>

            <style jsx>{`
                .icon-style {
                    font-size: 1.6rem;
                    vertical-align: middle;
                    flex-shrink: 0;
                }
                @media (min-width: 768px) {
                    .icon-style {
                        display: none;
                    }
                    .nav-link-base {
                        gap: 0;
                    }
                }
            `}</style>
        </header>
    );
};

export default Navbar;