# Audit & Deployment Database Dashboard

## Ringkasan Audit (Bagian A)

Berdasarkan hasil audit menyeluruh pada *dashboard pangan-usd-idr-dashboard*:
1. **Penyebab Utama "Data belum tersedia"**: 
   - Tabel `ResearchRun` tidak ditemukan akibat belum diisi.
   - Layanan `research.service.ts` membaca data dari tabel `ResearchArtifact` dan `ArtifactCsvRow` menggunakan referensi string konstan spesifik (contoh: `"audit_raw"`, `"missing_raw_harga"`, `"figure_index"`, dll).
   - Pada kondisi awal, data CSV pendukung (misal `01_audit_data_mentah.csv`) tidak disematkan key artifak yang benar sehingga API mengembalikan _empty state_.
2. **Ketergantungan Foreign Key**: 
   Seluruh tabel terkait metrik, shap, dan observasi bergantung pada `ResearchRun.id`. `ResearchArtifact` bersifat unik per `[researchRunId, artifactKey, sourceFile]`. Import harus menghapus (Cascade) _run id_ lama bila ada, kemudian mengisi `ResearchRun` dan men-seed data CSV.
3. **Konfigurasi Environment**:
   Diperlukan `DATABASE_URL` dengan format URL PostgreSQL valid untuk koneksi Prisma dan `RESEARCH_RUN_ID` (default: `run-2026-06-26-walkforward-embargo-usd-idr`).

## Cara Deployment (Lokal / CI)

### 1. Migrasi Skema
Sebelum melakukan seeding, pastikan skema database *up to date*:
```bash
npx prisma migrate deploy
```

### 2. Seeding Data
Script `scripts/seed-research.ts` sudah bersifat **idempotent**, membaca seluruh CSV asli tanpa mengarang nama header (menggunakan parsing header eksplisit melalui `csv-parse`), dan menangani berbagai struktur data (null, boolean, number) dengan aman.
```bash
npm run db:seed-research
```
Jika `DATABASE_URL` tidak terdapat di environment secara langsung, eksekusi ini akan otomatis mencoba meload nilai dari `.env.local` atau `.env`.

### 3. Validasi & Build
Setelah seed berhasil dijalankan, Anda dapat memastikan integritas data dan TypeScript build:
```bash
npm run build
```
Atau akses endpoint diagnostic lokal di rute: `GET /api/research-health`

## Instruksi Deploy Vercel (Bagian E)

Untuk men-deploy ke Vercel:
1. Masuk ke dashboard project Vercel.
2. Ke menu **Settings > Environment Variables**.
3. Pastikan `DATABASE_URL` telah diset menggunakan Connection String PostgreSQL produksi Anda (Misalnya dari Supabase). **INGAT: Jangan menaruh secret ini di dalam file `.env` yang di-push ke Git.**
4. (Opsional) Tambahkan `RESEARCH_RUN_ID` jika Anda menggunakan run identifier yang berbeda dari default.
5. Deploy dari CLI Vercel atau git push:
   - `npx prisma migrate deploy` dapat dijalankan dari mesin lokal Anda atau CI dengan nilai env yang diarahkan ke database produksi.
   - `npm run db:seed-research` juga dapat dijalankan lokal menunjuk ke database produksi. **(Perhatian: Karena kita menggunakan Supabase (remote DB), migrasi dan seed cukup dilakukan sekali saja secara remote. Tidak perlu dilakukan selama fase Build Vercel)**.
6. Trigger Vercel Deployment (Git Push atau redeploy).

_Catatan:_ Kita secara sengaja TIDAK menaruh proses `seed-research` maupun `migrate deploy` di script _build_ Vercel untuk mencegah beban yang tidak perlu saat scale/redeploy instance Next.js.
