# 🌾 AgroLens-LaskarAI

**AgroLens-LaskarAI** adalah proyek AI multimodal untuk analisis pertanian, menggabungkan model klasifikasi citra dan pemrosesan bahasa alami (NLP). Proyek ini dirancang untuk mendeteksi penyakit tanaman melalui gambar dan menjawab pertanyaan pertanian dalam Bahasa Indonesia melalui chatbot.

---

## 🚀 Fitur Utama

* 📷 **Klasifikasi Gambar**: Model pembelajaran mesin untuk mendeteksi berbagai penyakit tanaman dari citra daun.
* 🤖 **Chatbot NLP**: Menjawab pertanyaan seputar penyakit tanaman padi menggunakan Bahasa Indonesia.
* 🖥️ **Antarmuka Web**: Sistem frontend dan backend yang memungkinkan interaksi pengguna dan layanan API.
* 🧠 **Model NLP**: Tersedia di Hugging Face untuk inferensi publik.

---

## 🌐 Akses Langsung

Kamu bisa mencoba aplikasi ini secara langsung melalui:

* 🔗 **Frontend Web (Live)**: [agro-lens-web.vercel.app](https://agro-lens-web.vercel.app/)
* 🔗 **Model Chatbot di Hugging Face**: [AgroLens-Chatbot – Hugging Face](https://huggingface.co/ARusDian/AgroLens-Chatbot)

> ✨ **Catatan**: Backend aplikasi juga berjalan di **Hugging Face Spaces**, sehingga dapat melakukan inferensi chatbot secara langsung dari antarmuka web maupun endpoint.

---

## 📦 Kebutuhan Sistem

* **Python**: Versi 3.12 atau lebih baru
* **Jupyter Notebook**
* **Library Python**:

  * `TensorFlow`, `PyTorch`, `scikit-learn`, `pandas`, `numpy`, `openpyxl`, `ipywidgets`, `faiss`, dll.
* **Node.js**: Untuk menjalankan antarmuka frontend

---

## ⚙️ Cara Menjalankan Proyek Secara Lokal

### 1. Clone Repository

```bash
git clone https://github.com/ARusDian/AgroLens-LaskarAI.git
cd AgroLens-LaskarAI
```

### 2. Siapkan Environment Python

```bash
python -m venv venv
source venv/bin/activate  # atau venv\Scripts\activate di Windows
```

### 3. Jalankan Backend

```bash
cd web/agrolens-backend
python main.py
```

> **Alternatif**: Backend juga tersedia di Hugging Face Spaces, jadi tidak wajib dijalankan secara lokal jika hanya ingin menguji inferensi.

### 4. Jalankan Frontend

```bash
cd ../agrolens-frontend
npm install
npm run dev
```

---

## 🖼️ Tampilan Aplikasi

### Halaman Depan

![Landing Page](src/landing_page.png)

### Halaman Diagnosa

![Diagnose Page](src/diagnosa_page.png)

### Hasil Klasifikasi Gambar

![Result Image Classification](src/result_image_classfication.png)

### Prompt Chatbot

![Chatbot Prompt](src/chatbot_prompt.png)

### Hasil Chatbot

![Chatbot Result](src/chatbot_result.png)

---

## 📚 Lisensi

Proyek ini dikembangkan untuk tujuan edukatif dan solusi praktis di bidang pertanian. Silakan gunakan, modifikasi, dan kontribusi sesuai kebutuhan Anda. Untuk informasi lebih lanjut, lihat file LICENSE.

