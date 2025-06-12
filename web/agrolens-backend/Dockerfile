FROM python:3.10

# Install dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy app
COPY . /app
WORKDIR /app

# Expose port
EXPOSE 7860

# Run server (Hugging Face akan buka port 7860)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
