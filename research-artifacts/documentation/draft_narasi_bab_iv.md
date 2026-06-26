# Draft Narasi BAB IV — Hasil Otomatis

## 4.1 Deskripsi dataset
Dataset akhir strict-lag terdiri dari **25,850 observasi** pada periode April 2022 sampai December 2025. Sampel dibentuk hanya dari observasi yang mempunyai tiga lag harga berurutan, fitur USD/IDR lengkap, dan target perubahan harga satu bulan berikutnya yang tersedia. Kebijakan ini menghindari imputasi lag yang berpotensi menciptakan pola harga historis fiktif.

## 4.2 Audit kualitas dan outlier
Sebanyak **3.57%** observasi strict-lag ditandai sebagai target ekstrem berdasarkan perubahan absolut minimal 100% dan/atau robust MAD. Seluruh observasi tersebut tetap dipertahankan dalam analisis utama. Detail observasi ditulis pada `10_detail_outlier_audit.csv` agar dapat diverifikasi terhadap sumber data Bapanas.

## 4.3 Validasi temporal
Konfigurasi dipilih melalui 4 fold walk-forward validation dengan embargo satu bulan. Test akhir dimulai pada **January 2025** dan tidak digunakan dalam pemilihan konfigurasi. Model ML champion berdasarkan MAE validasi adalah **Random Forest | tanpa USD/IDR | rf_regularized**.

## 4.4 Evaluasi test akhir
Pada test akhir, champion memperoleh MAE **5.538** poin persentase, RMSE **12.308**, R² **-0.029**, dan directional accuracy **56.62%**. Sebagai pembanding, baseline naïf persistensi memperoleh MAE **5.271** poin persentase. Perbandingan per level harga, komoditas, dan analisis sensitivitas outlier disajikan pada tabel output BAB IV.

## 4.5 Interpretasi
Interpretasi SHAP menunjukkan fitur yang paling memengaruhi prediksi internal model. Hasil ini perlu dibaca sebagai kontribusi prediktif pada model, bukan sebagai bukti bahwa perubahan USD/IDR menyebabkan perubahan harga pangan.
