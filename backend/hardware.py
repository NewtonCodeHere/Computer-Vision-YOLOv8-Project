import time
import logging
from typing import Optional
from config import settings

logger = logging.getLogger("HardwareController")

class HardwareController:
    """
    Hardware Interface for Arduino Nano / ESP32.
    Controls pneumatic ejectors, servo arms, or alert buzzers when impurities are detected.
    Transmits coordinate packets: 'ACTUATE,<center_x>,<center_y>,<class_name>\\n'
    """
    def __init__(self, port: str = None, baudrate: int = None, mock: bool = True):
        self.port = port or settings.HARDWARE_PORT
        self.baudrate = baudrate or settings.HARDWARE_BAUDRATE
        self.mock = mock if mock is not None else settings.MOCK_HARDWARE
        self.connection = None
        self.last_command = None
        self.last_actuation_time = 0
        self.connected = False
        
        self.connect()

    def connect(self) -> bool:
        if self.mock:
            self.connected = True
            logger.info(f"[Hardware] Initialized in Mock Hardware mode (Emulated Arduino/ESP32 on {self.port})")
            return True

        try:
            import serial
            self.connection = serial.Serial(self.port, self.baudrate, timeout=1)
            time.sleep(2)  # Wait for microcontroller to reset
            self.connected = True
            logger.info(f"[Hardware] Connected to physical controller on {self.port} @ {self.baudrate}")
            return True
        except Exception as e:
            logger.warning(f"[Hardware] Could not connect to {self.port}: {e}. Falling back to virtual controller.")
            self.mock = True
            self.connected = True
            return False

    def trigger_ejector(self, center_x: float, center_y: float, class_name: str) -> bool:
        """Sends pneumatic ejection or robotic arm pick command with target coordinates."""
        command = f"ACTUATE,{int(center_x)},{int(center_y)},{class_name}\n"
        self.last_command = command.strip()
        self.last_actuation_time = time.time()
        
        if self.mock or not self.connection:
            logger.debug(f"[Hardware MOCK] Sent command: {self.last_command}")
            return True
        
        try:
            self.connection.write(command.encode('utf-8'))
            return True
        except Exception as e:
            logger.error(f"[Hardware] Error writing to serial: {e}")
            return False

    def trigger_buzzer(self, state: bool = True):
        cmd = f"BUZZER,{'ON' if state else 'OFF'}\n"
        if not self.mock and self.connection:
            try:
                self.connection.write(cmd.encode('utf-8'))
            except Exception:
                pass

    def get_status(self) -> dict:
        return {
            "connected": self.connected,
            "mock_mode": self.mock,
            "port": self.port,
            "baudrate": self.baudrate,
            "last_command": self.last_command,
            "last_actuation": round(self.last_actuation_time, 2) if self.last_actuation_time else None
        }

hardware = HardwareController()
