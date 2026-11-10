'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Bell, Activity, ShieldCheck } from 'lucide-react';

export default function Header({ title = 'Industrial Inspection Dashboard' }: { title?: string }) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const update = () => setTime(new Date().toUTCString().slice(17, 25) + ' UTC');
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-slate-100">{title}</h1>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
          Stage: Conveyor 1
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs">
        {/* Hardware Pneumatic Sorter status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ejector / Sorter:</span>
          <span className="text-emerald-400 font-semibold font-mono">ARMED</span>
        </div>

        {/* UTC Clock */}
        <div className="px-3 py-1.5 rounded-lg bg-slate-800/40 text-slate-400 font-mono">
          {time || '--:--:-- UTC'}
        </div>
      </div>
    </header>
  );
}
