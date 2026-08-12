import { requireAdmin } from "@/lib/auth";
import { AdminTopbar, AdminSidebar } from "@/components/AdminChrome";
import { FlashBanner } from "@/components/FlashBanner";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="admin-body">
      <AdminTopbar user={user} />
      <div className="admin-shell">
        <AdminSidebar />
        <main className="admin-content">
          <FlashBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
