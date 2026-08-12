"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { BookFormState } from "@/app/admin/buku/actions";

type Category = { id: number; name: string };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? "Menyimpan..." : label}
    </button>
  );
}

const emptyValues: Record<string, string> = {
  title: "",
  author: "",
  category_id: "",
  publisher: "",
  publication_year: String(new Date().getFullYear()),
  isbn: "",
  stock: "0",
  cover_url: "",
  description: "",
};

export function BookForm({
  action,
  categories,
  initialValues,
  submitLabel,
}: {
  action: (state: BookFormState, formData: FormData) => Promise<BookFormState>;
  categories: Category[];
  initialValues?: Record<string, string>;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, {
    errors: [],
    values: initialValues ?? emptyValues,
  });
  const values = state.values;

  return (
    <form action={formAction}>
      {state.errors.length > 0 && (
        <div className="flash flash-danger">
          <strong>Periksa data berikut:</strong>
          <ul>
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-grid">
        <div className="form-group form-span-2">
          <label htmlFor="title">Judul Buku *</label>
          <input id="title" name="title" type="text" defaultValue={values.title} required />
        </div>
        <div className="form-group">
          <label htmlFor="author">Penulis *</label>
          <input id="author" name="author" type="text" defaultValue={values.author} required />
        </div>
        <div className="form-group">
          <label htmlFor="category_id">Kategori</label>
          <select id="category_id" name="category_id" defaultValue={values.category_id ?? ""}>
            <option value="">Tanpa kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="publisher">Penerbit</label>
          <input id="publisher" name="publisher" type="text" defaultValue={values.publisher} />
        </div>
        <div className="form-group">
          <label htmlFor="publication_year">Tahun Terbit</label>
          <input
            id="publication_year"
            name="publication_year"
            type="number"
            min={1000}
            max={new Date().getFullYear() + 1}
            defaultValue={values.publication_year}
          />
        </div>
        <div className="form-group">
          <label htmlFor="isbn">ISBN</label>
          <input id="isbn" name="isbn" type="text" defaultValue={values.isbn} />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stok *</label>
          <input id="stock" name="stock" type="number" min={0} defaultValue={values.stock} required />
        </div>
        <div className="form-group form-span-2">
          <label htmlFor="cover_url">URL Sampul</label>
          <input
            id="cover_url"
            name="cover_url"
            type="url"
            defaultValue={values.cover_url}
            placeholder="https://contoh.com/sampul.jpg"
          />
        </div>
        <div className="form-group form-span-2">
          <label htmlFor="description">Deskripsi</label>
          <textarea id="description" name="description" rows={5} defaultValue={values.description} />
        </div>
      </div>

      <div className="form-actions">
        <SubmitButton label={submitLabel} />
        <a className="btn btn-light" href="/admin/buku">Batal</a>
      </div>
    </form>
  );
}
