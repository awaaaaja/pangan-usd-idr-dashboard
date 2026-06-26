# Route Map Dashboard Riset

Dashboard publik ini menyajikan evaluasi penelitian dan backtesting historis. Semua route penelitian bersifat publik. Route `/admin` tetap menggunakan BetterAuth.

## Public Routes

| Route | Tujuan | Data utama | Catatan klaim |
|---|---|---|---|
| `/` | Landing penelitian | metadata run, champion, test final, indeks artefak | Backtesting historis, bukan prediksi masa depan |
| `/dashboard` | Overview riset | audit raw, strict-lag, split final, champion, baseline | Model dipilih dari validasi temporal |
| `/dashboard/data-quality` | Audit kualitas data | audit raw, missing value, coverage, cleaning, lag audit, outlier | Outlier dipertahankan untuk analisis utama |
| `/dashboard/validation` | Validasi temporal | split registry, per-fold metrics, leaderboard validasi | Test akhir tidak dipakai memilih model |
| `/dashboard/usd-idr-ablation` | Evaluasi nilai tambah USD/IDR | ablation test akhir, feature registry | USD/IDR prediktif, bukan kausal |
| `/dashboard/test-evaluation` | Evaluasi test akhir | test metrics, champion, sensitivitas outlier | Baseline naive persistensi memiliki MAE test lebih kecil dari champion ML |
| `/dashboard/segments` | Segmen hasil tersedia | level harga, komoditas, sensitivitas outlier | Tidak ada explorer prediksi granular |
| `/dashboard/sumatera-barat` | Fokus Sumatera Barat | metrik Sumatera Barat, SHAP lokal | Backtesting historis |
| `/dashboard/explainability` | Interpretasi SHAP | SHAP global, group, local observation | SHAP menjelaskan kontribusi internal model |
| `/dashboard/methodology` | Metodologi dan reproduksibilitas | metadata model, split, feature registry, dokumentasi | Batas data fase pertama |
| `/dashboard/downloads` | Indeks artefak unduhan | index tabel, index figure, metadata run | Link artefak lokal yang tersedia |

## Protected Routes

| Route | Tujuan | Auth |
|---|---|---|
| `/admin` | Status import/run fase pertama | BetterAuth required |

## Navigation Labels

Sidebar penelitian mengganti menu template:

- Ikhtisar
- Kualitas Data
- Validasi Temporal
- Ablation USD/IDR
- Evaluasi Test Akhir
- Segmen Hasil
- Sumatera Barat
- Explainability
- Metodologi
- Downloads
- Admin

## Data Boundary

Route tidak menyediakan filter prediksi per provinsi, komoditas, dan tanggal karena ZIP fase pertama belum memiliki detail prediksi seluruh observasi. Halaman `segments` hanya menampilkan ringkasan yang tersedia pada CSV resmi.

## Required Scientific Notes

Catatan berikut muncul pada halaman relevan:

- USD/IDR diuji sebagai fitur prediktif; hasilnya tidak langsung ditafsirkan sebagai hubungan kausal.
- Model dipilih berdasarkan validasi temporal, bukan berdasarkan test akhir.
- Dashboard menyajikan backtesting historis dan evaluasi model; bukan rekomendasi harga masa depan.
- Baseline naive persistensi memiliki MAE test akhir lebih kecil daripada champion ML pada run ini.
