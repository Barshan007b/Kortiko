FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Seed database and start server
CMD python -m backend.seed_data && uvicorn backend.main:app --host 0.0.0.0 --port $PORT
