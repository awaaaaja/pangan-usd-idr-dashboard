import {
  ChartCard,
  EmptyState,
  EvidenceNote,
  MethodologyBadge,
  ResearchApexChart,
  ResearchDataTable,
  ResearchPageHeader,
} from "@/components/research";
import { formatDecimal, formatInteger, formatPercent } from "@/lib/research-format";
import {
  getResearchData,
  RESEARCH_SOURCE,
  SCIENCE_NOTES,
} from "@/services/research.service";

export const dynamic = "force-dynamic";

export default async function UsdIdrAblationPage() {
  const data = await getResearchData();

  if (!data) return <EmptyState />;

  return (
    <div className="space-y-6">
      <ResearchPageHeader
        title="Ablation USD/IDR"
        description="Perbandingan konfigurasi model dengan dan tanpa fitur USD/IDR pada test akhir. Halaman ini mengevaluasi nilai tambah prediktif, bukan hubungan sebab-akibat."
        badges={
          <>
            <MethodologyBadge tone="test">Test Akhir</MethodologyBadge>
            <MethodologyBadge tone="data">USD/IDR Ablation</MethodologyBadge>
          </>
        }
        visual={{
          src: "/assets/pangan-pulse/price-wave.svg",
          alt: "Gelombang harga dan sinyal USD/IDR sebagai visual ablation.",
          caption: "USD/IDR dibaca sebagai fitur prediktif, bukan sebagai klaim sebab-akibat.",
        }}
      />

      <EvidenceNote tone="warning">{SCIENCE_NOTES.usdIdr}</EvidenceNote>

      <ChartCard
        title="Perbandingan MAE Ablation USD/IDR"
        unit="MAE, poin persentase"
        period="Januari-Desember 2025"
        caption="Hasil test akhir tidak boleh dibaca sebagai bukti bahwa USD/IDR menyebabkan perubahan harga pangan."
        source={RESEARCH_SOURCE}
        isEmpty={data.usdIdrAblationMetrics.length === 0}
      >
        <ResearchApexChart
          type="bar"
          categories={data.usdIdrAblationMetrics.map((row) =>
            row.experiment.replace("Random Forest", "RF").replace("XGBoost", "XGB"),
          )}
          series={[
            {
              name: "MAE",
              data: data.usdIdrAblationMetrics.map((row) => row.mae),
            },
            {
              name: "RMSE",
              data: data.usdIdrAblationMetrics.map((row) => row.rmse),
            },
          ]}
          yAxisTitle="Nilai metrik"
        />
      </ChartCard>

      <ResearchDataTable
        title="Metrik Test Akhir Ablation"
        caption="Tabel resmi `22_ablation_usd_idr_test_akhir.csv`."
        source={RESEARCH_SOURCE}
        rows={data.usdIdrAblationMetrics.map((row) => ({
          experiment: row.experiment,
          include_usd_idr: row.includeUsdIdr ? "Dengan USD/IDR" : "Tanpa USD/IDR",
          n: row.n,
          mae: row.mae,
          rmse: row.rmse,
          r2: row.r2,
          direction: row.directionalAccuracyPct,
        }))}
        columns={[
          { key: "experiment", header: "Eksperimen" },
          { key: "include_usd_idr", header: "Fitur USD/IDR" },
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
            header: "Directional accuracy",
            align: "right",
            render: (row) => formatPercent(Number(row.direction), 2),
          },
        ]}
      />
    </div>
  );
}
