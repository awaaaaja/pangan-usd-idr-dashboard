import { db } from "@/lib/db";

export const RESEARCH_RUN_ID =
  process.env.RESEARCH_RUN_ID ?? "run-2026-06-26-walkforward-embargo-usd-idr";

export const RESEARCH_SOURCE = "Sumber: Hasil pengolahan penelitian, 2026.";

export const SCIENCE_NOTES = {
  usdIdr:
    "USD/IDR diuji sebagai fitur prediktif; hasilnya tidak langsung ditafsirkan sebagai hubungan kausal.",
  validation:
    "Model dipilih berdasarkan validasi temporal, bukan berdasarkan test akhir.",
  backtesting:
    "Dashboard menyajikan backtesting historis dan evaluasi model; bukan rekomendasi harga masa depan.",
  baseline:
    "Baseline naif persistensi memiliki MAE test akhir lebih kecil daripada champion ML pada run ini.",
};

export type ResearchData = Awaited<ReturnType<typeof getResearchData>>;

export async function getResearchData() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  return safeQuery(async () => {
    const run = await db.researchRun.findFirst({
      where: { id: RESEARCH_RUN_ID },
      orderBy: { executedAt: "desc" },
    });

    if (!run) return null;

    const [
      artifacts,
      auditRaw,
      missingHarga,
      missingUsd,
      coverageLevel,
      cleaning,
      cleanCoverage,
      usdIntegration,
      lagAudit,
      featureRegistry,
      splitRegistry,
      validationMetrics,
      validationLeaderboard,
      testMetrics,
      championTest,
      metricsByPriceLevel,
      metricsByCommodity,
      metricsSumateraBarat,
      usdIdrAblationMetrics,
      outlierSummary,
      outlierDetail,
      outlierSensitivity,
      shapGlobalImportance,
      shapGroupImportance,
      shapLocalObservation,
      figureIndex,
      tableIndex,
    ] = await Promise.all([
      db.researchArtifact.findMany({
        where: { researchRunId: run.id },
        orderBy: [{ artifactType: "asc" }, { sourceFile: "asc" }],
      }),
      csvRows(run.id, "audit_raw"),
      csvRows(run.id, "missing_raw_harga"),
      csvRows(run.id, "missing_raw_usd_idr"),
      csvRows(run.id, "coverage_level"),
      csvRows(run.id, "cleaning"),
      csvRows(run.id, "clean_coverage"),
      csvRows(run.id, "usd_integration"),
      csvRows(run.id, "lag_audit"),
      csvRows(run.id, "feature_registry"),
      db.splitRegistry.findMany({
        where: { researchRunId: run.id },
        orderBy: { rowIndex: "asc" },
      }),
      db.validationMetric.findMany({
        where: { researchRunId: run.id },
        orderBy: [{ fold: "asc" }, { rowIndex: "asc" }],
      }),
      db.validationLeaderboard.findMany({
        where: { researchRunId: run.id },
        orderBy: { meanMae: "asc" },
      }),
      db.testMetric.findMany({
        where: { researchRunId: run.id },
        orderBy: { mae: "asc" },
      }),
      db.testMetric.findFirst({
        where: { researchRunId: run.id, isChampionMl: true },
      }),
      db.metricsByPriceLevel.findMany({
        where: { researchRunId: run.id },
        orderBy: [{ levelHarga: "asc" }, { mae: "asc" }],
      }),
      db.metricsByCommodity.findMany({
        where: { researchRunId: run.id },
        orderBy: { mae: "desc" },
      }),
      db.metricsSumateraBarat.findMany({
        where: { researchRunId: run.id },
        orderBy: [{ levelHarga: "asc" }, { mae: "asc" }],
      }),
      db.usdIdrAblationMetric.findMany({
        where: { researchRunId: run.id },
        orderBy: { mae: "asc" },
      }),
      db.outlierSummary.findMany({
        where: { researchRunId: run.id },
        orderBy: { rowIndex: "asc" },
      }),
      db.outlierDetail.findMany({
        where: { researchRunId: run.id },
        orderBy: { targetPerubahanHarga1BulanPct: "desc" },
        take: 25,
      }),
      db.outlierSensitivity.findMany({
        where: { researchRunId: run.id },
        orderBy: [{ experiment: "asc" }, { skenario: "asc" }],
      }),
      db.shapGlobalImportance.findMany({
        where: { researchRunId: run.id },
        orderBy: { meanAbsShap: "desc" },
      }),
      db.shapGroupImportance.findMany({
        where: { researchRunId: run.id },
        orderBy: { meanAbsShap: "desc" },
      }),
      db.shapLocalObservation.findMany({
        where: { researchRunId: run.id },
        orderBy: { rowIndex: "asc" },
      }),
      csvRows(run.id, "figure_index"),
      csvRows(run.id, "table_index"),
    ]);

    const baselineTest = testMetrics.find((row) =>
      row.experiment.includes("Persistensi"),
    );
    const finalSplit = splitRegistry.find((row) => row.jenis === "final_test");
    const validationSplits = splitRegistry.filter(
      (row) => row.jenis === "walk_forward_validation",
    );

    return {
      run,
      artifacts,
      auditRaw,
      missingHarga,
      missingUsd,
      coverageLevel,
      cleaning,
      cleanCoverage,
      usdIntegration,
      lagAudit,
      featureRegistry,
      splitRegistry,
      finalSplit,
      validationSplits,
      validationMetrics,
      validationLeaderboard,
      testMetrics,
      championTest,
      baselineTest,
      metricsByPriceLevel,
      metricsByCommodity,
      metricsSumateraBarat,
      usdIdrAblationMetrics,
      outlierSummary,
      outlierDetail,
      outlierSensitivity,
      shapGlobalImportance,
      shapGroupImportance,
      shapLocalObservation,
      figureIndex,
      tableIndex,
    };
  });
}

async function csvRows(researchRunId: string, artifactKey: string) {
  const rows = await db.artifactCsvRow.findMany({
    where: { researchRunId, artifactKey },
    orderBy: { rowIndex: "asc" },
  });

  return rows.map((row) => row.payload as Record<string, unknown>);
}

async function safeQuery<T>(query: () => Promise<T>) {
  try {
    return await query();
  } catch (error) {
    console.error(
      "Research data query failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
