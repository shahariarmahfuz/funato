"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  Heart,
  Calculator,
  UserPlus,
  Phone,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { settings } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-clip bg-[#FDFDFC]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Creative 404 Illustration Badge */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-sky-200/50 rounded-full blur-2xl transform scale-150 pointer-events-none" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#0f4c75] to-[#2375b8] text-white flex flex-col items-center justify-center shadow-xl shadow-sky-900/10 border border-sky-300/30">
              <span className="text-3xl sm:text-4xl font-mono font-black tracking-tight leading-none">
                404
              </span>
              <span className="text-[10px] sm:text-xs font-july font-bold text-sky-200 mt-1">
                ভুল ঠিকানা
              </span>
            </div>
          </div>

          {/* Heading & Friendly Subtitle */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-july font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>পৃষ্ঠাটি পাওয়া যায়নি</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-july font-bold text-[#0f4c75] tracking-tight">
              দুঃখিত, আপনি ভুল ঠিকানায় চলে এসেছেন
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              আপনি যে লিংকটি খুঁজছেন তা হয়তো সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে অথবা ঠিকানাটি ভুল টাইপ করা হয়েছে।
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2375b8] hover:bg-[#1b619c] text-white font-july font-bold text-sm shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>হোমপেজে ফিরে যান</span>
            </Link>

            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#0f4c75] border border-slate-200 font-july font-bold text-sm shadow-xs hover:shadow-sm transition cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>কার্যক্রম বা অনুদান দিন</span>
            </Link>
          </div>

          {/* Quick Helpful Navigation Grid */}
          <div className="pt-6 border-t border-slate-100">
            <p className="text-xs font-july font-bold text-slate-500 uppercase tracking-wider mb-4">
              প্রয়োজনীয় লিংকসমূহ
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <Link
                href="/zakat-calculator"
                className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-sky-300 hover:bg-sky-50/40 transition group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Calculator className="w-4 h-4 text-amber-600" />
                  <span className="font-july font-bold text-xs text-slate-800 group-hover:text-[#2375b8] transition">
                    যাকাত ক্যালকুলেটর
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  শরীয়াহসম্মত যাকাত হিসাব
                </p>
              </Link>

              <Link
                href="/be-a-volunteer"
                className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-sky-300 hover:bg-sky-50/40 transition group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <UserPlus className="w-4 h-4 text-[#2375b8]" />
                  <span className="font-july font-bold text-xs text-slate-800 group-hover:text-[#2375b8] transition">
                    স্বেচ্ছাসেবক হোন
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  মানবিক কার্যক্রমে যোগ দিন
                </p>
              </Link>

              <Link
                href="/contact"
                className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-sky-300 hover:bg-sky-50/40 transition group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span className="font-july font-bold text-xs text-slate-800 group-hover:text-[#2375b8] transition">
                    যোগাযোগ ও হটলাইন
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {settings.phone_hotline || "২৪/৭ সার্বক্ষণিক সেবা"}
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
