import Link from "next/link";
import { db } from "@/lib/db";
import { deleteBook } from "./actions";
import { ConfirmForm } from "@/components/ConfirmForm";

export const metadata = { title: "Data Buku - Admin Perpustakaan Digital" };

export default async function BukuPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();

  const books = await db.book.findMany({
    where:
      q !== ""
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { author: { contains: q, mode: "insensitive" } },
              { isbn: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
    include: { category: true },
    orderBy: { id: "desc" },
  });

  return (
    <>
      <div className="page-heading">
        <div><span className="eyebrow dark">CRUD</span><h1>Data Buku</h1></div>
        <Link className="btn btn-primary" href="/admin/buku/new">+ Tambah Buku</Link>
      </div>

      <section className="panel">
        <form className="toolbar" method="get" action="/admin/buku">
          <input type="search" name="q" defaultValue={q} placeholder="Cari judul, penulis, atau ISBN" />
          <button className="btn btn-secondary" type="submit">Cari</button>
          {q !== "" && <a className="btn btn-light" href="/admin/buku">Reset</a>}
        </form>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>No.</th><th>Judul</th><th>Penulis</th><th>Kategori</th><th>Tahun</th><th>Stok</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book.id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{book.title}</strong>
                    <br />
                    <small>ISBN: {book.isbn || "-"}</small>
                  </td>
                  <td>{book.author}</td>
                  <td>{book.category?.name ?? "Tanpa kategori"}</td>
                  <td>{book.publicationYear ?? ""}</td>
                  <td>{book.stock}</td>
                  <td className="actions">
                    <Link className="btn btn-small btn-warning" href={`/admin/buku/${book.id}/edit`}>
                      Edit
                    </Link>
                    <ConfirmForm action={deleteBook} confirmText="Hapus buku ini?">
                      <input type="hidden" name="id" value={book.id} />
                      <button className="btn btn-small btn-danger" type="submit">Hapus</button>
                    </ConfirmForm>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr><td colSpan={7}>Data buku tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
