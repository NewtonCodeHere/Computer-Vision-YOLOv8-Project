import os
from typing import List, Dict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Bengal Gram YOLOv8 Quality Inspection System"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./detection.db")
    
    # Detection
    CONFIDENCE_THRESHOLD: float = 0.50
    IOU_THRESHOLD: float = 0.45
    MODEL_PATH: str = os.path.join(os.path.dirname(__file__), "models", "bengal_gram_yolov8.pt")
    
    # Hardware (Arduino Nano / ESP32 Ejector)
    HARDWARE_ENABLED: bool = False
    HARDWARE_PORT: str = "COM3"
    HARDWARE_BAUDRATE: int = 115200
    MOCK_HARDWARE: bool = True
    
    # Storage
    UPLOAD_DIR: str = os.path.join(os.path.dirname(__file__), "uploads")
    REPORTS_DIR: str = os.path.join(os.path.dirname(__file__), "reports")
    
    # Impurity Classes (16 classes as specified in project dataset)
    CLASSES: List[str] = [
        "Clean Bengal Gram",
        "Stone",
        "Twig",
        "Jute",
        "Chickpea",
        "Plastic",
        "Metal",
        "Dirt",
        "Discolored Grain",
        "Broken Bengal Gram",
        "Weevil Damaged",
        "Foreign Grain",
        "Glass",
        "Shell",
        "Mud Ball",
        "Mixed Impurity"
    ]
    
    # Class colors for visual annotation (BGR format for OpenCV)
    CLASS_COLORS: Dict[str, tuple] = {
        "Clean Bengal Gram": (0, 200, 0),       # Green
        "Stone": (0, 0, 220),                   # Red
        "Twig": (30, 105, 210),                 # Chocolate brown
        "Jute": (0, 140, 255),                  # Orange
        "Chickpea": (255, 191, 0),              # Deep Sky Blue
        "Plastic": (255, 0, 128),               # Purple
        "Metal": (0, 215, 255),                 # Gold
        "Dirt": (42, 42, 165),                  # Brown
        "Discolored Grain": (0, 165, 255),      # Amber
        "Broken Bengal Gram": (50, 205, 50),    # Lime green
        "Weevil Damaged": (0, 69, 255),         # Orange-red
        "Foreign Grain": (205, 92, 92),         # Medium violet
        "Glass": (238, 130, 238),               # Violet
        "Shell": (147, 112, 219),               # Medium purple
        "Mud Ball": (19, 69, 139),              # Saddle brown
        "Mixed Impurity": (0, 0, 255)           # Crimson
    }

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
os.makedirs(os.path.dirname(settings.MODEL_PATH), exist_ok=True)
