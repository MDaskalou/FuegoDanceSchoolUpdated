"use client";

import React, { useEffect, useState, useRef } from "react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
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

  const handleLanguageChange = () => {
    const newLang = currentLang === "sv" ? "en" : "sv";
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPath);
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

  const getLinkClass = (href: string, isCta: boolean) => {
    const fullHref = `/${currentLang}${href === "/" ? "" : href}`;
    const isActive = pathname === fullHref;

    if (isCta) return "bg-[#f26722] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#d5561d] transition-all transform hover:scale-105 shadow-lg uppercase tracking-wider";

    return `flex items-center gap-1.5 transition-colors duration-200 uppercase tracking-widest text-[14px] font-semibold ${
        isActive ? "text-[#f26722]" : "text-gray-200 hover:text-[#f26722]"
    }`;
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isAnchor: boolean) => {
    if (isAnchor && pathname === `/${currentLang}`) {
      const id = href.split("#")[1];
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
      }
    } else {
      setIsMenuOpen(false);
    }
  };

  return (
      <header
          className={`fixed top-0 left-0 w-full transition-all duration-300 ${
              isMenuOpen ? "z-[100000]" : "z-[1000]"
          } ${
              isHidden && !isMenuOpen ? "-translate-y-full" : "translate-y-0"
          } ${isScrolled
              ? "bg-gradient-to-br from-[#1f1f1f]/90 to-[#3a1f1d]/90 backdrop-blur-md border-b border-white/5 shadow-2xl"
              : "bg-transparent"
          }`}
      >
        {/* HUVUD-NAVBAR: Vi lägger till opacity-0 när menyn är öppen för att slippa dubbletter */}
        <div className={`mx-auto flex h-[90px] max-w-[1500px] items-center justify-between px-6 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}>

          {/* Vänster: Logotyp */}
          <Link href={`/${currentLang}`} className="flex items-center gap-3 group relative z-[10001]">
            <Image
                src="/img/Navbar/FuegoLogoimg.png"
                alt="Fuego Logo"
                width={80}
                height={80}
                className="object-contain transition-transform group-hover:scale-105"
                priority
            />
            <div className="flex flex-col">
              <span className="font-playfair text-2xl font-black leading-none text-[#f26722]">Fuego</span>
              <span className="text-[10px] tracking-[0.25em] text-white/80 uppercase font-light">Dance School</span>
            </div>
          </Link>

          {/* Mitten: Desktop Nav */}
          <nav className="hidden items-center gap-6 xl:flex">
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={`/${currentLang}${link.href}`}
                    onClick={(e) => handleLinkClick(e, link.href, !!link.isAnchor)}
                    className={getLinkClass(link.href, !!link.isCta)}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
            ))}
          </nav>

          {/* Höger: Språkval & Mobil-knapp */}
          <div className="flex items-center gap-5 relative z-[10001]">
            <button
                onClick={handleLanguageChange}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-white hover:bg-[#f26722] transition-all"
            >
              {currentLang.toUpperCase()}
            </button>

            <button
                className="text-3xl text-[#f26722] xl:hidden transition-transform duration-300 hover:scale-110"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* MOBILMENY: Denna syns nu ensam utan dubbletter bakom */}
        <div
            className={`fixed inset-0 h-screen w-screen bg-[#121212] flex flex-col transition-all duration-500 ease-in-out xl:hidden ${
                isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
            }`}
        >
          {/* Menyns Topp-bar */}
          <div className="flex h-[90px] w-full items-center justify-between px-6 bg-[#1a1a1a] border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <Image
                  src="/img/Navbar/FuegoLogoimg.png"
                  alt="Fuego Logo"
                  width={50}
                  height={50}
                  className="object-contain"
              />
              <span className="font-playfair text-xl font-black text-[#f26722]">Fuego</span>
            </div>
            <button
                className="text-4xl text-[#f26722] p-2"
                onClick={() => setIsMenuOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Navigeringslänkar */}
          <nav className="flex-1 overflow-y-auto bg-[#121212] py-8 px-6 flex flex-col gap-3">
            {navLinks.map((link, index) => {
              // Vi separerar CTA (Kurser) från de andra för att ge den fokus
              if (link.isCta) {
                return (
                    <Link
                        key={link.href}
                        href={`/${currentLang}${link.href}`}
                        onClick={(e) => handleLinkClick(e, link.href, !!link.isAnchor)}
                        className="flex items-center justify-between w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-[#f26722] to-[#ff8c52] text-white shadow-[0_10px_20px_rgba(242,103,34,0.3)] mb-4 transition-transform active:scale-95"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{link.icon}</span>
                        <span className="text-xl font-bold uppercase tracking-wider">{link.name}</span>
                      </div>
                      <span className="text-white/50">→</span>
                    </Link>
                );
              }

              // Vanliga länkar i ett snyggt listformat eller grid
              return (
                  <Link
                      key={link.href}
                      href={`/${currentLang}${link.href}`}
                      onClick={(e) => handleLinkClick(e, link.href, !!link.isAnchor)}
                      className="flex items-center gap-4 w-full py-4 px-5 rounded-xl text-gray-300 bg-white/5 border border-white/5 hover:bg-white/10 active:bg-[#f26722]/10 active:border-[#f26722]/30 transition-all uppercase tracking-widest font-semibold text-sm"
                  >
        <span className="text-[#f26722] text-xl opacity-80">
          {link.icon}
        </span>
                    {link.name}
                  </Link>
              );
            })}

            {/* Snabbval för Sociala Medier */}
            <div className="flex gap-4 mt-6 justify-center">
              {/* Instagram */}
              <a
                  href="https://www.instagram.com/fuegodanceschool/" // Ersätt med din länk
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-white/5 rounded-full text-white hover:text-[#f26722] transition-colors"
                  aria-label="Följ oss på Instagram"
              >
                <FaInstagram size={24} />
              </a>

              {/* Facebook */}
              <a
                  href="https://www.facebook.com/FuegoDSchool" // Ersätt med din länk
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-white/5 rounded-full text-white hover:text-[#f26722] transition-colors"
                  aria-label="Följ oss på Facebook"
              >
                <FaFacebook size={24} />
              </a>
            </div>
          </nav>

          <div className="p-8 bg-[#0a0a0a] border-t border-white/5 text-center shrink-0">
            <p className="text-gray-500 text-[10px] tracking-[0.4em] uppercase">
              Göteborgs skönaste dansskola
            </p>
          </div>
        </div>
      </header>

  );
};

export default Navbar;