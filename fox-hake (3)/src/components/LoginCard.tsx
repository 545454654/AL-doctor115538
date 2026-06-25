/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogIn, Trash2, KeyRound, UserRound, ShieldAlert } from 'lucide-react';
import logoUrl from '../assets/images/appel_logo_1782323915162.jpg';

interface LoginCardProps {
  onLoginSuccess: (userId: string) => void;
}

export default function LoginCard({ onLoginSuccess }: LoginCardProps) {
  const [userId, setUserId] = useState('');
  const [promoCode, setPromoCode] = useState('');
  
  const [userIdError, setUserIdError] = useState('');
  const [promoError, setPromoError] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Load saved data on startup
  useEffect(() => {
    try {
      const savedUserId = localStorage.getItem('fox_hake_userId');
      const savedPromo = localStorage.getItem('fox_hake_promoCode');
      if (savedUserId) {
        setUserId(savedUserId);
      }
      if (savedPromo) {
        setPromoCode(savedPromo);
      }
    } catch (e) {
      console.warn('LocalStorage is not accessible:', e);
    }
  }, []);

  const handleLogin = () => {
    let hasError = false;

    // Validate ID length >= 9
    if (!userId || userId.length < 9) {
      setUserIdError('معرف المستخدم يجب أن يكون 9 أرقام على الأقل');
      hasError = true;
    } else {
      setUserIdError('');
    }

    // Validate Promo Code must match E1111
    if (promoCode.trim().toUpperCase() !== 'E1111') {
      setPromoError('الرجاء إدخال البروموكود البريميوم الصحيح (E1111)');
      hasError = true;
    } else {
      setPromoError('');
    }

    if (!hasError) {
      try {
        localStorage.setItem('fox_hake_userId', userId);
        localStorage.setItem('fox_hake_promoCode', promoCode.toUpperCase());
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
      onLoginSuccess(userId);
    }
  };

  const handleClearData = () => {
    try {
      localStorage.removeItem('fox_hake_userId');
      localStorage.removeItem('fox_hake_promoCode');
    } catch (e) {
      console.warn('LocalStorage clear failed:', e);
    }
    setUserId('');
    setPromoCode('');
    setUserIdError('');
    setPromoError('');
    setShowClearConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.5)] md:grid md:grid-cols-12 md:gap-10 items-center relative overflow-hidden"
    >
      {/* Abstract futuristic grid backing */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Left Column (Logo design) - spans 5 columns */}
      <div className="md:col-span-5 flex flex-col items-center text-center justify-center mb-8 md:mb-0 relative py-4 border-b md:border-b-0 md:border-l border-slate-800/80 md:pl-10">
        <div className="absolute w-52 h-52 rounded-full bg-cyan-500/5 blur-3xl" />
        
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 blur-md opacity-60 scale-105" />
          <img
            src={logoUrl}
            alt="appel Logo"
            className="relative w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-cyan-400 object-cover shadow-[0_20px_45px_rgba(6,182,212,0.4)]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <h1 className="mt-5 font-display font-black text-2xl md:text-3xl tracking-widest bg-gradient-to-r from-white via-cyan-400 to-cyan-500 bg-clip-text text-transparent">
          appel
        </h1>
        <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">
          صفحة تسجيل الدخول في السكريبت
        </p>
      </div>

      {/* Right Column (Forms) - spans 7 columns */}
      <div className="md:col-span-7 flex flex-col">
        {/* Title & subtitle displayed on mobile or above */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] md:text-xs text-cyan-400 font-mono tracking-wider uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Server Status: Connected
          </span>
          <h2 className="text-2xl font-black text-white tracking-wide">ابدأ استخدام السكريبت</h2>
          <p className="text-xs text-slate-400 mt-1">
            قم بالولوج لحسابك لتفعيل سكربت توقع الصناديق في لعبة Apple of Fortune
          </p>
        </div>

        {/* Input: ID */}
        <div className="form-group mb-4">
          <label className="block text-slate-300 font-bold text-xs md:text-sm mb-2 select-none tracking-wide flex items-center gap-2">
            <UserRound className="w-4 h-4 text-cyan-400" />
            معرف المستخدم (USER ID)
          </label>
          <div className="relative">
            <input
              id="userIdInput"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={userId}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setUserId(val);
                if (val && val.length >= 9) setUserIdError('');
              }}
              className="w-full pl-4 pr-12 py-3.5 bg-slate-950 border-2 border-slate-800 focus:border-cyan-500 hover:border-slate-700 rounded-2xl text-slate-100 font-mono font-medium outline-none transition-all placeholder:text-slate-600 shadow-inner"
              placeholder="مثال: 734591028"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 tracking-wider">
              {userId.length} Digits
            </span>
          </div>
          <div className="text-slate-500 text-[10px] md:text-xs mt-1.5">
            تجد المعرف (ID) في صفحة تعديل الحساب أو الملف الشخصي بالمنصة
          </div>
          {userIdError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5 font-medium"
            >
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              {userIdError}
            </motion.div>
          )}
        </div>

        {/* Input: Promo / Password */}
        <div className="form-group mb-6">
          <label className="block text-slate-300 font-bold text-xs md:text-sm mb-2 select-none tracking-wide flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            كلمة مرور السكربت البريميوم (البروموكود)
          </label>
          <div className="relative">
            <input
              id="promoCodeInput"
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                if (e.target.value.trim().toUpperCase() === 'E1111') setPromoError('');
              }}
              className="w-full px-4 py-3.5 bg-slate-950 border-2 border-slate-800 focus:border-cyan-500 hover:border-slate-700 rounded-2xl text-slate-100 font-mono font-semibold tracking-widest outline-none transition-all placeholder:text-slate-600 shadow-inner"
              placeholder="أدخل البروموكود لتفعيل السكربت"
            />
          </div>
          <div className="text-slate-500 text-[10px] md:text-xs mt-1.5">
            كلمة المرور البريميوم المعتمدة حالياً للسكريبت هي: <span className="font-mono text-cyan-400 font-bold tracking-wider">E1111</span>
          </div>
          {promoError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5 font-medium"
            >
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              {promoError}
            </motion.div>
          )}
        </div>

        {/* Actions Row */}
        <div className="flex flex-col gap-3">
          <button
            id="loginSubmitBtn"
            onClick={handleLogin}
            className="w-full p-4 bg-gradient-to-r from-cyan-500 via-cyan-600 to-indigo-600 text-white rounded-2xl font-bold text-sm md:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <LogIn className="w-5 h-5" />
            تسجيل الدخول للسكريبت
          </button>
          
          {!showClearConfirm ? (
            <button
              id="clearDataBtn"
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-3.5 bg-slate-950 hover:bg-slate-950/70 text-slate-400 hover:text-red-400 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 border border-slate-800 cursor-pointer transition-all"
            >
              <Trash2 className="w-4 h-4" />
              مسح البيانات المحفوظة
            </button>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col gap-2 p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-center"
            >
              <span className="text-xs text-red-400 font-semibold">هل أنت متأكد من مسح جميع البيانات؟</span>
              <div className="flex items-center gap-2.5 justify-center mt-1">
                <button
                  id="confirmClearBtn"
                  onClick={handleClearData}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  تأكيد الحذف
                </button>
                <button
                  id="cancelClearBtn"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  تراجع
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
