import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class ScanRecord(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    image_path = Column(String(255), nullable=True)
    annotated_path = Column(String(255), nullable=True)
    total_objects = Column(Integer, default=0)
    clean_count = Column(Integer, default=0)
    impurity_count = Column(Integer, default=0)
    purity_rate = Column(Float, default=100.0)  # Purity percentage
    processing_time_ms = Column(Float, default=0.0)
    operator = Column(String(100), default="Admin")

    detections = relationship("DetectionItem", back_populates="scan", cascade="all, delete-orphan")


class DetectionItem(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    class_name = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    
    # Bounding box coordinates
    x1 = Column(Float, nullable=False)
    y1 = Column(Float, nullable=False)
    x2 = Column(Float, nullable=False)
    y2 = Column(Float, nullable=False)
    
    # Object center coordinates for robotic arm / pneumatic sorting
    center_x = Column(Float, nullable=False)
    center_y = Column(Float, nullable=False)
    
    is_impurity = Column(Boolean, default=True)
    ejected = Column(Boolean, default=False)

    scan = relationship("ScanRecord", back_populates="detections")


class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    level = Column(String(20), default="INFO")
    source = Column(String(50), default="YOLOv8")
    message = Column(Text, nullable=False)


class AppSetting(Base):
    __tablename__ = "app_settings"

    key = Column(String(100), primary_key=True)
    value = Column(String(255), nullable=False)
