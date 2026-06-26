-- Add research result tables without modifying BetterAuth tables.

CREATE TABLE "research_runs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "executed_at" TIMESTAMP(3) NOT NULL,
    "random_state" INTEGER NOT NULL,
    "dataset_observations" INTEGER NOT NULL,
    "dataset_start" DATE NOT NULL,
    "dataset_end" DATE NOT NULL,
    "final_train_end" DATE NOT NULL,
    "final_embargo_month" DATE NOT NULL,
    "final_test_start" DATE NOT NULL,
    "final_test_end" DATE NOT NULL,
    "test_observations" INTEGER NOT NULL,
    "champion_model_family" TEXT NOT NULL,
    "champion_config_name" TEXT NOT NULL,
    "champion_include_usd_idr" BOOLEAN NOT NULL,
    "target_evaluation" TEXT NOT NULL,
    "target_training" TEXT NOT NULL,
    "target_transformation" TEXT NOT NULL,
    "source_metadata_file" TEXT NOT NULL,
    "source_documentation_file" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_runs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "research_artifacts" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "artifact_key" TEXT NOT NULL,
    "artifact_type" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "row_count" INTEGER,
    "sha256" TEXT,
    "imported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_artifacts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "artifact_csv_rows" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "artifact_key" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "imported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artifact_csv_rows_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "split_registry" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "jenis" TEXT NOT NULL,
    "fold" TEXT NOT NULL,
    "train_mulai" DATE NOT NULL,
    "train_akhir" DATE NOT NULL,
    "embargo_mulai" DATE NOT NULL,
    "embargo_akhir" DATE NOT NULL,
    "validasi_mulai" DATE,
    "validasi_akhir" DATE,
    "test_mulai" DATE,
    "test_akhir" DATE,
    "train_observasi" INTEGER NOT NULL,
    "embargo_observasi" INTEGER NOT NULL,
    "validasi_observasi" INTEGER NOT NULL,
    "test_observasi" INTEGER NOT NULL,

    CONSTRAINT "split_registry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "validation_metrics" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "fold" INTEGER NOT NULL,
    "experiment" TEXT NOT NULL,
    "model_family" TEXT NOT NULL,
    "config_name" TEXT NOT NULL,
    "include_usd_idr" BOOLEAN NOT NULL,
    "n" INTEGER NOT NULL,
    "mae" DOUBLE PRECISION NOT NULL,
    "rmse" DOUBLE PRECISION NOT NULL,
    "r2" DOUBLE PRECISION NOT NULL,
    "smape_pct" DOUBLE PRECISION NOT NULL,
    "median_absolute_error" DOUBLE PRECISION NOT NULL,
    "bias" DOUBLE PRECISION NOT NULL,
    "directional_accuracy_pct" DOUBLE PRECISION,
    "directional_n" INTEGER NOT NULL,

    CONSTRAINT "validation_metrics_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "validation_leaderboard" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "experiment" TEXT NOT NULL,
    "model_family" TEXT NOT NULL,
    "config_name" TEXT NOT NULL,
    "include_usd_idr" BOOLEAN NOT NULL,
    "fold_tercakup" INTEGER NOT NULL,
    "mean_mae" DOUBLE PRECISION NOT NULL,
    "std_mae" DOUBLE PRECISION NOT NULL,
    "mean_rmse" DOUBLE PRECISION NOT NULL,
    "mean_r2" DOUBLE PRECISION NOT NULL,
    "mean_smape_pct" DOUBLE PRECISION NOT NULL,
    "mean_median_absolute_error" DOUBLE PRECISION NOT NULL,
    "mean_bias" DOUBLE PRECISION NOT NULL,
    "mean_directional_accuracy_pct" DOUBLE PRECISION,
    "selected_from_validation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "validation_leaderboard_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "test_metrics" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "experiment" TEXT NOT NULL,
    "model_family" TEXT NOT NULL,
    "config_name" TEXT NOT NULL,
    "include_usd_idr" BOOLEAN NOT NULL,
    "selected_from_validation" BOOLEAN NOT NULL,
    "n" INTEGER NOT NULL,
    "mae" DOUBLE PRECISION NOT NULL,
    "rmse" DOUBLE PRECISION NOT NULL,
    "r2" DOUBLE PRECISION NOT NULL,
    "smape_pct" DOUBLE PRECISION NOT NULL,
    "median_absolute_error" DOUBLE PRECISION NOT NULL,
    "bias" DOUBLE PRECISION NOT NULL,
    "directional_accuracy_pct" DOUBLE PRECISION,
    "directional_n" INTEGER NOT NULL,
    "is_champion_ml" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "test_metrics_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "metrics_by_price_level" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "experiment" TEXT NOT NULL,
    "model_family" TEXT NOT NULL,
    "include_usd_idr" BOOLEAN NOT NULL,
    "periode_mulai" DATE NOT NULL,
    "periode_akhir" DATE NOT NULL,
    "n" INTEGER NOT NULL,
    "mae" DOUBLE PRECISION NOT NULL,
    "rmse" DOUBLE PRECISION NOT NULL,
    "r2" DOUBLE PRECISION NOT NULL,
    "smape_pct" DOUBLE PRECISION NOT NULL,
    "median_absolute_error" DOUBLE PRECISION NOT NULL,
    "bias" DOUBLE PRECISION NOT NULL,
    "directional_accuracy_pct" DOUBLE PRECISION,
    "directional_n" INTEGER NOT NULL,
    "level_harga" TEXT NOT NULL,

    CONSTRAINT "metrics_by_price_level_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "metrics_by_commodity" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "experiment" TEXT NOT NULL,
    "model_family" TEXT NOT NULL,
    "include_usd_idr" BOOLEAN NOT NULL,
    "periode_mulai" DATE NOT NULL,
    "periode_akhir" DATE NOT NULL,
    "n" INTEGER NOT NULL,
    "mae" DOUBLE PRECISION NOT NULL,
    "rmse" DOUBLE PRECISION NOT NULL,
    "r2" DOUBLE PRECISION NOT NULL,
    "smape_pct" DOUBLE PRECISION NOT NULL,
    "median_absolute_error" DOUBLE PRECISION NOT NULL,
    "bias" DOUBLE PRECISION NOT NULL,
    "directional_accuracy_pct" DOUBLE PRECISION,
    "directional_n" INTEGER NOT NULL,
    "komoditas" TEXT NOT NULL,

    CONSTRAINT "metrics_by_commodity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "metrics_sumatera_barat" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "experiment" TEXT NOT NULL,
    "model_family" TEXT NOT NULL,
    "include_usd_idr" BOOLEAN NOT NULL,
    "periode_mulai" DATE NOT NULL,
    "periode_akhir" DATE NOT NULL,
    "n" INTEGER NOT NULL,
    "mae" DOUBLE PRECISION NOT NULL,
    "rmse" DOUBLE PRECISION NOT NULL,
    "r2" DOUBLE PRECISION NOT NULL,
    "smape_pct" DOUBLE PRECISION NOT NULL,
    "median_absolute_error" DOUBLE PRECISION NOT NULL,
    "bias" DOUBLE PRECISION NOT NULL,
    "directional_accuracy_pct" DOUBLE PRECISION,
    "directional_n" INTEGER NOT NULL,
    "level_harga" TEXT NOT NULL,

    CONSTRAINT "metrics_sumatera_barat_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "usd_idr_ablation_metrics" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "experiment" TEXT NOT NULL,
    "model_family" TEXT NOT NULL,
    "config_name" TEXT NOT NULL,
    "include_usd_idr" BOOLEAN NOT NULL,
    "selected_from_validation" BOOLEAN NOT NULL,
    "n" INTEGER NOT NULL,
    "mae" DOUBLE PRECISION NOT NULL,
    "rmse" DOUBLE PRECISION NOT NULL,
    "r2" DOUBLE PRECISION NOT NULL,
    "smape_pct" DOUBLE PRECISION NOT NULL,
    "median_absolute_error" DOUBLE PRECISION NOT NULL,
    "bias" DOUBLE PRECISION NOT NULL,
    "directional_accuracy_pct" DOUBLE PRECISION,
    "directional_n" INTEGER NOT NULL,

    CONSTRAINT "usd_idr_ablation_metrics_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "outlier_summary" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "indikator" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "persentase_dari_sampel" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "outlier_summary_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "outlier_detail" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "level_harga" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "komoditas" TEXT NOT NULL,
    "harga_rupiah" DOUBLE PRECISION NOT NULL,
    "harga_bulan_berikutnya" DOUBLE PRECISION NOT NULL,
    "perubahan_harga_1_bulan_pct" DOUBLE PRECISION NOT NULL,
    "target_perubahan_harga_1_bulan_pct" DOUBLE PRECISION NOT NULL,
    "n_raw_rows" INTEGER NOT NULL,
    "unique_price_count" INTEGER NOT NULL,
    "min_price" DOUBLE PRECISION NOT NULL,
    "max_price" DOUBLE PRECISION NOT NULL,
    "flag_change_abs_100pct" BOOLEAN NOT NULL,
    "flag_target_abs_100pct" BOOLEAN NOT NULL,
    "flag_change_mad" BOOLEAN NOT NULL,
    "flag_target_mad" BOOLEAN NOT NULL,
    "flag_source_conflict" BOOLEAN NOT NULL,

    CONSTRAINT "outlier_detail_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "outlier_sensitivity" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "experiment" TEXT NOT NULL,
    "skenario" TEXT NOT NULL,
    "n" INTEGER NOT NULL,
    "mae" DOUBLE PRECISION NOT NULL,
    "rmse" DOUBLE PRECISION NOT NULL,
    "r2" DOUBLE PRECISION NOT NULL,
    "smape_pct" DOUBLE PRECISION NOT NULL,
    "median_absolute_error" DOUBLE PRECISION NOT NULL,
    "bias" DOUBLE PRECISION NOT NULL,
    "directional_accuracy_pct" DOUBLE PRECISION,
    "directional_n" INTEGER NOT NULL,

    CONSTRAINT "outlier_sensitivity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "shap_global_importance" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "feature" TEXT NOT NULL,
    "mean_abs_shap" DOUBLE PRECISION NOT NULL,
    "kelompok_fitur" TEXT NOT NULL,

    CONSTRAINT "shap_global_importance_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "shap_group_importance" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "kelompok_fitur" TEXT NOT NULL,
    "mean_abs_shap" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "shap_group_importance_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "shap_local_observation" (
    "id" TEXT NOT NULL,
    "research_run_id" TEXT NOT NULL,
    "source_file" TEXT NOT NULL,
    "row_index" INTEGER NOT NULL,
    "level_harga" TEXT NOT NULL,
    "kode_provinsi" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "komoditas" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "harga_rupiah" DOUBLE PRECISION NOT NULL,
    "usd_idr_rata_rata_bulanan" DOUBLE PRECISION NOT NULL,
    "target_perubahan_harga_1_bulan_pct" DOUBLE PRECISION NOT NULL,
    "prediksi" DOUBLE PRECISION NOT NULL,
    "aktual" DOUBLE PRECISION NOT NULL,
    "absolute_error" DOUBLE PRECISION NOT NULL,
    "is_sumatera_barat" BOOLEAN NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "shap_local_observation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "research_artifacts_run_key_file_key" ON "research_artifacts"("research_run_id", "artifact_key", "source_file");
CREATE INDEX "research_artifacts_run_idx" ON "research_artifacts"("research_run_id");

CREATE UNIQUE INDEX "artifact_csv_rows_run_key_row_key" ON "artifact_csv_rows"("research_run_id", "artifact_key", "row_index");
CREATE INDEX "artifact_csv_rows_run_artifact_idx" ON "artifact_csv_rows"("research_run_id", "artifact_key");

CREATE UNIQUE INDEX "split_registry_run_file_row_key" ON "split_registry"("research_run_id", "source_file", "row_index");
CREATE INDEX "split_registry_run_jenis_idx" ON "split_registry"("research_run_id", "jenis");

CREATE UNIQUE INDEX "validation_metrics_run_file_row_key" ON "validation_metrics"("research_run_id", "source_file", "row_index");
CREATE INDEX "validation_metrics_run_fold_idx" ON "validation_metrics"("research_run_id", "fold");

CREATE UNIQUE INDEX "validation_leaderboard_run_file_row_key" ON "validation_leaderboard"("research_run_id", "source_file", "row_index");
CREATE INDEX "validation_leaderboard_run_mae_idx" ON "validation_leaderboard"("research_run_id", "mean_mae");

CREATE UNIQUE INDEX "test_metrics_run_file_row_key" ON "test_metrics"("research_run_id", "source_file", "row_index");
CREATE INDEX "test_metrics_run_mae_idx" ON "test_metrics"("research_run_id", "mae");

CREATE UNIQUE INDEX "metrics_price_level_run_file_row_key" ON "metrics_by_price_level"("research_run_id", "source_file", "row_index");
CREATE INDEX "metrics_price_level_run_level_idx" ON "metrics_by_price_level"("research_run_id", "level_harga");

CREATE UNIQUE INDEX "metrics_commodity_run_file_row_key" ON "metrics_by_commodity"("research_run_id", "source_file", "row_index");
CREATE INDEX "metrics_commodity_run_mae_idx" ON "metrics_by_commodity"("research_run_id", "mae");

CREATE UNIQUE INDEX "metrics_sumbar_run_file_row_key" ON "metrics_sumatera_barat"("research_run_id", "source_file", "row_index");
CREATE INDEX "metrics_sumbar_run_level_idx" ON "metrics_sumatera_barat"("research_run_id", "level_harga");

CREATE UNIQUE INDEX "usd_ablation_run_file_row_key" ON "usd_idr_ablation_metrics"("research_run_id", "source_file", "row_index");
CREATE INDEX "usd_ablation_run_include_idx" ON "usd_idr_ablation_metrics"("research_run_id", "include_usd_idr");

CREATE UNIQUE INDEX "outlier_summary_run_file_row_key" ON "outlier_summary"("research_run_id", "source_file", "row_index");

CREATE UNIQUE INDEX "outlier_detail_run_file_row_key" ON "outlier_detail"("research_run_id", "source_file", "row_index");
CREATE INDEX "outlier_detail_run_target_idx" ON "outlier_detail"("research_run_id", "target_perubahan_harga_1_bulan_pct");

CREATE UNIQUE INDEX "outlier_sensitivity_run_file_row_key" ON "outlier_sensitivity"("research_run_id", "source_file", "row_index");
CREATE INDEX "outlier_sensitivity_run_scenario_idx" ON "outlier_sensitivity"("research_run_id", "skenario");

CREATE UNIQUE INDEX "shap_global_run_file_row_key" ON "shap_global_importance"("research_run_id", "source_file", "row_index");
CREATE INDEX "shap_global_run_mean_idx" ON "shap_global_importance"("research_run_id", "mean_abs_shap");

CREATE UNIQUE INDEX "shap_group_run_file_row_key" ON "shap_group_importance"("research_run_id", "source_file", "row_index");

CREATE UNIQUE INDEX "shap_local_run_file_row_key" ON "shap_local_observation"("research_run_id", "source_file", "row_index");
CREATE INDEX "shap_local_run_provinsi_idx" ON "shap_local_observation"("research_run_id", "provinsi");

ALTER TABLE "research_artifacts" ADD CONSTRAINT "research_artifacts_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "artifact_csv_rows" ADD CONSTRAINT "artifact_csv_rows_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "split_registry" ADD CONSTRAINT "split_registry_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "validation_metrics" ADD CONSTRAINT "validation_metrics_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "validation_leaderboard" ADD CONSTRAINT "validation_leaderboard_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "test_metrics" ADD CONSTRAINT "test_metrics_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "metrics_by_price_level" ADD CONSTRAINT "metrics_by_price_level_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "metrics_by_commodity" ADD CONSTRAINT "metrics_by_commodity_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "metrics_sumatera_barat" ADD CONSTRAINT "metrics_sumatera_barat_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "usd_idr_ablation_metrics" ADD CONSTRAINT "usd_idr_ablation_metrics_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "outlier_summary" ADD CONSTRAINT "outlier_summary_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "outlier_detail" ADD CONSTRAINT "outlier_detail_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "outlier_sensitivity" ADD CONSTRAINT "outlier_sensitivity_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "shap_global_importance" ADD CONSTRAINT "shap_global_importance_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "shap_group_importance" ADD CONSTRAINT "shap_group_importance_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "shap_local_observation" ADD CONSTRAINT "shap_local_observation_research_run_id_fkey" FOREIGN KEY ("research_run_id") REFERENCES "research_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
