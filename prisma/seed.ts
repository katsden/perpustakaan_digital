import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "Administrator",
      username: "admin",
      password: passwordHash,
      role: "admin",
    },
  });

  const categoryNames = ["Manajemen", "Teknologi", "Pendidikan", "Psikologi", "Ekonomi"];
  const categories: Record<string, number> = {};
  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories[name] = category.id;
  }

  const books = [
    {
      category: "Manajemen",
      title: "Manajemen Strategik",
      author: "Ricky W. Griffin",
      publisher: "Pustaka Ilmu",
      publicationYear: 2024,
      isbn: "9786020000001",
      stock: 8,
      description: "Pengantar strategi organisasi dan pengambilan keputusan.",
    },
    {
      category: "Teknologi",
      title: "Pemrograman Web Modern",
      author: "Eko Kurniawan",
      publisher: "Tekno Press",
      publicationYear: 2025,
      isbn: "9786020000002",
      stock: 12,
      description: "Dasar pengembangan web modern menggunakan HTML, CSS, PHP, dan basis data.",
    },
    {
      category: "Pendidikan",
      title: "Pendidikan Karakter",
      author: "Zubaedi",
      publisher: "Akademia",
      publicationYear: 2023,
      isbn: "9786020000003",
      stock: 6,
      description: "Konsep dan penerapan pendidikan karakter.",
    },
    {
      category: "Psikologi",
      title: "Psikologi Belajar",
      author: "Slameto",
      publisher: "Cendekia",
      publicationYear: 2022,
      isbn: "9786020000004",
      stock: 7,
      description: "Dasar psikologi dalam proses pembelajaran.",
    },
    {
      category: "Ekonomi",
      title: "Ekonomi Mikro",
      author: "N. Gregory Mankiw",
      publisher: "Ekonomi Media",
      publicationYear: 2024,
      isbn: "9786020000005",
      stock: 10,
      description: "Konsep permintaan, penawaran, dan mekanisme pasar.",
    },
  ];

  for (const book of books) {
    const { category, ...data } = book;
    await prisma.book.upsert({
      where: { isbn: data.isbn },
      update: {},
      create: { ...data, categoryId: categories[category] },
    });
  }

  console.log("Seed selesai. Login: admin / admin123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
