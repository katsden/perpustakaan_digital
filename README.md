<<<<<<< HEAD
# Perpustakaan Digital (Next.js + Prisma + PostgreSQL)

Port dari versi PHP + MySQL ke stack yang native buat Vercel:
**Next.js 14 (App Router) + Prisma ORM + PostgreSQL**, biar bisa deploy langsung
tanpa runtime PHP pihak ketiga.

## Yang berubah dari versi PHP

| PHP (lama)                       | Next.js (baru)                                      |
|-----------------------------------|-------------------------------------------------------|
| Session PHP (`$_SESSION`)         | Cookie sesi ter-signed (JWT, `httpOnly`)               |
| MySQL + PDO                       | PostgreSQL + Prisma ORM                                |
| Form POST + `verify_csrf()`       | Next.js Server Actions (proteksi origin bawaan Next)   |
| `require_admin()` di tiap file    | `middleware.ts` (proteksi semua route `/admin/*`) + `requireAdmin()` di layout/action |
| Flash via session                 | Flash via cookie berumur pendek (~10 detik)            |

Semua fitur functional sama: beranda (search + filter kategori), login admin,
dashboard statistik, CRUD kategori, CRUD buku, validasi form, dan akun demo
`admin` / `admin123`.

## Menjalankan di lokal

1. Install dependency:
   ```bash
   npm install
   ```
2. Siapin database Postgres gratis (pilih salah satu, paling gampang **Neon**):
   - https://neon.tech → New Project → copy connection string.
   - Atau pake Vercel Postgres langsung dari dashboard project lu nanti.
3. Copy `.env.example` jadi `.env`, isi:
   ```
   DATABASE_URL="<connection string dari Neon/Vercel Postgres>"
   SESSION_SECRET="<string acak panjang, generate: openssl rand -base64 32>"
   ```
4. Push schema ke database & isi data demo:
   ```bash
   npx prisma db push
   npm run seed
   ```
5. Jalanin:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000`. Login admin di `/login` pake `admin` / `admin123`.

## Deploy ke Vercel

1. Push repo ini ke GitHub (lihat langkah git di bawah).
2. Buka https://vercel.com → **Add New Project** → import repo GitHub lu.
3. Sebelum klik Deploy, buka tab **Environment Variables**, isi:
   - `DATABASE_URL` — connection string Postgres (Neon / Vercel Postgres / Supabase)
   - `SESSION_SECRET` — string acak panjang
4. Deploy. Build command udah otomatis jalanin `prisma generate` (ada di `package.json`).
5. Push schema ke database production (sekali aja, dari lokal, arahin `DATABASE_URL`
   ke database production):
   ```bash
   npx prisma db push
   npm run seed
   ```
6. **Ganti password akun demo** setelah login pertama kali di production — belum
   ada halaman ganti password di versi ini, jadi update manual lewat Prisma Studio
   (`npx prisma studio`) atau query SQL langsung kalau mau ganti sekarang.

## Struktur proyek

```
app/
  page.tsx                  Beranda publik (search, filter kategori, katalog)
  (public)/login/           Halaman & action login
  logout/route.ts           Logout (hapus cookie sesi)
  admin/                    Semua halaman admin (dilindungi middleware)
    page.tsx                Dashboard
    kategori/                CRUD kategori
    buku/                    CRUD buku
components/                Komponen UI shared (form, header, sidebar, dst.)
lib/                        db.ts (Prisma client), auth.ts (sesi), flash.ts
prisma/schema.prisma        Schema database (setara sama database/perpustakaan_digital.sql)
prisma/seed.ts              Data demo (setara sama isi awal .sql)
middleware.ts               Proteksi route /admin/*
```

## Catatan jujur

- **CSRF**: PHP versi lama pake token CSRF manual di tiap form. Next.js Server
  Actions punya proteksi origin-check bawaan dari framework, jadi token manual
  udah gak dipakai — bukan dihilangin tanpa alasan.
- **Flash message**: sekarang lewat cookie berumur pendek (~10 detik), bukan
  session yang langsung "dibaca lalu dihapus" kayak PHP. Efeknya nyaris sama,
  cuma kalau reload halaman dalam <10 detik pesannya masih muncul sekali lagi.
- Belum ada halaman "ganti password" atau "lupa password" — sama kayak versi
  PHP aslinya, ini juga belum ada. Kalau lu mau publish beneran dan bukan cuma
  demo, ini salah satu hal wajib ditambahin duluan.
=======
# perpustakaan_digital
>>>>>>> c0024fa79249cd0a23d485cc889748ec2758b631
