# Rencana Implementasi yang Tidak Merusak Repo

## Phase 0 — Audit dan baseline
Output wajib:
- `docs/AUDIT_IMPLEMENTASI.md`
- `docs/ROUTE_MAP.md`
- daftar komponen mock yang akan diganti
- daftar package yang sudah ada
- validasi bahwa `npm ci` dan `npm run build` baseline berjalan atau catatan error bawaan

Aturan:
- Tidak menghapus sumber atau mengubah auth pada phase ini.
- Tidak melakukan migration/reset database.

## Phase 1 — Pondasi data Supabase
1. Tambahkan schema Prisma untuk hasil penelitian tanpa merusak tabel BetterAuth.
2. Buat migration baru saja; jangan edit migration lama.
3. Buat `.env.example` yang melengkapi kebutuhan database tanpa credential nyata.
4. Buat `scripts/import-research-artifacts.*`:
   - baca CSV dari `research-artifacts/tables`;
   - validasi kolom;
   - idempotent per `research_run_id`;
   - catat `source_file` dan timestamp impor;
   - log ringkas, bukan rahasia;
   - gunakan transaction.
5. Tambahkan `npm run db:seed-research`.
6. Buat service layer server-side untuk semua query dashboard.
7. Uji import dua kali; jumlah data tidak boleh berlipat.

## Phase 2 — Struktur route dan UI
1. Buat route publik untuk landing dan dashboard.
2. Ubah `src/proxy.ts` agar hanya `/admin` yang protected; halaman penelitian tidak memerlukan login.
3. Repurpose Sidebar dan Header; hapus terminology template hanya sesudah pengganti tersedia.
4. Buat dashboard menggunakan ApexCharts yang sudah ada.
5. Buat komponen reusable:
   - `ResearchMetricCard`
   - `MethodologyBadge`
   - `ChartCard`
   - `EvidenceNote`
   - `ResearchDataTable`
   - `EmptyState`
6. Sediakan skeleton loading dan error boundary.
7. Pastikan mobile responsive.

## Phase 3 — Halaman data
### Overview
- periode, jumlah observasi, final train/embargo/test;
- audit ringkas;
- visual cakupan strict-lag;
- fact box “ML champion validasi” dan “baseline test”.

### Data Quality
- data mentah, cleaning, lag policy, outlier;
- tabel top outlier;
- penggunaan `figures/02`, `figures/03`.

### Validation
- split registry;
- MAE per fold;
- leaderboard validasi;
- penjelasan kenapa test akhir tidak dipakai memilih model.

### USD/IDR Ablation
- compare with/without USD/IDR;
- jangan membuat klaim causal/positif.

### Test Evaluation
- baseline vs RF vs XGB;
- use official aggregate image and metrics;
- beri peringatan bahwa baseline persistensi punya MAE test lebih kecil daripada ML champion.

### Segments
- level harga, komoditas, sensitivitas outlier;
- tidak ada filter observation-level yang palsu.

### Sumatera Barat
- backtesting, bukan forecast masa depan.

### Explainability
- SHAP global, group, beeswarm, local;
- note causality limitation.

### Methodology & Downloads
- environment/reproducibility;
- source artifacts;
- downloadable selected figures/tables when available.

## Phase 4 — QA
- Cek 10 angka:
  1. 25.850 strict-lag.
  2. 4 fold.
  3. embargo final Desember 2024.
  4. test start Januari 2025.
  5. test n=5.340.
  6. champion RF no USD.
  7. champion MAE 5.5384.
  8. baseline MAE 5.2711.
  9. XGB+USD RMSE 11.6982.
  10. outlier audit count 1.621.
- Cek semua halaman desktop/mobile.
- `npm run build`.
- Cek route public tidak redirect login.
- Cek `/admin` redirect login.
- Cek no secrets client side.
- Cek no claim unsupported.
