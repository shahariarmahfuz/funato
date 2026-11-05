"use client";

import React, { useEffect, useState, useRef } from "react";
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

  // Dynamic user controls: side arrows fade in on tap/hover and auto-hide
  const [showControls, setShowControls] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerControls = () => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, []);

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

  const minSwipeDistance = 40;
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    triggerControls();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && slides.length > 1) {
      setSlideIdx((prev) => (prev + 1) % slides.length);
      triggerControls();
    } else if (isRightSwipe && slides.length > 1) {
      setSlideIdx((prev) => (prev - 1 + slides.length) % slides.length);
      triggerControls();
    }
  };

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
    <div className="pb-16 w-full max-w-full overflow-x-clip">
      {/* 1. CONTINUOUS NOTICE TICKER (Single-line marquee) */}
      <div className="bg-white border-b border-slate-200/90 h-9 sm:h-10 px-3 sm:px-6 w-full overflow-hidden flex items-center shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 w-full h-full text-xs sm:text-sm">
          {/* Infinite Marquee Ticker (Spans full width across mobile & desktop) */}
          <div className="flex-1 overflow-hidden relative min-w-0 h-full flex items-center">
            <div className="animate-marquee gap-8 items-center py-1">
              <Link
                href="/donate/shelterhome"
                className="text-slate-800 hover:text-red-700 font-medium transition cursor-pointer text-xs sm:text-sm"
              >
                শীতবস্ত্র বিতরণ ও আশ্রয়হীন পরিবারের পুনর্বাসন তহবিল — অসহায় মানুষের পাশে দাঁড়ান এবং সহায়তা প্রদান করুন
              </Link>
              <span className="text-red-500 font-bold">•</span>
              <Link
                href="/donate/shelterhome"
                className="text-slate-800 hover:text-red-700 font-medium transition cursor-pointer text-xs sm:text-sm"
              >
                শীতবস্ত্র বিতরণ ও আশ্রয়হীন পরিবারের পুনর্বাসন তহবিল — অসহায় মানুষের পাশে দাঁড়ান এবং সহায়তা প্রদান করুন
              </Link>
            </div>
          </div>

          {/* Right: Fixed Action Link (Hidden on mobile so text has full width, visible on sm+) */}
          <Link
            href="/donate/shelterhome"
            className="hidden sm:inline-flex items-center gap-1 font-july font-bold text-red-600 hover:text-red-800 underline underline-offset-4 decoration-red-300 hover:decoration-red-600 transition shrink-0 z-10 text-xs"
          >
            <span>এখনই অনুদান দিন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. HERO SECTION: Seamless top alignment with 0 gap on mobile */}
      <section className="relative pt-0 sm:pt-4 px-0 sm:px-4 overflow-hidden w-full max-w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start w-full">
          {/* Left 7 Columns: Responsive Hero Banner & Feature Cards */}
          <div className="lg:col-span-7 flex flex-col min-w-0 w-full">
            {/* HERO BANNER: Responsive height with bottom-anchored content */}
            <div className="relative rounded-none overflow-hidden shadow-sm border-y sm:border border-slate-200/80 bg-[#082238] aspect-[16/9] lg:aspect-[2.2/1] w-full">
              {currentSlide ? (
                <>
                  {/* ============================================================
                      A. MOBILE VIEW (< lg): Strict 16:9 Aspect Ratio, Top 100% Clear, Controls & Details at Bottom
                      ============================================================ */}
                  <div
                    className="lg:hidden absolute inset-0 w-full h-full select-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onClick={() => triggerControls()}
                  >
                    {/* Layer 1: Background Image */}
                    <div className="absolute inset-0 w-full h-full block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentSlide.image_url}
                        alt={currentSlide.title_bn}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                      />
                      {/* Layer 2: Gradient overlay (Top 55% crystal clear, bottom 45% dark for readability) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 via-45% to-transparent pointer-events-none" />
                    </div>

                    {/* Floating Side Chevrons (Appear on tap/click, auto-hide after 3.5s to preserve minimalist style) */}
                    {slides.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSlideIdx((prev) => (prev - 1 + slides.length) % slides.length);
                            triggerControls();
                          }}
                          aria-label="Previous slide"
                          className={`absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/55 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer active:scale-90 ${
                            showControls
                              ? "opacity-100 scale-100 pointer-events-auto"
                              : "opacity-0 scale-90 pointer-events-none"
                          }`}
                        >
                          <ChevronLeft className="w-4 h-4 text-white" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSlideIdx((prev) => (prev + 1) % slides.length);
                            triggerControls();
                          }}
                          aria-label="Next slide"
                          className={`absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/55 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer active:scale-90 ${
                            showControls
                              ? "opacity-100 scale-100 pointer-events-auto"
                              : "opacity-0 scale-90 pointer-events-none"
                          }`}
                        >
                          <ChevronRight className="w-4 h-4 text-white" />
                        </button>
                      </>
                    )}

                    {/* Layer 3: Mobile Content pinned at Bottom (Top is completely clear!) */}
                    <div className="absolute inset-0 z-10 p-3 sm:p-4 flex flex-col justify-end pointer-events-none text-white space-y-1.5">
                      {/* Photo Text on Top: Heading & 2-Line Subtitle */}
                      <Link
                        href={currentSlide.cta_link || "/donate"}
                        className="pointer-events-auto block group"
                      >
                        <h1 className="text-[13px] sm:text-base font-july font-bold leading-tight sm:leading-snug text-white drop-shadow-md group-hover:text-sky-300 transition line-clamp-1 sm:line-clamp-2">
                          {currentSlide.title_bn}
                        </h1>
                        {currentSlide.subtitle_bn && (
                          <p className="text-[10px] sm:text-xs text-slate-200 line-clamp-2 leading-relaxed font-normal drop-shadow-sm mt-0.5">
                            {currentSlide.subtitle_bn}
                          </p>
                        )}
                      </Link>

                      {/* Bottom Row: Mini Title Badge on Left & Sleek Tracking Dots on Right */}
                      <div className="flex items-center justify-between gap-2 pointer-events-auto pt-0.5">
                        {currentSlide.badge_bn ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-july font-bold text-white border border-white/25 shadow-2xs">
                            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                            <span>{currentSlide.badge_bn}</span>
                          </span>
                        ) : (
                          <div />
                        )}

                        {slides.length > 1 && (
                          <div className="flex items-center gap-0.5 shrink-0">
                            {slides.map((s, idx) => (
                              <button
                                key={s.id}
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSlideIdx(idx);
                                  triggerControls();
                                }}
                                aria-label={`Slide ${idx + 1}`}
                                className="py-2 px-1 flex items-center cursor-pointer"
                              >
                                <span
                                  className={`h-1 rounded-full transition-all duration-300 block ${
                                    idx === slideIdx ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                                  }`}
                                />
                              </button>
                            ))}
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
                        {/* Mini Title Badge */}
                        {currentSlide.badge_bn && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-july font-bold text-sky-200 shadow-2xs mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>{currentSlide.badge_bn}</span>
                          </div>
                        )}

                        {/* Heading & 2-line Description linking to distinct page */}
                        <Link
                          href={currentSlide.cta_link || "/donate"}
                          className="block group"
                        >
                          <h1 className="font-july font-bold text-lg xl:text-xl text-white leading-snug line-clamp-2 tracking-tight group-hover:text-sky-300 transition">
                            {currentSlide.title_bn}
                          </h1>
                          <p className="text-xs text-slate-200 leading-relaxed line-clamp-2 font-light mt-1.5">
                            {currentSlide.subtitle_bn}
                          </p>
                        </Link>
                      </div>

                      {/* Bottom Area: CTAs + Controls */}
                      <div className="space-y-2.5 pt-2">
                        {/* Horizontal CTAs */}
                        <div className="flex items-center gap-2">
                          <Link
                            href={currentSlide.cta_link || "/donate"}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-[#1d6fad] hover:bg-[#165a8e] text-white font-july font-bold text-xs shadow-sm hover:shadow-md transition cursor-pointer"
                          >
                            <Heart className="w-3.5 h-3.5 fill-white" />
                            <span>{currentSlide.cta_text_bn || "দান করুন"}</span>
                            <ArrowRight className="w-3 h-3 ml-0.5" />
                          </Link>
                          <Link
                            href="/zakat-calculator"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/15 hover:bg-white/25 text-white font-july font-bold text-xs border border-white/20 transition cursor-pointer"
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
                                  className={`h-1.5 transition-all duration-300 cursor-pointer ${
                                    idx === slideIdx ? "w-5 bg-sky-400" : "w-1.5 bg-white/40 hover:bg-white/60"
                                  }`}
                                />
                              ))}
                            </div>

                            {/* Arrows */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setSlideIdx((slideIdx - 1 + slides.length) % slides.length)
                                }
                                aria-label="Previous slide"
                                className="p-1 rounded-sm bg-white/15 hover:bg-white/30 text-white transition cursor-pointer"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setSlideIdx((slideIdx + 1) % slides.length)}
                                aria-label="Next slide"
                                className="p-1 rounded-sm bg-white/15 hover:bg-white/30 text-white transition cursor-pointer"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right 5 Columns: Clickable Slide Image */}
                    <Link
                      href={currentSlide.cta_link || "/donate"}
                      className="lg:col-span-5 relative h-full overflow-hidden bg-slate-900 block group cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentSlide.image_url}
                        alt={currentSlide.title_bn}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      />
                      {/* Soft left gradient fade into text side */}
                      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#0f3454] to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                    </Link>
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
            {/* Mobile: Edge-to-edge 2x2 grid with 1px border dividers | Desktop: Single horizontal row of 4 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200/80 border-y sm:border border-slate-200/80 w-full sm:gap-2.5 sm:bg-transparent sm:border-0 mt-2 sm:mt-3">
              <div className="flex items-center gap-2 py-2 px-3 bg-white sm:border sm:border-slate-200/80 sm:shadow-2xs min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-none bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-july font-bold text-slate-800 truncate min-w-0">
                  ১০০% শরীয়াহ সম্মত
                </span>
              </div>

              <div className="flex items-center gap-2 py-2 px-3 bg-white sm:border sm:border-slate-200/80 sm:shadow-2xs min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-none bg-sky-50 text-[#2375b8] flex items-center justify-center shrink-0">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-july font-bold text-slate-800 truncate min-w-0">
                  ডিজিটাল মানি রিসিট
                </span>
              </div>

              <div className="flex items-center gap-2 py-2 px-3 bg-white sm:border sm:border-slate-200/80 sm:shadow-2xs min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-none bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-july font-bold text-slate-800 truncate min-w-0">
                  সমাজসেবা নিবন্ধিত
                </span>
              </div>

              <div className="flex items-center gap-2 py-2 px-3 bg-white sm:border sm:border-slate-200/80 sm:shadow-2xs min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-none bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
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

      {/* 3. SUBSEQUENT CONTENT SECTIONS */}
      <div className="space-y-16 sm:space-y-20 mt-10 sm:mt-14">
        {/* ACTIVE CAMPAIGNS & HUMANITARIAN FUNDS */}
        <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-block px-3 py-1 rounded-sm bg-sky-50 text-[#1d6fad] border border-sky-100 font-july font-bold text-xs sm:text-sm mb-2">
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
      <section className="px-0 sm:px-4">
        <div className="max-w-7xl mx-auto rounded-none bg-gradient-to-r from-[#0a2540] to-[#0f3d64] p-6 sm:p-12 text-white shadow-md border-y sm:border border-white/10 relative overflow-hidden">
          {/* Subtle Islamic Motif Background Decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-july font-bold">
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
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-sm bg-amber-400 hover:bg-amber-300 text-slate-950 font-july font-bold shadow-md transition"
              >
                <Calculator className="w-5 h-5" />
                <span>যাকাত হিসাব করুন</span>
              </Link>
              <Link
                href="/donate/zakat"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-sm bg-white hover:bg-sky-50 text-[#0f4c75] font-july font-bold shadow-md transition"
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
          <span className="inline-block px-3 py-1 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-100 font-july font-bold text-xs sm:text-sm mb-2">
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
          <div className="bg-white rounded-none p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-sm bg-sky-50 text-[#2375b8] flex items-center justify-center">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <h3 className="font-july font-bold text-lg text-[#0f4c75]">
              সরকারি সমাজসেবা নিবন্ধিত
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের সমাজসেবা অধিদপ্তর এবং এনবিআর অনুমোদিত দাতব্য সংস্থা।
            </p>
          </div>

          <div className="bg-white rounded-none p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-sm bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-july font-bold text-lg text-[#0f4c75]">
              স্বাধীন শরীয়াহ বোর্ড
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              মুফতি ও ইসলামী স্কলারদের সার্বক্ষণিক তত্ত্বাবধানে যাকাত ও সাদাকাহর যথাযথ ব্যয় নিশ্চিতকরণ।
            </p>
          </div>

          <div className="bg-white rounded-none p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-sm bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-july font-bold text-lg text-[#0f4c75]">
              ডিজিটাল মানি রিসিট
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              প্রতিটি অনুদানের সাথে সাথে ট্যাক্স রেয়াত সুবিধাযুক্ত অফিশিয়াল ডিজিটাল রশিদ এসএমএস ও ইমেইলে প্রদান।
            </p>
          </div>

          <div className="bg-white rounded-none p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-sm bg-purple-50 text-purple-600 flex items-center justify-center">
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
              <span className="inline-block px-3 py-1 rounded-sm bg-sky-50 text-[#1d6fad] border border-sky-100 font-july font-bold text-xs sm:text-sm mb-2">
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
                className="group text-left bg-white rounded-none border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer"
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
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-sm bg-black/80 backdrop-blur-xs text-white text-xs font-mono">
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
            <span className="inline-block px-3.5 py-1 rounded-sm bg-[#f0f7fd] text-[#2375b8] font-july font-bold text-xs sm:text-sm mb-2">
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
              className="group bg-white rounded-none border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
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
              <span className="inline-block px-3 py-0.5 rounded-sm bg-sky-50 text-[#2375b8] font-july font-bold text-xs mb-1">
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
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-none bg-white border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="sm:w-44 h-32 rounded-none overflow-hidden bg-slate-100 shrink-0">
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

        {/* Right 4 cols: Volunteer Invitation */}
        <div className="lg:col-span-4 space-y-6">
          {/* Volunteer CTA Card */}
          <div className="rounded-none bg-gradient-to-br from-[#1d6fad] to-[#0a2540] p-6 text-white space-y-3.5 shadow-md">
            <div className="w-10 h-10 rounded-sm bg-white/15 flex items-center justify-center text-sky-200">
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
              className="inline-flex w-full items-center justify-center gap-2 py-2.5 rounded-sm bg-white text-[#0a2540] font-july font-bold text-sm hover:bg-sky-50 shadow-sm transition"
            >
              <span>নিবন্ধন ফর্ম পূরণ করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 11. 24/7 HOTLINE HELPLINE STRIP */}
      <section className="max-w-7xl mx-auto px-0 sm:px-4">
        <div className="rounded-none bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-y sm:border border-sky-200/80 p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-sm bg-[#2375b8] text-white flex items-center justify-center shrink-0 shadow-sm">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#2375b8] hover:bg-[#1b619c] text-white font-july font-bold text-sm shadow-sm transition"
            >
              <span>{settings.phone_hotline}</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm bg-white border border-slate-300 text-slate-700 font-july font-bold text-sm hover:bg-slate-50 transition"
            >
              <span>অফিস ঠিকানা</span>
            </Link>
          </div>
        </div>
      </section>
      </div>

      {/* 12. VIDEO LIGHTBOX MODAL */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-none overflow-hidden max-w-4xl w-full shadow-2xl border border-white/15">
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
