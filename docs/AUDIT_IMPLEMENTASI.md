# Audit Implementasi Dashboard Riset

Tanggal audit: 2026-06-26

## Ringkasan

Repository menggunakan NextAdmin v1.3.0 dengan Next.js 16, React 19, TypeScript, Tailwind CSS 4, Prisma 7, BetterAuth, dan ApexCharts. Artefak penelitian tersedia lengkap di `research-artifacts/` dan menjadi sumber kebenaran untuk dashboard publik hasil penelitian.

Dashboard yang akan dibangun adalah evaluasi penelitian dan backtesting historis, bukan aplikasi prediksi harga masa depan. USD/IDR diuji sebagai fitur prediktif dan tidak boleh ditafsirkan sebagai hubungan kausal.

## File Wajib yang Dibaca

- `AGENTS.md`
- `PROJECT_CONTEXT.md`
- `docs/DATA_CONTRACT.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `research-artifacts/documentation/README_HASIL.md`
- `research-artifacts/documentation/draft_narasi_bab_iv.md`
- `research-artifacts/models/champion_model_metadata.json`
- Seluruh CSV pada `research-artifacts/tables/`

Catatan: `node_modules/next/dist/docs/` yang disebut dalam `AGENTS.md` tidak tersedia pada instalasi lokal. Fallback yang dibaca adalah `node_modules/next/README.md`.

## Status Template

- Layout utama: `src/app/(with-layout)/layout.tsx`
- Halaman landing template saat ini: `src/app/(with-layout)/(home)/page.tsx`
- Sidebar: `src/components/Layouts/sidebar/data/index.ts`
- Proxy auth: `src/proxy.ts`
- Prisma schema: `prisma/schema.prisma`
- Prisma client output: `src/generated/prisma`
- BetterAuth: `src/lib/auth/auth.ts`, `src/app/api/auth/[...all]/route.ts`

## Dependency Utama

- `next`: `^16.1.6`
- `react`: `^19.2.0`
- `@prisma/client`: `^7.8.0`
- `prisma`: `^7.8.0`
- `@prisma/adapter-pg`: `^7.8.0`
- `better-auth`: `^1.6.7`
- `@better-auth/prisma-adapter`: `^1.6.7`
- `apexcharts`: `^4.5.0`
- `react-apexcharts`: `^1.7.0`
- `zod`: `^4.3.6`

## Baseline Build

Perintah:

```bash
npm run build
```

Hasil baseline sebelum perubahan:

- Gagal pada Turbopack karena module `@/generated/prisma/client` belum ada.
- Penyebab: Prisma Client belum digenerate ke output custom `src/generated/prisma`.
- Tindak lanjut: jalankan `npm run db:generate` setelah schema final, lalu ulangi `npm run build`.

Tidak ada connection string, password, atau isi `.env.local` yang dicetak selama audit.

## Kondisi Data Penelitian

Artefak fase pertama tersedia pada `research-artifacts/`:

- `documentation/`
- `figures/`
- `models/`
- `tables/`

Fakta utama dari CSV dan metadata:

- Dataset strict-lag: 25.850 observasi.
- Periode strict-lag: April 2022 sampai Desember 2025.
- Final train end: 2024-11-01.
- Final embargo: 2024-12-01.
- Final test: 2025-01-01 sampai 2025-12-01.
- Observasi test akhir: 5.340.
- Champion ML validasi: Random Forest tanpa USD/IDR, `rf_regularized`.
- MAE test champion ML: 5.538375675479792.
- RMSE test champion ML: 12.308442449748899.
- R2 test champion ML: -0.029416959043041757.
- MAE test baseline naive persistensi: 5.271086850581855.
- Jumlah outlier audit total: 1.621.
- Jumlah target extreme flag: 923.

## CSV yang Tersedia

Semua CSV di `research-artifacts/tables/` berhasil dibaca. Ringkasan row count:

| File | Baris data |
|---|---:|
| `01_audit_data_mentah.csv` | 2 |
| `02_missing_value_raw_harga.csv` | 11 |
| `03_missing_value_raw_usd_idr.csv` | 5 |
| `04_cakupan_raw_per_level_harga.csv` | 2 |
| `05_ringkasan_pembersihan_panel.csv` | 4 |
| `06_cakupan_panel_bersih.csv` | 2 |
| `07_ringkasan_integrasi_usd_idr.csv` | 1 |
| `08_audit_perlakuan_lag_hilang.csv` | 7 |
| `09_ringkasan_audit_outlier.csv` | 7 |
| `10_detail_outlier_audit.csv` | 1.621 |
| `11_registry_fitur.csv` | 17 |
| `12_registry_split_temporal_embargo.csv` | 5 |
| `13_metrik_walk_forward_per_fold.csv` | 24 |
| `14_leaderboard_walk_forward.csv` | 6 |
| `15_konfigurasi_terpilih_dari_validasi.csv` | 4 |
| `16_metrik_test_akhir.csv` | 6 |
| `17_metrik_test_akhir_champion_ml.csv` | 1 |
| `18_metrik_test_per_level_harga.csv` | 6 |
| `19_metrik_test_per_komoditas_champion.csv` | 34 |
| `20_metrik_test_sumatera_barat.csv` | 6 |
| `21_sensitivitas_outlier_test_akhir.csv` | 6 |
| `22_ablation_usd_idr_test_akhir.csv` | 4 |
| `23_shap_global_importance_champion.csv` | 84 |
| `24_shap_importance_per_kelompok.csv` | 4 |
| `25_observasi_shap_lokal.csv` | 1 |
| `26_indeks_visualisasi_bab_iv.csv` | 15 |
| `27_indeks_tabel_bab_iv.csv` | 16 |

## Komponen Template yang Harus Diganti

- `src/app/(with-layout)/(home)/page.tsx`: dashboard e-commerce/template.
- `src/services/charts.services.ts`: mock chart bisnis dan fake delay.
- `src/app/(with-layout)/(home)/fetch.ts`: mock overview/chat.
- `src/app/(with-layout)/(home)/_components/*`: kartu, chat, peta, tabel template.
- `src/components/Layouts/sidebar/data/index.ts`: menu template.
- `src/components/Layouts/header/index.tsx`: copy header template, search, notification, user menu publik.
- `src/components/Charts/*`: chart bisnis template tetap ada sebagai aset template, tetapi tidak dipakai pada route penelitian.
- `src/components/Tables/*`: tabel template tetap ada sebagai aset template, tetapi tidak dipakai pada route penelitian.

## Keputusan Implementasi

- BetterAuth tetap dipertahankan.
- Supabase digunakan sebagai PostgreSQL melalui Prisma server-side.
- Tidak menggunakan Supabase Auth pada fase pertama.
- Proxy diubah agar route publik penelitian tidak memerlukan session, sementara `/admin` tetap protected.
- Semua tabel penelitian memiliki `research_run_id`.
- Importer memakai transaction, validasi kolom, dan idempotensi per `research_run_id`.
- Halaman tidak membuat filter granular provinsi x komoditas x tanggal karena detail prediksi observasi penuh belum tersedia.

## Risiko dan Batasan

- Tidak ada `fact_test_predictions_all_models.csv`, sehingga chart aktual vs prediksi hanya boleh memakai ringkasan/figure resmi, bukan explorer interaktif.
- File `25_observasi_shap_lokal.csv` hanya berisi satu observasi lokal, sehingga interpretasi lokal bersifat contoh terbatas.
- `src/generated/prisma` belum ada sebelum `npm run db:generate`.
- Build akhir memerlukan environment database valid karena Prisma dan BetterAuth digunakan pada server.
