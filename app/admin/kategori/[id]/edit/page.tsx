import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CategoryForm } from "@/components/CategoryForm";
import { updateCategory } from "../../actions";

export const metadata = { title: "Edit Kategori - Admin Perpustakaan Digital" };

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id, 10);
  const category = id ? await db.category.findUnique({ where: { id } }) : null;

  if (!category) {
    notFound();
  }

  const boundUpdate = updateCategory.bind(null, category.id);

  return (
    <>
      <div className="page-heading">
        <div><span className="eyebrow dark">Update</span><h1>Edit Kategori</h1></div>
      </div>
      <section className="panel form-panel narrow-panel">
        <CategoryForm action={boundUpdate} initialName={category.name} submitLabel="Perbarui" />
      </section>
    </>
  );
}
