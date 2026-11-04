"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Play,
  ShieldCheck,
  Sparkles,
  UserPlus,
  X,
  Flame,
  CheckCircle2,
  FileText,
  BadgeCheck,
  Video,
  PhoneCall,
} from "lucide-react";
import { apiFetch, formatBDT, formatDate, toBnDigits } from "@/lib/api";
import { HomeBundle, MediaVideo } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import DonationWidget from "@/components/DonationWidget";
import CampaignCard from "@/components/CampaignCard";

export default function HomePage() {
  const { lang, t, settings } = useLanguage();
  const [data, setData] = useState<HomeBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [slideIdx, setSlideIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [playingVideo, setPlayingVideo] = useState<MediaVideo | null>(null);

  useEffect(() => {
    apiFetch<HomeBundle>("/api/public/home")
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const slides = data?.slides || [];
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const campaigns = data?.campaigns || [];
  const filteredCampaigns =
    activeCategory === "all"
      ? campaigns.slice(0, 9)
      : campaigns.filter((c) => c.category === activeCategory);

  const categories = [
    { id: "all", bn: "সকল প্রকল্প", en: "All Programs" },
    { id: "shelter", bn: "শেল্টারহোম", en: "Shelterhome" },
    { id: "food", bn: "মেহমানখানা", en: "Mehmankhana" },
    { id: "zakat", bn: "যাকাত স্বাবলম্বীকরণ", en: "Zakat" },
    { id: "orphan", bn: "এতিমখানা", en: "Orphanage" },
    { id: "emergency", bn: "জরুরি ত্রাণ", en: "Emergency" },
    { id: "sadaqah", bn: "সদকায়ে জারিয়া", en: "Sadaqah" },
    { id: "health", bn: "স্বাস্থ্য ও দাফন", en: "Health & Burial" },
  ];

  const currentSlide = slides[slideIdx];

  return (
    <div className="space-y-16 sm:space-y-20 pb-16 w-full max-w-full overflow-x-clip">
      {/* 1. URGENT APPEAL NOTICE RIBBON */}
      <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-sky-50 border-b border-rose-200/60 py-2.5 px-3 sm:px-6 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm min-w-0">
          <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-july font-bold text-[11px] shadow-xs shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              জরুরি আবেদন
            </span>
            <p className="text-slate-800 font-medium truncate min-w-0 flex-1">
              শীতবস্ত্র বিতরণ ও আশ্রয়হীন পরিবারের পুনর্বাসন তহবিল — অসহায় মানুষের পাশে দাঁড়ান
            </p>
          </div>
          <Link
            href="/donate/shelterhome"
            className="inline-flex items-center gap-1 font-july font-bold text-[#0f4c75] hover:text-[#2375b8] underline underline-offset-4 decoration-rose-300 hover:decoration-[#2375b8] transition shrink-0 self-end sm:self-auto"
          >
            <span>এখনই অনুদান দিন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. HERO SECTION: Dynamic Carousel + Compact Donation Widget */}
      <section className="relative -mt-8 pt-6 px-3 sm:px-4 overflow-hidden w-full max-w-full">
        {/* Soft Background Ambient Light Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
          {/* Left 7 Columns: Responsive Hero Banner & Feature Cards */}
          <div className="lg:col-span-7 flex flex-col min-w-0 w-full">
            {/* HERO BANNER: Strict 16:9 on Mobile, 2.2:1 on Desktop */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md shadow-slate-900/10 border border-slate-200/80 bg-[#082238] aspect-[16/9] lg:aspect-[2.2/1] w-full">
              {currentSlide ? (
                <>
                  {/* ============================================================
                      A. MOBILE VIEW (< lg): Strict 16:9, Background Image + Overlay
                      ============================================================ */}
                  <div className="lg:hidden absolute inset-0 w-full h-full">
                    {/* Layer 1: Background Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentSlide.image_url}
                      alt={currentSlide.title_bn}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Layer 2: Deep gradient overlay for Bengali readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-slate-950/30 pointer-events-none" />

                    {/* Layer 3: Mobile Content (Directly pinned over the image) */}
                    <div className="absolute inset-0 z-10 p-3 sm:p-4.5 flex flex-col justify-between text-white">
                      {/* Top: Badge */}
                      <div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/85 backdrop-blur-xs text-[10px] sm:text-xs font-july font-bold text-white shadow-xs border border-white/20">
                          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
                          <span>{currentSlide.badge_bn}</span>
                        </span>
                      </div>

                      {/* Middle: Headline & Description */}
                      <div className="my-auto py-1">
                        <h1 className="text-[13px] sm:text-base font-july font-bold leading-tight sm:leading-snug text-white drop-shadow-md line-clamp-2">
                          {currentSlide.title_bn}
                        </h1>
                        {currentSlide.subtitle_bn && (
                          <p className="text-[10px] sm:text-xs text-slate-200 line-clamp-1 leading-normal font-light mt-0.5 drop-shadow-sm">
                            {currentSlide.subtitle_bn}
                          </p>
                        )}
                      </div>

                      {/* Bottom: Compact CTAs & Carousel Controls in single row */}
                      <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-white/15">
                        {/* Horizontal Compact CTAs */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Link
                            href={currentSlide.cta_link || "/donate"}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#2375b8] to-[#1788bf] active:scale-95 text-white font-july font-bold text-[11px] shadow-sm shrink-0 cursor-pointer"
                          >
                            <Heart className="w-3 h-3 fill-white" />
                            <span>{currentSlide.cta_text_bn || "দান করুন"}</span>
                          </Link>
                          <Link
                            href="/zakat-calculator"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-xs active:scale-95 text-white font-july font-bold text-[10px] border border-white/25 shrink-0 cursor-pointer"
                          >
                            <Calculator className="w-3 h-3 text-amber-300" />
                            <span>যাকাত হিসাব</span>
                          </Link>
                        </div>

                        {/* Carousel Controls */}
                        {slides.length > 1 && (
                          <div className="flex items-center gap-1 shrink-0">
                            <div className="flex items-center gap-1">
                              {slides.map((s, idx) => (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={() => setSlideIdx(idx)}
                                  aria-label={`Slide ${idx + 1}`}
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    idx === slideIdx ? "w-3.5 bg-sky-400" : "w-1.5 bg-white/40"
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="flex items-center ml-0.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setSlideIdx((slideIdx - 1 + slides.length) % slides.length)
                                }
                                aria-label="Previous slide"
                                className="p-1 rounded bg-black/40 hover:bg-black/60 text-white/90 hover:text-white transition cursor-pointer"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setSlideIdx((slideIdx + 1) % slides.length)}
                                aria-label="Next slide"
                                className="p-1 rounded bg-black/40 hover:bg-black/60 text-white/90 hover:text-white transition cursor-pointer"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ============================================================
                      B. DESKTOP VIEW (>= lg): 2.2:1 Aspect Ratio, Text Left, Image Right
                      ============================================================ */}
                  <div className="hidden lg:grid lg:grid-cols-12 h-full w-full">
                    {/* Left 7 Columns: Text Content */}
                    <div className="lg:col-span-7 flex flex-col justify-between p-5 xl:p-6 text-white bg-gradient-to-r from-[#082238] via-[#0b2942] to-[#0f3454] relative z-10">
                      <div>
                        {/* Campaign Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 border border-white/20 text-xs font-july font-bold text-sky-200 shadow-2xs">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>{currentSlide.badge_bn}</span>
                        </div>

                        {/* Heading */}
                        <h1 className="font-july font-bold text-lg xl:text-xl text-white leading-snug line-clamp-2 mt-2.5 tracking-tight">
                          {currentSlide.title_bn}
                        </h1>

                        {/* Description */}
                        <p className="text-xs text-slate-200 leading-relaxed line-clamp-2 font-light mt-1.5">
                          {currentSlide.subtitle_bn}
                        </p>
                      </div>

                      {/* Bottom Area: CTAs + Controls */}
                      <div className="space-y-2.5 pt-2">
                        {/* Horizontal CTAs */}
                        <div className="flex items-center gap-2">
                          <Link
                            href={currentSlide.cta_link || "/donate"}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#2375b8] to-[#1788bf] hover:from-[#1b619c] hover:to-[#1374a6] text-white font-july font-bold text-xs shadow-sm hover:shadow-md transition cursor-pointer"
                          >
                            <Heart className="w-3.5 h-3.5 fill-white" />
                            <span>{currentSlide.cta_text_bn || "দান করুন"}</span>
                          </Link>
                          <Link
                            href="/zakat-calculator"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-july font-bold text-xs border border-white/20 transition cursor-pointer"
                          >
                            <Calculator className="w-3.5 h-3.5 text-amber-300" />
                            <span>যাকাত হিসাব করুন</span>
                          </Link>
                        </div>

                        {/* Controls Strip */}
                        {slides.length > 1 && (
                          <div className="flex items-center justify-between border-t border-white/10 pt-2">
                            {/* Dots */}
                            <div className="flex items-center gap-1.5">
                              {slides.map((s, idx) => (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={() => setSlideIdx(idx)}
                                  aria-label={`Slide ${idx + 1}`}
                                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                    idx === slideIdx ? "w-5 bg-sky-400" : "w-1.5 bg-white/40 hover:bg-white/60"
                                  }`}
                                />
                              ))}
                            </div>

                            {/* Counter & Arrows */}
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] text-slate-300 font-mono font-bold mr-1">
                                {toBnDigits(slideIdx + 1)} / {toBnDigits(slides.length)}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setSlideIdx((slideIdx - 1 + slides.length) % slides.length)
                                }
                                aria-label="Previous slide"
                                className="p-1 rounded-md bg-white/15 hover:bg-white/30 text-white transition cursor-pointer"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setSlideIdx((slideIdx + 1) % slides.length)}
                                aria-label="Next slide"
                                className="p-1 rounded-md bg-white/15 hover:bg-white/30 text-white transition cursor-pointer"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right 5 Columns: Slide Image */}
                    <div className="lg:col-span-5 relative h-full overflow-hidden bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentSlide.image_url}
                        alt={currentSlide.title_bn}
                        className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                      />
                      {/* Soft left gradient fade into text side */}
                      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#0f3454] to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6 text-white space-y-2">
                  <h1 className="text-xl font-july font-bold">{settings.org_name_bn}</h1>
                  <p className="text-xs">{settings.tagline_bn}</p>
                </div>
              )}
            </div>

            {/* BOTTOM FEATURE CARDS (TRUST INDICATORS) */}
            {/* Mobile: Compact 2-column grid | Desktop: Single horizontal row of 4 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 mt-2.5 sm:mt-3 w-full">
              <div className="flex items-center gap-2 py-2 px-2 sm:px-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-colors min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-july font-bold text-slate-800 truncate min-w-0">
                  ১০০% শরীয়াহ সম্মত
                </span>
              </div>

              <div className="flex items-center gap-2 py-2 px-2 sm:px-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-sky-300 transition-colors min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-sky-50 text-[#2375b8] flex items-center justify-center shrink-0">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-july font-bold text-slate-800 truncate min-w-0">
                  ডিজিটাল মানি রিসিট
                </span>
              </div>

              <div className="flex items-center gap-2 py-2 px-2 sm:px-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-amber-300 transition-colors min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-july font-bold text-slate-800 truncate min-w-0">
                  সমাজসেবা নিবন্ধিত
                </span>
              </div>

              <div className="flex items-center gap-2 py-2 px-2 sm:px-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-purple-300 transition-colors min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-july font-bold text-slate-800 truncate min-w-0">
                  ভিডিও ফিল্ড রিপোর্ট
                </span>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Quick Donation Widget */}
          <div className="lg:col-span-5 min-w-0 w-full">
            <DonationWidget campaigns={campaigns} compact />
          </div>
        </div>
      </section>

      {/* ACTIVE CAMPAIGNS & HUMANITARIAN FUNDS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#f0f7fd] text-[#2375b8] font-july font-bold text-xs sm:text-sm mb-2">
              চলমান মানবিক তহবিল
            </span>
            <h2 className="text-2xl sm:text-3xl font-july font-bold text-[#0f4c75]">
              জরুরি অনুদান প্রকল্প ও কার্যক্রম
            </h2>
          </div>
          <Link
            href="/donate"
            className="inline-flex items-center gap-1.5 text-[#2375b8] hover:text-[#0f4c75] font-july font-bold text-sm sm:text-base group"
          >
            <span>সকল প্রকল্প দেখুন ({toBnDigits(campaigns.length)})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-july font-bold text-xs sm:text-sm whitespace-nowrap transition cursor-pointer border ${
                activeCategory === cat.id
                  ? "bg-[#2375b8] text-white border-[#2375b8] shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-sky-200 hover:bg-sky-50/50"
              }`}
            >
              {cat.bn}
            </button>
          ))}
        </div>

        {/* Campaign Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-96 rounded-2xl bg-slate-100 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((camp) => (
              <CampaignCard key={camp.id} campaign={camp} />
            ))}
          </div>
        )}
      </section>

      {/* 6. ZAKAT SELF-RELIANCE SPOTLIGHT BANNER */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-[#0b2942] via-[#0f4c75] to-[#1788bf] p-7 sm:p-12 text-white shadow-xl shadow-sky-950/20 relative overflow-hidden">
          {/* Subtle Islamic Motif Background Decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-july font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>স্বাধীন শরীয়াহ বোর্ড অনুমোদিত যাকাত ব্যবস্থাপনা</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-july font-bold leading-snug">
                আপনার যাকাত বদলে দিতে পারে একটি দরিদ্র পরিবারের চিরস্থায়ী ভাগ্য
              </h2>
              <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
                মুষ্টিমেয় ত্রাণ নয়, বরং সেলাই মেশিন, ভ্যানগাড়ি, গবাদিপশু ও ক্ষুদ্র ব্যবসার পুঁজি প্রদানের মাধ্যমে আমরা অসচ্ছল পরিবারকে স্থায়ীভাবে স্বাবলম্বী করে তুলি।
              </p>

              {/* 3 Value Checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs sm:text-sm text-sky-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>১০০% হকদার নির্বাচন</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>স্থায়ী জীবিকা সরঞ্জাম</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ভিডিও অডিট ও প্রমাণ</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/zakat-calculator"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-july font-bold shadow-lg transition"
              >
                <Calculator className="w-5 h-5" />
                <span>যাকাত হিসাব করুন</span>
              </Link>
              <Link
                href="/donate/zakat"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-sky-50 text-[#0f4c75] font-july font-bold shadow-lg transition"
              >
                <Heart className="w-5 h-5 text-[#2375b8] fill-[#2375b8]" />
                <span>যাকাত প্রদান করুন</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY TRUST US? (স্বচ্ছতা ও জবাবদিহিতা) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-july font-bold text-xs sm:text-sm mb-2">
            স্বচ্ছতা ও জবাবদিহিতা
          </span>
          <h2 className="text-2xl sm:text-3xl font-july font-bold text-[#0f4c75]">
            কেন ভ্রাতৃত্ব ফাউন্ডেশনে অনুদান দিবেন?
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            আপনার কষ্টার্জিত প্রতিটি পয়সার সর্বোচ্চ আমানতদারি ও শতভাগ স্বচ্ছতা নিশ্চিতকরণে আমরা অঙ্গীকারবদ্ধ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#2375b8] flex items-center justify-center">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <h3 className="font-july font-bold text-lg text-[#0f4c75]">
              সরকারি সমাজসেবা নিবন্ধিত
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের সমাজসেবা অধিদপ্তর এবং এনবিআর অনুমোদিত দাতব্য সংস্থা।
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-july font-bold text-lg text-[#0f4c75]">
              স্বাধীন শরীয়াহ বোর্ড
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              মুফতি ও ইসলামী স্কলারদের সার্বক্ষণিক তত্ত্বাবধানে যাকাত ও সাদাকাহর যথাযথ ব্যয় নিশ্চিতকরণ।
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-july font-bold text-lg text-[#0f4c75]">
              ডিজিটাল মানি রিসিট
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              প্রতিটি অনুদানের সাথে সাথে ট্যাক্স রেয়াত সুবিধাযুক্ত অফিশিয়াল ডিজিটাল রশিদ এসএমএস ও ইমেইলে প্রদান।
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="font-july font-bold text-lg text-[#0f4c75]">
              সরাসরি ফিল্ড ভিডিও অডিট
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              প্রকল্প বাস্তবায়নের প্রতিটি মুহূর্তের সচিত্র ভিডিও ও মাঠপর্যায়ের অগ্রগতি প্রতিবেদন সরাসরি প্রকাশ।
            </p>
          </div>
        </div>
      </section>

      {/* 8. FEATURED FIELD VIDEOS & DOCUMENTARIES */}
      <section className="bg-gradient-to-b from-[#f4f9fd] to-[#FDFDFC] py-14 px-4 border-y border-sky-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-block px-3.5 py-1 rounded-full bg-sky-100 text-[#2375b8] font-july font-bold text-xs sm:text-sm mb-2">
                ভিডিও ডকুমেন্টারি
              </span>
              <h2 className="text-2xl sm:text-3xl font-july font-bold text-[#0f4c75]">
                মাঠপর্যায়ের কার্যক্রমের ভিডিও চিত্র
              </h2>
            </div>
            <Link
              href="/mastul-media"
              className="inline-flex items-center gap-1.5 text-[#2375b8] font-july font-bold text-sm sm:text-base hover:underline group"
            >
              <span>সকল ভিডিও দেখুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(data?.videos || []).slice(0, 3).map((vid) => (
              <button
                key={vid.id}
                type="button"
                onClick={() => setPlayingVideo(vid)}
                className="group text-left bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-52 bg-slate-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      vid.thumbnail_url ||
                      `https://img.youtube.com/vi/${vid.youtube_id}/hqdefault.jpg`
                    }
                    alt={vid.title_bn}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#2375b8] group-hover:bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-white text-xs font-mono">
                    {vid.duration}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-july font-bold text-base text-[#0f4c75] group-hover:text-[#2375b8] line-clamp-2 transition">
                    {vid.title_bn}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 9. STORIES OF HOPE & RECENT NEWS (মানবিক গল্প) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#f0f7fd] text-[#2375b8] font-july font-bold text-xs sm:text-sm mb-2">
              পরিবর্তনের গল্প
            </span>
            <h2 className="text-2xl sm:text-3xl font-july font-bold text-[#0f4c75]">
              মানবিক গল্প ও মাঠপর্যায়ের সাফল্য
            </h2>
          </div>
          <Link
            href="/news-stories"
            className="inline-flex items-center gap-1.5 text-[#2375b8] font-july font-bold text-sm sm:text-base hover:underline group"
          >
            <span>আরও পড়ুন</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(data?.stories || []).slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/news-stories/${post.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
            >
              <div className="h-52 overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover_image}
                  alt={post.title_bn}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(post.published_at, lang)}</span>
                  </div>
                  <h3 className="font-july font-bold text-lg text-[#0f4c75] group-hover:text-[#2375b8] transition line-clamp-2">
                    {post.title_bn}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                    {post.excerpt_bn}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-july font-bold text-[#2375b8]">
                  <span>বিস্তারিত পড়ুন</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 10. RECENT NEWS + LIVE VERIFIED DONORS TICKER */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 cols: প্রেস রিলিজ ও সর্বশেষ সংবাদ */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full bg-sky-50 text-[#2375b8] font-july font-bold text-xs mb-1">
                প্রেস ও গণমাধ্যম
              </span>
              <h2 className="text-2xl font-july font-bold text-[#0f4c75]">
                সাম্প্রতিক সংবাদ ও প্রেস বিজ্ঞপ্তি
              </h2>
            </div>
            <Link
              href="/news-stories"
              className="text-sm font-july font-bold text-[#2375b8] hover:underline"
            >
              সবগুলো দেখুন →
            </Link>
          </div>

          <div className="space-y-4">
            {(data?.news || []).slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/news-stories/${item.slug}`}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="sm:w-44 h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.cover_image}
                    alt={item.title_bn}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-[#2375b8] font-july font-bold">
                      {formatDate(item.published_at, lang)} • {item.author_name}
                    </span>
                    <h3 className="font-july font-bold text-base sm:text-lg text-[#0f4c75] group-hover:text-[#2375b8] mt-1 transition">
                      {item.title_bn}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {item.excerpt_bn}
                    </p>
                  </div>
                  <span className="text-xs font-july font-bold text-[#2375b8] mt-2 inline-flex items-center gap-1">
                    <span>সম্পূর্ণ সংবাদ পড়ুন</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right 4 cols: Live Verified Donor Wall + Volunteer Invitation */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Verified Donors Box */}
          <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-july font-bold text-base sm:text-lg text-[#0f4c75]">
                  লাইভ অনুদান আপডেট
                </h3>
              </div>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                ভেরিফাইড
              </span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {(data?.recent_donations || []).map((don) => (
                <div
                  key={don.id}
                  className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#f0f7fd]/70 border border-sky-100 text-sm hover:bg-sky-50 transition"
                >
                  <div className="min-w-0">
                    <div className="font-july font-bold text-slate-800 truncate">
                      {don.donor_name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {don.campaign_title_bn}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-july font-bold text-[#2375b8]">
                      {formatBDT(don.amount, "bn")}
                    </div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">
                      {don.payment_method}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Volunteer CTA Card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#2375b8] to-[#0b2942] p-6 text-white space-y-3.5 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-sky-200">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="font-july font-bold text-xl">
              স্বেচ্ছাসেবক হিসেবে যুক্ত হোন
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              দেশব্যাপী ৬৪ জেলায় ত্রাণ বিতরণ, মেডিকেল ক্যাম্প ও সুবিধাবঞ্চিত শিশুদের শিক্ষায় আমাদের সাথে যুক্ত হয়ে কাজ করুন।
            </p>
            <Link
              href="/be-a-volunteer"
              className="inline-flex w-full items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-[#0f4c75] font-july font-bold text-sm hover:bg-sky-50 shadow-md transition"
            >
              <span>নিবন্ধন ফর্ম পূরণ করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 11. 24/7 HOTLINE HELPLINE STRIP */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200/80 p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#2375b8] text-white flex items-center justify-center shrink-0 shadow-md">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-july font-bold text-base sm:text-lg text-[#0f4c75]">
                যে কোনো সহায়তা বা তথ্য জানতে কল করুন
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                আমাদের প্রতিনিধি সার্বক্ষণিক আপনার সেবায় নিয়োজিত
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${settings.phone_hotline}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2375b8] hover:bg-[#1b619c] text-white font-july font-bold text-sm shadow-md transition"
            >
              <span>{settings.phone_hotline}</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-july font-bold text-sm hover:bg-slate-50 transition"
            >
              <span>অফিস ঠিকানা</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 12. VIDEO LIGHTBOX MODAL */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/15">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 text-white">
              <h3 className="font-july font-bold text-base truncate">
                {playingVideo.title_bn}
              </h3>
              <button
                type="button"
                onClick={() => setPlayingVideo(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 cursor-pointer"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${playingVideo.youtube_id}?autoplay=1`}
                title={playingVideo.title_en}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
