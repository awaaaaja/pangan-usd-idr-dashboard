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

export default async function SumateraBaratPage() {
  const data = await getResearchData();

  if (!data) return <EmptyState />;

  const championRows = data.metricsSumateraBarat.filter((row) =>
    row.experiment.includes("Random Forest"),
  );
  const local = data.shapLocalObservation[0];

  return (
    <div className="space-y-6">
      <ResearchPageHeader
        title="Fokus Sumatera Barat"
        description="Ringkasan backtesting historis untuk Sumatera Barat berdasarkan artefak resmi fase pertama."
        badges={<MethodologyBadge tone="backtest">Backtesting Historis</MethodologyBadge>}
        visual={{
          src: "/assets/pangan-pulse/hero-data-archipelago.svg",
          alt: "Ilustrasi data kepulauan Indonesia untuk konteks regional Sumatera Barat.",
          caption: "Ringkasan regional tersedia sebagai metrik agregat, bukan explorer prediksi granular.",
        }}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {championRows.map((row) => (
          <ResearchMetricCard
            key={row.id}
            label={`MAE champion ${row.levelHarga}`}
            value={formatDecimal(row.mae, 4)}
            unit="poin persentase"
            caption={`${formatInteger(row.n)} observasi, ${row.periodeMulai.toISOString().slice(0, 10)} sampai ${row.periodeAkhir.toISOString().slice(0, 10)}.`}
          />
        ))}
        {local && (
          <ResearchMetricCard
            label="Contoh SHAP lokal"
            value={formatDecimal(local.absoluteError, 4)}
            unit="absolute error"
            caption={`${local.provinsi}, ${local.komoditas}, ${local.tanggal.toISOString().slice(0, 10)}.`}
          />
        )}
      </div>

      <EvidenceNote>{SCIENCE_NOTES.backtesting}</EvidenceNote>

      <ChartCard
        title="Metrik Sumatera Barat"
        unit="MAE dan RMSE"
        period="Test akhir 2025"
        caption="Perbandingan metrik yang tersedia untuk konsumen dan produsen di Sumatera Barat."
        source={RESEARCH_SOURCE}
        isEmpty={data.metricsSumateraBarat.length === 0}
      >
        <ResearchApexChart
          type="bar"
          categories={data.metricsSumateraBarat.map(
            (row) => `${row.levelHarga} - ${row.experiment.replace("Random Forest", "RF")}`,
          )}
          series={[
            { name: "MAE", data: data.metricsSumateraBarat.map((row) => row.mae) },
            { name: "RMSE", data: data.metricsSumateraBarat.map((row) => row.rmse) },
          ]}
          yAxisTitle="Nilai metrik"
        />
      </ChartCard>

      <ResearchDataTable
        title="Tabel Sumatera Barat"
        caption="Tabel resmi `20_metrik_test_sumatera_barat.csv`."
        source={RESEARCH_SOURCE}
        rows={data.metricsSumateraBarat.map((row) => ({
          level_harga: row.levelHarga,
          experiment: row.experiment,
          n: row.n,
          mae: row.mae,
          rmse: row.rmse,
          r2: row.r2,
          direction: row.directionalAccuracyPct,
        }))}
        columns={[
          { key: "level_harga", header: "Level" },
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
    </div>
  );
}
