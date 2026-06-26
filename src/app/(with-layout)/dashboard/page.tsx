import {
  AccessibleTooltip,
  AnimatedMetric,
  ChartNarrativeCard,
  EmptyState,
  EvidenceNote,
  InsightCallout,
  MethodologyBadge,
  MethodologyTimeline,
  ResearchApexChart,
  ResearchDataTable,
  ResearchTour,
  StorySection,
} from "@/components/research";
import {
  formatDate,
  formatDecimal,
  formatInteger,
  formatIsoDate,
  formatPercent,
} from "@/lib/research-format";
import {
  getResearchData,
  RESEARCH_SOURCE,
  SCIENCE_NOTES,
} from "@/services/research.service";
import Link from "next/link";

export const dynamic = "force-dynamic";

const SUBNAV = [
  ["Ringkasan", "#ringkasan"],
  ["Validasi", "#validasi"],
  ["Test akhir", "#test-akhir"],
  ["USD/IDR", "#usd-idr"],
  ["Level harga", "#level-harga"],
  ["Sumber", "#sumber"],
] as const;

export default async function DashboardOverviewPage() {
  const data = await getResearchData();

  if (!data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState />
      </div>
    );
  }

  const championLabel = `${data.run.championModelFamily} | ${
    data.run.championIncludeUsdIdr ? "dengan USD/IDR" : "tanpa USD/IDR"
  } | ${data.run.championConfigName}`;
  const validationBest = data.validationLeaderboard[0];
  const ablationTour = data.usdIdrAblationMetrics.slice(0, 4).map((row) => ({
    label: row.includeUsdIdr
      ? `${row.modelFamily} + USD`
      : `${row.modelFamily} tanpa USD`,
    title: row.experiment,
    value: `MAE ${formatDecimal(row.mae, 4)}`,
    detail: `n=${formatInteger(row.n)}, RMSE ${formatDecimal(
      row.rmse,
      4,
    )}, R2 ${formatDecimal(row.r2, 4)}. Ablation ini tidak dibaca sebagai bukti kausal.`,
    tone: row.includeUsdIdr ? ("usd" as const) : ("ml" as const),
  }));

  return (
    <div className="bg-pp-paper">
      {/* Hero — dark stage */}
      <section className="relative isolate overflow-hidden bg-pp-midnight px-4 py-16 text-pp-paper sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_20%,rgba(45,126,103,0.18),transparent_35%),linear-gradient(180deg,rgba(16,27,51,0.98),rgba(16,27,51,0.94))]" />
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-pp-leaf">
            Temuan riset
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.0] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Temuan Utama Penelitian
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-pp-paper/76 sm:text-xl">
            {data.run.title}
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <DashboardHeroFact
              label="Observasi strict-lag"
              value={formatInteger(data.run.datasetObservations)}
            />
            <DashboardHeroFact
              label="MAE champion validasi"
              value={formatDecimal(validationBest?.meanMae, 4)}
            />
            <DashboardHeroFact
              label="Periode data"
              value={`${formatDate(data.run.datasetStart)} - ${formatDate(
                data.run.datasetEnd,
              )}`}
            />
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-pp-paper/60">
            {SCIENCE_NOTES.backtesting}
          </p>
        </div>
      </section>

      {/* Sticky subnav */}
      <nav
        aria-label="Subnavigasi temuan"
        className="sticky top-[73px] z-30 border-b border-pp-sand bg-pp-rice/95 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto">
          {SUBNAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-pp-ink/68 transition hover:bg-white hover:text-pp-ink focus:outline-none focus:ring-2 focus:ring-pp-leaf"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* Ringkasan — warm reading surface */}
      <StorySection
        id="ringkasan"
        eyebrow="Ringkasan"
        title="Hasil utama harus dibaca bersama baseline dan desain temporal."
        lead="Model ML champion dipilih dari validasi walk-forward. Namun pada test akhir, baseline naif persistensi mempunyai MAE lebih rendah."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatedMetric
            label="Observasi strict-lag"
            value={data.run.datasetObservations}
            description="Semua angka berasal dari artefak penelitian yang diimpor."
          />
          <AnimatedMetric
            label="Observasi test akhir"
            value={data.run.testObservations}
            description="Januari–Desember 2025."
          />
          <AnimatedMetric
            label="MAE baseline naif"
            value={data.baselineTest?.mae ?? 0}
            decimals={4}
            description="Persistensi 0% pada test akhir."
          />
          <AnimatedMetric
            label="MAE champion ML"
            value={data.championTest?.mae ?? 0}
            decimals={4}
            description="Champion validasi, dievaluasi pada test akhir."
          />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <EvidenceNote title="Batas klaim">
            {SCIENCE_NOTES.backtesting}
          </EvidenceNote>
          <EvidenceNote title="Catatan baseline" tone="warning">
            {SCIENCE_NOTES.baseline}
          </EvidenceNote>
        </div>
        <p className="mt-6 text-sm leading-7 text-pp-ink/72">
          {SCIENCE_NOTES.validation}
          <span className="ml-2 inline-block">
            <AccessibleTooltip label="Mengapa penting?">
              Baseline sederhana menjadi pembanding minimum agar model kompleks
              tidak terlihat unggul tanpa bukti evaluasi.
            </AccessibleTooltip>
          </span>
        </p>
      </StorySection>

      {/* Validasi — dark data stage */}
      <section
        id="validasi"
        className="bg-pp-midnight px-4 py-16 text-pp-paper sm:px-6 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-pp-leaf">
                Validasi Temporal
              </span>
              <MethodologyBadge tone="validation">4-fold expanding window</MethodologyBadge>
            </div>
            <h2 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
              Validasi walk-forward memilih champion ML.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-pp-paper/72">
              Pemilihan model menggunakan 4 fold expanding walk-forward validation
              dengan embargo satu bulan. Test akhir tidak dipakai untuk memilih
              model.
            </p>
            <EvidenceNote
              title="Batas klaim"
              tone="neutral"
              className="mt-6 border-pp-paper/14 bg-pp-ink/60 text-pp-paper"
            >
              Model dipilih dari validasi walk-forward, bukan dari test akhir.
              Hasil validasi tidak menjamin performa di luar periode yang diuji.
            </EvidenceNote>
          </div>
          <div className="min-w-0 space-y-6">
            <ChartNarrativeCard
              title="Leaderboard validasi temporal"
              kicker="Validasi Temporal"
              unit="Mean MAE"
              period="4 fold expanding window"
              caption="Urutan berdasarkan MAE rata-rata validasi. Semakin rendah MAE, semakin baik performa rata-rata di seluruh fold."
              source={RESEARCH_SOURCE}
              summary="Chart menunjukkan leaderboard validasi temporal untuk kandidat model dan baseline."
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

            <InsightCallout title="Champion dari validasi" tone="cream">
              {validationBest?.experiment ?? championLabel} berada pada urutan
              terbaik validasi dengan mean MAE{" "}
              {formatDecimal(validationBest?.meanMae, 4)}. Konfigurasi champion
              riset adalah {championLabel}.
            </InsightCallout>
          </div>
        </div>
      </section>

      {/* Test akhir — warm reading surface */}
      <StorySection
        id="test-akhir"
        eyebrow="Test Akhir"
        title="Baseline tetap kompetitif pada test akhir."
        lead="Pada periode Januari–Desember 2025, baseline naif persistensi mencatat MAE lebih rendah daripada champion ML. Ini adalah hasil penelitian, bukan anomali yang disembunyikan."
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <MethodologyBadge tone="test">Test Akhir</MethodologyBadge>
            <MethodologyBadge tone="backtest">Backtesting Historis</MethodologyBadge>
          </div>
          <ChartNarrativeCard
            title="Perbandingan test akhir"
            kicker="Test Akhir"
            unit="MAE, poin persentase"
            period={`${formatDate(data.run.finalTestStart)} - ${formatDate(
              data.run.finalTestEnd,
            )}`}
            caption="Semakin rendah MAE, semakin kecil rata-rata error absolut perubahan harga bulanan. Champion ML dipilih dari validasi, bukan dari test akhir."
            source={RESEARCH_SOURCE}
            summary="Chart membandingkan MAE test akhir seluruh eksperimen yang tersedia."
            action={<SourceLink href="/dashboard/test-evaluation" />}
          >
            <ResearchApexChart
              type="bar"
              categories={data.testMetrics.map((row) =>
                shortExperiment(row.experiment),
              )}
              series={[
                {
                  name: "MAE",
                  data: data.testMetrics.map((row) => row.mae),
                },
              ]}
              yAxisTitle="MAE"
            />
          </ChartNarrativeCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <InsightCallout title="Baseline vs Champion" tone="warning">
              Baseline naif persistensi mencatat MAE{" "}
              {formatDecimal(data.baselineTest?.mae, 4)}, lebih rendah dari
              champion ML yang mencatat MAE{" "}
              {formatDecimal(data.championTest?.mae, 4)}. Directional accuracy
              champion adalah{" "}
              {formatPercent(data.championTest?.directionalAccuracyPct, 2)}.
            </InsightCallout>
            <EvidenceNote title="Catatan metodologi" tone="info">
              {SCIENCE_NOTES.baseline} {SCIENCE_NOTES.validation}
            </EvidenceNote>
          </div>
        </div>
      </StorySection>

      {/* USD/IDR — dark data stage */}
      <section
        id="usd-idr"
        className="bg-pp-midnight px-4 py-16 text-pp-paper sm:px-6 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-pp-exchange">
                USD/IDR Ablation
              </span>
              <MethodologyBadge tone="shap">Ablation</MethodologyBadge>
            </div>
            <h2 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
              Sinyal kurs diuji sebagai fitur prediktif, bukan sebagai klaim penyebab.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-pp-paper/72">
              Perbandingan ablation memberi konteks apakah memasukkan USD/IDR
              membantu konfigurasi tertentu. Interpretasinya tetap prediktif dan
              bukan kausal.
            </p>
            <EvidenceNote
              title="Batas klaim"
              tone="neutral"
              className="mt-6 border-pp-paper/14 bg-pp-ink/60 text-pp-paper"
            >
              {SCIENCE_NOTES.usdIdr}
            </EvidenceNote>
            <div className="mt-6">
              <SourceLink href="/dashboard/usd-idr-ablation" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="rounded-lg border border-pp-paper/12 bg-pp-ink/50 p-5 sm:p-6">
              <h3 className="text-xl font-semibold text-pp-paper">
                Ablation USD/IDR pada test akhir
              </h3>
              <p className="mt-2 text-sm leading-7 text-pp-paper/72">
                {SCIENCE_NOTES.usdIdr}
              </p>
              <div className="mt-6">
                <ResearchTour items={ablationTour} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Level harga — warm reading surface */}
      <StorySection
        id="level-harga"
        eyebrow="Segmen Hasil"
        title="Error bervariasi antara level harga konsumen dan produsen."
        lead="Evaluasi per level harga memberikan konteks tambahan, tetapi tidak menyediakan filter prediksi granular per provinsi atau komoditas."
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <MethodologyBadge tone="test">Test Akhir</MethodologyBadge>
            <MethodologyBadge tone="data">Level Harga</MethodologyBadge>
          </div>
          <ChartNarrativeCard
            title="Metrik per level harga"
            kicker="Konsumen dan produsen"
            unit="MAE"
            period="Test akhir"
            caption="Level harga dibaca sebagai segmen evaluasi agregat yang tersedia pada artefak."
            source={RESEARCH_SOURCE}
            summary="Chart membandingkan MAE per level harga untuk metrik test akhir."
            action={<SourceLink href="/dashboard/segments" />}
          >
            <ResearchApexChart
              type="bar"
              categories={data.metricsByPriceLevel.map(
                (row) => `${row.levelHarga} | ${shortExperiment(row.experiment)}`,
              )}
              series={[
                {
                  name: "MAE",
                  data: data.metricsByPriceLevel.map((row) => row.mae),
                },
              ]}
              colors={["#2468a8", "#2f6f45", "#6b7280"]}
              yAxisTitle="MAE"
            />
          </ChartNarrativeCard>

          <div className="rounded-lg border border-pp-sand bg-pp-rice p-6">
            <h3 className="text-lg font-semibold text-pp-ink">
              Garis waktu pemisahan data
            </h3>
            <div className="mt-5">
              <MethodologyTimeline
                items={[
                  {
                    title: "Train final selesai",
                    period: formatIsoDate(data.run.finalTrainEnd),
                    description:
                      "Model final dilatih sampai titik ini setelah konfigurasi dipilih.",
                    tone: "green",
                  },
                  {
                    title: "Embargo final",
                    period: formatIsoDate(data.run.finalEmbargoMonth),
                    description:
                      "Embargo satu bulan memisahkan train final dan test akhir.",
                    tone: "purple",
                  },
                  {
                    title: "Test akhir",
                    period: `${formatIsoDate(
                      data.run.finalTestStart,
                    )} - ${formatIsoDate(data.run.finalTestEnd)}`,
                    description:
                      "Periode evaluasi akhir, tidak digunakan untuk pemilihan model.",
                    tone: "red",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </StorySection>

      {/* Sumber — warm reading surface */}
      <section
        id="sumber"
        className="bg-pp-rice px-4 py-16 sm:px-6 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-pp-baseline">
            Sumber
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-pp-ink sm:text-4xl">
            Setiap angka dapat ditelusuri ke artefak penelitian.
          </h2>
          <div className="mt-8">
            <ResearchDataTable
              title="Sumber angka utama"
              caption="Tabel ini menampilkan ringkasan angka yang dipakai pada halaman ini agar klaim mudah ditelusuri."
              source={RESEARCH_SOURCE}
              rows={[
                {
                  indikator: "Observasi strict-lag",
                  nilai: formatInteger(data.run.datasetObservations),
                  sumber: data.run.sourceMetadataFile,
                },
                {
                  indikator: "MAE champion ML test akhir",
                  nilai: formatDecimal(data.championTest?.mae, 4),
                  sumber: data.championTest?.sourceFile ?? "-",
                },
                {
                  indikator: "MAE baseline naif test akhir",
                  nilai: formatDecimal(data.baselineTest?.mae, 4),
                  sumber: data.baselineTest?.sourceFile ?? "-",
                },
                {
                  indikator: "Best mean MAE validasi",
                  nilai: formatDecimal(validationBest?.meanMae, 4),
                  sumber: validationBest?.sourceFile ?? "-",
                },
                {
                  indikator: "Directional accuracy champion",
                  nilai: formatPercent(
                    data.championTest?.directionalAccuracyPct,
                    2,
                  ),
                  sumber: data.championTest?.sourceFile ?? "-",
                },
              ]}
              columns={[
                { key: "indikator", header: "Indikator" },
                { key: "nilai", header: "Nilai", align: "right" },
                { key: "sumber", header: "Sumber" },
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardHeroFact({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-pp-paper/14 bg-pp-paper/8 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-pp-paper/55">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold leading-tight text-pp-paper sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

function SourceLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex rounded-full border border-pp-ink/18 bg-white/70 px-4 py-2 text-sm font-semibold text-pp-ink/80 transition hover:bg-pp-ink hover:text-pp-paper focus:outline-none focus:ring-2 focus:ring-pp-leaf"
    >
      Lihat sumber data
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
