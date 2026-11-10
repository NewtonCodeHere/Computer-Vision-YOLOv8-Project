"""
Bengal Gram YOLOv8 Model Training Script
Configured according to the specifications in README.md:
- Epochs: 100
- Batch size: 16
- Input image size: 640x640
- Optimizer: AdamW
- Learning rate: 0.001
- Model architecture: YOLOv8n / YOLOv8s
"""

import os
import argparse

def train_model(
    data_yaml: str = "data.yaml",
    model_size: str = "yolov8n.pt",
    epochs: int = 100,
    batch_size: int = 16,
    img_size: int = 640,
    device: str = "0",
    output_dir: str = "runs/train"
):
    try:
        from ultralytics import YOLO
    except ImportError:
        print("[Error] Ultralytics is not installed. Run: pip install ultralytics")
        return

    if not os.path.exists(data_yaml):
        print(f"[Warning] Dataset descriptor '{data_yaml}' not found.")
        print("Please provide path to your Roboflow exported data.yaml file.")
        return

    print(f"--- Starting Bengal Gram YOLOv8 Training ---")
    print(f"Base model: {model_size}")
    print(f"Dataset:    {data_yaml}")
    print(f"Epochs:     {epochs}")
    print(f"Batch:      {batch_size}")
    print(f"Image Size: {img_size}")
    print(f"Optimizer:  AdamW (lr0=0.001)")

    model = YOLO(model_size)

    results = model.train(
        data=data_yaml,
        epochs=epochs,
        batch=batch_size,
        imgsz=img_size,
        optimizer="AdamW",
        lr0=0.001,
        project=output_dir,
        name="bengal_gram_yolov8",
        device=device,
        save=True,
        plots=True,
        mosaic=1.0,
        flipud=0.5,
        fliplr=0.5
    )

    print("--- Training Completed Successfully! ---")
    best_weights = os.path.join(output_dir, "bengal_gram_yolov8", "weights", "best.pt")
    print(f"Best model weights saved to: {best_weights}")
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train YOLOv8 on Bengal Gram Dataset")
    parser.add_argument("--data", default="data.yaml", help="Path to data.yaml")
    parser.add_argument("--model", default="yolov8n.pt", help="Pretrained model weights")
    parser.add_argument("--epochs", type=int, default=100, help="Number of epochs")
    parser.add_argument("--batch", type=int, default=16, help="Batch size")
    parser.add_argument("--imgsz", type=int, default=640, help="Image resolution")
    args = parser.parse_args()

    train_model(
        data_yaml=args.data,
        model_size=args.model,
        epochs=args.epochs,
        batch_size=args.batch,
        img_size=args.imgsz
    )
