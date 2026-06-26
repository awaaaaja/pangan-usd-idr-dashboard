type IllustrationProps = {
  className?: string;
};

type AssetIllustrationProps = IllustrationProps & {
  src: string;
  alt: string;
  loading?: "eager" | "lazy";
};

function AssetIllustration({
  src,
  alt,
  className = "",
  loading = "lazy",
}: AssetIllustrationProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={`rounded-lg object-contain ${className}`}
    />
  );
}

export function IndonesiaPulseIllustration({ className = "" }: IllustrationProps) {
  return (
    <AssetIllustration
      src="/assets/pangan-pulse/hero-data-archipelago.svg"
      alt="Ilustrasi abstrak kepulauan Indonesia dengan titik harga dan sinyal data."
      className={`${className} rounded-none`}
      loading="eager"
    />
  );
}

export function CommodityGeometry({ className = "" }: IllustrationProps) {
  return (
    <AssetIllustration
      src="/assets/pangan-pulse/commodity-cluster.svg"
      alt="Ilustrasi geometrik komoditas pangan."
      className={className}
    />
  );
}

export function DataModelFlow({ className = "" }: IllustrationProps) {
  return (
    <AssetIllustration
      src="/assets/pangan-pulse/methodology-flow.svg"
      alt="Diagram alur data, fitur, model, validasi, dan SHAP."
      className={className}
    />
  );
}

export function ShapExplainabilitySketch({ className = "" }: IllustrationProps) {
  return (
    <AssetIllustration
      src="/assets/pangan-pulse/methodology-flow.svg"
      alt="Ilustrasi alur interpretasi model dan SHAP."
      className={className}
    />
  );
}

export function WalkforwardEmbargoIllustration({ className = "" }: IllustrationProps) {
  return (
    <AssetIllustration
      src="/assets/pangan-pulse/walkforward-embargo.svg"
      alt="Ilustrasi walk-forward validation dengan embargo satu bulan."
      className={className}
    />
  );
}

export function PriceWaveIllustration({ className = "" }: IllustrationProps) {
  return (
    <AssetIllustration
      src="/assets/pangan-pulse/price-wave.svg"
      alt="Ilustrasi gelombang harga dan volatilitas."
      className={className}
    />
  );
}

export function DotFieldIllustration({ className = "" }: IllustrationProps) {
  return (
    <AssetIllustration
      src="/assets/pangan-pulse/dot-field.svg"
      alt="Tekstur titik data untuk audit dan artefak penelitian."
      className={className}
    />
  );
}
