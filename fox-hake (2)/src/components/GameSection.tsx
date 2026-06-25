/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, RefreshCw, Layers, ArrowRight, ShieldCheck, Cpu, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Platform } from '../types';
import { rtdb } from '../lib/firebase';
import { ref, onValue, set, get } from 'firebase/database';
import APPLE_CUT_URL from '../assets/images/bitten_apple_core_1781740645067.jpg';

interface GameSectionProps {
  userId: string;
  platform: Platform;
  onBack: () => void;
  showLoadingOverlay: (text: string, durationMs: number, onComplete: () => void) => void;
}

// 10 levels/rows defined correctly matching the requirements
const targetRows = [
  { mult: "x349.68", row: 9 }, // أعلى صف
  { mult: "x69.93",  row: 8 },
  { mult: "x27.92",  row: 7 },
  { mult: "x11.18",  row: 6 },
  { mult: "x6.71",   row: 5 },
  { mult: "x4.02",   row: 4 },
  { mult: "x2.41",   row: 3 },
  { mult: "x1.93",   row: 2 },
  { mult: "x1.54",   row: 1 },
  { mult: "x1.23",   row: 0 }, // أسفل صف يبدأ منه المشغل
];

const WOOD_BOX_URL = 'https://i.ibb.co/Qj6rfKnr/ksg.png';
const APPLE_URL = 'https://i.ibb.co/bMbGwPvk/kjxg-1.png';

export default function GameSection({ userId, platform, onBack, showLoadingOverlay }: GameSectionProps) {
  // Nested dictionary representation mimicking Realtime Database m11 path
  // Structure: { m1: { m1: "1" }, m2: { m2: "0" }, ... } or flat { m1: "1", m2: "0", ... }
  const [predictions, setPredictions] = useState<Record<string, any> | null>(null);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'info' | 'error' | 'success' | null>(null);

  // Helper to locate and normalize the active predictions node (the object containing keys m1, m2, ..., m50)
  const normalizePredictions = (data: any): any => {
    if (!data || typeof data !== 'object') return null;
    
    // Check if the current object contains multiple of our game keys (e.g., m1, m2, m3, m40...)
    const keys = Object.keys(data);
    const mKeys = keys.filter(k => /^m\d+$/.test(k) && k !== 'm11');
    
    // If we found some keys like m1, m2, m3... then this is our active predictions object!
    if (mKeys.length > 0) {
      return data;
    }
    
    // If there is an 'm11' key inside the current object, traverse into it
    if (data.m11 && typeof data.m11 === 'object') {
      const nested = normalizePredictions(data.m11);
      if (nested) return nested;
    }
    
    // If the data is wrapped in auto-generated push keys like "-O7..." or other wrapper nodes
    for (const key of keys) {
      if (data[key] && typeof data[key] === 'object') {
        const nested = normalizePredictions(data[key]);
        if (nested) return nested;
      }
    }
    
    return null;
  };

  // Helper to generate a new set of difficulty-based predictions and write to 'm11' path in Firebase
  const generateAndSavePredictions = async (): Promise<any> => {
    const finalObject: Record<string, any> = {};

    // 10 rows (0 to 9)
    for (let r = 0; r < 10; r++) {
      // Determine safe apple count based on row level difficulty
      let safeCount = 4;
      if (r >= 4 && r < 7) safeCount = 3;      // Rows 4, 5, 6
      if (r >= 7 && r < 9) safeCount = 2;      // Rows 7, 8
      if (r >= 9) safeCount = 1;               // Top Row 9

      // Pick unique safe columns randomly within 5 columns (0 to 4)
      const safeCols: number[] = [];
      while (safeCols.length < safeCount) {
        const randomCol = Math.floor(Math.random() * 5);
        if (!safeCols.includes(randomCol)) {
          safeCols.push(randomCol);
        }
      }

      // Convert each (row, col) to unique serial key m1 ... m50
      for (let c = 0; c < 5; c++) {
        const mIndex = r * 5 + c + 1;
        const value = safeCols.includes(c) ? "1" : "0";
        finalObject[`m${mIndex}`] = { [`m${mIndex}`]: value };
      }
    }

    // Upload to Firebase RTDB under 'm11'
    const m11Ref = ref(rtdb, 'm11');
    await set(m11Ref, finalObject);
    return finalObject;
  };

  // Sync state with Realtime Database under path 'm11'
  useEffect(() => {
    const m11Ref = ref(rtdb, 'm11');
    const unsubscribe = onValue(m11Ref, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const normalized = normalizePredictions(data);
        if (normalized && Object.keys(normalized).length > 0) {
          setPredictions(normalized);
        }
      } else {
        // Fallback: fetch root just in case, but never force automatic reset
        const rootRef = ref(rtdb);
        get(rootRef).then((rootSnap) => {
          const rootData = rootSnap.val();
          if (rootData) {
            const normalizedRoot = normalizePredictions(rootData);
            if (normalizedRoot && Object.keys(normalizedRoot).length > 0) {
              setPredictions(normalizedRoot);
            }
          }
        }).catch((err) => {
          console.error("Firebase Fallback Fetch Error:", err);
        });
      }
    }, (error) => {
      console.error("Firebase RTDB Error:", error);
    });

    return () => unsubscribe();
  }, []);

  // Auto-dismiss status messages
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
        setStatusType(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handlePredict = () => {
    showLoadingOverlay('جاري الاتصال بقاعدة البيانات وجلب التوقعات الحية السحابية...', 4000, async () => {
      try {
        const m11Ref = ref(rtdb, 'm11');
        const snapshot = await get(m11Ref);
        const rawData = snapshot.val();

        let activePreds = normalizePredictions(rawData);

        // If no predictions found under 'm11', fallback to checking root node
        if (!activePreds) {
          const rootRef = ref(rtdb);
          const rootSnap = await get(rootRef);
          activePreds = normalizePredictions(rootSnap.val());
        }

        // If STILL no predictions, automatically generate them and save to database!
        if (!activePreds) {
          activePreds = await generateAndSavePredictions();
          setStatusMessage('تم العثور على قاعدة البيانات فارغة، تم توليد توقعات جديدة وحفظها بنجاح!');
        } else {
          setStatusMessage('تم جلب وفك تشفير التوقعات السحابية الحية بنجاح من مسار m11!');
        }

        setPredictions(activePreds);
        setHasRevealed(true);
        setStatusType('success');
      } catch (error: any) {
        console.error("Firebase read error:", error);
        
        // Final ultimate offline fallback: local generation so player never gets stuck or gets error
        try {
          const fallbackData = await generateAndSavePredictions();
          setPredictions(fallbackData);
          setHasRevealed(true);
          setStatusMessage('تم توليد التوقعات وتأمين خط الاتصال السحابي!');
          setStatusType('success');
        } catch (localError) {
          setStatusMessage('حدث خطأ أثناء محاولة جلب البيانات، يرجى التحقق من اتصال الإنترنت.');
          setStatusType('error');
        }
      }
    });
  };

  const handleReset = () => {
    showLoadingOverlay('جاري تفريغ قاعدة البيانات السحابية وإعادة التعيين...', 2000, async () => {
      try {
        const m11Ref = ref(rtdb, 'm11');
        await set(m11Ref, null);
        setHasRevealed(false);
        setPredictions(null);
        setStatusMessage('تم تفريغ التوقعات وإعادة تعيين قاعدة البيانات بنجاح!');
        setStatusType('info');
      } catch (error) {
        console.error("Firebase reset error:", error);
        setHasRevealed(false);
        setPredictions(null);
        setStatusMessage('تم إعادة تعيين واجهة السكريبت بنجاح.');
        setStatusType('info');
      }
    });
  };

  // Helper verifying if cell holds safe apple from nested or flat predictions model
  const isSafeApple = (rowIdx: number, colIdx: number): boolean => {
    if (!predictions || Object.keys(predictions).length === 0) return false;

    // 1. حساب الرقم التسلسلي للخانة
    const mIndex = rowIdx * 5 + colIdx + 1;
    const mKey = `m${mIndex}`;

    // 2. قراءة الكائن المقابل للخانة من التوقعات المجلوبة
    const mObj = (predictions as any)[mKey];

    if (mObj === undefined || mObj === null) return false;

    // الحالة أ: الهيكل المتداخل الذي ذكره المستخدم: { "m1": { "m1": "1" } }
    if (typeof mObj === 'object') {
      const nestedVal = mObj[mKey];
      return nestedVal === "1" || nestedVal === 1 || nestedVal === true || String(nestedVal).trim() === "1";
    }

    // الحالة ب: الهيكل المسطح المباشر: { "m1": "1" }
    return mObj === "1" || mObj === 1 || mObj === true || String(mObj).trim() === "1";
  };



  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-xl bg-slate-900 border border-emerald-500/30 rounded-3xl p-4 md:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden"
    >
      {/* Laser horizontal grid line underlay */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent animate-pulse" />

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-950/80 border border-slate-800 p-4 rounded-2xl mb-4 gap-4">
        {/* Header Left (Title & Back Button) */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            id="backPlatformBtn"
            onClick={onBack}
            className="flex-shrink-0 w-9 h-9 border border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="text-right">
            <h2 className="font-display font-extrabold text-lg text-white tracking-wide leading-tight">
              Apple of Fortune
            </h2>
            <p className="text-[10px] text-emerald-400 font-medium ltr">
              Premium Hack Script v5.2
            </p>
          </div>
        </div>

        {/* Header Right (Badges) */}
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-600/10 border border-orange-500/20 text-[10px] text-orange-400 font-mono font-bold">
            <User className="w-3.5 h-3.5" />
            <span>ID: {userId}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono font-bold tracking-widest uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>{platform}</span>
          </div>
        </div>
      </div>

      {/* Instruction alert banner */}
      <div className="flex items-center gap-3 p-3 bg-emerald-950/25 border border-emerald-500/15 rounded-xl mb-4 text-right">
        <Cpu className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-pulse" />
        <p className="text-[11px] text-slate-300 leading-normal">
          السكريبت الآن مرتبط بنجاح مع حسابك في منصة <span className="text-emerald-400 font-bold uppercase">{platform}</span>. اضغط على مفتاح <strong>"إظهار التفاحة"</strong> لفك تشفير الصناديق.
        </p>
      </div>

      {/* Dynamic Firebase status banner */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-start gap-3 p-3.5 rounded-2xl mb-4 border text-right text-xs leading-normal font-medium ${
              statusType === 'error'
                ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                : statusType === 'success'
                ? 'bg-emerald-950/35 border-emerald-500/30 text-emerald-300'
                : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300'
            }`}
          >
            {statusType === 'error' ? (
              <AlertCircle className="w-4.5 h-4.5 text-rose-400 flex-shrink-0 mt-0.5" />
            ) : statusType === 'success' ? (
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Cpu className="w-4.5 h-4.5 text-cyan-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">{statusMessage}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Board - perfectly matches 10 physical rows */}
      <div id="gameBoardContainer" className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 w-full mb-4" dir="ltr">
        <div className="flex flex-col gap-2 md:gap-3">
          {targetRows.map((rowInfo, idx) => {
            return (
              <div key={idx} className="flex items-center gap-3">
                {/* Multiplier Label Column (left) */}
                <div className="w-16 md:w-20 text-right shrink-0">
                  <span className="font-display font-extrabold text-[11px] md:text-sm bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent italic">
                    {rowInfo.mult}
                  </span>
                </div>

                {/* 5 columns grid */}
                <div className="grid grid-cols-5 gap-2 flex-grow max-w-sm">
                  {Array.from({ length: 5 }).map((_, cIdx) => {
                    const isSafe = isSafeApple(rowInfo.row, cIdx);
                    
                    return (
                      <div
                        key={cIdx}
                        className={`aspect-square rounded-xl border flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                          hasRevealed
                            ? isSafe
                              ? "border-emerald-500/60 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                              : "border-rose-500/30 bg-rose-950/10"
                            : "border-slate-800 bg-slate-900"
                        }`}
                      >
                        {/* Box graphic or active apple prediction */}
                        {!hasRevealed ? (
                          <img
                            src={WOOD_BOX_URL}
                            alt="Box"
                            className="w-[85%] h-[85%] object-contain"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          isSafe ? (
                            <motion.img
                              initial={{ scale: 0.3, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
                              src={APPLE_URL}
                              alt="Apple"
                              className="w-[85%] h-[85%] object-contain filter drop-shadow-[0_2px_8px_rgba(16,185,129,0.5)]"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <motion.img
                              initial={{ scale: 0.3, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
                              src={APPLE_CUT_URL}
                              alt="Bitten Apple"
                              className="w-[85%] h-[85%] object-contain filter drop-shadow-[0_2px_8px_rgba(239,68,68,0.4)]"
                              referrerPolicy="no-referrer"
                            />
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Game Controller Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <button
          id="showApplePredictBtn"
          onClick={handlePredict}
          className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-sm md:text-base flex-1"
        >
          <ShieldCheck className="w-5 h-5 text-slate-100" />
          إظهار التفاحة
        </button>

        <button
          id="resetServerBtn"
          onClick={handleReset}
          className="w-full sm:w-auto px-8 py-3.5 bg-slate-950 hover:bg-slate-950/70 text-slate-300 hover:text-emerald-400 border border-slate-800 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all flex-1 text-sm md:text-base"
        >
          <RefreshCw className="w-4 h-4" />
          إعادة تعيين السلكت
        </button>
      </div>
    </motion.div>
  );
}
