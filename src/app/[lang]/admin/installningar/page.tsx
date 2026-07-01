import { AdminPlaceholderPage } from "@/admin/components/AdminPlaceholderPage";

export default function AdminInstallningarPage() {
  return (
    <AdminPlaceholderPage
      phase="Fas 1"
      title="Inställningar"
      description="Här samlas grundinställningar som roller, lokaler, säsonger och framtida adminbehörigheter."
      items={[
        "Roller och behörigheter.",
        "Lokaler och kapacitet.",
        "Säsonger och terminer.",
        "Grundvärden som C# backenden senare behöver äga.",
      ]}
    />
  );
}
