import { notFound } from "next/navigation";
import { getCurrentAdminUser } from "@/admin/api/adminApi";
import { AdminShell } from "@/admin/components/AdminShell";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const user = await getCurrentAdminUser();

  return (
    <AdminShell lang={params.lang} user={user}>
      {children}
    </AdminShell>
  );
}
