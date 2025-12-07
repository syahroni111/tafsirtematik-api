const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  // ====== WAJIB! Tambahkan header CORS ======
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // ===========================================

  // Ganti ceritanabi.json menjadi tafsirtematik.json
  const dbFile = path.join(__dirname, "../tafsirtematik.json");

  fs.readFile(dbFile, "utf-8", (err, data) => {
    if (err) {
      // Lebih spesifik jika gagal membaca file
      res.status(500).json({ error: "Failed to read Tafsir Tematik database" });
      return;
    }

    const db = JSON.parse(data);

    // --- Logika Filtering Tambahan ---
    // Karena Vercel hanya bisa membaca 1 file index.js (endpoint utama),
    // kita perlu logika untuk mengarahkan request ke themes atau verses.

    const url = req.url;

    if (url === "/themes") {
      res.status(200).json(db.themes);
    } else if (url.startsWith("/verses")) {
      // Contoh sederhana: Mengambil semua verses. Jika butuh filtering,
      // harus dibuat logika query parameter di sini.
      res.status(200).json(db.verses);
    } else {
      // Default: Kirim semua data (themes dan verses)
      res.status(200).json(db);
    }
    // ----------------------------------
  });
};
