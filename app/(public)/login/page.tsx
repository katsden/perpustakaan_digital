import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FlashBanner } from "@/components/FlashBanner";
import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "Login Administrator - Perpustakaan Digital" };

export default async function LoginPage() {
  const user = await getSession();
  if (user) {
    redirect("/admin");
  }

  return (
    <>
      <SiteHeader />
      <FlashBanner />
      <main className="auth-main">
        <section className="auth-card">
          <div className="auth-copy">
            <span className="eyebrow dark">Administrator</span>
            <h1>Masuk ke panel pengelolaan</h1>
            <p>Gunakan akun administrator untuk mengelola kategori dan katalog buku.</p>
          </div>

          <LoginForm />

          <div className="demo-account">
            <strong>Akun awal:</strong> <code>admin</code> / <code>admin123</code>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
