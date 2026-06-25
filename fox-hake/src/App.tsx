/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, Platform } from './types';
import SplashScreen from './components/SplashScreen';
import RequirementsModal from './components/RequirementsModal';
import LoginCard from './components/LoginCard';
import PlatformSelection from './components/PlatformSelection';
import GameSection from './components/GameSection';

export default function App() {
  const [step, setStep] = useState<AppState>('splash');
  const [userId, setUserId] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  // Global loading states
  const [loadingActive, setLoadingActive] = useState(false);
  const [loadingText, setLoadingText] = useState('جاري التحميل...');

  const triggerLoadingOverlay = (text: string, durationMs: number, onComplete: () => void) => {
    setLoadingText(text);
    setLoadingActive(true);
    
    setTimeout(() => {
      setLoadingActive(false);
      onComplete();
    }, durationMs);
  };

  const handleLoginSuccess = (enteredId: string) => {
    setUserId(enteredId);
    setStep('platform');
  };

  const handleSelectPlatform = (platform: Platform) => {
    setSelectedPlatform(platform);
    triggerLoadingOverlay('جاري الدخول لسكربت التفاحة السحابي...', 3000, () => {
      setStep('game');
    });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#020617] text-slate-100 overflow-y-auto">
      {/* Background cyber ambient glows */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <SplashScreen key="splash" onFinish={() => setStep('requirements')} />
        )}

        {step === 'requirements' && (
          <RequirementsModal
            key="requirements"
            onAccept={() => setStep('login')}
          />
        )}

        {step === 'login' && (
          <div key="login" className="relative z-10 flex w-full items-center justify-center">
            <LoginCard onLoginSuccess={handleLoginSuccess} />
          </div>
        )}

        {step === 'platform' && (
          <div key="platform" className="relative z-10 flex w-full items-center justify-center">
            <PlatformSelection
              onSelectPlatform={handleSelectPlatform}
              onBackToLogin={() => setStep('login')}
            />
          </div>
        )}

        {step === 'game' && (
          <div key="game" className="relative z-10 flex w-full items-center justify-center">
            <GameSection
              userId={userId}
              platform={selectedPlatform || 'wowbet'}
              onBack={() => setStep('platform')}
              showLoadingOverlay={triggerLoadingOverlay}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Global Hack Loading Screen Overlay */}
      <AnimatePresence>
        {loadingActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-6"
          >
            <div className="relative mb-6">
              {/* Outer cyber ring */}
              <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 border-r-cyan-400 animate-spin" />
              <div className="absolute inset-2 w-12 h-12 rounded-full border-4 border-indigo-500/20 border-b-indigo-400 border-l-indigo-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>

            {/* Glowing Text */}
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-center"
            >
              <h3 className="font-display font-medium text-lg text-cyan-400 tracking-wide mb-1">
                APPEL SYSTEM
              </h3>
              <p className="text-sm text-slate-300 font-medium">
                {loadingText}
              </p>
            </motion.div>

            {/* Simple decorative command logs */}
            <div className="absolute bottom-6 font-mono text-[9px] text-slate-600 max-w-sm text-center line-clamp-1 select-none">
              DEC_ERR_KEYS: OK // IP_GATEWAY: BYPASSED // SERVER_COM_STND: STABLE
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
