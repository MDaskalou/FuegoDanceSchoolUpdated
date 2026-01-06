"use client";

import React, { useEffect, useState, useRef } from "react";
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

  // Placeholder med samma färg som resten av sidan - TRANSPARENT
  if (!mounted) return <div className="h-[90px] bg-transparent" />;

  const handleLanguageChange = () => {
    const newLang = currentLang === "sv" ? "en" : "sv";
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPath);
  };

  // Navigeringslänkar exakt enligt dina bilder
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

    // Orange knapp för "KURSER"
    if (isCta) return "bg-[#f26722] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#d5561d] transition-all transform hover:scale-105 shadow-lg uppercase tracking-wider";

    // Vanliga länkar: Grå/Vita med orange hover
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
          className={`fixed top-0 left-0 z-[1000] w-full transition-all duration-300 ${
              isHidden && !isMenuOpen ? "-translate-y-full" : "translate-y-0"
          } ${isScrolled
              ? "bg-gradient-to-br from-[#1f1f1f]/90 to-[#3a1f1d]/90 backdrop-blur-md border-b border-white/5 shadow-2xl"    
              : "bg-transparent"
          }`}
      >
        <div className="mx-auto flex h-[90px] max-w-[1500px] items-center justify-between px-6">

          {/* Vänster: Logotyp utan cirkel/ring */}
          <Link href={`/${currentLang}`} className="flex items-center gap-3 group">
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

          {/* Mitten: Desktop Nav (UPPERCASE) */}
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
          <div className="flex items-center gap-5">
            <button
                onClick={handleLanguageChange}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-white hover:bg-[#f26722] transition-all"
            >
              {currentLang.toUpperCase()}
            </button>

            <button
                className="text-3xl text-[#f26722] xl:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobilmeny Overlay - Samma färg som body (#121212) */}
        <div
            className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#121212] transition-transform duration-500 xl:hidden ${
                isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex flex-col gap-10 text-center uppercase tracking-widest">
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={`/${currentLang}${link.href}`}
                    onClick={(e) => handleLinkClick(e, link.href, !!link.isAnchor)}
                    className={`flex items-center justify-center gap-4 text-2xl ${link.isCta ? "text-[#f26722] font-bold" : "text-white"}`}
                >
                  {link.icon} {link.name}
                </Link>
            ))}
          </div>
        </div>
      </header>
  );
};

export default Navbar;