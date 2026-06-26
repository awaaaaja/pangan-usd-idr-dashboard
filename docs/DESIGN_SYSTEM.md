# Design System — Pangan Pulse

## Arah Visual
Pangan Pulse adalah public data storytelling website untuk penelitian data science harga pangan Indonesia. Gaya visual mengutamakan editorial research, data journalism, dan traceability artefak. Website tidak memakai pola template admin, SaaS KPI generik, atau ilustrasi stock.

## Palet Warna
| Token | Hex | Fungsi |
|---|---:|---|
| Navy riset | `#172033` | Header, hero, teks utama, fondasi kredibilitas |
| Cream editorial | `#f6efe2` | Latar utama public site |
| Hijau produsen | `#2f6f45` | Produsen, validasi positif, aksen data |
| Biru konsumen | `#2468a8` | Konsumen dan metrik pembanding |
| Merah cabai | `#d1453b` | Volatilitas, outlier, test warning |
| Ungu USD/IDR | `#6f4aa8` | Ablation dan fitur kurs |
| Abu baseline | `#6b7280` | Baseline naif dan konteks netral |
| Putih hangat | `#fffaf0` | Panel visual dan SVG ringan |

Warna tidak boleh menjadi satu-satunya pembeda. Label model, level harga, dan konteks metodologi harus tetap tertulis.

## Tipografi
- Font utama tetap Satoshi dari template, dipakai lebih editorial dengan heading besar dan line-height longgar.
- Heading hero: 4xl-7xl, weight semibold, tracking rapat secukupnya.
- Body naratif: 16-20 px, line-height 1.7-2.0.
- Eyebrow section: uppercase kecil dengan tracking lebar.

## Spacing dan Layout
- Public shell memakai top navigation horizontal minimal.
- Tidak ada sidebar dominan pada halaman publik.
- Home memakai full-screen hero dan section scrollytelling.
- `/dashboard` memakai layout editorial: insight naratif, chart lebar, evidence note, dan tabel sumber.
- Kartu kecil hanya untuk metrik inti, bukan grid KPI generik.

## Motion
- Motion menggunakan Framer Motion.
- Section memakai fade-up saat masuk viewport.
- Count-up hanya untuk metrik inti.
- Hover maksimal 2-4 px.
- Semua animasi menghormati `prefers-reduced-motion`.
- Tidak ada animasi loop dekoratif berlebihan.

## Chart
- Semua chart wajib memiliki judul, satuan, periode, caption, sumber, dan ringkasan aksesibel.
- Default chart memakai palet Pangan Pulse:
  - Hijau `#2f6f45`
  - Biru `#2468a8`
  - Merah `#d1453b`
  - Ungu `#6f4aa8`
  - Abu `#6b7280`
- Baseline naif memakai abu.
- USD/IDR memakai ungu.
- Produsen memakai hijau dan konsumen memakai biru bila keduanya dibandingkan langsung.

## Ilustrasi
- Ilustrasi dibuat sebagai SVG/React internal.
- Subjek visual: peta Indonesia abstrak, titik harga, gelombang harga, komoditas geometrik, node model, dan alur USD/IDR.
- Tidak memakai gambar AI, stock photo, glassmorphism berat, emoji, atau ikon lucu.

## Bahasa dan Klaim
- Bahasa Indonesia akademik, ringkas, dan natural.
- Website menyajikan backtesting historis, bukan prediksi harga masa depan.
- USD/IDR dibaca sebagai fitur prediktif dalam ablation, bukan bukti kausal.
- Jangan menyatakan machine learning mengalahkan baseline bila test akhir tidak mendukung.
- Semua angka harus berasal dari database/CSV penelitian asli.

## Aksesibilitas
- Kontras teks minimal harus nyaman pada cream dan navy.
- Navigasi keyboard harus terlihat melalui focus ring.
- Chart memiliki ringkasan teks `sr-only`.
- Tooltip harus dapat dibuka melalui focus, bukan hanya hover.
- Layout mobile-first dan tidak mengandalkan warna saja.
