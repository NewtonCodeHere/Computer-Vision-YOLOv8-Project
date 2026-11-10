import os
import random
import datetime
import numpy as np
import cv2
from database import SessionLocal, init_db
from models import ScanRecord, DetectionItem, SystemLog
from config import settings

SAMPLES_DIR = os.path.join(os.path.dirname(__file__), "samples")
os.makedirs(SAMPLES_DIR, exist_ok=True)

def generate_sample_images():
    """Generates synthetic Bengal Gram test images with various contaminants."""
    from detector import detector
    
    sample_files = []
    for i in range(3):
        filepath = os.path.join(SAMPLES_DIR, f"bengal_gram_sample_{i+1}.jpg")
        frame = detector.generate_synthetic_conveyor_frame(frame_index=i * 20)
        cv2.imwrite(filepath, frame)
        sample_files.append(filepath)
    return sample_files

def seed_sample_database():
    """Seeds the database with realistic historical scans and impurity logs."""
    init_db()
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(ScanRecord).count() > 0:
        db.close()
        return

    print("[Seed] Seeding sample inspection batches and detection data...")
    now = datetime.datetime.utcnow()
    
    impurity_pool = [
        "Stone", "Twig", "Jute", "Broken Bengal Gram", 
        "Discolored Grain", "Mud Ball", "Plastic", "Foreign Grain"
    ]

    for day_offset in range(7, -1, -1):
        for scan_idx in range(random.randint(4, 8)):
            scan_time = now - datetime.timedelta(days=day_offset, hours=random.randint(1, 10), minutes=random.randint(0, 59))
            
            clean_count = random.randint(18, 30)
            imp_count = random.choice([0, 0, 1, 1, 2, 3])
            total = clean_count + imp_count
            purity = (clean_count / total * 100) if total > 0 else 100.0
            
            scan = ScanRecord(
                timestamp=scan_time,
                image_path=None,
                annotated_path=None,
                total_objects=total,
                clean_count=clean_count,
                impurity_count=imp_count,
                purity_rate=round(purity, 2),
                processing_time_ms=round(random.uniform(18.5, 35.2), 1),
                operator=random.choice(["Admin", "Operator_1", "QC_Inspector"])
            )
            db.add(scan)
            db.flush()

            # Add clean grains
            for _ in range(min(clean_count, 15)):
                cx = random.uniform(50, 590)
                cy = random.uniform(50, 590)
                item = DetectionItem(
                    scan_id=scan.id,
                    class_name="Clean Bengal Gram",
                    confidence=round(random.uniform(0.88, 0.98), 2),
                    x1=cx - 15, y1=cy - 12,
                    x2=cx + 15, y2=cy + 12,
                    center_x=cx, center_y=cy,
                    is_impurity=False,
                    ejected=False
                )
                db.add(item)

            # Add impurities
            for _ in range(imp_count):
                imp_class = random.choice(impurity_pool)
                cx = random.uniform(60, 580)
                cy = random.uniform(60, 580)
                item = DetectionItem(
                    scan_id=scan.id,
                    class_name=imp_class,
                    confidence=round(random.uniform(0.82, 0.96), 2),
                    x1=cx - 18, y1=cy - 18,
                    x2=cx + 18, y2=cy + 18,
                    center_x=cx, center_y=cy,
                    is_impurity=True,
                    ejected=True
                )
                db.add(item)

    # Add system log
    log = SystemLog(
        timestamp=now,
        level="INFO",
        source="SystemStartup",
        message="Bengal Gram Inspection System initialized successfully. Model YOLOv8 online."
    )
    db.add(log)
    db.commit()
    db.close()
    print("[Seed] Seed data generation complete.")

if __name__ == "__main__":
    generate_sample_images()
    seed_sample_database()
