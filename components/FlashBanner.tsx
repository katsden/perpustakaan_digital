import { readFlash } from "@/lib/flash";

export function FlashBanner() {
  const flash = readFlash();
  if (!flash) return null;

  return (
    <div className={`container flash flash-${flash.type}`} role="alert">
      {flash.message}
    </div>
  );
}
