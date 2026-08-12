export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong>Perpustakaan Digital</strong>
          <p>Proyek pembelajaran Next.js, Prisma, dan PostgreSQL.</p>
        </div>
        <p>&copy; {new Date().getFullYear()} Perpustakaan Digital.</p>
      </div>
    </footer>
  );
}
