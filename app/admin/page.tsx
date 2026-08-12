import Link from "next/link";
import { db } from "@/lib/db";

export const metadata = { title: "Dashboard - Admin Perpustakaan Digital" };

export default async function AdminDashboardPage() {
  const [books, categories, stockAgg, users] = await Promise.all([
    db.book.count(),
    db.category.count(),
    db.book.aggregate({ _sum: { stock: true } }),
    db.user.count(),
  ]);

  const latestBooks = await db.book.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { category: true },
  });

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow dark">Ringkasan</span>
          <h1>Dashboard Administrator</h1>
        </div>
        <Link className="btn btn-primary" href="/admin/buku/new">+ Tambah Buku</Link>
      </div>

      <section className="admin-stat-grid">
        <article><span>Judul Buku</span><strong>{books}</strong></article>
        <article><span>Kategori</span><strong>{categories}</strong></article>
        <article><span>Total Stok</span><strong>{stockAgg._sum.stock ?? 0}</strong></article>
        <article><span>Pengguna</span><strong>{users}</strong></article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Buku terbaru</h2>
          <Link href="/admin/buku">Kelola semua</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Judul</th><th>Penulis</th><th>Kategori</th><th>Stok</th></tr>
            </thead>
            <tbody>
              {latestBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category?.name ?? "Tanpa kategori"}</td>
                  <td>{book.stock}</td>
                </tr>
              ))}
              {latestBooks.length === 0 && (
                <tr><td colSpan={4}>Belum ada data buku.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
