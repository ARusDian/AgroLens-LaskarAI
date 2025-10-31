# 🌾 AgroLens-LaskarAI

**AgroLens-LaskarAI** is a **multimodal AI project for agricultural analysis**, combining **image classification** and **natural language processing (NLP)**. Its goal is to detect rice plant diseases from leaf images and provide interactive explanations and treatment solutions in **Indonesian** through an AI-powered chatbot.

---

## 🚀 Key Features

* 📷 **Image Classification**
  Automatically detects various rice leaf diseases using a deep learning model.

* 🤖 **NLP Chatbot**
  Answers questions about symptoms, causes, and treatments of rice diseases in Indonesian.

* 🖥️ **Interactive Web Interface**
  Includes both frontend and backend connected via API for diagnosis and agricultural consultation.

* 🧠 **Open NLP Model**
  The chatbot model is available on Hugging Face for public use and further development.

---

## 🌐 Live Access

You can try the live version of the application and model here:

* 🔗 **Frontend Web**: [agro-lens-web.vercel.app](https://agro-lens-web.vercel.app/)
* 🔗 **NLP Model on Hugging Face**: [AgroLens-Chatbot @ Hugging Face](https://huggingface.co/ARusDian/AgroLens-Chatbot)

> 💡 **Note**: The backend is also hosted on **Hugging Face Spaces**, allowing you to use the chatbot inference directly from the web without local setup.

---

## 🛠️ Tech Stack

### 🔍 Machine Learning & NLP

* `TensorFlow`, `Keras`, `PyTorch`
* `Transformers`, `datasets`, `tokenizers` (Hugging Face)
* `scikit-learn`, `opencv-python`, `scikit-image`, `Pillow`
* `faiss-gpu` for vector search

### 🌐 Backend

* `FastAPI`, `Uvicorn`
* `Pandas`, `NumPy`

### 💻 Frontend

* `React.js` + `Vite`
* `Tailwind CSS`

### ☁️ Deployment

* **Frontend**: [Vercel](https://vercel.com)
* **Backend/NLP Model**: [Hugging Face Spaces](https://huggingface.co/spaces)
* **Source Code Repository**: [GitHub](https://github.com/ARusDian/AgroLens-LaskarAI)

---

## 📦 System Requirements

* **Python**: Version 3.10 or newer
* **Node.js**: Required for frontend
* **Jupyter Notebook**: For ML experimentation

### Main Python Libraries

```txt
tensorflow
torch
transformers
datasets
tokenizers
scikit-learn
pandas
numpy
opencv-python
scikit-image
Pillow
fastapi
uvicorn
ipywidgets
openpyxl
```

---

## ⚙️ Running the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/ARusDian/AgroLens-LaskarAI.git
cd AgroLens-LaskarAI
```

### 2. Set Up Python Environment

```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

### 3. Run the Backend

```bash
cd web/agrolens-backend
python main.py
```

> 🧪 The backend is also available on Hugging Face Spaces if you just want to test the chatbot without installing it locally.

### 4. Run the Frontend

```bash
cd ../agrolens-frontend
npm install
npm run dev
```

---

## 🖼️ Application Preview

### Landing Page

![Landing Page](assets/landing_page.png)

### Diagnosis Page

![Diagnosis Page](assets/diagnosa_page.png)

### Image Classification Result

![Result Image Classification](assets/result_image_classfication.png)

### Chatbot Prompt

![Chatbot Prompt](assets/chatbot_prompt.png)

### Chatbot Response

![Chatbot Result](assets/chatbot_result.png)

---

## 📚 License

This project is developed for educational purposes and as a practical solution for digital agriculture.
Feel free to use, modify, and contribute to it as needed.
