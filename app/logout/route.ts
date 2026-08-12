import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";
import { setFlash } from "@/lib/flash";

export async function GET(request: Request) {
  destroySession();
  setFlash("success", "Anda telah keluar dari panel administrator.");
  return NextResponse.redirect(new URL("/login", request.url));
}
