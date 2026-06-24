/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, BookOpen, Gift, Check } from 'lucide-react';

interface RequirementsModalProps {
  onAccept: () => void;
  key?: string;
}

export default function RequirementsModal({ onAccept }: RequirementsModalProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      {/* Background ambient lighting */}
      <div className="absolute w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl -top-10 left-1/4" />
      <div className="absolute w-96 h-96 rounded-full bg-purple-500/5 blur-3xl -bottom-10 right-1/4" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Subtle decorative grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px]" />

        {/* Modal Header */}
        <div className="relative text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5 shadow-lg shadow-cyan-500/20 mb-3">
            <div className="flex items-center justify-center w-full h-full bg-slate-950 rounded-[14px]">
              <ShieldAlert className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h2 className="font-display font-extrabold text-2xl bg-gradient-to-r from-white via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
            شروط مهمة جداً
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            يرجى قراءة الشروط بعناية قبل المتابعة
          </p>
        </div>

        {/* Requirements List */}
        <div className="relative flex flex-col gap-3.5 mb-6">
          {/* Requirement 1 */}
          <div className="flex items-start gap-3 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/60 hover:border-cyan-500/20 transition-all duration-300 group">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 font-bold font-display text-sm border border-cyan-500/10 group-hover:bg-cyan-500/20 transition-all">
              1
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold text-sm text-slate-200">حساب جديد في wowBet</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                تأكد من إنشاء حساب جديد كلياً في منصة wowBet لضمان ربط السكريبت
              </p>
            </div>
          </div>

          {/* Requirement 2 */}
          <div className="flex items-start gap-3 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/60 hover:border-cyan-500/20 transition-all duration-300 group">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 font-bold font-display text-sm border border-cyan-500/10 group-hover:bg-cyan-500/20 transition-all">
              2
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold text-sm text-slate-200">قيمة الإيداع</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                الحد الأدنى للإيداع المتوافق مع سيرفر التوقعات هو <span className="text-cyan-400 font-bold">9$</span> أو <span className="text-cyan-400 font-bold">300 جنيه</span>
              </p>
            </div>
          </div>

          {/* Requirement 3 */}
          <div className="flex items-start gap-3 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/60 hover:border-cyan-500/20 transition-all duration-300 group">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 font-bold font-display text-sm border border-cyan-500/10 group-hover:bg-cyan-500/20 transition-all">
              3
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold text-sm text-slate-200">إدخال البروموكود الموحد</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                تفعيل البروموكود <span className="font-mono text-cyan-400 font-bold tracking-wider">E1111</span> للتفعيل السحابي الفوري
              </p>
            </div>
          </div>
        </div>

        {/* Promo Code Copy Banner */}
        <div className="relative flex items-center justify-between p-3 px-4 bg-cyan-500/5 hover:bg-cyan-500/10 rounded-2xl border border-cyan-500/20 mb-6 transition-all">
          <span className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <Gift className="w-4 h-4 text-emerald-400 animate-bounce" />
            البروموكود المعتمد:
          </span>
          <span className="font-display font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 tracking-widest leading-none">
            E1111
          </span>
        </div>

        {/* Consent Checkbox */}
        <label className="relative flex items-center gap-3 p-3.5 bg-slate-950/30 hover:bg-slate-950/50 rounded-2xl border border-slate-800/40 cursor-pointer select-none transition-all duration-200">
          <input
            id="requirementsCheck"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer accent-cyan-500"
          />
          <span className="text-xs text-slate-300 font-medium leading-relaxed">
            أوافق على الشروط والأحكام المذكورة أعلاه وأقر بقراءتها
          </span>
        </label>

        {/* Start Button */}
        <button
          id="acceptRequirementsBtn"
          disabled={!agreed}
          onClick={onAccept}
          className="relative w-full mt-5 p-4 bg-gradient-to-r from-cyan-500 via-cyan-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base"
        >
          <Check className="w-5 h-5" />
          هل فهمت الشروط؟ ابدأ الآن
        </button>
      </motion.div>
    </div>
  );
}
