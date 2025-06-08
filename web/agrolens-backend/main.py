from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from PIL import Image
from PIL import Image
import numpy as np
import uvicorn
from tensorflow.keras.models import load_model
from transformers import (AutoTokenizer)
import os

# === Inisialisasi FastAPI ===
app = FastAPI()

# === CORS (opsional) ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Load Model Klasifikasi Gambar ===
model_path = os.path.join(os.path.dirname(__file__), "saved_model", "multidisease_model.h5")
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model tidak ditemukan di path: {model_path}")
image_model = load_model(model_path)


# Label (ubah sesuai model Anda)
label_map = {
    0: "BacterialBlight",
    1: "Blast",
    2: "Brownspot",
    3: "Healthy",
    4: "Leaf_Scald",
    5: "Tungro",
}
label_descriptions = {
    "BacterialBlight": "Penyakit akibat bakteri yang menyebabkan bercak air dan layu.",
    "Blast": "Penyakit jamur yang menyerang leher malai dan daun.",
    "Brownspot": "Terdapat bercak coklat bulat di permukaan daun.",
    "Healthy": "Tanaman padi dalam kondisi sehat tanpa gejala penyakit.",
    "Leaf_Scald": "Daun mengering dari ujung dan terbakar karena patogen atau cuaca ekstrem.",
    "Tungro": "Penyakit virus yang membuat daun menguning dan pertumbuhan terhambat.",
}

# === Load Chatbot Pipeline ===
chatbot = pipeline(
    "text-generation",
    model="indogpt-chatbot-finetuned",
    tokenizer="indogpt-chatbot-finetuned",
)


def preprocess_image(image: Image.Image):
    image = image.resize((224, 224))  # sesuaikan ukuran input model
    img_array = np.array(image) / 255.0  # normalisasi
    img_array = np.expand_dims(img_array, axis=0)  # tambahkan batch dimensi
    return img_array


# === Endpoint: Klasifikasi Gambar ===
@app.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
    image = Image.open(file.file).convert("RGB")
    input_tensor = preprocess_image(image)

    pred = np.argmax(image_model.predict(input_tensor), axis=1)[0]
    label = label_map.get(pred, "Tidak dikenal")
    description = label_descriptions.get(label, "-")

    return {"prediction": label, "description": description}


# === Endpoint: Chatbot Deskripsi Penyakit ===
@app.post("/chatbot")
async def describe(prompt: dict):
    text = prompt["prompt"]
    tokenizer = AutoTokenizer.from_pretrained("indogpt-chatbot-finetuned")
    result = chatbot(
        text,
        max_new_tokens=100,
        temperature=0.5,
        top_p=0.85,
        repetition_penalty=1.4,
        no_repeat_ngram_size=5,
        do_sample=True,
        eos_token_id=tokenizer.eos_token_id,
    )[0]["generated_text"]
    return {"response": result}


# === Run (opsional) ===
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
