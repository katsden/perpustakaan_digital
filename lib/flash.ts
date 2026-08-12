import "server-only";
import { cookies } from "next/headers";

const FLASH_COOKIE = "flash";

export type Flash = {
  type: "success" | "danger" | "warning" | "info";
  message: string;
};

/**
 * Set a one-time flash message. Must be called from a Server Action or
 * Route Handler (Next.js does not allow writing cookies during render).
 * Short maxAge makes it act like a "read once" PHP session flash.
 */
export function setFlash(type: Flash["type"], message: string): void {
  cookies().set(FLASH_COOKIE, JSON.stringify({ type, message }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 10,
  });
}

/** Read the flash message during render. Does not delete it (see note above). */
export function readFlash(): Flash | null {
  const raw = cookies().get(FLASH_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Flash;
  } catch {
    return null;
  }
}
