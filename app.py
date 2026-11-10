"""
Bengal Gram Real-Time Foreign Object Detection System using YOLOv8
Root Runner: Launches the FastAPI backend and detection service.
"""

import sys
import os
import uvicorn

# Add backend directory to Python sys.path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    print("=" * 70)
    print(" Bengal Gram Foreign Object Detection System (YOLOv8)")
    print(" Starting Backend Server on http://localhost:8000")
    print(" Swagger API Documentation: http://localhost:8000/docs")
    print("=" * 70)
    
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, app_dir=backend_dir)
