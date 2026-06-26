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

export default async function SegmentsPage() {
  const data = await getResearchData();

  if (!data) return <EmptyState />;

  const topCommodities = data.metricsByCommodity.slice(0, 15);

  return (
    <div className="space-y-6">
      <ResearchPageHeader
        title="Segmen Hasil yang Tersedia"
        description="Ringkasan evaluasi menurut level harga dan komoditas dari artefak resmi. Tidak ada explorer prediksi granular karena detail observasi penuh belum tersedia pada fase pertama."
        badges={<MethodologyBadge tone="test">Segmen Test Akhir</MethodologyBadge>}
        visual={{
          src: "/assets/pangan-pulse/commodity-cluster.svg",
          alt: "Ilustrasi komoditas pangan untuk segmen level harga dan komoditas.",
          caption: "Segmen dibaca sebagai ringkasan agregat dari artefak resmi.",
        }}
      />

      <EvidenceNote tone="warning">
        {SCIENCE_NOTES.backtesting} Dataset fase pertama tidak memuat detail
        prediksi seluruh observasi, sehingga halaman ini tidak menyediakan
        filter provinsi x komoditas x tanggal.
      </EvidenceNote>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="MAE per Level Harga"
          unit="MAE, poin persentase"
          period="Test akhir 2025"
          caption="Perbandingan level konsumen dan produsen untuk model champion dan baseline yang tersedia."
          source={RESEARCH_SOURCE}
          isEmpty={data.metricsByPriceLevel.length === 0}
        >
          <ResearchApexChart
            type="bar"
            categories={data.metricsByPriceLevel.map(
              (row) => `${row.levelHarga} - ${row.experiment.replace("Random Forest", "RF")}`,
            )}
            series={[
              {
                name: "MAE",
                data: data.metricsByPriceLevel.map((row) => row.mae),
              },
            ]}
            yAxisTitle="MAE"
          />
        </ChartCard>

        <ChartCard
          title="Komoditas dengan MAE Tertinggi"
          unit="MAE, poin persentase"
          period="Test akhir 2025"
          caption="Lima belas komoditas dengan kesalahan prediksi tertinggi pada champion ML."
          source={RESEARCH_SOURCE}
          isEmpty={topCommodities.length === 0}
        >
          <ResearchApexChart
            type="bar"
            horizontal
            categories={topCommodities.map((row) => row.komoditas)}
            series={[
              {
                name: "MAE",
                data: topCommodities.map((row) => row.mae),
              },
            ]}
            yAxisTitle="MAE"
          />
        </ChartCard>
      </div>

      <ResearchDataTable
        title="Metrik per Level Harga"
        caption="Tabel resmi `18_metrik_test_per_level_harga.csv`."
        source={RESEARCH_SOURCE}
        rows={data.metricsByPriceLevel.map((row) => ({
          level_harga: row.levelHarga,
          experiment: row.experiment,
          periode: `${row.periodeMulai.toISOString().slice(0, 10)} - ${row.periodeAkhir.toISOString().slice(0, 10)}`,
          n: row.n,
          mae: row.mae,
          rmse: row.rmse,
          direction: row.directionalAccuracyPct,
        }))}
        columns={[
          { key: "level_harga", header: "Level" },
          { key: "experiment", header: "Eksperimen" },
          { key: "periode", header: "Periode" },
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
            key: "direction",
            header: "Directional",
            align: "right",
            render: (row) =>
              row.direction === null ? "-" : formatPercent(Number(row.direction), 2),
          },
        ]}
      />

      <ResearchDataTable
        title="Metrik per Komoditas Champion"
        caption="Tabel resmi `19_metrik_test_per_komoditas_champion.csv`; ditampilkan semua komoditas yang tersedia."
        source={RESEARCH_SOURCE}
        rows={data.metricsByCommodity.map((row) => ({
          komoditas: row.komoditas,
          periode: `${row.periodeMulai.toISOString().slice(0, 10)} - ${row.periodeAkhir.toISOString().slice(0, 10)}`,
          n: row.n,
          mae: row.mae,
          rmse: row.rmse,
          r2: row.r2,
        }))}
        columns={[
          { key: "komoditas", header: "Komoditas" },
          { key: "periode", header: "Periode" },
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
  );
}
