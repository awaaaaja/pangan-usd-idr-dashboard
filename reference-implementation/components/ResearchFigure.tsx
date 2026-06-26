import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  title: string;
  caption: string;
  source: string;
  period?: string;
};

export function ResearchFigure({ src, alt, title, caption, source, period }: Props) {
  return (
    <figure className="pp-figure">
      <Image src={src} alt={alt} width={1400} height={860} sizes="(max-width: 780px) 100vw, 58vw" />
      <figcaption className="pp-figure__meta">
        <strong>{title}</strong><br />
        {caption}{period ? ` Periode: ${period}.` : ""}<br />
        <span>Sumber: {source}.</span>
      </figcaption>
    </figure>
  );
}
