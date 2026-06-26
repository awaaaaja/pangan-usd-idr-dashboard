import {
  ChartCard,
  EmptyState,
  EvidenceNote,
  MethodologyBadge,
  ResearchApexChart,
  ResearchDataTable,
  ResearchPageHeader,
} from "@/components/research";
import { formatDecimal, formatInteger, formatIsoDate } from "@/lib/research-format";
import {
  getResearchData,
  RESEARCH_SOURCE,
  SCIENCE_NOTES,
} from "@/services/research.service";

export const dynamic = "force-dynamic";

export default async function ValidationPage() {
  const data = await getResearchData();

  if (!data) return <EmptyState />;

  const selectedExperiments = data.validationLeaderboard.filter(
    (row) => row.selectedFromValidation,
  );

  return (
    <div className="space-y-6">
      <ResearchPageHeader
        title="Validasi Temporal Walk-Forward"
        description="Konfigurasi model dipilih melalui expanding walk-forward validation dengan embargo satu bulan. Test akhir tidak digunakan untuk pemilihan model."
        badges={<MethodologyBadge tone="validation">Validasi Temporal</MethodologyBadge>}
        visual={{
          src: "/assets/pangan-pulse/walkforward-embargo.svg",
          alt: "Ilustrasi walk-forward validation dengan embargo satu bulan.",
          caption: "Empat fold expanding walk-forward menjaga urutan waktu evaluasi.",
        }}
      />

      <EvidenceNote>{SCIENCE_NOTES.validation}</EvidenceNote>

      <ChartCard
        title="MAE per Fold Validasi"
        unit="MAE, poin persentase"
        period="Fold 1-4 walk-forward"
        caption="Perbandingan kandidat model pada tiap fold validasi temporal."
        source={RESEARCH_SOURCE}
        isEmpty={data.validationMetrics.length === 0}
      >
        <ResearchApexChart
          type="line"
          categories={["Fold 1", "Fold 2", "Fold 3", "Fold 4"]}
          series={selectedExperiments.map((experiment) => ({
            name: experiment.experiment
              .replace("Random Forest", "RF")
              .replace("XGBoost", "XGB"),
            data: [1, 2, 3, 4].map((fold) => {
              const row = data.validationMetrics.find(
                (metric) =>
                  metric.fold === fold &&
                  metric.experiment === experiment.experiment,
              );
              return row?.mae ?? null;
            }),
          }))}
          yAxisTitle="MAE"
        />
      </ChartCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <ResearchDataTable
          title="Registry Split Temporal"
          caption="Setiap fold menggunakan train historis, embargo satu bulan, lalu periode validasi."
          source={RESEARCH_SOURCE}
          rows={data.splitRegistry.map((row) => ({
            jenis: row.jenis,
            fold: row.fold,
            train: `${formatIsoDate(row.trainMulai)} - ${formatIsoDate(row.trainAkhir)}`,
            embargo: `${formatIsoDate(row.embargoMulai)} - ${formatIsoDate(row.embargoAkhir)}`,
            validasi: row.validasiMulai
              ? `${formatIsoDate(row.validasiMulai)} - ${formatIsoDate(row.validasiAkhir)}`
              : "-",
            test: row.testMulai
              ? `${formatIsoDate(row.testMulai)} - ${formatIsoDate(row.testAkhir)}`
              : "-",
            train_observasi: row.trainObservasi,
            validasi_observasi: row.validasiObservasi,
            test_observasi: row.testObservasi,
          }))}
          columns={[
            { key: "jenis", header: "Jenis" },
            { key: "fold", header: "Fold" },
            { key: "train", header: "Train" },
            { key: "embargo", header: "Embargo" },
            { key: "validasi", header: "Validasi" },
            { key: "test", header: "Test" },
            {
              key: "train_observasi",
              header: "Train n",
              align: "right",
              render: (row) => formatInteger(Number(row.train_observasi)),
            },
            {
              key: "validasi_observasi",
              header: "Validasi n",
              align: "right",
              render: (row) => formatInteger(Number(row.validasi_observasi)),
            },
            {
              key: "test_observasi",
              header: "Test n",
              align: "right",
              render: (row) => formatInteger(Number(row.test_observasi)),
            },
          ]}
        />

        <ResearchDataTable
          title="Leaderboard Validasi"
          caption="Diurutkan berdasarkan MAE rata-rata validasi walk-forward."
          source={RESEARCH_SOURCE}
          rows={data.validationLeaderboard.map((row) => ({
            experiment: row.experiment,
            fold: row.foldTercakup,
            mean_mae: row.meanMae,
            mean_rmse: row.meanRmse,
            mean_r2: row.meanR2,
            selected: row.selectedFromValidation ? "Ya" : "Tidak",
          }))}
          columns={[
            { key: "experiment", header: "Eksperimen" },
            { key: "fold", header: "Fold", align: "right" },
            {
              key: "mean_mae",
              header: "Mean MAE",
              align: "right",
              render: (row) => formatDecimal(Number(row.mean_mae), 4),
            },
            {
              key: "mean_rmse",
              header: "Mean RMSE",
              align: "right",
              render: (row) => formatDecimal(Number(row.mean_rmse), 4),
            },
            {
              key: "mean_r2",
              header: "Mean R2",
              align: "right",
              render: (row) => formatDecimal(Number(row.mean_r2), 4),
            },
            { key: "selected", header: "Terpilih" },
          ]}
        />
      </div>
    </div>
  );
}
