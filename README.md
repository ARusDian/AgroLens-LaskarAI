# AgroLens-LaskarAI

AgroLens-LaskarAI is a multi-modal AI project for agricultural analysis, featuring image classification and natural language processing (NLP) models. It includes tools for plant disease detection from images and a chatbot for answering agricultural questions in Bahasa Indonesia.

## Features

- **Image Classification**: A machine learning models for detecting multiple plant diseases from images.
- **NLP Chatbot**:  Using natural language processing for Q&A about the disease.
- **Web Interface**: Frontend and backend for user interaction and API serving.

## Requirements

- Python 3.12+
- Jupyter Notebook
- TensorFlow, PyTorch, scikit-learn, pandas, numpy, openpyxl, ipywidgets, FAISS, etc.
- Node.js (for frontend)

## How to Start

1. **Clone the repository**
   ```sh
   git clone https://github.com/ARusDian/AgroLens-LaskarAI.git
   cd AgroLens-LaskarAI
   ```

2. **Set up Python environment**
    ```python -m venv venv
    source venv/bin/activate
    ```

3. **Start the backend**
    ```
    cd web/agrolens-backend
    python main.py
    ```

4. **Start the frontend**    
    ```
    cd web/agrolens-frontend
    npm install
    npm run dev
    ```

 ## Overview
![Landing Page](src/landing_page.png)
![Diagnose Page](src/diagnosa_page.png)
![Result Image Classification](src/result_image_classfication.png)
![Chatbot Prompt](src/chatbot_prompt.png)
![Chatbot Result](src/chatbot_result.png)