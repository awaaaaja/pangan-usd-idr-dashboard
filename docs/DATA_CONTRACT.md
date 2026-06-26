# Data Contract — Artefak Penelitian

## Struktur sumber
```
research-artifacts/
  documentation/
  figures/
  models/
  tables/
```

## Tabel utama yang harus diimpor pada Fase 1
| Key | File | Fungsi dashboard |
|---|---|---|
| audit_raw | 01_audit_data_mentah.csv | Audit data mentah |
| coverage_level | 04_cakupan_raw_per_level_harga.csv | Cakupan produsen/konsumen |
| cleaning | 05_ringkasan_pembersihan_panel.csv | Pembersihan panel |
| clean_coverage | 06_cakupan_panel_bersih.csv | Cakupan panel bersih |
| usd_integration | 07_ringkasan_integrasi_usd_idr.csv | Integrasi kurs |
| lag_audit | 08_audit_perlakuan_lag_hilang.csv | Kebijakan strict-lag |
| outlier_summary | 09_ringkasan_audit_outlier.csv | Ringkasan outlier |
| outlier_detail | 10_detail_outlier_audit.csv | Detail audit outlier |
| feature_registry | 11_registry_fitur.csv | Daftar fitur |
| split_registry | 12_registry_split_temporal_embargo.csv | Fold dan embargo |
| validation_fold | 13_metrik_walk_forward_per_fold.csv | Metrik tiap fold |
| validation_leaderboard | 14_leaderboard_walk_forward.csv | Pemilihan berdasarkan MAE |
| selected_configs | 15_konfigurasi_terpilih_dari_validasi.csv | Konfigurasi terpilih |
| test_metrics | 16_metrik_test_akhir.csv | Seluruh metrik test akhir |
| champion_test | 17_metrik_test_akhir_champion_ml.csv | Champion ML |
| test_level | 18_metrik_test_per_level_harga.csv | Konsumen/produsen |
| test_commodity | 19_metrik_test_per_komoditas_champion.csv | Komoditas |
| sumbar | 20_metrik_test_sumatera_barat.csv | Sumatera Barat |
| outlier_sensitivity | 21_sensitivitas_outlier_test_akhir.csv | Sensitivitas |
| usd_ablation | 22_ablation_usd_idr_test_akhir.csv | Eksperimen USD/IDR |
| shap_global | 23_shap_global_importance_champion.csv | Feature importance |
| shap_group | 24_shap_importance_per_kelompok.csv | Grup SHAP |
| shap_local | 25_observasi_shap_lokal.csv | Satu observasi lokal |
| figure_index | 26_indeks_visualisasi_bab_iv.csv | Indeks gambar |
| table_index | 27_indeks_tabel_bab_iv.csv | Indeks tabel |

## Required database tables
Buat tabel terketik untuk metrik yang sering di-query:
- `research_runs`
- `research_artifacts`
- `split_registry`
- `validation_metrics`
- `validation_leaderboard`
- `test_metrics`
- `metrics_by_price_level`
- `metrics_by_commodity`
- `metrics_sumatera_barat`
- `usd_idr_ablation_metrics`
- `outlier_summary`
- `outlier_detail`
- `outlier_sensitivity`
- `shap_global_importance`
- `shap_group_importance`
- `shap_local_observation`

Buat tabel generik untuk audit/tabel metadata yang tidak dipakai sebagai filter utama:
- `artifact_csv_rows`: `research_run_id`, `artifact_key`, `row_index`, `payload jsonb`.

## Required field policy
- Semua tabel penelitian harus memiliki `research_run_id`.
- Jangan mengubah nama CSV sumber tanpa menyimpan `source_file`.
- Store dates as `date` / `timestamp`, not as untyped display strings.
- Store metrics as numeric (`decimal`/`double precision`), not formatted string.
- Store `include_usd_idr` as boolean.
- Store `selected_from_validation` as boolean.
- Store source artifact filename for traceability.
- Importer must reject unknown/missing required columns with an actionable error.

## Artifact integrity
Source metadata:
- input harga SHA256: `1ed7aa600fe2dc841920d6098ef9e2764419855b639591ad225fe44ee2e0591d`
- input USD/IDR SHA256: `4c4a997c77798d7fceb5716125a47a12fee21cb0abc3ee46046edbdb84b5217f`
- Python execution timestamp: `2026-06-26T08:58:12.872676+00:00`
- random_state: `42`

## Missing Phase 2 exports — do not invent them
Before interactive observation-level filtering can exist, the notebook must produce:
1. `fact_price_monthly_dashboard.csv`
2. `fact_test_predictions_all_models.csv`
3. `fact_walk_forward_predictions.csv`
4. `fact_shap_local_samples.csv`
5. `fact_dashboard_filters.csv`

A future data contract must document their columns before code is written.
