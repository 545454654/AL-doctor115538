/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ArrowLeft, Gamepad2 } from 'lucide-react';
import { Platform, PlatformConfig } from '../types';

interface PlatformSelectionProps {
  onSelectPlatform: (platform: Platform) => void;
  onBackToLogin: () => void;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'wowbet',
    name: 'wowBet',
    logo: '', // Rendered as custom component fallback
    promo: 'E1111',
  },
];

export default function PlatformSelection({ onSelectPlatform, onBackToLogin }: PlatformSelectionProps) {
  const [selectedId, setSelectedId] = useState<Platform | null>('wowbet');

  const handleEntry = () => {
    if (selectedId) {
      onSelectPlatform(selectedId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden"
    >
      {/* Absolute ambient lights */}
      <div className="absolute w-72 h-72 rounded-full bg-cyan-500/5 blur-3xl -top-10 -right-10" />

      {/* Title Header */}
      <div className="text-center mb-8 relative">
        <h2 className="font-display font-extrabold text-2xl md:text-3xl bg-gradient-to-r from-white via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
          اختر منصتك المفضلة
        </h2>
        <p className="text-slate-400 text-xs md:text-sm mt-1.5 font-medium">
          يرجى اختيار المنصة التي ترغب في تطبيق سكريبت الصناديق عليها
        </p>
      </div>

      {/* Platform Cards Grid */}
      <div className="flex flex-col gap-4 mb-6 relative">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedId === platform.id;
          return (
            <motion.div
              layoutId={`platform-card-${platform.id}`}
              onClick={() => setSelectedId(platform.id)}
              key={platform.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-500/10 via-slate-900/5 to-slate-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
              }`}
            >
              {/* Platform Logo */}
              <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-slate-950 border border-emerald-500/30 overflow-hidden flex flex-col items-center justify-center p-1 group-hover:scale-105 transition-transform duration-300 relative group-hover:border-emerald-400">
                <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
                <span className="font-display font-black text-[10px] text-emerald-400 tracking-wider relative z-10 leading-tight">WOW</span>
                <span className="font-display font-black text-[9px] text-slate-400 tracking-widest -mt-0.5 font-mono relative z-10">BET</span>
              </div>

              {/* Platform Details */}
              <div className="flex-grow">
                <h4 className="font-display font-black text-lg md:text-xl text-slate-100 group-hover:text-emerald-400 transition-colors">
                  {platform.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] md:text-xs text-slate-400">
                  <span>البروموكود البريميوم:</span>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {platform.promo}
                  </span>
                </div>
              </div>

              {/* Selection Check Circle */}
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-emerald-400 bg-emerald-500 text-slate-950 font-black'
                    : 'border-slate-700'
                }`}
              >
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xs font-black"
                  >
                    ✓
                  </motion.span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 relative">
        <button
          id="enterAppleScriptBtn"
          disabled={!selectedId}
          onClick={handleEntry}
          className="w-full p-4 bg-gradient-to-r from-cyan-500 via-cyan-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:pointer-events-none text-sm md:text-base font-display tracking-wide"
        >
          <Gamepad2 className="w-5 h-5 text-slate-100" />
          الدخول لسكربت التفاحة
        </button>

        <button
          id="backToLoginBtn"
          onClick={onBackToLogin}
          className="w-full py-3 bg-slate-950/80 hover:bg-slate-950 text-slate-300 font-bold text-xs md:text-sm border border-slate-800 rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة لتسجيل الدخول
        </button>
      </div>
    </motion.div>
  );
}
