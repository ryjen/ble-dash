#!/bin/bash
# BLE GATT Server Setup Script for Arch Linux

set -e

echo "Setting up BLE GATT Server on Arch Linux..."

# Check if running as root for package installation
if [[ $EUID -eq 0 ]]; then
    echo "Don't run this script as root. It will use sudo when needed."
    exit 1
fi

# Install required packages
echo "Installing required packages..."
sudo pacman -Sy --needed bluez bluez-utils python-dbus python-gobject

# Enable and start Bluetooth service
echo "Enabling and starting Bluetooth service..."
sudo systemctl enable bluetooth
sudo systemctl start bluetooth

# Check if Bluetooth adapter is available
echo "Checking for Bluetooth adapter..."
if ! bluetoothctl list | grep -q "Controller"; then
    echo "No Bluetooth adapter found. Make sure your Bluetooth hardware is connected."
    exit 1
fi

# Power on Bluetooth adapter
echo "Powering on Bluetooth adapter..."
bluetoothctl power on

# Set adapter to discoverable and pairable
echo "Making adapter discoverable..."
bluetoothctl discoverable on
bluetoothctl pairable on

# Create systemd service file for the BLE server
echo "Creating systemd service file..."
sudo tee /etc/systemd/system/ble-gatt-server.service > /dev/null <<EOF
[Unit]
Description=BLE GATT Server
After=bluetooth.service
Requires=bluetooth.service

[Service]
Type=simple
User=$USER
Group=$USER
ExecStart=/usr/bin/python3 /home/$USER/.local/bin/ble-gatt-server
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Set up D-Bus permissions
echo "Setting up D-Bus permissions..."
sudo tee /etc/dbus-1/system.d/ble-gatt-server.conf > /dev/null <<EOF
<!DOCTYPE busconfig PUBLIC "-//freedesktop//DTD D-BUS Bus Configuration 1.0//EN"
  "http://www.freedesktop.org/standards/dbus/1.0/busconfig.dtd">
<busconfig>
  <policy user="$USER">
    <allow own="org.bluez.example"/>
    <allow send_destination="org.bluez"/>
    <allow send_interface="org.bluez.GattManager1"/>
    <allow send_interface="org.bluez.LEAdvertisingManager1"/>
    <allow send_interface="org.freedesktop.DBus.ObjectManager"/>
    <allow send_interface="org.freedesktop.DBus.Properties"/>
    <allow send_interface="org.bluez.GattService1"/>
    <allow send_interface="org.bluez.GattCharacteristic1"/>
    <allow send_interface="org.bluez.GattDescriptor1"/>
  </policy>
</busconfig>
EOF

# Add user to bluetooth group
echo "Adding user to bluetooth group..."
#sudo usermod -a -G bluetooth $USER

echo "Setup complete!"
echo ""
echo "To run the BLE GATT Server:"
echo "1. Save the Python script as ~/ble-gatt-server"
echo "2. Make it executable: chmod +x ~/ble-gatt-server"
echo "3. Run it: python3 ~/ble-gatt-server"
echo ""
echo "Or enable the systemd service:"
echo "  sudo systemctl daemon-reload"
echo "  sudo systemctl enable ble-gatt-server"
echo "  sudo systemctl start ble-gatt-server"
echo ""
echo "Note: You may need to log out and back in for group membership to take effect."
echo ""
echo "Test the server by connecting with a BLE client app on your phone."
echo "Look for a device named 'TestServer' with UUID: 12345678-1234-5678-1234-56789abcdef0"
