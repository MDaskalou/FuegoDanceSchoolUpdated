"use client";

import React, { useEffect, useState, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useParams } from "next/navigation";
import {
  FaHome, FaCalendarAlt, FaBook, FaTags,
  FaStar, FaUsers, FaHeart, FaQuestion
} from "react-icons/fa";

// --- Hook: Göm navbar vid scroll ---
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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return hidden;
}

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Vi drar ut i18n här för att kunna byta språk programmatiskt
  const { t, i18n } = useTranslation("navbarTranslation");
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentLang = (params?.lang as string) || "sv";
  const isHidden = useHideOnScroll(80);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  if (!mounted) return <div className="h-[90px] bg-transparent" />;

  // I Navbar.tsx
  const handleLanguageChange = async () => {
    const newLang = currentLang === "sv" ? "en" : "sv";

    // 1. Förbered i18next direkt
    await i18n.changeLanguage(newLang);

    // 2. Beräkna den nya vägen säkert
    const segments = pathname.split('/');
    if (segments[1] === currentLang) {
      segments[1] = newLang;
    }
    const newPath = segments.join('/') || `/${newLang}`;

    // 3. Utför navigeringen tyst
    // scroll: false förhindrar att sidan hoppar till toppen
    router.push(newPath, { scroll: false });
  };

  const navLinks = [
    { name: t('nav.home'), href: "/#heroreel", icon: <FaHome />, isAnchor: true },
    { name: t('nav.schedule'), href: "/#schedule", icon: <FaCalendarAlt />, isAnchor: true },
    { name: t('nav.courses'), href: "/courses", icon: <FaBook />, isCta: true },
    { name: t('nav.prices'), href: "/#prices", icon: <FaTags />, isAnchor: true },
    { name: t('nav.events'), href: "/#events", icon: <FaStar />, isAnchor: true },
    { name: t('nav.instructors'), href: "/instructors", icon: <FaUsers /> },
    { name: t('nav.values'), href: "/values", icon: <FaHeart /> },
    { name: t('nav.faq'), href: "/FAQpage", icon: <FaQuestion /> },
  ];

  const handleLinkClick = async (e: React.MouseEvent<HTMLAnchorElement>, href: string, isAnchor: boolean) => {
    if (isAnchor) {
      const id = href.split("#")[1];
      const isHomePage = pathname === `/${currentLang}` || pathname === `/${currentLang}/`;

      if (isHomePage) {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
        return;
      }

      // Om vi inte är på startsidan, navigera dit först
      e.preventDefault();
      setIsMenuOpen(false);
      await router.push(`/${currentLang}`);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    setIsMenuOpen(false);
  };

  const getLinkClass = (href: string, isCta: boolean) => {
    const pathOnly = href.split('#')[0] || '/';
    const fullHref = `/${currentLang}${pathOnly === "/" ? "" : pathOnly}`;
    const isActive = pathname === fullHref;

    if (isCta) return "bg-[#f26722] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#d5561d] transition-all transform hover:scale-105 shadow-lg uppercase tracking-wider";

    return `flex items-center gap-1.5 transition-colors duration-200 uppercase tracking-widest text-[14px] font-semibold ${
        isActive ? "text-[#f26722]" : "text-gray-200 hover:text-[#f26722]"
    }`;
  };

  const headerClasses = [
    "fixed top-0 left-0 w-full transition-all duration-300",
    isMenuOpen ? "z-[100000]" : "z-[1000]",
    isHidden && !isMenuOpen ? "-translate-y-full" : "translate-y-0",
    isScrolled
        ? "bg-[#1a1a1a]/80 backdrop-blur-lg border-b border-white/5 shadow-2xl"
        : "bg-transparent"
  ].join(" ");

  return (
      <header className={headerClasses}>
        <div className={`mx-auto flex h-[90px] max-w-[1500px] items-center justify-between px-6 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}>
          {/* LOGO */}
          <Link href={`/${currentLang}`} className="flex items-center gap-3 group">
            <Image src="/img/Navbar/FuegoLogoimg.png" alt="Fuego" width={50} height={50} />
            <span className="font-playfair text-2xl font-bold text-[#f26722] uppercase tracking-tighter">Fuego</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
                <Link
                    key={link.name}
                    href={`/${currentLang}${link.href}`}
                    className={getLinkClass(link.href, link.isCta || false)}
                    onClick={(e) => handleLinkClick(e, link.href, link.isAnchor || false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
            ))}
          </nav>

          {/* RIGHT SECTION (Language + Mobile Toggle) */}
          <div className="flex items-center gap-6">
            <button
                onClick={handleLanguageChange}
                className="text-white hover:text-[#f26722] font-bold transition-colors min-w-[30px]"
            >
              {currentLang === "sv" ? "EN" : "SV"}
            </button>

            <button
                className="lg:hidden text-white text-2xl"
                onClick={() => setIsMenuOpen(true)}
            >
              <FaBars />
            </button>
          </div>
        </div>

        {/* MOBILE OVERLAY MENU */}
        <div className={`fixed inset-0 bg-[#1a1a1a] z-[100001] transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "translate-x-full"} lg:hidden`}>
          <div className="flex flex-col h-full p-8">
            <div className="flex justify-between items-center mb-12">
              <span className="text-[#f26722] font-playfair text-2xl">FUEGO</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white text-3xl"><FaTimes /></button>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto">
              {navLinks.map((link) => (
                  <Link
                      key={link.name}
                      href={`/${currentLang}${link.href}`}
                      className="text-2xl text-white font-semibold flex items-center gap-4 active:text-[#f26722]"
                      onClick={(e) => handleLinkClick(e, link.href, link.isAnchor || false)}
                  >
                    <span className="text-[#f26722]">{link.icon}</span>
                    {link.name}
                  </Link>
              ))}

              {/* Extra språkknapp i mobilmenyn för tydlighet */}
              <button
                  onClick={() => {
                    handleLanguageChange();
                    setIsMenuOpen(false);
                  }}
                  className="mt-4 text-left text-xl text-gray-400 border-t border-white/10 pt-6"
              >
                {currentLang === "sv" ? "Switch to English" : "Byt till Svenska"}
              </button>
            </div>
          </div>
        </div>
      </header>
  );
};

export default Navbar;