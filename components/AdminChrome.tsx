"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SessionUser } from "@/lib/auth";

export function AdminTopbar({ user }: { user: SessionUser }) {
  return (
    <header className="admin-topbar">
      <Link className="brand" href="/admin">
        <span className="brand-icon">PD</span>
        <span><strong>Admin Perpustakaan</strong><small>Panel pengelolaan data</small></span>
      </Link>
      <div className="admin-user">
        <span>{user.name}</span>
        <Link className="btn btn-small btn-outline" href="/">Lihat Situs</Link>
        <a className="btn btn-small btn-danger" href="/logout">Keluar</a>
      </div>
    </header>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (prefix: string, exact = false) =>
    exact ? pathname === prefix : pathname.startsWith(prefix);

  return (
    <aside className="admin-sidebar">
      <nav aria-label="Navigasi administrator">
        <Link className={isActive("/admin", true) ? "active" : ""} href="/admin">Dashboard</Link>
        <Link className={isActive("/admin/buku") ? "active" : ""} href="/admin/buku">Data Buku</Link>
        <Link className={isActive("/admin/kategori") ? "active" : ""} href="/admin/kategori">Data Kategori</Link>
      </nav>
    </aside>
  );
}
