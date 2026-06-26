type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "Data belum tersedia",
  description = "Jalankan import artefak penelitian untuk menampilkan bagian ini.",
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-[#172033]/24 bg-white/65 p-8 text-center">
      <h3 className="text-lg font-semibold text-[#172033]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#172033]/68">{description}</p>
    </div>
  );
}
