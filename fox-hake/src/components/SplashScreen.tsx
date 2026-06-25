/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import logoUrl from '../assets/images/appel_logo_1782323915162.jpg';

interface SplashScreenProps {
  onFinish: () => void;
  key?: string;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000; // 3 seconds for smooth load
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    const finishTimeout = setTimeout(() => {
      onFinish();
    }, 3400); // Small delay to let the user see 100% loaded

    return () => {
      clearInterval(timer);
      clearTimeout(finishTimeout);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-radial from-slate-900 via-slate-950 to-black p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        {/* Glow backdrop behind the logo */}
        <div className="absolute w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Logo Container with Cyber Neon Pulse */}
        <div className="relative mb-6 transform hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 blur-md opacity-70 animate-pulse" />
          <img
            id="splashLogo"
            src={logoUrl}
            alt="appel Logo"
            className="relative w-44 h-44 md:w-52 md:h-52 rounded-full border-4 border-cyan-400 object-cover shadow-[0_0_50px_rgba(6,182,212,0.5)]"
            referrerPolicy="no-referrer"
          />
          {/* Circular scanner effect */}
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-indigo-400/30 scale-110 animate-ping" />
        </div>

        {/* Title */}
        <h1 
          id="splashTitle"
          className="font-display font-black text-4xl md:text-5xl text-center mb-2 tracking-widest text-shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #22d3ee 50%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.2em'
          }}
        >
          appel
        </h1>

        <p className="text-cyan-400/70 text-sm md:text-base mb-8 tracking-widest font-mono uppercase">
          Predictive Gaming Engine
        </p>

        {/* Loading Bar Section */}
        <div className="w-64 md:w-80 bg-slate-950/80 rounded-full h-2.5 p-0.5 border border-cyan-500/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <motion.div
            className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        {/* Loading details */}
        <div className="mt-3 text-xs font-mono text-slate-500 text-center tracking-wide min-w-[120px]">
          {progress < 40 && 'Initializing core system...'}
          {progress >= 40 && progress < 80 && 'Establishing bypass keys...'}
          {progress >= 80 && progress < 100 && 'Connecting safe gateways...'}
          {progress === 100 && 'Ready'}
        </div>
      </motion.div>
    </div>
  );
}
