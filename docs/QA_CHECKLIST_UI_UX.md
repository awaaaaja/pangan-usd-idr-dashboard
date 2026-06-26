# QA Checklist UI/UX Public

## Visual
- [ ] Tidak ada sidebar admin di halaman public.
- [ ] Tidak ada tombol Admin pada navbar public.
- [ ] Tidak ada wall of KPI cards.
- [ ] Tidak ada gradient neon/glassmorphism generik.
- [ ] Hero kuat di desktop dan mobile.
- [ ] Tidak ada overflow horizontal yang tidak disengaja.
- [ ] Semua section punya ritme visual berbeda namun konsisten.

## Data dan klaim
- [ ] Metrik berasal dari query/CSV asli.
- [ ] Sumber dan periode terlihat pada setiap figure.
- [ ] “Backtesting historis” terlihat minimal di hero/footer/test evaluation.
- [ ] Tidak ada klaim USD/IDR sebagai sebab-akibat.
- [ ] Tidak ada klaim ML mengalahkan baseline tanpa pembuktian.
- [ ] SHAP dijelaskan sebagai interpretasi model, bukan kausalitas.

## Motion
- [ ] Motion tidak menghalangi pembacaan.
- [ ] `prefers-reduced-motion` didukung.
- [ ] Tidak ada autoplay loop yang agresif.
- [ ] Chart animation hanya sekali saat masuk viewport.
- [ ] Hover subtle, tidak meloncat berlebihan.

## Aksesibilitas
- [ ] Kontras teks cukup.
- [ ] Fokus keyboard terlihat.
- [ ] Figure memiliki caption/summary teks.
- [ ] Warna bukan satu-satunya pembeda.
- [ ] Tombol/link memiliki label bermakna.

## Teknis
- [ ] `npm run build` berhasil.
- [ ] Tidak ada mock data.
- [ ] Tidak ada perubahan schema/importer/back-end tanpa kebutuhan.
- [ ] Tidak ada secret atau `.env.local` tercetak di UI/log.
