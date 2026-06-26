# Peta Asset dan Penggunaan

## Asset custom (SVG)

| Asset | Lokasi tujuan | Fungsi |
|---|---|---|
| `pangan-pulse-mark.svg` | navbar/footer | brand mark sederhana |
| `hero-data-archipelago.svg` | hero | visual abstrak Indonesia + sinyal harga |
| `commodity-cluster.svg` | section data | cabai, bawang, beras bergaya geometrik |
| `methodology-flow.svg` | methodology | data → feature → model → validation → SHAP |
| `walkforward-embargo.svg` | validation | ilustrasi embargo satu bulan |
| `price-wave.svg` | background | lapisan gelombang harga |
| `dot-field.svg` | background | tekstur node-data |

## Asset hasil penelitian

`assets/research-figures/` berisi 15 figure asli yang berasal dari hasil notebook. Gunakan sebagai:
- figure statis/fallback jika data interaktif belum tersedia;
- modal “lihat figure penelitian”;
- konten halaman download;
- bukti visual pada halaman metodologi/appendix.

Jangan mengubah label, angka, atau caption figure asli.

## Mappings halaman

| Halaman | Asset utama | Figure penelitian |
|---|---|---|
| `/` | hero-data-archipelago, price-wave | 01, 02, 05 |
| `/dashboard` | commodity-cluster | 04, 05, 07 |
| `/dashboard/data-quality` | dot-field | 02, 03 |
| `/dashboard/validation` | walkforward-embargo | 04, 05 |
| `/dashboard/usd-idr-ablation` | price-wave | 06 |
| `/dashboard/test-evaluation` | price-wave | 07, 08, 09, 10, 11 |
| `/dashboard/sumatera-barat` | hero-data-archipelago | 12 |
| `/dashboard/explainability` | methodology-flow | 13, 14, 15 |
| `/methodology` | methodology-flow, walkforward-embargo | 01 |
