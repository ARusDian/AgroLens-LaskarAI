import json
import faiss
import numpy as np
import tensorflow as tf
from tokenizers import Tokenizer

import tensorflow as tf
from tensorflow.keras import layers


class AgroTransformerEncoder(tf.keras.Model):
    def __init__(
        self, vocab_size=8000, max_length=128, d_model=256, n_heads=4, dropout=0.1
    ):
        super().__init__()
        self.token_embed = layers.Embedding(input_dim=vocab_size, output_dim=d_model)
        self.pos_embed = layers.Embedding(input_dim=max_length, output_dim=d_model)

        self.attn = layers.MultiHeadAttention(num_heads=n_heads, key_dim=d_model)
        self.ffn = tf.keras.Sequential(
            [
                layers.Dense(d_model * 4, activation="relu"),
                layers.Dropout(dropout),
                layers.Dense(d_model),
            ]
        )
        self.dropout = layers.Dropout(dropout)
        self.ln1 = layers.LayerNormalization()
        self.ln2 = layers.LayerNormalization()

    def call(self, x, training=False):
        seq_len = tf.shape(x)[1]
        pos = tf.range(start=0, limit=seq_len, delta=1)
        pos = tf.expand_dims(pos, 0)
        x = self.token_embed(x) + self.pos_embed(pos)

        attn_output = self.attn(x, x, attention_mask=None, use_causal_mask=False)
        x = self.ln1(x + self.dropout(attn_output, training=training))

        ffn_output = self.ffn(x, training=training)
        x = self.ln2(x + self.dropout(ffn_output, training=training))

        x = tf.reduce_mean(x, axis=1)  # Global average pooling
        return x  # shape: (batch, d_model)


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

query = "Apa tantangan dalam menerapkan pengendalian hayati penyakit blast di lapangan?"
input_ids = tokenizer.encode(query).ids[:128]
padded = tf.constant([input_ids + [0] * (128 - len(input_ids))], dtype=tf.int32)
query_vec = encoder(padded, training=False).numpy()

D, I = index.search(query_vec, k=3)
print("Top 3 results for query:", query)
for i in I[0]:
    print(kb_entries[i]["text"])
