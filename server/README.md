# Robot BLE GATT Server

A Bluetooth Low Energy (BLE) GATT server that provides real-time statistics for a hypothetical robot. The server runs in Docker and exposes various robot metrics via BLE characteristics.

## Features

### Robot Statistics Provided:
- **Battery Level**: Current battery percentage (0-100%)
- **Position**: 3D coordinates (x, y, z) in meters
- **Velocity**: Linear and angular velocity
- **Status**: Current robot state (idle, moving, charging, error)
- **Command Interface**: Send commands to the robot

### BLE Service Details:
- **Service UUID**: `12345678-1234-5678-9abc-123456789abc`
- **Battery Characteristic**: `12345678-1234-5678-9abc-123456789abd` (Read, Notify)
- **Position Characteristic**: `12345678-1234-5678-9abc-123456789abe` (Read, Notify)
- **Velocity Characteristic**: `12345678-1234-5678-9abc-123456789abf` (Read, Notify)
- **Status Characteristic**: `12345678-1234-5678-9abc-123456789ac0` (Read, Notify)
- **Command Characteristic**: `12345678-1234-5678-9abc-123456789ac1` (Write)

## Prerequisites

- Docker and Docker Compose
- Bluetooth adapter on the host system
- Linux host (required for proper Bluetooth support)

## Quick Start

1. **Clone or create the project files**:
   ```bash
   mkdir robot-ble-server
   cd robot-ble-server
   # Copy all the provided files to this directory
   ```

2. **Build and run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Alternative: Build and run with Docker**:
   ```bash
   docker build -t robot-ble-server .
   docker run --privileged --network host \
     -v /var/run/dbus:/var/run/dbus:ro \
     -v /sys/class/bluetooth:/sys/class/bluetooth:ro \
     --device /dev/bluetooth \
     robot-ble-server
   ```

## Robot Simulation

The server simulates a realistic robot with the following behavior:

### Battery Management:
- Drains faster when moving (0.1%/second)
- Slow drain when idle (0.02%/second)
- Range: 0-100%

### Movement Simulation:
- Position updates based on velocity
- Velocity has realistic limits (0-2 m/s linear, ±1 rad/s angular)
- Random noise added for realistic behavior

### Status States:
- `idle`: Robot is stationary
- `moving`: Robot is in motion
- `charging`: Robot is charging (future feature)
- `error`: Robot has encountered an error

## Connecting to the Server

### Using a BLE Scanner App:
1. Look for device advertising the robot service UUID
2. Connect and explore available characteristics
3. Subscribe to notifications for real-time updates

### Using Command Line Tools:
```bash
# Scan for BLE devices
sudo hcitool lescan

# Connect using gatttool
gatttool -b [MAC_ADDRESS] -I
```

### Using Python Client:
```python
import asyncio
from bleak import BleakClient, BleakScanner

async def connect_to_robot():
    device = await BleakScanner.find_device_by_name("Robot")
    if device:
        async with BleakClient(device) as client:
            # Read battery level
            battery = await client.read_gatt_char("12345678-1234-5678-9abc-123456789abd")
            print(f"Battery: {battery[0]}%")
```

## Data Formats

### Battery Level:
- Format: Single byte (0-100)
- Units: Percentage

### Position:
- Format: 3 × 32-bit floats (little-endian)
- Units: Meters (x, y, z coordinates)

### Velocity:
- Format: 2 × 32-bit floats (little-endian)
- Units: m/s (linear), rad/s (angular)

### Status:
- Format: UTF-8 string
- Values: "idle", "moving", "charging", "error"

## Troubleshooting

### Common Issues:

1. **No Bluetooth adapter found**:
   - Ensure the host has a working Bluetooth adapter
   - Check with `hciconfig` on the host

2. **Permission denied errors**:
   - Make sure container runs with `--privileged` flag
   - Verify D-Bus socket access

3. **Cannot connect to device**:
   - Check if BlueZ service is running on host
   - Verify firewall settings
   - Try resetting Bluetooth: `sudo systemctl restart bluetooth`

### Logs and Debugging:
```bash
# View container logs
docker-compose logs -f robot-ble-server

# Check Bluetooth status in container
docker exec -it robot-ble-gatt-server hciconfig
```

## Development

### Running Locally (without Docker):
```bash
# Install system dependencies (Ubuntu/Debian)
sudo apt-get install bluez bluez-tools bluetooth libbluetooth-dev

# Install Python dependencies
pip install -r requirements.txt

# Run the server
sudo python3 robot_ble_server.py
```

### Customizing Robot Behavior:
Modify the `RobotStatistics` class in `robot_ble_server.py` to change:
- Update frequency
- Value ranges
- Simulation behavior
- Additional statistics

## License

This project is provided as an example implementation for educational purposes.
