# Runbook Implementasi UI/UX

## Prinsip kerja

Jangan meminta Codex membangun semua halaman dalam satu sesi. Scope besar menyebabkan sesi habis untuk audit dan laporan. Jalankan per fase, tiap fase harus berakhir dengan build.

## Fase 0 — Pengunci scope
Kirim `prompts/00_PENGUNCI_SCOPE.md`.

## Fase 1 — Design foundation + public shell
Kirim `prompts/01_FOUNDATION_AND_HERO.md`.
Target:
- public navigation tanpa Admin;
- design tokens;
- aset masuk ke `public/assets/pangan-pulse`;
- landing hero;
- section pembuka + satu insight utama;
- build hijau.

## Fase 2 — Story sections dan chart presentation
Kirim `prompts/02_STORY_AND_INTERPRETATION.md`.
Target:
- data story sections;
- interpretasi sederhana;
- chart styling;
- references/source notes;
- mobile responsiveness;
- build hijau.

## Fase 3 — Halaman analitik publik
Kirim `prompts/03_PUBLIC_PAGES.md`.
Target:
- data quality, validation, USD/IDR, test, Sumatera Barat, SHAP, methodology, downloads;
- data binding tetap asli;
- build hijau.

## Fase 4 — Motion, accessibility, QA
Kirim `prompts/04_MOTION_AND_QA.md`.
Target:
- motion refinement;
- reduced motion;
- keyboard/focus;
- visual QA;
- no overflow;
- build hijau.

## Jika Codex berhenti atau reconnect
Kirim `prompts/05_LANJUTKAN_TANPA_AUDIT_ULANG.md`.

## Wajib cek setelah tiap fase

```powershell
npm run build
```

Jika build gagal, perbaiki hanya error yang muncul. Jangan refactor backend atau database untuk memperbaiki masalah UI.
