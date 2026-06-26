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
import { formatDecimal, formatInteger } from "@/lib/research-format";
import {
  getResearchData,
  RESEARCH_SOURCE,
  SCIENCE_NOTES,
} from "@/services/research.service";

export const dynamic = "force-dynamic";

export default async function DataQualityPage() {
  const data = await getResearchData();

  if (!data) return <EmptyState />;

  const strictLag = data.lagAudit.find(
    (row) => row.tahap === "dataset_model_strict_lag",
  );
  const targetExtreme = data.outlierSummary.find(
    (row) => row.indikator === "target_extreme_flag_total",
  );
  const outlierTotal = data.outlierSummary.find(
    (row) => row.indikator === "outlier_audit_flag_total",
  );

  return (
    <div className="space-y-6">
      <ResearchPageHeader
        title="Kualitas Data dan Pembentukan Panel"
        description="Audit sumber data, pembersihan panel, integrasi USD/IDR, strict-lag, dan outlier yang dipertahankan dalam analisis utama."
        badges={<MethodologyBadge tone="data">Kualitas Data</MethodologyBadge>}
        visual={{
          src: "/assets/pangan-pulse/dot-field.svg",
          alt: "Tekstur node data untuk menggambarkan audit kualitas panel.",
          caption: "Panel strict-lag dibentuk dari artefak penelitian, tanpa observasi dummy.",
        }}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResearchMetricCard
          label="Baris raw harga"
          value={formatInteger(Number(data.auditRaw[0]?.baris))}
          unit="baris"
          caption="Sumber harga pangan Bapanas sebelum pembersihan panel."
        />
        <ResearchMetricCard
          label="Panel setelah integrasi USD/IDR"
          value={formatInteger(Number(data.usdIntegration[0]?.panel_setelah_integrasi))}
          unit="observasi"
          caption="Tidak ada panel tanpa pasangan USD/IDR pada ringkasan integrasi."
        />
        <ResearchMetricCard
          label="Dataset model strict-lag"
          value={formatInteger(Number(strictLag?.observasi))}
          unit="observasi"
          caption="Observasi dengan tiga lag harga dan target t+1 tersedia."
        />
        <ResearchMetricCard
          label="Target ekstrem"
          value={formatInteger(targetExtreme?.jumlah)}
          unit="observasi"
          caption={`${formatDecimal(targetExtreme?.persentaseDariSampel, 4)}% dari sampel strict-lag.`}
        />
      </div>

      <EvidenceNote>{SCIENCE_NOTES.backtesting}</EvidenceNote>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Cakupan Raw per Level Harga"
          unit="Observasi"
          period="Raw: 2021-2026 sesuai sumber"
          caption="Cakupan konsumen dan produsen sebelum panel strict-lag dibentuk."
          source={RESEARCH_SOURCE}
          isEmpty={data.coverageLevel.length === 0}
        >
          <ResearchApexChart
            type="bar"
            categories={data.coverageLevel.map((row) => String(row.level_harga))}
            series={[
              {
                name: "Observasi",
                data: data.coverageLevel.map((row) => Number(row.observasi)),
              },
              {
                name: "Harga kosong",
                data: data.coverageLevel.map((row) => Number(row.harga_kosong)),
              },
            ]}
            yAxisTitle="Observasi"
          />
        </ChartCard>

        <ChartCard
          title="Ringkasan Flag Outlier"
          unit="Jumlah observasi"
          period="Sampel strict-lag"
          caption="Seluruh observasi flagged tetap dipertahankan pada analisis utama dan disediakan untuk audit."
          source={RESEARCH_SOURCE}
          isEmpty={data.outlierSummary.length === 0}
        >
          <ResearchApexChart
            type="bar"
            horizontal
            categories={data.outlierSummary.map((row) => row.indikator)}
            series={[
              {
                name: "Jumlah",
                data: data.outlierSummary.map((row) => row.jumlah),
              },
            ]}
            yAxisTitle="Jumlah"
          />
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ResearchDataTable
          title="Missing Value Raw Harga"
          caption="Audit missing value pada file harga sebelum pembersihan panel."
          source={RESEARCH_SOURCE}
          rows={data.missingHarga}
          columns={[
            { key: "kolom", header: "Kolom" },
            { key: "jumlah_missing", header: "Jumlah missing", align: "right" },
            {
              key: "persentase_missing",
              header: "Persentase",
              align: "right",
              render: (row) => `${formatDecimal(Number(row.persentase_missing), 4)}%`,
            },
          ]}
        />

        <ResearchDataTable
          title="Kebijakan Strict-Lag"
          caption="Audit observasi yang tersaring karena target, lag harga, atau turunan USD/IDR tidak tersedia."
          source={RESEARCH_SOURCE}
          rows={data.lagAudit}
          columns={[
            { key: "tahap", header: "Tahap" },
            {
              key: "observasi",
              header: "Observasi",
              align: "right",
              render: (row) => formatInteger(Number(row.observasi)),
            },
          ]}
        />
      </div>

      <ResearchDataTable
        title="Top Detail Outlier Audit"
        caption="Ditampilkan 25 baris teratas dari `10_detail_outlier_audit.csv` menurut target perubahan harga satu bulan berikutnya."
        source={RESEARCH_SOURCE}
        rows={data.outlierDetail.map((row) => ({
          tanggal: row.tanggal.toISOString().slice(0, 10),
          level_harga: row.levelHarga,
          provinsi: row.provinsi,
          komoditas: row.komoditas,
          target: row.targetPerubahanHarga1BulanPct,
          harga: row.hargaRupiah,
          harga_berikutnya: row.hargaBulanBerikutnya,
        }))}
        columns={[
          { key: "tanggal", header: "Tanggal" },
          { key: "level_harga", header: "Level" },
          { key: "provinsi", header: "Provinsi" },
          { key: "komoditas", header: "Komoditas" },
          {
            key: "target",
            header: "Target (%)",
            align: "right",
            render: (row) => formatDecimal(Number(row.target), 3),
          },
          {
            key: "harga",
            header: "Harga t",
            align: "right",
            render: (row) => formatInteger(Number(row.harga)),
          },
          {
            key: "harga_berikutnya",
            header: "Harga t+1",
            align: "right",
            render: (row) => formatInteger(Number(row.harga_berikutnya)),
          },
        ]}
      />

      <EvidenceNote tone="warning">
        Outlier audit total: {formatInteger(outlierTotal?.jumlah)} observasi.
        Dashboard tidak menghapus observasi ini dari hasil utama; sensitivitas
        tanpa target ekstrem disajikan pada halaman evaluasi test akhir.
      </EvidenceNote>
    </div>
  );
}
