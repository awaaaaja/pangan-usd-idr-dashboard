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

export default async function ExplainabilityPage() {
  const data = await getResearchData();

  if (!data) return <EmptyState />;

  const topFeatures = data.shapGlobalImportance.slice(0, 20);
  const local = data.shapLocalObservation[0];

  return (
    <div className="space-y-6">
      <ResearchPageHeader
        title="Explainability SHAP"
        description="Interpretasi SHAP menjelaskan kontribusi prediktif internal model champion. Hasil ini bukan bukti hubungan kausal."
        badges={<MethodologyBadge tone="shap">Interpretasi SHAP</MethodologyBadge>}
        visual={{
          src: "/assets/pangan-pulse/methodology-flow.svg",
          alt: "Ilustrasi alur fitur, model, validasi, dan interpretasi SHAP.",
          caption: "SHAP menjelaskan perilaku internal model champion pada evaluasi historis.",
        }}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResearchMetricCard
          label="Fitur SHAP global"
          value={formatInteger(data.shapGlobalImportance.length)}
          unit="fitur"
          caption="Berdasarkan `23_shap_global_importance_champion.csv`."
        />
        <ResearchMetricCard
          label="Kelompok SHAP"
          value={formatInteger(data.shapGroupImportance.length)}
          unit="kelompok"
          caption="Ringkasan kontribusi absolut per kelompok fitur."
        />
        <ResearchMetricCard
          label="Top feature"
          value={data.shapGlobalImportance[0]?.feature ?? "-"}
          caption={`Mean |SHAP| ${formatDecimal(data.shapGlobalImportance[0]?.meanAbsShap, 4)}.`}
        />
        <ResearchMetricCard
          label="Observasi lokal"
          value={local?.provinsi ?? "-"}
          caption={local ? `${local.komoditas}, ${local.tanggal.toISOString().slice(0, 10)}.` : undefined}
        />
      </div>

      <EvidenceNote tone="warning">{SCIENCE_NOTES.usdIdr}</EvidenceNote>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Top 20 SHAP Global Importance"
          unit="Mean absolute SHAP"
          period="Sampel test akhir model champion"
          caption="Fitur dengan kontribusi absolut rata-rata tertinggi pada prediksi internal model champion."
          source={RESEARCH_SOURCE}
          isEmpty={topFeatures.length === 0}
        >
          <ResearchApexChart
            type="bar"
            horizontal
            categories={topFeatures.map((row) => row.feature)}
            series={[{ name: "Mean |SHAP|", data: topFeatures.map((row) => row.meanAbsShap) }]}
            yAxisTitle="Mean |SHAP|"
          />
        </ChartCard>

        <ChartCard
          title="SHAP per Kelompok Fitur"
          unit="Mean absolute SHAP"
          period="Sampel test akhir model champion"
          caption="Agregasi kontribusi berdasarkan kelompok fitur."
          source={RESEARCH_SOURCE}
          isEmpty={data.shapGroupImportance.length === 0}
        >
          <ResearchApexChart
            type="donut"
            categories={data.shapGroupImportance.map((row) => row.kelompokFitur)}
            series={data.shapGroupImportance.map((row) => row.meanAbsShap)}
          />
        </ChartCard>
      </div>

      <ResearchDataTable
        title="Tabel SHAP Global"
        caption="Tabel resmi `23_shap_global_importance_champion.csv`, ditampilkan 30 fitur teratas."
        source={RESEARCH_SOURCE}
        limit={30}
        rows={data.shapGlobalImportance.map((row) => ({
          feature: row.feature,
          kelompok: row.kelompokFitur,
          mean_abs_shap: row.meanAbsShap,
        }))}
        columns={[
          { key: "feature", header: "Fitur" },
          { key: "kelompok", header: "Kelompok" },
          {
            key: "mean_abs_shap",
            header: "Mean |SHAP|",
            align: "right",
            render: (row) => formatDecimal(Number(row.mean_abs_shap), 6),
          },
        ]}
      />

      {local && (
        <ResearchDataTable
          title="Observasi SHAP Lokal"
          caption="CSV fase pertama hanya memiliki satu observasi lokal; tidak ditafsirkan sebagai explorer seluruh observasi."
          source={RESEARCH_SOURCE}
          rows={[
            {
              provinsi: local.provinsi,
              komoditas: local.komoditas,
              level_harga: local.levelHarga,
              tanggal: local.tanggal.toISOString().slice(0, 10),
              prediksi: local.prediksi,
              aktual: local.aktual,
              absolute_error: local.absoluteError,
              harga_rupiah: local.hargaRupiah,
            },
          ]}
          columns={[
            { key: "provinsi", header: "Provinsi" },
            { key: "komoditas", header: "Komoditas" },
            { key: "level_harga", header: "Level" },
            { key: "tanggal", header: "Tanggal" },
            {
              key: "prediksi",
              header: "Prediksi",
              align: "right",
              render: (row) => formatDecimal(Number(row.prediksi), 4),
            },
            {
              key: "aktual",
              header: "Aktual",
              align: "right",
              render: (row) => formatDecimal(Number(row.aktual), 4),
            },
            {
              key: "absolute_error",
              header: "Absolute error",
              align: "right",
              render: (row) => formatDecimal(Number(row.absolute_error), 4),
            },
            {
              key: "harga_rupiah",
              header: "Harga",
              align: "right",
              render: (row) => formatInteger(Number(row.harga_rupiah)),
            },
          ]}
        />
      )}
    </div>
  );
}
