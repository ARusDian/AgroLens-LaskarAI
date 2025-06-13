import os

os.environ["TRANSFORMERS_CACHE"] = "/tmp/huggingface"
os.environ["HF_HOME"] = "/tmp/huggingface"

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline, AutoTokenizer
from PIL import Image
import numpy as np
import uvicorn
from tensorflow.keras.models import load_model
import os
import hashlib
import diskcache
import json

# === Inisialisasi FastAPI ===
app = FastAPI()

# === CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://agro-lens-web.vercel.app",  # ini penting!
        "http://localhost:3000",  # opsional untuk dev lokal
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Inisialisasi Cache ===
cache = diskcache.Cache("/tmp/cache")

# === Load Model Gambar ===
model_path = os.path.join(
    os.path.dirname(__file__), "saved_model", "multidisease_model.h5"
)
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model tidak ditemukan di path: {model_path}")
image_model = load_model(model_path)

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

# === Load Chatbot ===
chatbot = pipeline(
    "text-generation",
    model="ARusDian/AgroLens-Chatbot",
    tokenizer="ARusDian/AgroLens-Chatbot",
)


def preprocess_image(image: Image.Image):
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


def hash_image(image: Image.Image) -> str:
    """Generate hash for image content."""
    image_bytes = image.tobytes()
    return hashlib.md5(image_bytes).hexdigest()


@app.get("/")
def root():
    return {"ok": True}


# === Endpoint: Prediksi Gambar ===
@app.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
    image = Image.open(file.file).convert("RGB")
    image_hash = hash_image(image)

    if image_hash in cache:
        return cache[image_hash]

    input_tensor = preprocess_image(image)
    pred = np.argmax(image_model.predict(input_tensor), axis=1)[0]
    label = label_map.get(pred, "Tidak dikenal")
    description = label_descriptions.get(label, "-")

    result = {"prediction": label, "description": description}
    cache[image_hash] = result
    return result


# === Endpoint: Chatbot ===
@app.post("/chatbot")
async def describe(prompt: dict):
    text = prompt["prompt"]
    key = hashlib.md5(text.encode()).hexdigest()

    if key in cache:
        return {"response": cache[key]}

    tokenizer = AutoTokenizer.from_pretrained("ARusDian/AgroLens-Chatbot")
    result = chatbot(
        text,
        max_new_tokens=120,
        temperature=0.5,
        top_p=0.85,
        repetition_penalty=1.4,
        no_repeat_ngram_size=5,
        do_sample=True,
        eos_token_id=tokenizer.eos_token_id,
    )[0]["generated_text"]

    cache[key] = result
    return {"response": result}


# === Run lokal (tidak dipakai di Spaces) ===
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000)
