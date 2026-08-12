import { CategoryForm } from "@/components/CategoryForm";
import { createCategory } from "../actions";

export const metadata = { title: "Tambah Kategori - Admin Perpustakaan Digital" };

export default function NewCategoryPage() {
  return (
    <>
      <div className="page-heading">
        <div><span className="eyebrow dark">Create</span><h1>Tambah Kategori</h1></div>
      </div>
      <section className="panel form-panel narrow-panel">
        <CategoryForm action={createCategory} submitLabel="Simpan" />
      </section>
    </>
  );
}
