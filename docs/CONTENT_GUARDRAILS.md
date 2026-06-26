# Guardrail Klaim Penelitian

## Gunakan
- “USD/IDR diuji sebagai fitur prediktif.”
- “Model dipilih berdasarkan validasi temporal.”
- “Test akhir digunakan untuk evaluasi objektif.”
- “Baseline sederhana tetap kompetitif.”
- “SHAP menjelaskan kontribusi prediktif di dalam model.”
- “Dashboard menampilkan backtesting historis.”

## Jangan gunakan
- “USD/IDR menyebabkan harga pangan naik/turun.”
- “USD/IDR terbukti meningkatkan prediksi.”
- “Random Forest/XGBoost adalah model terbaik secara mutlak.”
- “Dashboard memprediksi harga masa depan.”
- “SHAP membuktikan faktor penyebab.”
- “Akurasi model tinggi” tanpa menyebut metrik dan konteks.

## Aturan angka

1. Angka UI wajib berasal dari tabel CSV atau database hasil import.
2. Jangan hard-code angka production ke komponen jika data sudah tersedia dari query.
3. Preview lokal boleh memakai angka contoh yang sama dengan data asli, tetapi harus ditandai `PROTOTYPE ONLY` pada dokumen, bukan UI publik.
4. Setiap figure harus memiliki sumber dan periode.
