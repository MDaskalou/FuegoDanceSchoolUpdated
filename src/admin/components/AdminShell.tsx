"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Camera,
  ClipboardList,
  Home,
  Megaphone,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";
import type { AdminRole, CurrentAdminUserDto } from "@/admin/types/adminDtos";

const navItems: Array<{
  label: string;
  href: string;
  icon: typeof Home;
  allowedRoles: AdminRole[];
}> = [
  { label: "Dashboard", href: "/admin", icon: Home, allowedRoles: ["Admin", "Coordinator", "Instructor"] },
  { label: "Schema", href: "/admin/schema", icon: CalendarDays, allowedRoles: ["Admin", "Coordinator", "Instructor"] },
  { label: "Kurser", href: "/admin/kurser", icon: ClipboardList, allowedRoles: ["Admin", "Coordinator", "Instructor"] },
  { label: "Events", href: "/admin/events", icon: Megaphone, allowedRoles: ["Admin", "Coordinator"] },
  { label: "Media", href: "/admin/media", icon: Camera, allowedRoles: ["Admin", "Coordinator"] },
  { label: "Instruktörer", href: "/admin/instruktorer", icon: Users, allowedRoles: ["Admin", "Coordinator"] },
  { label: "Intern info", href: "/admin/internt", icon: Newspaper, allowedRoles: ["Admin", "Coordinator", "Instructor"] },
  { label: "Inställningar", href: "/admin/installningar", icon: Settings, allowedRoles: ["Admin"] },
];

interface AdminShellProps {
  children: React.ReactNode;
  lang: string;
  user: CurrentAdminUserDto;
}

export function AdminShell({ children, lang, user }: AdminShellProps) {
  const pathname = usePathname();
  const visibleItems = navItems.filter((item) => item.allowedRoles.includes(user.role));

  return (
    <div className="min-h-screen bg-[#f7f3ef] text-[#231f1c]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-[#231f1c]/10 bg-[#231f1c] text-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 p-5">
              <Link href={`/${lang}/admin/`} className="block">
                <span className="font-playfair text-2xl font-bold text-[#f26722]">Fuego</span>
                <span className="ml-2 font-sans text-sm font-bold uppercase tracking-[0.22em] text-white/70">
                  Admin
                </span>
              </Link>
              <div className="mt-4 rounded-md bg-white/8 p-3">
                <p className="font-sans text-sm font-bold text-white">{user.name}</p>
                <p className="mt-1 font-sans text-xs uppercase tracking-[0.16em] text-white/55">
                  {user.role}
                </p>
              </div>
            </div>

            <nav className="grid gap-1 p-3 sm:grid-cols-2 lg:block lg:space-y-1">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const href = `/${lang}${item.href}/`;
                const isActive =
                  pathname === href || (item.href !== "/admin" && pathname.startsWith(href));

                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={`flex min-h-11 items-center gap-3 rounded-md px-3 py-2.5 font-sans text-sm font-bold transition ${
                      isActive
                        ? "bg-[#f26722] text-white shadow-sm"
                        : "text-white/72 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto hidden border-t border-white/10 p-5 font-sans text-xs leading-5 text-white/45 lg:block">
              Development mode. Mockdata via adminApi tills C# backend finns.
            </div>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
