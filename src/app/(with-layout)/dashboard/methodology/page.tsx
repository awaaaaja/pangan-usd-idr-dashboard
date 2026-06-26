import {
  EmptyState,
  EvidenceNote,
  MethodologyBadge,
  ResearchDataTable,
  ResearchMetricCard,
  ResearchPageHeader,
} from "@/components/research";
import { formatInteger, formatIsoDate } from "@/lib/research-format";
import {
  getResearchData,
  RESEARCH_SOURCE,
  SCIENCE_NOTES,
} from "@/services/research.service";

export const dynamic = "force-dynamic";

export default async function MethodologyPage() {
  const data = await getResearchData();

  if (!data) return <EmptyState />;

  return (
    <div className="space-y-6">
      <ResearchPageHeader
        title="Metodologi dan Batas Klaim"
        description="Dokumentasi ringkas alur data, split temporal, model champion, dan batas data fase pertama."
        badges={
          <>
            <MethodologyBadge tone="validation">Validasi Temporal</MethodologyBadge>
            <MethodologyBadge tone="backtest">Backtesting Historis</MethodologyBadge>
          </>
        }
        visual={{
          src: "/assets/pangan-pulse/methodology-flow.svg",
          alt: "Diagram alur data menuju fitur, model, validasi, dan SHAP.",
          caption: "Next.js hanya menyajikan hasil notebook yang sudah dieksekusi.",
        }}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResearchMetricCard
          label="Random state"
          value={formatInteger(data.run.randomState)}
          caption="Nilai dari metadata eksekusi model."
        />
        <ResearchMetricCard
          label="Target evaluasi"
          value="Perubahan harga"
          caption={data.run.targetEvaluation}
        />
        <ResearchMetricCard
          label="Final train end"
          value={formatIsoDate(data.run.finalTrainEnd)}
          caption="Bulan setelahnya digunakan sebagai embargo final."
        />
        <ResearchMetricCard
          label="Final test"
          value={formatIsoDate(data.run.finalTestStart)}
          caption={`Berakhir ${formatIsoDate(data.run.finalTestEnd)}.`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <EvidenceNote>{SCIENCE_NOTES.validation}</EvidenceNote>
        <EvidenceNote>{SCIENCE_NOTES.backtesting}</EvidenceNote>
        <EvidenceNote tone="warning">{SCIENCE_NOTES.usdIdr}</EvidenceNote>
        <EvidenceNote tone="warning">{SCIENCE_NOTES.baseline}</EvidenceNote>
      </div>

      <ResearchDataTable
        title="Registry Fitur"
        caption="Daftar fitur yang tersedia dalam pipeline penelitian. Champion metadata menunjukkan model terpilih tidak menyertakan fitur USD/IDR."
        source={RESEARCH_SOURCE}
        rows={data.featureRegistry}
        columns={[
          { key: "fitur", header: "Fitur" },
          { key: "jenis", header: "Jenis" },
          { key: "kelompok", header: "Kelompok" },
        ]}
      />

      <ResearchDataTable
        title="Batas Data Fase Pertama"
        caption="Aplikasi tidak membuat fitur yang belum didukung artefak."
        rows={[
          {
            kebutuhan: "Explorer prediksi per provinsi x komoditas x tanggal",
            status: "Belum tersedia",
            alasan:
              "Belum ada `fact_test_predictions_all_models.csv` atau detail prediksi seluruh observasi.",
          },
          {
            kebutuhan: "Sampel SHAP lokal banyak observasi",
            status: "Belum tersedia",
            alasan: "CSV fase pertama hanya berisi satu observasi lokal.",
          },
          {
            kebutuhan: "Prediksi harga masa depan",
            status: "Tidak termasuk",
            alasan: "Dashboard ini hanya evaluasi model dan backtesting historis.",
          },
        ]}
        columns={[
          { key: "kebutuhan", header: "Kebutuhan" },
          { key: "status", header: "Status" },
          { key: "alasan", header: "Alasan" },
        ]}
      />
    </div>
  );
}
