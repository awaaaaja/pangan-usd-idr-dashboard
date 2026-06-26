# Validasi Angka Dashboard

Dokumen ini mencocokkan angka yang tampil pada UI dengan artefak CSV sumber. Angka dashboard berasal dari import database hasil CSV; tidak ada angka sintetis.

## Ringkasan Dry-Run Importer

Perintah:

```bash
node scripts/import-research-artifacts.mjs --dry-run
```

Hasil:

- Artefak tercatat: 44.
- Baris CSV traceability: 1.901.
- `outlier_detail`: 1.621 baris.
- `shap_global_importance`: 84 baris.
- `shap_local_observation`: 1 baris.

## Pencocokan Angka UI

| No | Angka UI | Halaman | Sumber CSV | Nilai sumber |
|---:|---|---|---|---|
| 1 | Observasi strict-lag = 25.850 | `/`, `/dashboard`, `/dashboard/data-quality` | `08_audit_perlakuan_lag_hilang.csv`, baris `dataset_model_strict_lag` | `25850` |
| 2 | Fold validasi = 4 | `/dashboard`, `/dashboard/validation` | `12_registry_split_temporal_embargo.csv`, `walk_forward_validation` | 4 fold |
| 3 | Final train end = 2024-11-01 | `/dashboard/methodology` | `12_registry_split_temporal_embargo.csv`, baris `final_test` | `train_akhir=2024-11-01` |
| 4 | Embargo final = 2024-12-01 | `/dashboard/validation`, `/dashboard/methodology` | `12_registry_split_temporal_embargo.csv`, baris `final_test` | `embargo_mulai=2024-12-01`, `embargo_akhir=2024-12-01` |
| 5 | Final test start = 2025-01-01 | `/dashboard/methodology` | `12_registry_split_temporal_embargo.csv`, baris `final_test` | `test_mulai=2025-01-01` |
| 6 | Test observations = 5.340 | `/dashboard`, `/dashboard/test-evaluation` | `12_registry_split_temporal_embargo.csv`, baris `final_test` | `test_observasi=5340` |
| 7 | Champion ML = Random Forest tanpa USD/IDR, `rf_regularized` | `/`, `/dashboard/test-evaluation`, `/dashboard/methodology` | `17_metrik_test_akhir_champion_ml.csv` dan `champion_model_metadata.json` | `model_family=Random Forest`, `include_usd_idr=False`, `config_name=rf_regularized` |
| 8 | MAE champion ML test = 5,5384 | `/`, `/dashboard/test-evaluation` | `17_metrik_test_akhir_champion_ml.csv` | `mae=5.538375675479792` |
| 9 | RMSE champion ML test = 12,3084 | `/dashboard/test-evaluation` | `17_metrik_test_akhir_champion_ml.csv` | `rmse=12.308442449748899` |
| 10 | R2 champion ML test = -0,0294 | `/dashboard/test-evaluation` | `17_metrik_test_akhir_champion_ml.csv` | `r2=-0.029416959043041757` |
| 11 | MAE baseline naïf persistensi test = 5,2711 | `/dashboard`, `/dashboard/test-evaluation` | `16_metrik_test_akhir.csv`, baris `Naif Persistensi (0%)` | `mae=5.271086850581855` |
| 12 | XGBoost + USD/IDR RMSE = 11,6982 | `/dashboard/usd-idr-ablation` | `22_ablation_usd_idr_test_akhir.csv`, baris `XGBoost | dengan USD/IDR | xgb_regularized` | `rmse=11.698248498138998` |
| 13 | Outlier audit total = 1.621 | `/dashboard/data-quality` | `09_ringkasan_audit_outlier.csv`, baris `outlier_audit_flag_total` | `jumlah=1621` |
| 14 | Target extreme flag total = 923 | `/dashboard/data-quality` | `09_ringkasan_audit_outlier.csv`, baris `target_extreme_flag_total` | `jumlah=923` |
| 15 | Top SHAP feature = `harga_lag_1`, mean_abs_shap 1,397096 | `/dashboard/explainability` | `23_shap_global_importance_champion.csv`, baris pertama | `mean_abs_shap=1.397096440151026` |
| 16 | SHAP group riwayat harga/musiman = 6,329028 | `/dashboard/explainability` | `24_shap_importance_per_kelompok.csv`, baris `Riwayat harga/musiman` | `mean_abs_shap=6.329027770260051` |

## Validasi Klaim

- Dashboard menampilkan bahwa model ML champion dipilih berdasarkan validasi temporal.
- Dashboard menampilkan bahwa baseline naïf persistensi memiliki MAE test akhir lebih kecil daripada champion ML pada run ini.
- Dashboard tidak menyatakan USD/IDR menyebabkan perubahan harga pangan.
- Dashboard tidak menyediakan filter prediksi granular yang tidak didukung artefak fase pertama.
