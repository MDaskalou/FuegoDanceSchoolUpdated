"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const DynamicNavbar = dynamic(() => import("@/components/Navbar").then((mod) => mod.Navbar), {
  ssr: false,
  loading: () => <div style={{ height: 80, backgroundColor: "#1a1a1a" }} />,
});

interface SiteChromeProps {
  children: React.ReactNode;
}

export default function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = /^\/[^/]+\/admin(\/|$)/.test(pathname);

  if (isAdmin) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <DynamicNavbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CookieConsent />
    </>
  );
}
