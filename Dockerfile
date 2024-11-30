FROM node:18-slim as frontend-builder

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY app/ ./app/

# Copy built frontend files
COPY --from=frontend-builder /frontend/dist ./static

# Copy startup script
COPY start.sh .
RUN chmod +x start.sh

# Environment variables
ENV MONGODB_URL=""
ENV PORT=8000

# Expose port
EXPOSE 8000

# Start the application
CMD ["./start.sh"]
