"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { setFlash } from "@/lib/flash";

export type BookFormState = {
  errors: string[];
  values: Record<string, string>;
};

function parseBookInput(formData: FormData) {
  return {
    title: String(formData.get("title") || "").trim(),
    author: String(formData.get("author") || "").trim(),
    category_id: String(formData.get("category_id") || "").trim(),
    publisher: String(formData.get("publisher") || "").trim(),
    publication_year: String(formData.get("publication_year") || "").trim(),
    isbn: String(formData.get("isbn") || "").trim(),
    stock: String(formData.get("stock") || "0").trim(),
    cover_url: String(formData.get("cover_url") || "").trim(),
    description: String(formData.get("description") || "").trim(),
  };
}

async function validateBookInput(
  input: ReturnType<typeof parseBookInput>,
  excludeId?: number
): Promise<string[]> {
  const errors: string[] = [];
  const currentYear = new Date().getFullYear();
  const isDigits = (value: string) => /^\d+$/.test(value);

  if (input.title === "") errors.push("Judul buku wajib diisi.");
  if (input.author === "") errors.push("Nama penulis wajib diisi.");
  if (!isDigits(input.stock) || Number(input.stock) < 0) {
    errors.push("Stok harus berupa bilangan nol atau lebih.");
  }
  if (
    input.publication_year !== "" &&
    (!isDigits(input.publication_year) ||
      Number(input.publication_year) < 1000 ||
      Number(input.publication_year) > currentYear + 1)
  ) {
    errors.push("Tahun terbit tidak valid.");
  }
  if (input.cover_url !== "") {
    try {
      new URL(input.cover_url);
    } catch {
      errors.push("URL sampul tidak valid.");
    }
  }
  if (input.category_id !== "" && !isDigits(input.category_id)) {
    errors.push("Kategori tidak valid.");
  }
  if (input.category_id !== "" && isDigits(input.category_id)) {
    const count = await db.category.count({ where: { id: Number(input.category_id) } });
    if (count === 0) errors.push("Kategori tidak ditemukan.");
  }
  if (input.isbn !== "") {
    const existing = await db.book.findFirst({
      where: {
        isbn: input.isbn,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    if (existing) errors.push("ISBN sudah digunakan oleh buku lain.");
  }

  return errors;
}

function toBookData(input: ReturnType<typeof parseBookInput>) {
  return {
    title: input.title,
    author: input.author,
    categoryId: input.category_id !== "" ? Number(input.category_id) : null,
    publisher: input.publisher || null,
    publicationYear: input.publication_year !== "" ? Number(input.publication_year) : null,
    isbn: input.isbn || null,
    stock: Number(input.stock),
    coverUrl: input.cover_url || null,
    description: input.description || null,
  };
}

export async function createBook(
  _prevState: BookFormState,
  formData: FormData
): Promise<BookFormState> {
  await requireAdmin();
  const input = parseBookInput(formData);
  const errors = await validateBookInput(input);

  if (errors.length > 0) {
    return { errors, values: input };
  }

  await db.book.create({ data: toBookData(input) });

  setFlash("success", "Buku berhasil ditambahkan.");
  revalidatePath("/admin/buku");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin/buku");
}

export async function updateBook(
  id: number,
  _prevState: BookFormState,
  formData: FormData
): Promise<BookFormState> {
  await requireAdmin();
  const input = parseBookInput(formData);
  const errors = await validateBookInput(input, id);

  if (errors.length > 0) {
    return { errors, values: input };
  }

  await db.book.update({ where: { id }, data: toBookData(input) });

  setFlash("success", "Buku berhasil diperbarui.");
  revalidatePath("/admin/buku");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin/buku");
}

export async function deleteBook(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number.parseInt(String(formData.get("id") || ""), 10);

  if (id) {
    await db.book.delete({ where: { id } });
    setFlash("success", "Buku berhasil dihapus.");
  }

  revalidatePath("/admin/buku");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin/buku");
}
