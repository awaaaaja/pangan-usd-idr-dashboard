import {
  EmptyState,
  EvidenceNote,
  MethodologyBadge,
  ResearchDataTable,
  ResearchMetricCard,
  ResearchPageHeader,
} from "@/components/research";
import { formatInteger, formatIsoDate } from "@/lib/research-format";
import { getResearchData, RESEARCH_SOURCE } from "@/services/research.service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getResearchData();

  if (!data) {
    return (
      <div className="space-y-6">
        <ResearchPageHeader
          title="Admin Import Riset"
          description="Halaman protected BetterAuth untuk status awal import artefak."
          badges={<MethodologyBadge tone="data">Admin</MethodologyBadge>}
        />
        <EmptyState description="Data riset belum ditemukan di database untuk run id default." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ResearchPageHeader
        title="Admin Import Riset"
        description="Status ringkas import artefak penelitian fase pertama. CRUD data belum diperlukan pada fase ini."
        badges={<MethodologyBadge tone="data">Admin Protected</MethodologyBadge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResearchMetricCard
          label="Research run"
          value={data.run.id}
          caption={`Executed at ${data.run.executedAt.toISOString()}.`}
        />
        <ResearchMetricCard
          label="Artefak tercatat"
          value={formatInteger(data.artifacts.length)}
          unit="artefak"
          caption="CSV, figure, metadata, dan dokumentasi."
        />
        <ResearchMetricCard
          label="CSV table index"
          value={formatInteger(data.tableIndex.length)}
          unit="tabel"
          caption="Berdasarkan indeks tabel BAB IV."
        />
        <ResearchMetricCard
          label="Final test"
          value={formatIsoDate(data.run.finalTestStart)}
          caption={`Sampai ${formatIsoDate(data.run.finalTestEnd)}.`}
        />
      </div>

      <EvidenceNote>
        Importer bersifat idempotent per `research_run_id`: menjalankan ulang
        script akan mengganti data run yang sama di dalam transaction, bukan
        menggandakan baris.
      </EvidenceNote>

      <ResearchDataTable
        title="Artefak Terbaru"
        caption="Ringkasan artefak yang tercatat di database."
        source={RESEARCH_SOURCE}
        limit={20}
        rows={data.artifacts.map((artifact) => ({
          key: artifact.artifactKey,
          type: artifact.artifactType,
          file: artifact.sourceFile,
          rows: artifact.rowCount ?? "-",
        }))}
        columns={[
          { key: "key", header: "Key" },
          { key: "type", header: "Tipe" },
          { key: "file", header: "File" },
          { key: "rows", header: "Rows", align: "right" },
        ]}
      />
    </div>
  );
}
