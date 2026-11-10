'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Camera, 
  Upload, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Zap,
  Sliders
} from 'lucide-react';

export default function LiveDetectionPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [mode, setMode] = useState<'stream' | 'upload' | 'sample'>('stream');
  const [telemetry, setTelemetry] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [annotatedResult, setAnnotatedResult] = useState<any>(null);
  const [loadingScan, setLoadingScan] = useState(false);
  const [confidence, setConfidence] = useState(0.50);
  const [actuatorFlashed, setActuatorFlashed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll detection telemetry or connect websocket
  useEffect(() => {
    if (!isPlaying || mode !== 'stream') return;

    let ws: WebSocket | null = null;
    const wsUrl = `ws://${window.location.hostname}:8000/ws/live`;
    
    try {
      ws = new WebSocket(wsUrl);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setTelemetry(data);
          if (data.hardware_actuated) {
            setActuatorFlashed(true);
            setTimeout(() => setActuatorFlashed(false), 300);
          }
        } catch (e) {
          console.error(e);
        }
      };
    } catch (e) {
      console.warn("WebSocket could not connect, will use stream fallback.");
    }

    return () => {
      if (ws) ws.close();
    };
  }, [isPlaying, mode]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingScan(true);
    setMode('upload');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/detect/image?confidence=${confidence}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setAnnotatedResult(data);
      setUploadedImage(data.annotated_base64);
    } catch (err) {
      console.error("Scan upload error:", err);
    } finally {
      setLoadingScan(false);
    }
  };

  const handleRunSample = async () => {
    setLoadingScan(true);
    setMode('sample');
    try {
      const res = await fetch(`/api/detect/sample?confidence=${confidence}`);
      const data = await res.json();
      setAnnotatedResult(data);
      setUploadedImage(data.annotated_base64);
    } catch (err) {
      console.error("Sample scan error:", err);
    } finally {
      setLoadingScan(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            Live Conveyor Impurity Inspection
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Real-time YOLOv8 object detection with center coordinate extraction for pneumatic ejection.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setMode('stream'); setIsPlaying(!isPlaying); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              isPlaying && mode === 'stream'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isPlaying && mode === 'stream' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying && mode === 'stream' ? 'Pause Feed' : 'Live Camera'}
          </button>

          <button
            onClick={handleRunSample}
            disabled={loadingScan}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingScan ? 'animate-spin' : ''}`} />
            Sample Batch
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loadingScan}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Image
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Camera / Video Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
            {mode === 'stream' && isPlaying ? (
              <img
                src="/api/detect/stream"
                alt="Conveyor Feed"
                className="w-full h-full object-contain"
              />
            ) : uploadedImage ? (
              <img
                src={uploadedImage}
                alt="Uploaded scan"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-8 text-slate-500">
                <Camera className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">Video Feed Paused</p>
                <p className="text-xs text-slate-600 mt-1">Press "Live Camera" or upload an image to inspect</p>
              </div>
            )}

            {/* Actuator Trigger Banner */}
            <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              actuatorFlashed
                ? 'bg-rose-500 text-white border-rose-400 scale-105'
                : 'bg-slate-900/80 backdrop-blur text-slate-400 border-slate-700'
            }`}>
              <Zap className={`w-3.5 h-3.5 ${actuatorFlashed ? 'text-white' : 'text-amber-400'}`} />
              PNEUMATIC EJECTOR: {actuatorFlashed ? 'EJECTING' : 'READY'}
            </div>

            {/* Live Coordinate Overlay HUD */}
            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur px-3 py-2 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
              <div>Resolution: 640×640</div>
              <div>Confidence Cutoff: {(confidence * 100).toFixed(0)}%</div>
              <div className="text-amber-400">FPS: 32.4 | Latency: 22ms</div>
            </div>
          </div>

          {/* Quick Confidence Slider */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Sensitivity / Confidence Threshold:</span>
            </div>
            <div className="flex items-center gap-3 flex-1 max-w-xs">
              <input
                type="range"
                min="0.2"
                max="0.95"
                step="0.05"
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="font-mono text-xs text-amber-400 w-10 text-right">
                {(confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry & Extracted Object Coordinates Panel */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Coordinate Extraction</h3>
                <p className="text-[11px] text-slate-400">Object Centers for Robotic Arm Actuation</p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                (center_x, center_y)
              </span>
            </div>

            {/* Impurity & Object list */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[500px] pr-1">
              {(() => {
                const currentDetections = annotatedResult?.detections || telemetry?.detections || [];
                if (currentDetections.length === 0) {
                  return (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      No active objects in frame.
                    </div>
                  );
                }

                return currentDetections.map((det: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                      det.is_impurity
                        ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-sans mb-1">
                      <span className={`font-semibold ${det.is_impurity ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {det.class_name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {(det.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Center:</span>
                      <span className="text-amber-400 font-bold">
                        X: {det.center?.[0] ?? det.center_x ?? '-'}, Y: {det.center?.[1] ?? det.center_y ?? '-'}
                      </span>
                    </div>

                    {det.is_impurity && (
                      <div className="mt-1 text-[10px] text-rose-400 font-sans flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3 h-3" /> Ejection Target Armed
                      </div>
                    )}
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
