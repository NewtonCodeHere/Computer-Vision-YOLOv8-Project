# Real-Time Foreign Object Detection in Bengal Gram using YOLOv8

An AI-powered computer vision system for **real-time foreign object detection in Bengal gram (chickpea)** using **YOLOv8**, designed for **vision-based food quality inspection** in industrial and agricultural processing pipelines.

[![Patent Status: Approved](https://img.shields.io/badge/Patent-Process%20Ongoing%20%26%20Approved-success.svg)](#patent-status)

---

## Overview

Food contamination during harvesting, transportation, and packaging is a major challenge in the food industry. Foreign materials such as **stones, twigs, jute fibers, plastic pieces, and other impurities** can mix with Bengal gram, affecting product quality and consumer safety.

This project provides an intelligent automated inspection system that uses **deep learning + computer vision** to detect impurities in real time and supports future integration with **robotic sorting systems**.

---

## Features

* Real-time impurity detection using **YOLOv8**
* Detects multiple foreign object classes
* Bounding box visualization
* Confidence score prediction
* Object center coordinate extraction
* Live camera / video feed support
* Detection analytics dashboard
* Report generation (PDF / CSV)
* Hardware integration ready (Arduino / ESP32)
* Future robotic arm support for automatic sorting

---

## Problem Statement

Traditional impurity detection methods are:

* Manual and time-consuming
* Error-prone due to human fatigue
* Difficult for visually similar contaminants
* Inefficient in large-scale industrial environments

This project solves these limitations using an AI-based automated inspection pipeline.

---

## Dataset

A custom dataset was created specifically for Bengal gram contamination detection.

### Dataset Specifications

* Total Images: **5606**
* Classes: **16**
* Resolution: **640 × 640**
* Annotation Tool: **Roboflow**
* Dataset Split:

  * Train: 70%
  * Validation: 20%
  * Test: 10%

### Impurity Classes

* Clean Bengal Gram
* Stone
* Twig
* Jute
* Chickpea
* Multiple combined impurity classes

---

## Data Augmentation

To improve model robustness, the following augmentations were applied:

* Rotation
* Horizontal flipping
* Vertical flipping
* Brightness adjustment
* Contrast enhancement
* Noise injection
* Shadow simulation
* Mosaic augmentation

---

## Tech Stack

### AI / ML

* Python
* PyTorch
* Ultralytics YOLOv8
* OpenCV
* NumPy

### Frontend

* React / Next.js
* Tailwind CSS
* Chart.js / Recharts

### Backend

* FastAPI / Flask
* WebSocket Streaming

### Database

* MongoDB / PostgreSQL

### Hardware (Future Integration)

* Arduino Nano
* ESP32
* Servo Motors
* Robotic Arm
* Pneumatic Ejector

---

## System Architecture

The system follows a modular pipeline:

### 1. Image Acquisition

Captures images using:

* Camera
* Webcam
* Conveyor feed
* Uploaded images/videos

### 2. Preprocessing

Input image preprocessing includes:

* Resizing to 640×640
* Pixel normalization
* Noise reduction
* Lighting adjustment

### 3. Detection

YOLOv8 detects impurities and outputs:

* Bounding boxes
* Class labels
* Confidence scores

### 4. Post Processing

Applies:

* Confidence thresholding
* Non-Maximum Suppression (NMS)

### 5. Coordinate Extraction

Computes impurity center coordinates:

center_x = (x1 + x2) / 2
center_y = (y1 + y2) / 2

Used for robotic sorting.

---

## Model Training Configuration

* Model: YOLOv8
* Input Size: 640×640
* Epochs: 100
* Batch Size: 16
* Optimizer: AdamW
* Learning Rate: 0.001
* Loss:

  * Bounding Box Loss
  * Classification Loss
  * Objectness Loss

---

## Performance Metrics

Model performance was evaluated using:

* Precision
* Recall
* mAP@0.5
* Confusion Matrix

### Results

* Precision: High
* Recall: High
* mAP@0.5: **96%+**
* Real-time capable: Yes

The model performs well even in challenging conditions such as:

* Overlapping grains
* Small impurities
* Moderate lighting variations

---

## UI Dashboard

A modern dashboard UI is included for industrial monitoring.

### Pages

### Login

Role-based access:

* Admin
* Operator
* Quality Inspector

### Dashboard

Shows:

* Total scans
* Detected impurities
* Accuracy
* System health

### Live Detection

Real-time:

* Camera feed
* Bounding boxes
* Detection logs
* Object coordinates

### Analytics

Charts for:

* Impurity distribution
* Daily detection count
* Accuracy trends

### Reports

Export:

* CSV
* PDF
* Daily summaries

### Settings

Configure:

* Confidence threshold
* Camera source
* Detection sensitivity
* Hardware communication

---

## Future Improvements

Planned upgrades:

* CBAM attention-enhanced YOLO
* Jetson Nano edge deployment
* Robotic arm integration
* Conveyor belt synchronization
* Voice alerts
* Sound alarms
* Multi-threaded pipeline
* Cloud analytics dashboard

---

## Applications

This system can be used in:

* Food processing industries
* Agricultural sorting units
* Quality control pipelines
* Smart manufacturing
* Automated packaging systems

---

## Installation

Clone repository:

```bash
git clone <repository-url>
cd foreign-object-detection
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run application:

```bash
python app.py
```

---

## Project Goals

* Improve food safety
* Reduce contamination
* Minimize food waste
* Enable industrial automation
* Support sustainable agriculture

---

## SDG Impact

This project supports:

* SDG 2 — Zero Hunger
* SDG 9 — Industry, Innovation & Infrastructure
* SDG 12 — Responsible Consumption & Production

---

## Patent Status

* **Status:** Patent process is ongoing and has received official approval.
* **Scope:** Real-Time AI & Computer Vision Foreign Object Detection in Bengal Gram (Chickpea) with automated pneumatic / robotic coordinate sorting pipeline.
* **Intellectual Property:** All system architectures, custom multi-class impurity dataset schemas, center coordinate extraction algorithms, and automated physical ejection interfaces are covered under the patent.

---

## Author

**NewtonCode**

AI Developer | Software Engineer | Problem Solver

---

## License

This project is licensed under the MIT License.

---

## Acknowledgement

Special thanks to all contributors, open-source communities, and research communities working in:

* Deep Learning
* Computer Vision
* Food Safety Automation
