import Link from "next/link";
import { db } from "@/lib/db";
import { deleteCategory } from "./actions";
import { ConfirmForm } from "@/components/ConfirmForm";

export const metadata = { title: "Data Kategori - Admin Perpustakaan Digital" };

export default async function KategoriPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { books: true } } },
  });

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow dark">CRUD</span>
          <h1>Data Kategori</h1>
        </div>
        <Link className="btn btn-primary" href="/admin/kategori/new">+ Tambah Kategori</Link>
      </div>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>No.</th><th>Nama Kategori</th><th>Jumlah Buku</th><th>Dibuat</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={category.id}>
                  <td>{index + 1}</td>
                  <td><strong>{category.name}</strong></td>
                  <td>{category._count?.books ?? 0}</td>
                  <td>{category.createdAt.toLocaleDateString("id-ID")}</td>
                  <td className="actions">
                    <Link className="btn btn-small btn-warning" href={`/admin/kategori/${category.id}/edit`}>
                      Edit
                    </Link>
                    <ConfirmForm
                      action={deleteCategory}
                      confirmText="Hapus kategori ini? Buku terkait akan menjadi tanpa kategori."
                    >
                      <input type="hidden" name="id" value={category.id} />
                      <button className="btn btn-small btn-danger" type="submit">Hapus</button>
                    </ConfirmForm>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={5}>Belum ada kategori.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
