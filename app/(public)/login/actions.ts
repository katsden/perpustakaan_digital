"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { setFlash } from "@/lib/flash";

export type LoginState = {
  error: string;
  username: string;
};

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (username === "" || password === "") {
    return { error: "Username dan password wajib diisi.", username };
  }

  const user = await db.user.findUnique({ where: { username } });
  const valid = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !valid) {
    return { error: "Username atau password tidak sesuai.", username };
  }

  await createSession({
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
  });

  setFlash("success", `Login berhasil. Selamat datang, ${user.name}.`);
  redirect("/admin");
}
