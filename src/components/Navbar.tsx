"use client";

import React, { useEffect, useState } from "react";
import { FaBars, FaTimes, FaFacebookF, FaInstagram } from "react-icons/fa"; //
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useParams } from "next/navigation";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { t, i18n } = useTranslation("navbarTranslation");
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentLang = (params?.lang as string) || "sv";

  // 1. Säkrare scroll-hantering
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      // Kontrollera window explicit för mobila in-app browsers
      if (typeof window !== "undefined") {
        setIsScrolled(window.scrollY > 20);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

// 2. Säkrare overflow-hantering
  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      document.body.style.overflow = isMenuOpen ? "hidden" : "";
    }
  }, [isMenuOpen, mounted]);

  if (!mounted) return <div className="h-[100px] bg-transparent" />; //

  const handleLanguageChange = () => {
    const newLang = currentLang === "sv" ? "en" : "sv";
    const segments = pathname.split('/');
    if (segments[1] === currentLang) segments[1] = newLang;
    router.push(segments.join('/') || `/${newLang}`);
  };

  const navLinks = [
    { name: t('nav.home'), href: "/#heroreel" },
    { name: t('nav.schedule'), href: "/#schedule" },
    { name: t('nav.courses'), href: "/courses", isCta: true }, //
    { name: t('nav.prices'), href: "/#prices" },
    { name: t('nav.events'), href: "/#events" },
    { name: t('nav.instructors'), href: "/instructors" },
    { name: t('nav.faq'), href: "/FAQpage" },
  ];

  return (
      <>
        {/* --- HEADER --- */}
        <header className={`fixed top-0 left-0 w-full h-[100px] z-[5000] transition-all duration-500 ${
            isScrolled ? "bg-[#1a1a1a]/98 backdrop-blur-lg shadow-2xl" : "bg-transparent"
        }`}>
          <div className="max-w-[1700px] mx-auto h-full px-8 flex items-center justify-between">

            {/* Logo Section */}
            <Link href={`/${currentLang}`} className="flex items-center gap-4 group shrink-0">
              <Image src="/img/Navbar/FuegoLogoimg.png" alt="Fuego" width={55} height={55} className="transition-transform duration-500 group-hover:scale-110" />
              <div className="flex flex-col leading-none">
                <span className="font-playfair text-[26px] font-bold text-[#f26722] uppercase tracking-tighter">Fuego</span>
                <span className="font-playfair italic text-[12px] text-[#f26722]/60 tracking-[0.25em]">Dance School</span>
              </div>
            </Link>

            {/* Desktop Nav - Mer 'fylld' design */}
            <nav className="hidden xl:flex items-center gap-10">
              {navLinks.map((link) => (
                  <Link
                      key={link.name}
                      href={`/${currentLang}${link.href}`}
                      className={`text-[14px] font-extrabold uppercase tracking-[0.2em] transition-all duration-300 ${
                          link.isCta
                              ? "bg-[#f26722] text-white px-10 py-4 rounded-full hover:scale-105 shadow-[0_0_20px_rgba(242,103,34,0.3)]"
                              : "text-white hover:text-[#f26722]"
                      }`}
                  >
                    {link.name}
                  </Link>
              ))}
            </nav>

            {/* Right Section: Språk + Socials */}
            <div className="flex items-center gap-8">
              <div className="hidden md:flex items-center gap-5 border-r border-white/10 pr-8">
                <a href="https://instagram.com" target="_blank" className="text-white/60 hover:text-[#f26722] transition-colors">
                  <FaInstagram size={22} />
                </a>
                <a href="https://facebook.com" target="_blank" className="text-white/60 hover:text-[#f26722] transition-colors">
                  <FaFacebookF size={20} />
                </a>
              </div>

              <button onClick={handleLanguageChange} className="text-white font-black text-sm hover:text-[#f26722] transition-colors tracking-widest">
                {currentLang === "sv" ? "EN" : "SV"}
              </button>

              <button onClick={() => setIsMenuOpen(true)} className="xl:hidden text-white p-2">
                <FaBars size={28} />
              </button>
            </div>
          </div>
        </header>

        {/* --- MOBILE OVERLAY --- */}
        <div className={`fixed inset-0 z-[6000] bg-[#0c0c0c] transition-all duration-700 ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}>
          <div className="relative flex flex-col h-full px-10 py-12">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 text-white/50 hover:text-white">
              <FaTimes size={35} />
            </button>

            <nav className="flex flex-col justify-center items-center flex-grow space-y-10">
              {navLinks.map((link, i) => (
                  <Link
                      key={link.name}
                      href={`/${currentLang}${link.href}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex flex-col items-center"
                  >
                    <span className="text-[10px] text-orange-500 font-mono tracking-[0.5em] mb-2">0{i + 1}</span>
                    <span className="font-playfair text-4xl text-white uppercase tracking-widest group-hover:italic group-hover:text-[#f26722] transition-all">
                  {link.name}
                </span>
                  </Link>
              ))}
            </nav>

            <div className="flex flex-col items-center gap-8 pt-10 border-t border-white/5">
              <div className="flex gap-10">
                <FaInstagram size={24} className="text-white/40 hover:text-white transition-colors" />
                <FaFacebookF size={22} className="text-white/40 hover:text-white transition-colors" />
              </div>
              <button onClick={handleLanguageChange} className="text-[#f26722] font-bold tracking-[0.3em] uppercase text-xs">
                {currentLang === "sv" ? "English Version" : "Svenska"}
              </button>
            </div>
          </div>
        </div>
      </>
  );
};

export default Navbar;