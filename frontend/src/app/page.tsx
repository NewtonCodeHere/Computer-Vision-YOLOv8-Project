'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Scan, 
  AlertTriangle, 
  CheckCircle, 
  Gauge, 
  ArrowUpRight, 
  Play, 
  Download, 
  Activity, 
  Layers 
} from 'lucide-react';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resAnalytics, resScans] = await Promise.all([
          fetch('/api/analytics').then(r => r.ok ? r.json() : null),
          fetch('/api/scans?limit=5').then(r => r.ok ? r.json() : null),
        ]);
        if (resAnalytics) setAnalytics(resAnalytics);
        if (resScans?.scans) setRecentScans(resScans.scans);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const kpis = analytics?.kpis || {
    total_scans: 48,
    total_items_inspected: 1240,
    total_clean_grains: 1182,
    total_impurities_detected: 58,
    overall_purity_rate: 95.3,
    system_accuracy: 96.4,
    average_fps: 32.5,
  };

  const distribution = analytics?.impurity_distribution || [
    { class_name: 'Stone', count: 22 },
    { class_name: 'Twig', count: 14 },
    { class_name: 'Jute', count: 9 },
    { class_name: 'Plastic', count: 6 },
    { class_name: 'Broken Bengal Gram', count: 7 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Active Conveyor Pipeline
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Industrial Impurity Inspection Station</h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time optical grain grading and pneumatic foreign object rejection powered by YOLOv8.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/live"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-amber-500/10"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            Launch Live Feed
          </Link>
          <a
            href="/api/reports/pdf"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-400" />
            Export PDF Report
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>Overall Purity Rate</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{kpis.overall_purity_rate}%</div>
          <div className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">
            <span>Standard compliant (&gt;95%)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>Total Foreign Objects</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-bold text-rose-400 font-mono">{kpis.total_impurities_detected}</div>
          <div className="text-xs text-slate-400 mt-2">
            Pneumatically sorted &amp; ejected
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>Grains Inspected</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{kpis.total_items_inspected.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-2">Across {kpis.total_scans} batches</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>Model mAP@0.5</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-cyan-400 font-mono">{kpis.system_accuracy}%</div>
          <div className="text-xs text-slate-400 mt-2">FPS: {kpis.average_fps} (Real-Time)</div>
        </div>
      </div>

      {/* Impurity Distribution & Live Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution Bar List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Detected Impurity Breakdown</h3>
              <p className="text-xs text-slate-400 mt-0.5">Distribution of foreign bodies detected by YOLOv8</p>
            </div>
            <Link href="/analytics" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              View Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {distribution.map((item: any) => {
              const maxCount = Math.max(...distribution.map((d: any) => d.count), 1);
              const percentage = Math.round((item.count / maxCount) * 100);
              return (
                <div key={item.class_name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">{item.class_name}</span>
                    <span className="font-mono text-slate-400">{item.count} items</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live System Specs Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
              <Activity className="w-4 h-4 text-emerald-400" />
              Inspection Configuration
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Architecture</span>
                <span className="font-mono font-medium text-slate-200">Ultralytics YOLOv8</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Input Resolution</span>
                <span className="font-mono font-medium text-slate-200">640 × 640 px</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Target Impurity Classes</span>
                <span className="font-mono font-medium text-slate-200">16 Custom Classes</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Coordinate Extraction</span>
                <span className="font-mono font-medium text-emerald-400">Active (X, Y)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Ejection Interface</span>
                <span className="font-mono font-medium text-amber-400">Arduino / ESP32</span>
              </div>
            </div>
          </div>

          <Link
            href="/live"
            className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-center text-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            Open Live Camera Monitor
          </Link>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent Inspection Batches</h3>
            <p className="text-xs text-slate-400 mt-0.5">Automated conveyor scans and purity verification</p>
          </div>
          <Link href="/reports" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
            Full Inspection Logs <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="py-3 px-4">Batch ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Clean Seeds</th>
                <th className="py-3 px-4">Impurities</th>
                <th className="py-3 px-4">Purity Rate</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {recentScans.length > 0 ? (
                recentScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-300">#{scan.id}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {scan.timestamp ? new Date(scan.timestamp).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">{scan.clean_count}</td>
                    <td className="py-3 px-4 text-rose-400 font-semibold">{scan.impurity_count}</td>
                    <td className="py-3 px-4 text-slate-200">{scan.purity_rate}%</td>
                    <td className="py-3 px-4">
                      {scan.impurity_count === 0 ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                          CLEAN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                          EJECTED ({scan.impurity_count})
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500 font-sans">
                    No inspection batches recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
