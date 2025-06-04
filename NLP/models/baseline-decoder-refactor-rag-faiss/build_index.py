import json
import faiss
import numpy as np
import tensorflow as tf
from tokenizers import Tokenizer
from agro_encoder import AgroTransformerEncoder

# --- Load KB ---
with open("kb.jsonl", "r", encoding="utf-8") as f:
    kb_entries = [json.loads(line) for line in f]

# --- Load tokenizer ---
tokenizer = Tokenizer.from_file("tokenizer-agrolens.json")

# --- Init encoder ---
encoder = AgroTransformerEncoder()
encoder.build(input_shape=(None, 128))  # Build model
# (opsional) load encoder weights here if needed

# --- Encode and collect vectors ---
vecs = []
id_map = []

for entry in kb_entries:
    input_ids = tokenizer.encode(entry["text"]).ids[:128]
    padded = tf.constant([input_ids + [0] * (128 - len(input_ids))], dtype=tf.int32)
    embedding = encoder(padded, training=False).numpy()
    vecs.append(embedding[0])
    id_map.append(entry["id"])

vecs = np.stack(vecs).astype("float32")

# --- FAISS index ---
dim = vecs.shape[1]
index = faiss.IndexFlatL2(dim)
index.add(vecs)

# --- Save FAISS and ID mapping ---
faiss.write_index(index, "kb_faiss.index")
with open("kb_ids.json", "w") as f:
    json.dump(id_map, f)

print("✅ FAISS index built with", len(vecs), "entries.")
print("✅ ID mapping saved to kb_ids.json")
print("✅ FAISS index saved to kb_faiss.index")
