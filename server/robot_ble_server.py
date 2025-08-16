#!/usr/bin/env python3

import asyncio
import logging
import struct
import time
import json
import random
import subprocess
import os
import signal
import sys

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class RobotStatistics:
    """Simulates robot statistics with realistic values"""
    
    def __init__(self):
        self.battery_level = 85.0
        self.position = {"x": 0.0, "y": 0.0, "z": 0.0}
        self.velocity = {"linear": 0.0, "angular": 0.0}
        self.status = "idle"
        self.last_update = time.time()
        
    def update(self):
        """Update robot statistics with simulated values"""
        current_time = time.time()
        dt = current_time - self.last_update
        
        # Simulate battery drain
        if self.status == "moving":
            self.battery_level -= 0.1 * dt
        else:
            self.battery_level -= 0.02 * dt
            
        self.battery_level = max(0.0, min(100.0, self.battery_level))
        
        # Simulate position changes
        if self.status == "moving":
            self.position["x"] += self.velocity["linear"] * dt * 0.8
            self.position["y"] += self.velocity["linear"] * dt * 0.6
            
        # Add some random movement
        if random.random() < 0.1:  # 10% chance to change status
            self.status = random.choice(["idle", "moving", "charging"])
            if self.status == "moving":
                self.velocity["linear"] = random.uniform(0.1, 1.5)
                self.velocity["angular"] = random.uniform(-0.5, 0.5)
            else:
                self.velocity["linear"] = 0.0
                self.velocity["angular"] = 0.0
        
        self.last_update = current_time
        
    def to_json(self):
        """Convert stats to JSON for easy debugging"""
        return json.dumps({
            "battery": round(self.battery_level, 1),
            "position": self.position,
            "velocity": self.velocity,
            "status": self.status,
            "timestamp": time.time()
        }, indent=2)

class SimpleBLEAdvertiser:
    """Simple BLE advertiser using hciconfig and bluetoothctl"""
    
    def __init__(self):
        self.robot_stats = RobotStatistics()
        self.running = False
        
    def setup_bluetooth(self):
        """Setup Bluetooth adapter"""
        try:
            # Reset Bluetooth adapter
            subprocess.run(["hciconfig", "hci0", "down"], check=False)
            time.sleep(1)
            subprocess.run(["hciconfig", "hci0", "up"], check=True)
            
            # Make adapter discoverable
            subprocess.run(["hciconfig", "hci0", "piscan"], check=True)
            subprocess.run(["hciconfig", "hci0", "name", "RobotServer"], check=False)
            
            logger.info("Bluetooth adapter configured successfully")
            return True
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to setup Bluetooth: {e}")
            return False
        except FileNotFoundError:
            logger.error("Bluetooth tools not found. Install bluez-tools package.")
            return False
    
    def start_statistics_server(self):
        """Start a simple HTTP server for statistics"""
        from http.server import HTTPServer, BaseHTTPRequestHandler
        import threading
        
        # Get port from environment variable, default to 8080
        port = int(os.environ.get('HTTP_PORT', '8080'))
        
        class StatsHandler(BaseHTTPRequestHandler):
            def __init__(self, stats_ref, *args, **kwargs):
                self.stats = stats_ref
                super().__init__(*args, **kwargs)
                
            def do_GET(self):
                if self.path == '/stats':
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(self.stats.to_json().encode())
                elif self.path == '/':
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html')
                    self.end_headers()
                    html = f"""
                    <html>
                    <head><title>Robot BLE Server</title></head>
                    <body>
                        <h1>Robot Statistics Server</h1>
                        <p>BLE Server Status: {self.stats.status}</p>
                        <p><a href="/stats">View JSON Stats</a></p>
                        <h2>Current Stats:</h2>
                        <pre>{self.stats.to_json()}</pre>
                        <script>
                            setInterval(() => {{
                                fetch('/stats')
                                .then(r => r.json())
                                .then(data => {{
                                    document.querySelector('pre').textContent = JSON.stringify(data, null, 2);
                                }});
                            }}, 1000);
                        </script>
                    </body>
                    </html>
                    """
                    self.wfile.write(html.encode())
                else:
                    self.send_response(404)
                    self.end_headers()
                    
            def log_message(self, format, *args):
                # Suppress HTTP server logs
                pass
        
        def create_handler(*args, **kwargs):
            return StatsHandler(self.robot_stats, *args, **kwargs)
            
        server = HTTPServer(('0.0.0.0', port), create_handler)
        server_thread = threading.Thread(target=server.serve_forever, daemon=True)
        server_thread.start()
        logger.info(f"HTTP stats server started on port {port}")
        return server
    
    def run(self):
        """Run the BLE server simulation"""
        logger.info("Starting Robot BLE Server (Simplified)")
        
        # Setup signal handlers
        def signal_handler(sig, frame):
            logger.info("Shutting down...")
            self.running = False
            sys.exit(0)
            
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
        
        # Setup Bluetooth
        if not self.setup_bluetooth():
            logger.warning("Bluetooth setup failed, running in simulation mode only")
        
        # Start HTTP server for easy monitoring
        http_server = self.start_statistics_server()
        
        # Main loop
        self.running = True
        port = int(os.environ.get('HTTP_PORT', '8080'))
        logger.info(f"Server running. Access stats at http://localhost:{port}")
        logger.info("Robot stats will be logged every 5 seconds")
        
        try:
            while self.running:
                # Update robot statistics
                self.robot_stats.update()
                
                # Log stats every 5 seconds
                if int(time.time()) % 5 == 0:
                    logger.info(f"Robot Stats: Battery={self.robot_stats.battery_level:.1f}%, "
                              f"Status={self.robot_stats.status}, "
                              f"Position=({self.robot_stats.position['x']:.2f}, "
                              f"{self.robot_stats.position['y']:.2f}, "
                              f"{self.robot_stats.position['z']:.2f})")
                
                time.sleep(1)
                
        except KeyboardInterrupt:
            logger.info("Received interrupt signal")
        finally:
            self.running = False
            logger.info("Server stopped")

if __name__ == "__main__":
    server = SimpleBLEAdvertiser()
    server.run()
