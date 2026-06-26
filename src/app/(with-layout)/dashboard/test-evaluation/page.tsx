import {
  ChartCard,
  EmptyState,
  EvidenceNote,
  MethodologyBadge,
  ResearchApexChart,
  ResearchDataTable,
  ResearchMetricCard,
  ResearchPageHeader,
} from "@/components/research";
import { formatDecimal, formatInteger, formatPercent } from "@/lib/research-format";
import {
  getResearchData,
  RESEARCH_SOURCE,
  SCIENCE_NOTES,
} from "@/services/research.service";

export const dynamic = "force-dynamic";

export default async function TestEvaluationPage() {
  const data = await getResearchData();

  if (!data) return <EmptyState />;

  return (
    <div className="space-y-6">
      <ResearchPageHeader
        title="Evaluasi Test Akhir"
        description="Hasil test akhir Januari-Desember 2025 setelah model dipilih dari validasi temporal. Halaman ini menampilkan hasil apa adanya, termasuk baseline naif persistensi yang lebih rendah MAE-nya."
        badges={<MethodologyBadge tone="test">Test Akhir</MethodologyBadge>}
        visual={{
          src: "/assets/pangan-pulse/price-wave.svg",
          alt: "Gelombang perubahan harga untuk visual evaluasi test akhir.",
          caption: "Test akhir hanya dipakai setelah champion dipilih dari validasi temporal.",
        }}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResearchMetricCard
          label="n test akhir"
          value={formatInteger(data.run.testObservations)}
          unit="observasi"
          caption="Dipisahkan dari proses pemilihan model."
        />
        <ResearchMetricCard
          label="MAE champion ML"
          value={formatDecimal(data.championTest?.mae, 4)}
          unit="poin persentase"
          caption={data.championTest?.experiment}
        />
        <ResearchMetricCard
          label="MAE baseline persistensi"
          value={formatDecimal(data.baselineTest?.mae, 4)}
          unit="poin persentase"
          caption="Baseline pembanding pada test akhir."
        />
        <ResearchMetricCard
          label="Directional accuracy champion"
          value={formatPercent(data.championTest?.directionalAccuracyPct, 2)}
          caption={`${formatInteger(data.championTest?.directionalN)} observasi arah.`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <EvidenceNote>{SCIENCE_NOTES.validation}</EvidenceNote>
        <EvidenceNote tone="warning">{SCIENCE_NOTES.baseline}</EvidenceNote>
      </div>

      <ChartCard
        title="Metrik Test Akhir Seluruh Model"
        unit="MAE dan RMSE"
        period="Januari-Desember 2025"
        caption="Grafik menunjukkan metrik agregat test akhir dari CSV resmi, bukan prediksi baru."
        source={RESEARCH_SOURCE}
        isEmpty={data.testMetrics.length === 0}
      >
        <ResearchApexChart
          type="bar"
          categories={data.testMetrics.map((row) =>
            row.experiment.replace("Random Forest", "RF").replace("XGBoost", "XGB"),
          )}
          series={[
            { name: "MAE", data: data.testMetrics.map((row) => row.mae) },
            { name: "RMSE", data: data.testMetrics.map((row) => row.rmse) },
          ]}
          yAxisTitle="Nilai metrik"
        />
      </ChartCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <ResearchDataTable
          title="Tabel Metrik Test Akhir"
          caption="Tabel resmi `16_metrik_test_akhir.csv`."
          source={RESEARCH_SOURCE}
          rows={data.testMetrics.map((row) => ({
            experiment: row.experiment,
            n: row.n,
            mae: row.mae,
            rmse: row.rmse,
            r2: row.r2,
            direction: row.directionalAccuracyPct,
          }))}
          columns={[
            { key: "experiment", header: "Eksperimen" },
            {
              key: "n",
              header: "n",
              align: "right",
              render: (row) => formatInteger(Number(row.n)),
            },
            {
              key: "mae",
              header: "MAE",
              align: "right",
              render: (row) => formatDecimal(Number(row.mae), 4),
            },
            {
              key: "rmse",
              header: "RMSE",
              align: "right",
              render: (row) => formatDecimal(Number(row.rmse), 4),
            },
            {
              key: "r2",
              header: "R2",
              align: "right",
              render: (row) => formatDecimal(Number(row.r2), 4),
            },
            {
              key: "direction",
              header: "Directional",
              align: "right",
              render: (row) =>
                row.direction === null ? "-" : formatPercent(Number(row.direction), 2),
            },
          ]}
        />

        <ResearchDataTable
          title="Sensitivitas Outlier"
          caption="Perbandingan skenario seluruh test dan tanpa target ekstrem."
          source={RESEARCH_SOURCE}
          rows={data.outlierSensitivity.map((row) => ({
            experiment: row.experiment,
            skenario: row.skenario,
            n: row.n,
            mae: row.mae,
            rmse: row.rmse,
            r2: row.r2,
          }))}
          columns={[
            { key: "experiment", header: "Eksperimen" },
            { key: "skenario", header: "Skenario" },
            {
              key: "n",
              header: "n",
              align: "right",
              render: (row) => formatInteger(Number(row.n)),
            },
            {
              key: "mae",
              header: "MAE",
              align: "right",
              render: (row) => formatDecimal(Number(row.mae), 4),
            },
            {
              key: "rmse",
              header: "RMSE",
              align: "right",
              render: (row) => formatDecimal(Number(row.rmse), 4),
            },
            {
              key: "r2",
              header: "R2",
              align: "right",
              render: (row) => formatDecimal(Number(row.r2), 4),
            },
          ]}
        />
      </div>
    </div>
  );
}
