import { readFileSync, existsSync } from 'fs';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
else if (existsSync('.env')) process.loadEnvFile('.env');
import { PrismaClient, Prisma } from '../src/generated/prisma/client';
import { join } from 'path';
import { parse } from 'csv-parse/sync';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const RESEARCH_RUN_ID = process.env.RESEARCH_RUN_ID || 'run-2026-06-26-walkforward-embargo-usd-idr';
const ARTIFACTS_DIR = join(process.cwd(), 'research-artifacts', 'tables');

let prisma: PrismaClient;

// Metadata based on README_HASIL.md
const runMetadata = {
  id: RESEARCH_RUN_ID,
  title: 'Eksekusi Prediksi Harga Pangan USD/IDR',
  executedAt: new Date(),
  randomState: 42, // placeholder
  datasetObservations: 0, // placeholder
  datasetStart: new Date('2018-01-01'), // placeholder
  datasetEnd: new Date('2024-12-31'), // placeholder
  finalTrainEnd: new Date('2024-11-01'),
  finalEmbargoMonth: new Date('2024-12-01'),
  finalTestStart: new Date('2025-01-01'),
  finalTestEnd: new Date('2025-12-31'), // placeholder
  testObservations: 0, // placeholder
  championModelFamily: 'Random Forest',
  championConfigName: 'rf_regularized',
  championIncludeUsdIdr: false,
  targetEvaluation: 'MAE',
  targetTraining: 'MAE',
  targetTransformation: 'None',
  sourceMetadataFile: 'documentation/README_HASIL.md',
  sourceDocumentationFile: 'documentation/README_HASIL.md',
};

async function readCsv(filename: string): Promise<any[]> {
  const filePath = join(ARTIFACTS_DIR, filename);
  if (!existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }
  const fileContent = readFileSync(filePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    cast: (value, context) => {
      if (value === '') return null;
      if (value.toLowerCase() === 'true') return true;
      if (value.toLowerCase() === 'false') return false;
      if (!isNaN(Number(value))) return Number(value);
      return value;
    },
  });
  return records;
}

// Helper to save generic artifact rows
async function saveArtifactAndRows(filename: string, artifactKey: string, artifactType: string, records: any[]) {
  await prisma.researchArtifact.upsert({
    where: {
      researchRunId_artifactKey_sourceFile: {
        researchRunId: RESEARCH_RUN_ID,
        artifactKey: artifactKey,
        sourceFile: filename,
      }
    },
    update: {
      title: filename,
      rowCount: records.length,
    },
    create: {
      researchRunId: RESEARCH_RUN_ID,
      artifactKey: artifactKey,
      artifactType: artifactType,
      sourceFile: filename,
      title: filename,
      rowCount: records.length,
    }
  });

  const chunkSize = 1000;
  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);
    await prisma.artifactCsvRow.createMany({
      data: chunk.map((record, idx) => ({
        researchRunId: RESEARCH_RUN_ID,
        artifactKey: artifactKey,
        sourceFile: filename,
        rowIndex: i + idx + 1,
        payload: record,
      }))
    });
  }
}

async function importGenericArtifact(filename: string, artifactKey: string) {
  console.log(`Importing generic artifact: ${filename} -> ${artifactKey}`);
  const records = await readCsv(filename);
  await saveArtifactAndRows(filename, artifactKey, 'Generic', records);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    const envLocalPath = join(process.cwd(), '.env.local');
    const envPath = join(process.cwd(), '.env');
    const targetPath = existsSync(envLocalPath) ? envLocalPath : (existsSync(envPath) ? envPath : null);
    console.log("ENV Path resolved to:", targetPath);
    if (targetPath) {
      const envContent = readFileSync(targetPath, 'utf-8');
      console.log("ENV Content length:", envContent.length);
      for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx !== -1) {
            const key = trimmed.slice(0, idx).trim();
            let value = trimmed.slice(idx + 1).trim();
            value = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
            process.env[key] = value;
          }
        }
      }
    }
  }

  console.log(`Starting seed for Research Run ID: ${RESEARCH_RUN_ID}`);
  console.log("DB URL:", process.env.DATABASE_URL ? "SET" : "NOT SET");
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
  
  // Idempotency: Delete existing run and cascade
  console.log('Cleaning up existing data for this run...');
  await prisma.researchRun.deleteMany({
    where: { id: RESEARCH_RUN_ID }
  });

  // Create Research Run
  console.log('Creating ResearchRun record...');
  await prisma.researchRun.create({
    data: runMetadata
  });

  // Import generic CSVs for the dashboard
  await importGenericArtifact('01_audit_data_mentah.csv', 'audit_raw');
  await importGenericArtifact('02_missing_value_raw_harga.csv', 'missing_raw_harga');
  await importGenericArtifact('03_missing_value_raw_usd_idr.csv', 'missing_raw_usd_idr');
  await importGenericArtifact('04_cakupan_raw_per_level_harga.csv', 'coverage_level');
  await importGenericArtifact('05_ringkasan_pembersihan_panel.csv', 'cleaning');
  await importGenericArtifact('06_cakupan_panel_bersih.csv', 'clean_coverage');
  await importGenericArtifact('07_ringkasan_integrasi_usd_idr.csv', 'usd_integration');
  await importGenericArtifact('08_audit_perlakuan_lag_hilang.csv', 'lag_audit');
  await importGenericArtifact('11_registry_fitur.csv', 'feature_registry');
  await importGenericArtifact('26_indeks_visualisasi_bab_iv.csv', 'figure_index');
  await importGenericArtifact('27_indeks_tabel_bab_iv.csv', 'table_index');

  // 1. SplitRegistry
  console.log('Importing SplitRegistry...');
  const splitRecords = await readCsv('12_registry_split_temporal_embargo.csv');
  await saveArtifactAndRows('12_registry_split_temporal_embargo.csv', '12_registry_split_temporal_embargo', 'Registry', splitRecords);
  await prisma.splitRegistry.createMany({
    data: splitRecords.map((r, i) => ({
      researchRunId: RESEARCH_RUN_ID,
      sourceFile: '12_registry_split_temporal_embargo.csv',
      rowIndex: i + 1,
      jenis: r.jenis,
      fold: r.fold.toString(),
      trainMulai: new Date(r.train_mulai),
      trainAkhir: new Date(r.train_akhir),
      embargoMulai: new Date(r.embargo_mulai),
      embargoAkhir: new Date(r.embargo_akhir),
      validasiMulai: r.validasi_mulai ? new Date(r.validasi_mulai) : null,
      validasiAkhir: r.validasi_akhir ? new Date(r.validasi_akhir) : null,
      testMulai: r.test_mulai ? new Date(r.test_mulai) : null,
      testAkhir: r.test_akhir ? new Date(r.test_akhir) : null,
      trainObservasi: Number(r.train_observasi),
      embargoObservasi: Number(r.embargo_observasi),
      validasiObservasi: Number(r.validasi_observasi),
      testObservasi: Number(r.test_observasi)
    }))
  });

  // 2. ValidationMetric
  console.log('Importing ValidationMetric...');
  const valMetricsRecords = await readCsv('13_metrik_walk_forward_per_fold.csv');
  await saveArtifactAndRows('13_metrik_walk_forward_per_fold.csv', '13_metrik_walk_forward_per_fold', 'Metric', valMetricsRecords);
  await prisma.validationMetric.createMany({
    data: valMetricsRecords.map((r, i) => ({
      researchRunId: RESEARCH_RUN_ID,
      sourceFile: '13_metrik_walk_forward_per_fold.csv',
      rowIndex: i + 1,
      fold: Number(r.fold),
      experiment: String(r.experiment),
      modelFamily: String(r.model_family),
      configName: String(r.config_name),
      includeUsdIdr: Boolean(r.include_usd_idr),
      n: Number(r.n),
      mae: Number(r.mae),
      rmse: Number(r.rmse),
      r2: Number(r.r2),
      smapePct: Number(r.smape_pct),
      medianAbsoluteError: Number(r.median_absolute_error),
      bias: Number(r.bias),
      directionalAccuracyPct: r.directional_accuracy_pct !== null ? Number(r.directional_accuracy_pct) : null,
      directionalN: Number(r.directional_n)
    }))
  });

  // 3. ValidationLeaderboard
  console.log('Importing ValidationLeaderboard...');
  const valLeaderboardRecords = await readCsv('14_leaderboard_walk_forward.csv');
  const selectedConfigRecords = await readCsv('15_konfigurasi_terpilih_dari_validasi.csv');
  const selectedConfigs = new Set(selectedConfigRecords.map(r => String(r.experiment)));
  
  await saveArtifactAndRows('14_leaderboard_walk_forward.csv', '14_leaderboard_walk_forward', 'Leaderboard', valLeaderboardRecords);
  await prisma.validationLeaderboard.createMany({
    data: valLeaderboardRecords.map((r, i) => ({
      researchRunId: RESEARCH_RUN_ID,
      sourceFile: '14_leaderboard_walk_forward.csv',
      rowIndex: i + 1,
      experiment: String(r.experiment),
      modelFamily: String(r.model_family),
      configName: String(r.config_name),
      includeUsdIdr: Boolean(r.include_usd_idr),
      foldTercakup: Number(r.fold_tercakup),
      meanMae: Number(r.mean_mae),
      stdMae: Number(r.std_mae),
      meanRmse: Number(r.mean_rmse),
      meanR2: Number(r.mean_r2),
      meanSmapePct: Number(r.mean_smape_pct),
      meanMedianAbsoluteError: Number(r.mean_median_absolute_error),
      meanBias: Number(r.mean_bias),
      meanDirectionalAccuracyPct: r.mean_directional_accuracy_pct !== null ? Number(r.mean_directional_accuracy_pct) : null,
      selectedFromValidation: selectedConfigs.has(String(r.experiment))
    }))
  });

  // 4. TestMetric (16 and 17)
  console.log('Importing TestMetric...');
  const testMetricsRecords = await readCsv('16_metrik_test_akhir.csv');
  const championTestRecords = await readCsv('17_metrik_test_akhir_champion_ml.csv');
  const championExperiments = new Set(championTestRecords.map(r => String(r.experiment)));
  
  await saveArtifactAndRows('16_metrik_test_akhir.csv', '16_metrik_test_akhir', 'Metric', testMetricsRecords);
  await prisma.testMetric.createMany({
    data: testMetricsRecords.map((r, i) => ({
      researchRunId: RESEARCH_RUN_ID,
      sourceFile: '16_metrik_test_akhir.csv',
      rowIndex: i + 1,
      experiment: String(r.experiment),
      modelFamily: String(r.model_family),
      configName: String(r.config_name),
      includeUsdIdr: Boolean(r.include_usd_idr),
      selectedFromValidation: Boolean(r.selected_from_validation),
      n: Number(r.n),
      mae: Number(r.mae),
      rmse: Number(r.rmse),
      r2: Number(r.r2),
      smapePct: Number(r.smape_pct),
      medianAbsoluteError: Number(r.median_absolute_error),
      bias: Number(r.bias),
      directionalAccuracyPct: r.directional_accuracy_pct !== null ? Number(r.directional_accuracy_pct) : null,
      directionalN: Number(r.directional_n),
      isChampionMl: championExperiments.has(String(r.experiment))
    }))
  });

  // 5. MetricsByPriceLevel
  console.log('Importing MetricsByPriceLevel...');
  const priceLevelRecords = await readCsv('18_metrik_test_per_level_harga.csv');
  await saveArtifactAndRows('18_metrik_test_per_level_harga.csv', '18_metrik_test_per_level_harga', 'Metric', priceLevelRecords);
  await prisma.metricsByPriceLevel.createMany({
    data: priceLevelRecords.map((r, i) => ({
      researchRunId: RESEARCH_RUN_ID,
      sourceFile: '18_metrik_test_per_level_harga.csv',
      rowIndex: i + 1,
      experiment: String(r.experiment),
      modelFamily: String(r.model_family),
      includeUsdIdr: Boolean(r.include_usd_idr),
      periodeMulai: new Date(r.periode_mulai),
      periodeAkhir: new Date(r.periode_akhir),
      n: Number(r.n),
      mae: Number(r.mae),
      rmse: Number(r.rmse),
      r2: Number(r.r2),
      smapePct: Number(r.smape_pct),
      medianAbsoluteError: Number(r.median_absolute_error),
      bias: Number(r.bias),
      directionalAccuracyPct: r.directional_accuracy_pct !== null ? Number(r.directional_accuracy_pct) : null,
      directionalN: Number(r.directional_n),
      levelHarga: String(r.level_harga)
    }))
  });

  // 6. MetricsByCommodity
  console.log('Importing MetricsByCommodity...');
  const commodityRecords = await readCsv('19_metrik_test_per_komoditas_champion.csv');
  await saveArtifactAndRows('19_metrik_test_per_komoditas_champion.csv', '19_metrik_test_per_komoditas_champion', 'Metric', commodityRecords);
  await prisma.metricsByCommodity.createMany({
    data: commodityRecords.map((r, i) => ({
      researchRunId: RESEARCH_RUN_ID,
      sourceFile: '19_metrik_test_per_komoditas_champion.csv',
      rowIndex: i + 1,
      experiment: String(r.experiment),
      modelFamily: String(r.model_family),
      includeUsdIdr: Boolean(r.include_usd_idr),
      periodeMulai: new Date(r.periode_mulai),
      periodeAkhir: new Date(r.periode_akhir),
      n: Number(r.n),
      mae: Number(r.mae),
      rmse: Number(r.rmse),
      r2: Number(r.r2),
      smapePct: Number(r.smape_pct),
      medianAbsoluteError: Number(r.median_absolute_error),
      bias: Number(r.bias),
      directionalAccuracyPct: r.directional_accuracy_pct !== null ? Number(r.directional_accuracy_pct) : null,
      directionalN: Number(r.directional_n),
      komoditas: String(r.komoditas)
    }))
  });

  // 7. MetricsSumateraBarat
  console.log('Importing MetricsSumateraBarat...');
  const sumbarRecords = await readCsv('20_metrik_test_sumatera_barat.csv');
  await saveArtifactAndRows('20_metrik_test_sumatera_barat.csv', '20_metrik_test_sumatera_barat', 'Metric', sumbarRecords);
  await prisma.metricsSumateraBarat.createMany({
    data: sumbarRecords.map((r, i) => ({
      researchRunId: RESEARCH_RUN_ID,
      sourceFile: '20_metrik_test_sumatera_barat.csv',
      rowIndex: i + 1,
      experiment: String(r.experiment),
      modelFamily: String(r.model_family),
      includeUsdIdr: Boolean(r.include_usd_idr),
      periodeMulai: new Date(r.periode_mulai),
      periodeAkhir: new Date(r.periode_akhir),
      n: Number(r.n),
      mae: Number(r.mae),
      rmse: Number(r.rmse),
      r2: Number(r.r2),
      smapePct: Number(r.smape_pct),
      medianAbsoluteError: Number(r.median_absolute_error),
      bias: Number(r.bias),
      directionalAccuracyPct: r.directional_accuracy_pct !== null ? Number(r.directional_accuracy_pct) : null,
      directionalN: Number(r.directional_n),
      levelHarga: String(r.level_harga)
    }))
  });

  // 8. UsdIdrAblationMetric
  console.log('Importing UsdIdrAblationMetric...');
  const ablationRecords = await readCsv('22_ablation_usd_idr_test_akhir.csv');
  await saveArtifactAndRows('22_ablation_usd_idr_test_akhir.csv', '22_ablation_usd_idr_test_akhir', 'Metric', ablationRecords);
  await prisma.usdIdrAblationMetric.createMany({
    data: ablationRecords.map((r, i) => ({
      researchRunId: RESEARCH_RUN_ID,
      sourceFile: '22_ablation_usd_idr_test_akhir.csv',
      rowIndex: i + 1,
      experiment: String(r.experiment),
      modelFamily: String(r.model_family),
      configName: String(r.config_name),
      includeUsdIdr: Boolean(r.include_usd_idr),
      selectedFromValidation: Boolean(r.selected_from_validation),
      n: Number(r.n),
      mae: Number(r.mae),
      rmse: Number(r.rmse),
      r2: Number(r.r2),
      smapePct: Number(r.smape_pct),
      medianAbsoluteError: Number(r.median_absolute_error),
      bias: Number(r.bias),
      directionalAccuracyPct: r.directional_accuracy_pct !== null ? Number(r.directional_accuracy_pct) : null,
      directionalN: Number(r.directional_n)
    }))
  });

  // 9. OutlierSummary
  console.log('Importing OutlierSummary...');
  const outlierSummaryRecords = await readCsv('09_ringkasan_audit_outlier.csv');
  await saveArtifactAndRows('09_ringkasan_audit_outlier.csv', '09_ringkasan_audit_outlier', 'Summary', outlierSummaryRecords);
  await prisma.outlierSummary.createMany({
    data: outlierSummaryRecords.map((r, i) => ({
      researchRunId: RESEARCH_RUN_ID,
      sourceFile: '09_ringkasan_audit_outlier.csv',
      rowIndex: i + 1,
      indikator: String(r.indikator),
      jumlah: Number(r.jumlah),
      persentaseDariSampel: Number(r.persentase_dari_sampel)
    }))
  });

  // 10. OutlierDetail
  console.log('Importing OutlierDetail...');
  const outlierDetailRecords = await readCsv('10_detail_outlier_audit.csv');
  await saveArtifactAndRows('10_detail_outlier_audit.csv', '10_detail_outlier_audit', 'Detail', outlierDetailRecords);
  
  const chunkSize = 1000;
  for (let i = 0; i < outlierDetailRecords.length; i += chunkSize) {
    const chunk = outlierDetailRecords.slice(i, i + chunkSize);
    await prisma.outlierDetail.createMany({
      data: chunk.map((r, idx) => ({
        researchRunId: RESEARCH_RUN_ID,
        sourceFile: '10_detail_outlier_audit.csv',
        rowIndex: i + idx + 1,
        tanggal: new Date(r.tanggal),
        levelHarga: String(r.level_harga),
        provinsi: String(r.provinsi),
        komoditas: String(r.komoditas),
        hargaRupiah: Number(r.harga_rupiah),
        hargaBulanBerikutnya: Number(r.harga_bulan_berikutnya),
        perubahanHarga1BulanPct: Number(r.perubahan_harga_1_bulan_pct),
        targetPerubahanHarga1BulanPct: Number(r.target_perubahan_harga_1_bulan_pct),
        nRawRows: Number(r.n_raw_rows),
        uniquePriceCount: Number(r.unique_price_count),
        minPrice: Number(r.min_price),
        maxPrice: Number(r.max_price),
        flagChangeAbs100Pct: Boolean(r.flag_change_abs_100pct),
        flagTargetAbs100Pct: Boolean(r.flag_target_abs_100pct),
        flagChangeMad: Boolean(r.flag_change_mad),
        flagTargetMad: Boolean(r.flag_target_mad),
        flagSourceConflict: Boolean(r.flag_source_conflict)
      }))
    });
  }

  // 11. OutlierSensitivity
  console.log('Importing OutlierSensitivity...');
  const outlierSensitivityRecords = await readCsv('21_sensitivitas_outlier_test_akhir.csv');
  await saveArtifactAndRows('21_sensitivitas_outlier_test_akhir.csv', '21_sensitivitas_outlier_test_akhir', 'Sensitivity', outlierSensitivityRecords);
  await prisma.outlierSensitivity.createMany({
    data: outlierSensitivityRecords.map((r, i) => ({
      researchRunId: RESEARCH_RUN_ID,
      sourceFile: '21_sensitivitas_outlier_test_akhir.csv',
      rowIndex: i + 1,
      experiment: String(r.experiment),
      skenario: String(r.skenario),
      n: Number(r.n),
      mae: Number(r.mae),
      rmse: Number(r.rmse),
      r2: Number(r.r2),
      smapePct: Number(r.smape_pct),
      medianAbsoluteError: Number(r.median_absolute_error),
      bias: Number(r.bias),
      directionalAccuracyPct: r.directional_accuracy_pct !== null ? Number(r.directional_accuracy_pct) : null,
      directionalN: Number(r.directional_n)
    }))
  });

  // 12. ShapGlobalImportance
  console.log('Importing ShapGlobalImportance...');
  const shapGlobalRecords = await readCsv('23_shap_global_importance_champion.csv');
  await saveArtifactAndRows('23_shap_global_importance_champion.csv', '23_shap_global_importance_champion', 'Importance', shapGlobalRecords);
  await prisma.shapGlobalImportance.createMany({
    data: shapGlobalRecords.map((r, i) => ({
      researchRunId: RESEARCH_RUN_ID,
      sourceFile: '23_shap_global_importance_champion.csv',
      rowIndex: i + 1,
      feature: String(r.feature),
      meanAbsShap: Number(r.mean_abs_shap),
      kelompokFitur: String(r.kelompok_fitur)
    }))
  });

  // 13. ShapGroupImportance
  console.log('Importing ShapGroupImportance...');
  const shapGroupRecords = await readCsv('24_shap_importance_per_kelompok.csv');
  await saveArtifactAndRows('24_shap_importance_per_kelompok.csv', '24_shap_importance_per_kelompok', 'Importance', shapGroupRecords);
  await prisma.shapGroupImportance.createMany({
    data: shapGroupRecords.map((r, i) => ({
      researchRunId: RESEARCH_RUN_ID,
      sourceFile: '24_shap_importance_per_kelompok.csv',
      rowIndex: i + 1,
      kelompokFitur: String(r.kelompok_fitur),
      meanAbsShap: Number(r.mean_abs_shap)
    }))
  });

  // 14. ShapLocalObservation
  console.log('Importing ShapLocalObservation...');
  const shapLocalRecords = await readCsv('25_observasi_shap_lokal.csv');
  await saveArtifactAndRows('25_observasi_shap_lokal.csv', '25_observasi_shap_lokal', 'Observation', shapLocalRecords);
  
  for (let i = 0; i < shapLocalRecords.length; i += chunkSize) {
    const chunk = shapLocalRecords.slice(i, i + chunkSize);
    await prisma.shapLocalObservation.createMany({
      data: chunk.map((r, idx) => ({
        researchRunId: RESEARCH_RUN_ID,
        sourceFile: '25_observasi_shap_lokal.csv',
        rowIndex: i + idx + 1,
        levelHarga: String(r.level_harga),
        kodeProvinsi: String(r.kode_provinsi),
        provinsi: String(r.provinsi),
        komoditas: String(r.komoditas),
        tanggal: new Date(r.tanggal),
        hargaRupiah: Number(r.harga_rupiah),
        usdIdrRataRataBulanan: Number(r.usd_idr_rata_rata_bulanan),
        targetPerubahanHarga1BulanPct: Number(r.target_perubahan_harga_1_bulan_pct),
        prediksi: Number(r.prediksi),
        aktual: Number(r.aktual),
        absoluteError: Number(r.absolute_error),
        isSumateraBarat: Boolean(r.is_sumatera_barat),
        payload: r
      }))
    });
  }

  console.log('Verification: Fetching row counts...');
  const counts = await Promise.all([
    prisma.researchArtifact.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    prisma.artifactCsvRow.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    prisma.splitRegistry.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    prisma.validationMetric.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    prisma.validationLeaderboard.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    prisma.testMetric.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    prisma.metricsByPriceLevel.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    prisma.metricsByCommodity.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    prisma.metricsSumateraBarat.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    prisma.usdIdrAblationMetric.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    prisma.outlierSummary.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    prisma.outlierDetail.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    prisma.outlierSensitivity.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    prisma.shapGlobalImportance.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    prisma.shapGroupImportance.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    prisma.shapLocalObservation.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
  ]);

  console.log(`
  Import Summary for Run ID: ${RESEARCH_RUN_ID}
  -----------------------------------------
  ResearchArtifacts:      ${counts[0]}
  ArtifactCsvRows:        ${counts[1]}
  SplitRegistry:          ${counts[2]}
  ValidationMetric:       ${counts[3]}
  ValidationLeaderboard:  ${counts[4]}
  TestMetric:             ${counts[5]}
  MetricsByPriceLevel:    ${counts[6]}
  MetricsByCommodity:     ${counts[7]}
  MetricsSumateraBarat:   ${counts[8]}
  UsdIdrAblationMetric:   ${counts[9]}
  OutlierSummary:         ${counts[10]}
  OutlierDetail:          ${counts[11]}
  OutlierSensitivity:     ${counts[12]}
  ShapGlobalImportance:   ${counts[13]}
  ShapGroupImportance:    ${counts[14]}
  ShapLocalObservation:   ${counts[15]}
  -----------------------------------------
  Success! Data has been successfully imported.
  `);
}

main()
  .catch(e => {
    console.error('Failed to seed research data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
