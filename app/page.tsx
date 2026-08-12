import { db } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FlashBanner } from "@/components/FlashBanner";

function bookInitial(title: string): string {
  const trimmed = title.trim();
  return trimmed === "" ? "?" : trimmed.charAt(0).toUpperCase();
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const categoryId = Number.parseInt(searchParams.category ?? "", 10) || 0;

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { books: true } } },
  });

  const books = await db.book.findMany({
    where: {
      AND: [
        q !== ""
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { author: { contains: q, mode: "insensitive" } },
                { isbn: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        categoryId > 0 ? { categoryId } : {},
      ],
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  const [totalBooks, totalCategories, stockAgg] = await Promise.all([
    db.book.count(),
    db.category.count(),
    db.book.aggregate({ _sum: { stock: true } }),
  ]);
  const totalStock = stockAgg._sum.stock ?? 0;

  return (
    <>
      <SiteHeader active="home" />
      <FlashBanner />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Belajar tanpa batas</span>
              <h1>
                Selamat datang di <span>Perpustakaan Digital</span>
              </h1>
              <p>
                Temukan buku, jurnal, dan sumber belajar digital dari katalog
                yang dikelola melalui panel administrator.
              </p>

              <form className="search-box" action="/" method="get">
                <label className="sr-only" htmlFor="q">Cari koleksi</label>
                <input
                  id="q"
                  name="q"
                  type="search"
                  defaultValue={q}
                  placeholder="Cari judul, penulis, atau ISBN..."
                />
                <button type="submit">Cari</button>
              </form>
            </div>

            <div className="hero-art" aria-label="Ilustrasi katalog digital">
              <div className="screen-card">
                <span>Next.js</span>
                <strong>PostgreSQL</strong>
                <small>CRUD</small>
              </div>
              <div className="book-stack"><i></i><i></i><i></i></div>
            </div>
          </div>
        </section>

        <section className="category-strip" id="kategori">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow dark">Jelajahi</span>
                <h2>Kategori Koleksi</h2>
              </div>
              <a href="/">Tampilkan semua</a>
            </div>
            <div className="category-grid">
              {categories.map((category) => (
                <a
                  key={category.id}
                  className="category-card"
                  href={`/?category=${category.id}#koleksi`}
                >
                  <span>{category.name.charAt(0).toUpperCase()}</span>
                  <strong>{category.name}</strong>
                  <small>{category._count?.books ?? 0} buku</small>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="collection-section" id="koleksi">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow dark">Katalog</span>
                <h2>{q !== "" ? "Hasil pencarian" : "Koleksi terbaru"}</h2>
              </div>
              {(q !== "" || categoryId > 0) && (
                <a href="/#koleksi">Hapus filter</a>
              )}
            </div>

            {books.length > 0 ? (
              <div className="book-grid">
                {books.map((book) => (
                  <article className="book-card" key={book.id}>
                    {book.coverUrl ? (
                      <img src={book.coverUrl} alt={`Sampul ${book.title}`} />
                    ) : (
                      <div className="book-placeholder" aria-hidden="true">
                        {bookInitial(book.title)}
                      </div>
                    )}
                    <div className="book-body">
                      <span className="book-category">
                        {book.category?.name ?? "Tanpa kategori"}
                      </span>
                      <h3>{book.title}</h3>
                      <p>{book.author}</p>
                      <div className="book-meta">
                        <span>{book.publicationYear ?? ""}</span>
                        <span>Stok: {book.stock}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>Koleksi tidak ditemukan</h3>
                <p>Gunakan kata kunci lain atau hapus filter pencarian.</p>
              </div>
            )}
          </div>
        </section>

        <section className="statistics-section">
          <div className="container statistics-grid">
            <div><strong>{totalBooks}</strong><span>Judul buku</span></div>
            <div><strong>{totalCategories}</strong><span>Kategori</span></div>
            <div><strong>{totalStock}</strong><span>Total stok</span></div>
            <div><strong>24/7</strong><span>Akses online</span></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
