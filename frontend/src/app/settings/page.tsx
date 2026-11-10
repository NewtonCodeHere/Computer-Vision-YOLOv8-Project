'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Cpu, 
  Sliders, 
  Camera, 
  Check, 
  Zap, 
  Save 
} from 'lucide-react';

export default function SettingsPage() {
  const [confidence, setConfidence] = useState(0.50);
  const [iou, setIou] = useState(0.45);
  const [cameraSource, setCameraSource] = useState('synthetic');
  const [comPort, setComPort] = useState('COM3');
  const [baudRate, setBaudRate] = useState(115200);
  const [mockHardware, setMockHardware] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [triggerStatus, setTriggerStatus] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.confidence_threshold) setConfidence(data.confidence_threshold);
          if (data.iou_threshold) setIou(data.iou_threshold);
          if (data.hardware) {
            setMockHardware(data.hardware.mock_mode);
            setComPort(data.hardware.port);
            setBaudRate(data.hardware.baudrate);
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confidence_threshold: confidence,
          iou_threshold: iou,
          mock_hardware: mockHardware,
          hardware_port: comPort,
        }),
      });
      if (res.ok) {
        setStatusMessage('Settings saved and synchronized with detection engine!');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleTestActuation = async () => {
    setTriggerStatus('Actuating...');
    try {
      const res = await fetch('/api/hardware/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          center_x: 320.0,
          center_y: 240.0,
          class_name: 'Stone',
        }),
      });
      const data = await res.json();
      setTriggerStatus(`Actuated: ${data.command || 'Pneumatic pulse triggered'}`);
      setTimeout(() => setTriggerStatus(''), 3000);
    } catch (err) {
      setTriggerStatus('Failed');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-amber-400" />
          System &amp; Hardware Configuration
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Tune YOLOv8 detection sensitivity, input camera parameters, and Arduino/ESP32 sorting actuator settings.
        </p>
      </div>

      {statusMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" /> {statusMessage}
        </div>
      )}

      {/* YOLOv8 Model Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sliders className="w-4 h-4 text-amber-400" />
          YOLOv8 Detection Thresholds
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between mb-1.5 font-medium">
              <span className="text-slate-300">Confidence Threshold</span>
              <span className="font-mono text-amber-400">{(confidence * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.95"
              step="0.05"
              value={confidence}
              onChange={(e) => setConfidence(parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Minimum confidence score required to classify a seed or foreign object.
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-1.5 font-medium">
              <span className="text-slate-300">NMS IoU (Intersection-over-Union)</span>
              <span className="font-mono text-amber-400">{(iou * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.80"
              step="0.05"
              value={iou}
              onChange={(e) => setIou(parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Suppresses overlapping duplicate bounding boxes for closely packed grains.
            </p>
          </div>
        </div>
      </div>

      {/* Optical Input Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Camera className="w-4 h-4 text-amber-400" />
          Camera &amp; Vision Source
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Active Optical Feed</label>
            <select
              value={cameraSource}
              onChange={(e) => setCameraSource(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500 font-sans"
            >
              <option value="synthetic">Synthetic Industrial Conveyor Belt (Default Simulator)</option>
              <option value="webcam_0">USB Industrial Camera 0 (Conveyor Overhead)</option>
              <option value="webcam_1">USB Auxiliary Camera 1</option>
              <option value="rtsp">RTSP Industrial IP Camera Stream</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hardware Interface Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="w-4 h-4 text-amber-400" />
          Arduino Nano / ESP32 Ejection Controller
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Serial COM Port</label>
            <input
              type="text"
              value={comPort}
              onChange={(e) => setComPort(e.target.value)}
              placeholder="e.g. COM3 or /dev/ttyUSB0"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Baud Rate</label>
            <select
              value={baudRate}
              onChange={(e) => setBaudRate(parseInt(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
            >
              <option value={115200}>115200 baud (Recommended)</option>
              <option value={9600}>9600 baud</option>
              <option value={57600}>57600 baud</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <div className="font-semibold text-slate-200">Hardware Emulation Mode</div>
            <div className="text-[11px] text-slate-500">
              Simulates serial responses when physical Arduino / ESP32 is unplugged
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMockHardware(!mockHardware)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              mockHardware ? 'bg-amber-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                mockHardware ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Manual Test Trigger */}
        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestActuation}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Send Test Actuation Pulse
          </button>
          {triggerStatus && (
            <span className="text-xs font-mono text-amber-400 font-semibold">{triggerStatus}</span>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/10"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
}
