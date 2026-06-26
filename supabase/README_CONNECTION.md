# Koneksi Supabase yang aman untuk repo ini

## Pilihan yang dipakai
- Database: Supabase PostgreSQL.
- ORM: Prisma 7 + `@prisma/adapter-pg` yang sudah digunakan template.
- Authentication: BetterAuth existing template.
- Fase 1 tidak menggunakan Supabase Auth dan tidak memerlukan `NEXT_PUBLIC_SUPABASE_URL`.

## Membuat project
1. Buat project baru pada Supabase.
2. Simpan password database di password manager, bukan di chat atau Git.
3. Pada Supabase dashboard pilih Connect.
4. Untuk pengembangan dan migration, ambil **Session Pooler**.
5. Untuk deployment serverless, pilih **Transaction Pooler** setelah aplikasi stabil dan ikuti parameter Prisma/Supabase yang berlaku.

## `.env.local` minimum
```dotenv
DATABASE_URL="PASTE_CONNECTION_STRING_DARI_SUPABASE"
BETTER_AUTH_SECRET="GENERATE_SECRET_ACAK_PANJANG"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Jangan commit `.env.local`.

## Urutan command setelah Codex menambahkan migration dan script seed
```bash
npm ci
npm run db:generate
npx prisma migrate dev --name research_dashboard_initial
npm run db:seed-research
npm run dev
```

## Setelah aplikasi siap deploy
- Tambahkan URL deploy pada `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, dan trusted origins yang dipakai BetterAuth.
- Gunakan connection pooler sesuai model deployment.
- Jalankan `npx prisma migrate deploy`, bukan `migrate dev`, untuk deployment.
- Jangan mengaktifkan Supabase Auth tanpa rencana migrasi eksplisit dari BetterAuth.
