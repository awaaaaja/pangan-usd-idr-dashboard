# Design Brief — Pangan Pulse

## Posisi produk

Pangan Pulse adalah situs publik untuk menceritakan hasil penelitian data science. Pengunjung bukan hanya melihat metrik; mereka dibimbing memahami pertanyaan riset, cara eksperimen bekerja, hasil yang mendukung atau membatasi klaim, serta arti praktis dari temuan.

**Bukan:** dashboard KPI, SaaS, admin panel, atau aplikasi prediksi harga masa depan.

**Harus terasa seperti:** interactive visual essay + research dashboard + portfolio data science yang kredibel.

## One-line story

> Kurs USD/IDR layak diuji sebagai sinyal prediktif, tetapi hasil penelitian menunjukkan bahwa nilai tambahnya belum stabil dibanding pola harga historis dan baseline sederhana.

## Prinsip visual

1. **Insight sebelum interface.** Satu section harus menjawab satu pertanyaan, bukan hanya memajang chart.
2. **Narasi dan bukti berdampingan.** Chart selalu memiliki interpretasi sederhana, caption, sumber, dan batas klaim.
3. **Ritme editorial.** Bergantian antara dark data stage, warm reading surface, full-bleed chart, dan split narrative.
4. **Motion bermakna.** Animasi mengarahkan perhatian ke perubahan data atau alur metode; bukan dekorasi acak.
5. **Satu highlight per layar.** Hindari dinding kartu, grid 4x4, badge berlebihan, dan visual KPI generik.
6. **Interaksi jujur.** Jangan membuat control/filter yang tidak benar-benar dapat mengubah data.

## Palet “Pangan Pulse”

| Token | Hex | Penggunaan |
|---|---:|---|
| Midnight | `#101B33` | stage gelap, hero, heading kuat |
| Ink | `#1C273B` | teks utama |
| Paper | `#F7F0E4` | background utama |
| Rice | `#FFF9F1` | panel terang |
| Leaf | `#2D7E67` | produsen, pertanian |
| Data Blue | `#2D75B8` | konsumen, data |
| Chili | `#D4513E` | volatilitas, outlier, perhatian |
| Exchange | `#7256C8` | USD/IDR |
| Baseline | `#7C8493` | benchmark/naïf |
| Sand | `#D8CEBA` | stroke, divider |

## Tipografi

- Gunakan font yang sudah tersedia pada repo jika ada (misalnya Satoshi) atau system fallback.
- Headline: 48–72px desktop, 34–46px mobile, line-height 0.96–1.08.
- Body: 16–18px, line-height 1.55–1.7.
- Jangan memakai semua kapital untuk teks panjang.
- Hindari letter-spacing besar kecuali label mikro 11–12px.

## Struktur home

1. Hero: pertanyaan besar + ilustrasi data kepulauan abstrak.
2. “Apa yang diuji?”: data harga + USD/IDR + model.
3. “Temuan utama”: baseline vs champion ML pada test akhir.
4. “Apakah USD/IDR membantu?”: ablation dengan nuansa hati-hati.
5. “Apa yang paling dibaca model?”: SHAP.
6. “Bagaimana Sumatera Barat?”: hasil per level harga.
7. Metode: timeline walk-forward + embargo.
8. Artefak: figures, CSV, metadata, ZIP.

## Dilarang

- sidebar admin;
- tombol Admin di public navbar;
- hero berisi tiga sampai enam KPI card;
- glassmorphism / gradient neon / neon glow;
- stock photo generik;
- emoji sebagai ikon;
- animasi loop tanpa makna;
- istilah “AI-powered”, “smart analytics”, “next-gen”, atau klaim bombastis;
- menumpuk semua visual dalam kotak dengan border tipis.
