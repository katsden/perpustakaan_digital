import Link from "next/link";
import { getSession } from "@/lib/auth";

export async function SiteHeader({ active }: { active?: string }) {
  const user = await getSession();

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" href="/">
          <span className="brand-icon" aria-hidden="true">PD</span>
          <span>
            <strong>Perpustakaan Digital</strong>
            <small>Akses ilmu, buka dunia</small>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Navigasi utama">
          <Link className={active === "home" ? "active" : ""} href="/">Beranda</Link>
          <Link href="/#koleksi">Koleksi</Link>
          <Link href="/#kategori">Kategori</Link>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <Link className="btn btn-outline" href="/admin">Dashboard</Link>
              <a className="btn btn-primary" href="/logout">Keluar</a>
            </>
          ) : (
            <Link className="btn btn-outline" href="/login">Masuk Admin</Link>
          )}
        </div>
      </div>
    </header>
  );
}
