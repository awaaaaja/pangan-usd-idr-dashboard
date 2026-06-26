# Narasi & Interpretasi Sederhana — Berdasarkan Hasil Eksekusi

Semua teks di bawah berasal dari artefak hasil penelitian yang dieksekusi. Gunakan sebagai copy public website. Jangan mengubah angka tanpa menjalankan notebook ulang.

## Hero / pembuka

**Pertanyaan utama:**
> Apakah kurs dolar benar-benar membantu membaca perubahan harga pangan?

**Jawaban singkat:**
> Kurs USD/IDR diuji sebagai fitur prediktif. Namun, pada validasi waktu yang ketat, pola harga historis dan baseline sederhana masih sangat kompetitif.

## Temuan 1 — Validasi harus jujur

**Judul:** Model tidak dipilih dari hasil test akhir.

**Interpretasi sederhana:**
> Model dipilih melalui empat putaran validasi walk-forward. Data Januari–Desember 2025 disimpan sebagai test akhir agar proses evaluasi tidak “mengintip” masa depan.

**Fakta:**
- Sampel strict-lag: **25,850 observasi**.
- Periode strict-lag: **April 2022–Desember 2025**.
- Validasi: **4 fold** expanding walk-forward.
- Embargo final: **Desember 2024**.
- Test akhir: **Januari–Desember 2025**.

## Temuan 2 — Baseline sederhana tetap kompetitif

**Judul:** Model kompleks tidak otomatis lebih unggul.

**Interpretasi sederhana:**
> Pada test akhir, baseline persistensi memperoleh MAE **5.271** poin persentase, sedikit lebih rendah daripada champion Random Forest **5.538**. Artinya, pada data yang belum pernah dilihat, perubahan harga belum selalu dapat ditangkap lebih baik oleh model yang lebih kompleks.

**Batas klaim:**
> Hasil ini bukan bukti bahwa machine learning tidak berguna. Hasil ini menunjukkan bahwa nilai tambah model perlu diuji terhadap baseline sederhana dan tidak boleh diasumsikan sejak awal.

## Temuan 3 — USD/IDR belum memberikan nilai tambah yang stabil

**Judul:** USD/IDR layak diuji, tetapi belum konsisten menang.

**Interpretasi sederhana:**
> Dalam empat fold validasi, konfigurasi tanpa USD/IDR lebih baik daripada konfigurasi dengan USD/IDR untuk Random Forest maupun XGBoost. Pada test akhir, XGBoost dengan USD/IDR memperoleh MAE **5.338**, tetapi test akhir tidak dipakai untuk memilih model. Karena itu, USD/IDR belum dapat diklaim memberi peningkatan yang stabil.

**Batas klaim:**
> USD/IDR diuji sebagai fitur prediktif, bukan ditafsirkan sebagai penyebab langsung perubahan harga pangan.

## Temuan 4 — Model terutama membaca riwayat harga dan musim

**Judul:** Riwayat harga lebih dominan daripada lokasi.

**Interpretasi sederhana:**
> SHAP pada model champion menunjukkan bahwa kelompok riwayat harga dan musiman memiliki kontribusi absolut rata-rata **6.329**, jauh di atas komoditas (**1.110**), provinsi (**0.060**), dan level harga (**0.045**). Bagi model ini, pola harga sebelumnya dan siklus waktu lebih banyak digunakan untuk membentuk prediksi.

**Batas klaim:**
> SHAP menjelaskan mekanisme internal model. Ia tidak membuktikan sebab-akibat ekonomi.

## Temuan 5 — Hasil Sumatera Barat berbeda menurut level harga

**Judul:** Tidak ada satu kesimpulan yang sama untuk semua level harga.

**Interpretasi sederhana:**
> Untuk Sumatera Barat tingkat konsumen, baseline memiliki MAE **3.398**, lebih rendah daripada Random Forest **3.917**. Pada tingkat produsen, Random Forest memperoleh MAE **5.608**, sedikit lebih rendah daripada baseline **5.627**. Perbedaan ini menunjukkan bahwa konteks harga konsumen dan produsen perlu dibaca terpisah.

## Temuan 6 — Outlier tidak disembunyikan

**Judul:** Lonjakan ekstrem diaudit, bukan dihapus otomatis.

**Interpretasi sederhana:**
> Sebanyak **6.27%** observasi diberi flag audit outlier, termasuk **3.57%** target ekstrem. Observasi tersebut dipertahankan dalam analisis utama agar hasil tidak terlihat terlalu rapi tetapi kehilangan kondisi pasar yang ekstrem.

## Copy footer / disclaimer

> Dashboard ini menyajikan backtesting historis dan evaluasi model. Ini bukan sistem rekomendasi harga masa depan, bukan bukti hubungan kausal, dan bukan pengganti keputusan kebijakan berbasis informasi lapangan.
