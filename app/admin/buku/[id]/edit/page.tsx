import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BookForm } from "@/components/BookForm";
import { updateBook } from "../../actions";

export const metadata = { title: "Edit Buku - Admin Perpustakaan Digital" };

export default async function EditBookPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id, 10);
  const [book, categories] = await Promise.all([
    id ? db.book.findUnique({ where: { id } }) : Promise.resolve(null),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!book) {
    notFound();
  }

  const boundUpdate = updateBook.bind(null, book.id);
  const initialValues: Record<string, string> = {
    title: book.title,
    author: book.author,
    category_id: book.categoryId ? String(book.categoryId) : "",
    publisher: book.publisher ?? "",
    publication_year: book.publicationYear ? String(book.publicationYear) : "",
    isbn: book.isbn ?? "",
    stock: String(book.stock),
    cover_url: book.coverUrl ?? "",
    description: book.description ?? "",
  };

  return (
    <>
      <div className="page-heading">
        <div><span className="eyebrow dark">Update</span><h1>Edit Buku</h1></div>
      </div>
      <section className="panel form-panel">
        <BookForm
          action={boundUpdate}
          categories={categories}
          initialValues={initialValues}
          submitLabel="Perbarui Buku"
        />
      </section>
    </>
  );
}
