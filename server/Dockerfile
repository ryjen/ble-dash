FROM python:3.9-slim

# Install minimal system dependencies
RUN apt-get update && apt-get install -y \
    bluez \
    bluez-tools \
    bluetooth \
    curl \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /app

# Copy application files (use the simplified version)
COPY robot_ble_server.py ./robot_ble_server.py
COPY start.sh ./start.sh

# Make start script executable
RUN chmod +x start.sh

# Expose HTTP port (configurable via environment)
EXPOSE 8080

# Run the application
CMD ["./start.sh"]
