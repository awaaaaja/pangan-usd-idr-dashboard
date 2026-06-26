# Next.js Admin Template + Supabase PostgreSQL

This is a dashboard template.
Data riset prediksi Harga Pangan USD/IDR dapat diisi menggunakan script otomatis.

## Instalasi dan Setup Database

1. Pastikan variabel environment pada file `.env` sudah diisi (contoh di `.env.example`).
   - `DATABASE_URL` wajib ada
   - `RESEARCH_RUN_ID` (opsional, default: `run-2026-06-26-walkforward-embargo-usd-idr`)

2. Deploy skema database Prisma:
   ```bash
   npx prisma migrate deploy
   ```

3. Jalankan script importer riset:
   ```bash
   npm run db:seed-research
   ```

4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
