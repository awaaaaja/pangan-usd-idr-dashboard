import {
  AnimatedMetric,
  ChartNarrativeCard,
  CommodityGeometry,
  DataModelFlow,
  DataSourceFooter,
  EmptyState,
  InsightCallout,
  MethodologyTimeline,
  ResearchApexChart,
  ResearchHero,
  ResearchTour,
  ShapExplainabilitySketch,
  StorySection,
} from "@/components/research";
import {
  formatDate,
  formatDecimal,
  formatInteger,
} from "@/lib/research-format";
import {
  getResearchData,
  RESEARCH_SOURCE,
  SCIENCE_NOTES,
} from "@/services/research.service";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const data = await getResearchData();

  if (!data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState description="Jalankan migration dan import CSV riset untuk mengisi website publik." />
      </div>
    );
  }

  const championLabel = `${data.run.championModelFamily} ${data.run.championConfigName}`;
  const validationBest = data.validationLeaderboard[0];
  const targetExtreme = data.outlierSummary.find(
    (row) => row.indikator === "target_extreme_flag_total",
  );
  const ablationRows = data.usdIdrAblationMetrics.slice(0, 4);
  const sumbarChampionRows = data.metricsSumateraBarat.filter(
    (row) => row.experiment === data.championTest?.experiment,
  );
  const shapTop = data.shapGroupImportance[0];

  return (
    <>
      <ResearchHero
        title="Apakah kurs dolar benar-benar membantu membaca perubahan harga pangan?"
        subtitle="Evaluasi machine learning pada harga pangan konsumen dan produsen antarprovinsi di Indonesia, 2022–2025."
        primaryHref="#temuan"
        primaryLabel="Jelajahi Temuan"
        secondaryHref="/dashboard/methodology"
        secondaryLabel="Lihat Metodologi"
        meta={
          <>
            <HeroMeta label="Observasi strict-lag" value={formatInteger(data.run.datasetObservations)} />
            <HeroMeta label="Champion validasi" value={championLabel} />
            <HeroMeta label="Test akhir" value="Jan-Dec 2025" />
          </>
        }
      />

      <StorySection
        id="masalah"
        eyebrow="Masalah"
        title="Harga pangan bergerak tidak selalu tenang, dan model harus diuji melawan baseline sederhana."
        lead="Website ini membaca perubahan harga bulanan sebagai evaluasi historis. Tujuannya bukan meramal masa depan, melainkan menilai apakah sinyal tambahan dan model non-linear memberi nilai tambah pada data yang tersedia."
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <CommodityGeometry className="h-full min-h-80 w-full" />
          <InsightCallout title="Volatilitas harus dilihat sebagai risiko evaluasi, bukan hiasan chart." tone="warning">
            Sampel strict-lag menyimpan observasi ekstrem untuk audit. Total target
            ekstrem tercatat {formatInteger(targetExtreme?.jumlah)} observasi,
            atau {formatDecimal(targetExtreme?.persentaseDariSampel, 3)}% dari
            sampel.
          </InsightCallout>
        </div>
      </StorySection>

      <StorySection
        id="data"
        eyebrow="Data"
        title="Panel harga pangan digabung dengan USD/IDR, lalu dipotong ketat agar lag dan target tersedia."
        lead="Fase pertama hanya memakai artefak agregat dari notebook. Karena itu website tidak membuat filter observasi palsu yang belum didukung ekspor data."
      >
        <div className="grid gap-5">
          <DataModelFlow className="w-full" />
          <div className="grid gap-4 md:grid-cols-3">
            <AnimatedMetric
              label="Panel strict-lag"
              value={data.run.datasetObservations}
              description={`${formatDate(data.run.datasetStart)} sampai ${formatDate(data.run.datasetEnd)}.`}
            />
            <AnimatedMetric
              label="Observasi test akhir"
              value={data.run.testObservations}
              description="Dipisahkan dari pemilihan model."
            />
            <AnimatedMetric
              label="Fold validasi"
              value={data.validationSplits.length}
              description="Expanding walk-forward dengan embargo satu bulan."
            />
          </div>
        </div>
      </StorySection>

      <StorySection
        id="eksperimen"
        eyebrow="Eksperimen"
        title="Baseline naif, Random Forest, dan XGBoost dibandingkan dalam desain temporal."
        lead="Model dipilih dari validasi walk-forward, sementara test akhir Januari-Desember 2025 baru dipakai setelah konfigurasi dipilih."
      >
        <ChartNarrativeCard
          title="Leaderboard validasi walk-forward"
          kicker="Validasi temporal"
          unit="MAE rata-rata"
          period="4 fold"
          caption="Urutan ini menjadi dasar pemilihan champion ML pada run penelitian."
          source={RESEARCH_SOURCE}
          summary="Chart menampilkan MAE rata-rata validasi untuk kandidat baseline, Random Forest, dan XGBoost."
          action={<SourceLink href="/dashboard/validation" />}
        >
          <ResearchApexChart
            type="bar"
            categories={data.validationLeaderboard.map((row) =>
              shortExperiment(row.experiment),
            )}
            series={[
              {
                name: "Mean MAE",
                data: data.validationLeaderboard.map((row) => row.meanMae),
              },
            ]}
            yAxisTitle="Mean MAE"
          />
        </ChartNarrativeCard>
      </StorySection>

      <StorySection
        id="temuan"
        eyebrow="Temuan Penting"
        title="Champion ML dipilih secara temporal, tetapi baseline sederhana tetap lebih rendah MAE pada test akhir."
        lead={SCIENCE_NOTES.baseline}
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <InsightCallout title="Hasil yang tidak perlu disembunyikan" tone="navy">
            Champion validasi adalah {championLabel} tanpa USD/IDR. Pada test
            akhir, MAE champion ML adalah {formatDecimal(data.championTest?.mae, 4)},
            sedangkan baseline naif persistensi adalah{" "}
            {formatDecimal(data.baselineTest?.mae, 4)}.
          </InsightCallout>
          <ChartNarrativeCard
            title="Test akhir: model dan baseline"
            unit="MAE, poin persentase"
            period="Januari-Desember 2025"
            caption="Test akhir tidak digunakan dalam pemilihan model."
            source={RESEARCH_SOURCE}
            summary="Baseline naif persistensi memiliki MAE test akhir lebih kecil daripada champion ML."
            action={<SourceLink href="/dashboard/test-evaluation" />}
          >
            <ResearchApexChart
              type="bar"
              categories={data.testMetrics.map((row) => shortExperiment(row.experiment))}
              series={[
                {
                  name: "MAE",
                  data: data.testMetrics.map((row) => row.mae),
                },
              ]}
              colors={["#6b7280", "#2f6f45", "#2468a8", "#6f4aa8", "#d1453b"]}
              yAxisTitle="MAE"
            />
          </ChartNarrativeCard>
        </div>
      </StorySection>

      <StorySection
        id="usd-idr"
        eyebrow="USD/IDR"
        title="Ablation membaca nilai tambah prediktif, bukan bukti sebab-akibat."
        lead={SCIENCE_NOTES.usdIdr}
      >
        <ResearchTour
          items={ablationRows.map((row) => ({
            label: row.includeUsdIdr ? `${row.modelFamily} + USD` : `${row.modelFamily} tanpa USD`,
            title: row.experiment,
            value: `MAE ${formatDecimal(row.mae, 4)}`,
            detail: `RMSE ${formatDecimal(row.rmse, 4)}, R2 ${formatDecimal(row.r2, 4)}, directional accuracy ${formatDecimal(row.directionalAccuracyPct, 2)}%. Hasil ini hanya dievaluasi sebagai ablation fitur.`,
            tone: row.includeUsdIdr ? "usd" : "ml",
          }))}
        />
      </StorySection>

      <StorySection
        id="sumatera-barat"
        eyebrow="Fokus Regional"
        title="Sumatera Barat dipakai sebagai lensa regional, bukan explorer prediksi granular."
        lead="Artefak fase pertama menyediakan ringkasan metrik Sumatera Barat, bukan seluruh prediksi per komoditas-bulan untuk difilter bebas."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {sumbarChampionRows.map((row) => (
            <InsightCallout
              key={`${row.levelHarga}-${row.experiment}`}
              title={`Level ${row.levelHarga}`}
            >
              MAE {formatDecimal(row.mae, 4)} dari {formatInteger(row.n)} observasi
              test akhir Sumatera Barat. Directional accuracy{" "}
              {formatDecimal(row.directionalAccuracyPct, 2)}%.
            </InsightCallout>
          ))}
        </div>
      </StorySection>

      <StorySection
        id="shap"
        eyebrow="SHAP"
        title="Explainability menjelaskan perilaku internal model, bukan kausalitas harga."
        lead="SHAP membantu membaca fitur yang paling berkontribusi pada prediksi champion. Interpretasinya tetap berada di dalam model."
      >
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1fr]">
          <ShapExplainabilitySketch className="w-full" />
          <InsightCallout title={shapTop?.kelompokFitur ?? "Kontribusi fitur"}>
            Kelompok fitur teratas menurut mean absolute SHAP adalah{" "}
            {shapTop?.kelompokFitur} dengan nilai{" "}
            {formatDecimal(shapTop?.meanAbsShap, 4)}. Detail fitur tersedia pada
            halaman explainability.
            <div className="mt-5">
              <SourceLink href="/dashboard/explainability" label="Lihat SHAP" />
            </div>
          </InsightCallout>
        </div>
      </StorySection>

      <StorySection
        id="metodologi"
        eyebrow="Metodologi"
        title="Embargo satu bulan menjaga evaluasi tetap temporal."
        lead="Rangkaian split dibuat agar model selalu dievaluasi pada periode setelah data latih, dengan test akhir dipisahkan dari pemilihan konfigurasi."
      >
        <MethodologyTimeline
          items={[
            {
              title: "Dataset strict-lag",
              period: `${formatDate(data.run.datasetStart)} - ${formatDate(data.run.datasetEnd)}`,
              description:
                "Sampel dibentuk hanya dari observasi dengan lag harga, fitur pendukung, dan target t+1 yang tersedia.",
              tone: "green",
            },
            {
              title: "Walk-forward validation",
              period: `${data.validationSplits.length} fold`,
              description:
                "Konfigurasi dipilih dari validasi expanding window dengan embargo satu bulan.",
              tone: "navy",
            },
            {
              title: "Final embargo",
              period: formatDate(data.run.finalEmbargoMonth),
              description:
                "Bulan embargo memisahkan akhir train final dari awal test akhir.",
              tone: "purple",
            },
            {
              title: "Test akhir",
              period: `${formatDate(data.run.finalTestStart)} - ${formatDate(data.run.finalTestEnd)}`,
              description:
                "Periode ini digunakan untuk evaluasi akhir setelah champion dipilih.",
              tone: "red",
            },
          ]}
        />
      </StorySection>

      <DataSourceFooter
        artifacts={data.artifacts.map((artifact) => ({
          key: artifact.artifactKey,
          type: artifact.artifactType,
          file: artifact.sourceFile,
          rows: artifact.rowCount,
        }))}
      />
    </>
  );
}

function HeroMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#f6efe2]/16 bg-[#f6efe2]/8 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f6efe2]/58">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold leading-tight text-white">{value}</p>
    </div>
  );
}

function SourceLink({
  href,
  label = "Lihat sumber data",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex rounded-full border border-[#172033]/18 px-3 py-2 text-sm font-semibold text-[#172033]/72 transition hover:bg-[#172033] hover:text-[#f6efe2] focus:outline-none focus:ring-2 focus:ring-[#2f6f45]"
    >
      {label}
    </Link>
  );
}

function shortExperiment(value: string) {
  return value
    .replace("Random Forest", "RF")
    .replace("XGBoost", "XGB")
    .replace("Naif Persistensi (0%)", "Naif")
    .replace("Naif Momentum (Δt-1)", "Momentum")
    .replace("tanpa USD/IDR", "tanpa USD")
    .replace("dengan USD/IDR", "+USD");
}
