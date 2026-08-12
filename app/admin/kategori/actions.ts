"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { setFlash } from "@/lib/flash";

export type CategoryFormState = {
  error: string;
  name: string;
};

function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();

  if (name === "") {
    return { error: "Nama kategori wajib diisi.", name };
  }

  try {
    await db.category.create({ data: { name } });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: "Nama kategori sudah digunakan.", name };
    }
    return { error: "Kategori gagal disimpan.", name };
  }

  setFlash("success", "Kategori berhasil ditambahkan.");
  revalidatePath("/admin/kategori");
  revalidatePath("/");
  redirect("/admin/kategori");
}

export async function updateCategory(
  id: number,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();

  if (name === "") {
    return { error: "Nama kategori wajib diisi.", name };
  }

  try {
    await db.category.update({ where: { id }, data: { name } });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: "Nama kategori sudah digunakan.", name };
    }
    return { error: "Kategori gagal diperbarui.", name };
  }

  setFlash("success", "Kategori berhasil diperbarui.");
  revalidatePath("/admin/kategori");
  revalidatePath("/");
  redirect("/admin/kategori");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number.parseInt(String(formData.get("id") || ""), 10);

  if (id) {
    // Matches the original schema: ON DELETE SET NULL on books.category_id
    await db.book.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
    await db.category.delete({ where: { id } });
    setFlash("success", "Kategori berhasil dihapus.");
  }

  revalidatePath("/admin/kategori");
  revalidatePath("/admin/buku");
  revalidatePath("/");
  redirect("/admin/kategori");
}
