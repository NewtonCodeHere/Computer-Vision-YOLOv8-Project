'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Wrench, Cpu, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Operator' | 'Inspector'>('Inspector');

  const roles = [
    {
      id: 'Inspector',
      title: 'Quality Inspector',
      desc: 'Verify seed purity standards, inspect foreign bodies, and export regulatory PDF reports.',
      icon: ShieldCheck,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    },
    {
      id: 'Operator',
      title: 'Plant Operator',
      desc: 'Operate active conveyor belt, monitor optical camera feed, and view real-time rejections.',
      icon: User,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    },
    {
      id: 'Admin',
      title: 'System Administrator',
      desc: 'Full access to YOLOv8 model weights, detection thresholds, and Arduino hardware ports.',
      icon: Wrench,
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Bengal Gram Inspection Portal</h2>
          <p className="text-xs text-slate-400">Select operational role to authenticate</p>
        </div>

        <div className="space-y-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id as any)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? `${role.color} ring-1 ring-amber-400/40`
                    : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5 font-bold text-sm text-slate-100">
                    <Icon className="w-4 h-4 text-amber-400" />
                    {role.title}
                  </div>
                  {isSelected && <CheckCircle className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{role.desc}</p>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg shadow-amber-500/10"
        >
          Authenticate as {selectedRole}
        </button>
      </div>
    </div>
  );
}
