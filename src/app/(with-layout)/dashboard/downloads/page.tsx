import {
  EmptyState,
  MethodologyBadge,
  ResearchDataTable,
  ResearchPageHeader,
} from "@/components/research";
import { artifactUrl } from "@/lib/research-format";
import { getResearchData, RESEARCH_SOURCE } from "@/services/research.service";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DownloadsPage() {
  const data = await getResearchData();

  if (!data) return <EmptyState />;

  const csvArtifacts = data.artifacts.filter(
    (artifact) => artifact.artifactType === "csv_table",
  );
  const figureArtifacts = data.artifacts.filter(
    (artifact) => artifact.artifactType === "figure",
  );
  const metadataArtifacts = data.artifacts.filter((artifact) =>
    ["metadata", "documentation"].includes(artifact.artifactType),
  );

  return (
    <div className="space-y-6">
      <ResearchPageHeader
        title="Downloads Artefak Penelitian"
        description="Indeks artefak fase pertama yang tersedia di repository. Link mengarah ke file resmi lokal, bukan hasil buatan dashboard."
        badges={<MethodologyBadge tone="data">Artefak Riset</MethodologyBadge>}
        visual={{
          src: "/assets/pangan-pulse/dot-field.svg",
          alt: "Tekstur node data untuk menggambarkan indeks artefak penelitian.",
          caption: "CSV, figure, metadata, dan dokumentasi ditelusuri dari artefak lokal.",
        }}
      />

      <ResearchDataTable
        title="CSV Tabel"
        caption="Semua CSV pada `research-artifacts/tables` yang diimpor dan disimpan sebagai traceability rows."
        source={RESEARCH_SOURCE}
        rows={csvArtifacts.map((artifact) => ({
          title: artifact.title ?? artifact.artifactKey,
          source_file: artifact.sourceFile,
          row_count: artifact.rowCount ?? "-",
          url: artifactUrl(artifact.sourceFile),
        }))}
        columns={[
          { key: "title", header: "Tabel" },
          { key: "source_file", header: "File" },
          { key: "row_count", header: "Baris", align: "right" },
          {
            key: "url",
            header: "Download",
            render: (row) => (
              <Link className="font-semibold text-teal-700 hover:underline" href={String(row.url)}>
                Unduh
              </Link>
            ),
          },
        ]}
      />

      <ResearchDataTable
        title="Figure Resmi"
        caption="Gambar hasil notebook pada `research-artifacts/figures`."
        source={RESEARCH_SOURCE}
        rows={figureArtifacts.map((artifact) => ({
          title: artifact.title ?? artifact.artifactKey,
          description: artifact.description ?? "-",
          source_file: artifact.sourceFile,
          url: artifactUrl(artifact.sourceFile),
        }))}
        columns={[
          { key: "title", header: "Section" },
          { key: "description", header: "Caption" },
          { key: "source_file", header: "File" },
          {
            key: "url",
            header: "Buka",
            render: (row) => (
              <Link className="font-semibold text-teal-700 hover:underline" href={String(row.url)}>
                Lihat
              </Link>
            ),
          },
        ]}
      />

      <ResearchDataTable
        title="Metadata dan Dokumentasi"
        caption="Metadata model champion dan README hasil."
        source={RESEARCH_SOURCE}
        rows={metadataArtifacts.map((artifact) => ({
          title: artifact.title ?? artifact.artifactKey,
          source_file: artifact.sourceFile,
          url: artifactUrl(artifact.sourceFile),
        }))}
        columns={[
          { key: "title", header: "Artefak" },
          { key: "source_file", header: "File" },
          {
            key: "url",
            header: "Download",
            render: (row) => (
              <Link className="font-semibold text-teal-700 hover:underline" href={String(row.url)}>
                Unduh
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
