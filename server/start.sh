#!/bin/bash

echo "Starting Robot BLE Server (Simplified Mode)..."

# Try to start Bluetooth service (may not work in all container environments)
if service bluetooth start 2>/dev/null; then
    echo "Bluetooth service started"
    sleep 2
else
    echo "Bluetooth service not available - running in simulation mode"
fi

# Check if Bluetooth adapter is available
if command -v hciconfig >/dev/null 2>&1; then
    if hciconfig hci0 up 2>/dev/null; then
        echo "Bluetooth adapter is ready"
    else
        echo "No Bluetooth adapter found - running in simulation mode"
    fi
else
    echo "Bluetooth tools not available - running in simulation mode"
fi

# Set default port if not specified
HTTP_PORT=${HTTP_PORT:-8080}
echo "HTTP server will run on port $HTTP_PORT"

# Start the simplified BLE server
echo "Starting Robot Statistics Server..."
exec python3 robot_ble_server.py
