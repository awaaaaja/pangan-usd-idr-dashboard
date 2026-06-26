import Image from "next/image";
import Link from "next/link";

export function ResearchHero() {
  return (
    <section className="pp-section pp-section--dark" id="top">
      <div className="pp-container pp-grid">
        <div className="pp-copy pp-reveal is-visible">
          <p className="pp-kicker">Pangan Pulse · Riset Data Science</p>
          <h1 className="pp-display">Apakah kurs dolar benar-benar membantu membaca perubahan harga pangan?</h1>
          <p className="pp-lede">Evaluasi machine learning pada harga pangan konsumen dan produsen antarprovinsi di Indonesia, 2022–2025.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 30 }}>
            <Link className="pp-button pp-button--light" href="/dashboard">Jelajahi temuan <span aria-hidden>↘</span></Link>
            <Link className="pp-button pp-button--ghost" href="/methodology">Lihat metodologi</Link>
          </div>
        </div>
        <div className="pp-visual pp-reveal is-visible">
          <Image src="/assets/pangan-pulse/illustrations/hero-data-archipelago.svg" alt="Ilustrasi abstrak kepulauan Indonesia, sinyal harga, dan node data" width={960} height={640} priority />
        </div>
      </div>
      <div className="pp-container pp-stat-rail" aria-label="Ringkasan penelitian">
        <div className="pp-stat"><strong>25.850</strong><span>observasi strict-lag</span></div>
        <div className="pp-stat"><strong>4 fold</strong><span>walk-forward validation</span></div>
        <div className="pp-stat"><strong>1 bulan</strong><span>embargo sebelum test akhir</span></div>
      </div>
    </section>
  );
}
