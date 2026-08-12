import { db } from "@/lib/db";
import { BookForm } from "@/components/BookForm";
import { createBook } from "../actions";

export const metadata = { title: "Tambah Buku - Admin Perpustakaan Digital" };

export default async function NewBookPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <>
      <div className="page-heading">
        <div><span className="eyebrow dark">Create</span><h1>Tambah Buku</h1></div>
      </div>
      <section className="panel form-panel">
        <BookForm action={createBook} categories={categories} submitLabel="Simpan Buku" />
      </section>
    </>
  );
}
