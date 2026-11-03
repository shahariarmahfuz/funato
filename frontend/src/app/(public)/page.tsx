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
} from "lucide-react";
import { apiFetch, formatBDT, formatDate } from "@/lib/api";
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
    { id: "zakat", bn: "যাকাত", en: "Zakat" },
    { id: "orphan", bn: "এতিমখানা", en: "Orphanage" },
    { id: "emergency", bn: "জরুরি ত্রাণ", en: "Emergency" },
    { id: "sadaqah", bn: "সদকায়ে জারিয়া", en: "Sadaqah" },
    { id: "health", bn: "স্বাস্থ্য ও দাফন", en: "Health & Burial" },
  ];

  const currentSlide = slides[slideIdx];
  const impactStats = data?.settings?.impact_stats || settings.impact_stats || [];

  return (
    <div>
      {/* HERO SECTION: Slider + Mastul Quick Donation Form */}
      <section className="relative bg-gradient-to-b from-[#e8f4fc] via-[#f4f9fd] to-[#FDFDFC] pt-6 pb-14 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Dynamic Hero Carousel */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[430px] sm:min-h-[510px] bg-[#0f4c75] flex flex-col justify-end">
              {currentSlide ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentSlide.image_url}
                    alt={t(currentSlide.title_bn, currentSlide.title_en)}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#082238] via-[#0b2e4b]/65 to-black/20" />
                  <div className="relative z-10 p-6 sm:p-10 space-y-4 text-white">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1788bf]/90 backdrop-blur-xs text-xs sm:text-sm font-july font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t(currentSlide.badge_bn, currentSlide.badge_en)}
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-july font-bold leading-snug">
                      {t(currentSlide.title_bn, currentSlide.title_en)}
                    </h1>
                    <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
                      {t(currentSlide.subtitle_bn, currentSlide.subtitle_en)}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <Link
                        href={currentSlide.cta_link || "/donate"}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1788bf] hover:bg-[#2375b8] text-white font-july font-bold shadow-lg transition"
                      >
                        <Heart className="w-4 h-4 fill-white" />
                        <span>{t(currentSlide.cta_text_bn, currentSlide.cta_text_en)}</span>
                      </Link>
                      <Link
                        href="/zakat-calculator"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs text-white font-july font-bold transition"
                      >
                        <Calculator className="w-4 h-4 text-amber-300" />
                        <span>{t("যাকাত হিসাব করুন", "Calculate Zakat")}</span>
                      </Link>
                    </div>

                    {/* Carousel Controls */}
                    {slides.length > 1 && (
                      <div className="pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {slides.map((s, idx) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setSlideIdx(idx)}
                              aria-label={`Slide ${idx + 1}`}
                              className={`h-2 rounded-full transition-all cursor-pointer ${
                                idx === slideIdx ? "w-8 bg-sky-400" : "w-2 bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSlideIdx((slideIdx - 1 + slides.length) % slides.length)
                            }
                            className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition cursor-pointer"
                            aria-label="Prev"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSlideIdx((slideIdx + 1) % slides.length)}
                            className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition cursor-pointer"
                            aria-label="Next"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-10 text-white space-y-4">
                  <h1 className="text-3xl font-july font-bold">
                    {t(settings.org_name_bn, settings.org_name_en)}
                  </h1>
                  <p>{t(settings.tagline_bn, settings.tagline_en)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right 5 Columns: Quick Donation Widget */}
          <div className="lg:col-span-5">
            <DonationWidget campaigns={campaigns} compact />
          </div>
        </div>

        {/* IMPACT STATS STRIP */}
        <div className="max-w-7xl mx-auto mt-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {impactStats.map((st, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs text-center hover:border-sky-300 transition"
              >
                <div className="text-2xl sm:text-3xl font-july font-bold text-[#2375b8]">
                  {t(st.value_bn, st.value_en)}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                  {t(st.label_bn, st.label_en)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS & CAMPAIGNS SECTION */}
      <section className="py-14 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#f0f7fd] text-[#2375b8] font-july font-bold text-xs sm:text-sm mb-2">
              {t("চলমান মানবিক তহবিল", "Active Humanitarian Funds")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-july font-bold text-[#0f4c75]">
              {t("আমাদের প্রকল্প ও কর্মসূচি", "Our Programs & Initiatives")}
            </h2>
          </div>
          <Link
            href="/donate"
            className="inline-flex items-center gap-1.5 text-[#2375b8] hover:text-[#0f4c75] font-july font-bold text-sm sm:text-base"
          >
            <span>{t("আরও দেখুন", "View All Programs")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-july font-bold text-sm whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#2375b8] text-white shadow-sm"
                  : "bg-[#f0f7fd] text-slate-700 hover:bg-sky-100"
              }`}
            >
              {t(cat.bn, cat.en)}
            </button>
          ))}
        </div>

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

      {/* ZAKAT SELF-RELIANCE CALLOUT BANNER */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-[#0f4c75] via-[#1b649e] to-[#1788bf] p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-july font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {t(
                  "শরীয়াহ বোর্ড অনুমোদিত যাকাত ব্যবস্থাপনা",
                  "Independent Shariah Board Supervised"
                )}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-july font-bold">
              {t(
                "আপনার যাকাত হোক দারিদ্র্য বিমোচন ও স্বাবলম্বীকরণের হাতিয়ার",
                "Make Your Zakat a Catalyst for Permanent Self-Reliance"
              )}
            </h2>
            <p className="text-sky-100 text-sm sm:text-base">
              {t(
                "সহজ যাকাত ক্যালকুলেটরের মাধ্যমে নিসাব অনুযায়ী আপনার প্রদেয় যাকাত হিসাব করুন এবং সেলাই মেশিন, ভ্যানগাড়ি ও ক্ষুদ্র ব্যবসার মাধ্যমে অসহায় পরিবারকে স্বাবলম্বী করুন।",
                "Use our interactive Zakat Calculator to compute your 2.5% obligation accurately and empower impoverished families with sustainable livelihoods."
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/zakat-calculator"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-july font-bold shadow-md transition"
            >
              <Calculator className="w-5 h-5" />
              <span>{t("যাকাত ক্যালকুলেটর", "Zakat Calculator")}</span>
            </Link>
            <Link
              href="/donate/zakat"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-sky-50 text-[#0f4c75] font-july font-bold shadow-md transition"
            >
              <Heart className="w-5 h-5 text-[#2375b8] fill-[#2375b8]" />
              <span>{t("যাকাত প্রদান করুন", "Pay Zakat Now")}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* NEWS & STORIES (মানবিক গল্প) */}
      <section className="py-14 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#f0f7fd] text-[#2375b8] font-july font-bold text-xs sm:text-sm mb-2">
              {t("পরিবর্তনের গল্প", "Impact Stories")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-july font-bold text-[#0f4c75]">
              {t("নিউজ & স্টোরিজ", "Humanitarian Stories")}
            </h2>
          </div>
          <Link
            href="/news-stories"
            className="inline-flex items-center gap-1.5 text-[#2375b8] font-july font-bold text-sm sm:text-base hover:underline"
          >
            <span>{t("আরও দেখুন", "See More")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(data?.stories || []).map((post) => (
            <Link
              key={post.id}
              href={`/news-stories/${post.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col"
            >
              <div className="h-52 overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover_image}
                  alt={t(post.title_bn, post.title_en)}
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
                    {t(post.title_bn, post.title_en)}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                    {t(post.excerpt_bn, post.excerpt_en)}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-july font-bold text-[#2375b8]">
                  {t("বিস্তারিত পড়ুন", "Read Story")}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED VIDEOS SECTION (আমাদের কার্যক্রম সম্পর্কে ভিডিও) */}
      <section className="py-14 px-4 bg-[#f6f9fc] border-y border-sky-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-[#2375b8] font-july font-bold text-xs sm:text-sm mb-2">
                {t("ভিডিও ডকুমেন্টারি", "Field Documentaries")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-july font-bold text-[#0f4c75]">
                {t("আমাদের কার্যক্রম সম্পর্কে ভিডিও", "Videos of Our Activities")}
              </h2>
            </div>
            <Link
              href="/mastul-media"
              className="inline-flex items-center gap-1.5 text-[#2375b8] font-july font-bold text-sm sm:text-base hover:underline"
            >
              <span>{t("আরও দেখুন", "All Videos")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(data?.videos || []).map((vid) => (
              <button
                key={vid.id}
                type="button"
                onClick={() => setPlayingVideo(vid)}
                className="group text-left bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition cursor-pointer"
              >
                <div className="relative h-52 bg-slate-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      vid.thumbnail_url ||
                      `https://img.youtube.com/vi/${vid.youtube_id}/hqdefault.jpg`
                    }
                    alt={t(vid.title_bn, vid.title_en)}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#2375b8] group-hover:bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/75 text-white text-xs font-mono">
                    {vid.duration}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-july font-bold text-base text-[#0f4c75] group-hover:text-[#2375b8] line-clamp-2">
                    {t(vid.title_bn, vid.title_en)}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST PRESS NEWS + LIVE VERIFIED DONORS */}
      <section className="py-14 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 cols: মাস্তুল নিউজ */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-july font-bold text-[#0f4c75]">
              {t("সাম্প্রতিক সংবাদ ও আপডেট", "Latest News & Updates")}
            </h2>
            <Link
              href="/news-stories"
              className="text-sm font-july font-bold text-[#2375b8] hover:underline"
            >
              {t("আরও দেখুন", "View All")} →
            </Link>
          </div>
          <div className="space-y-4">
            {(data?.news || []).map((item) => (
              <Link
                key={item.id}
                href={`/news-stories/${item.slug}`}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 shadow-xs transition group"
              >
                <div className="sm:w-48 h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.cover_image}
                    alt={t(item.title_bn, item.title_en)}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-[#2375b8] font-july font-bold">
                      {formatDate(item.published_at, lang)} • {item.author_name}
                    </span>
                    <h3 className="font-july font-bold text-lg text-[#0f4c75] group-hover:text-[#2375b8] mt-1">
                      {t(item.title_bn, item.title_en)}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {t(item.excerpt_bn, item.excerpt_en)}
                    </p>
                  </div>
                  <span className="text-xs font-july font-bold text-[#2375b8] mt-2">
                    {t("সম্পূর্ণ সংবাদ পড়ুন →", "Read Full News →")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right 4 cols: Live Verified Donor Wall + Volunteer CTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-july font-bold text-lg text-[#0f4c75]">
                {t("সাম্প্রতিক অনুদানসমূহ", "Recent Verified Donations")}
              </h3>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {(data?.recent_donations || []).map((don) => (
                <div
                  key={don.id}
                  className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#f0f7fd]/70 border border-sky-100 text-sm"
                >
                  <div className="min-w-0">
                    <div className="font-july font-bold text-slate-800 truncate">
                      {don.donor_name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {t(don.campaign_title_bn, don.campaign_title_en)}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-july font-bold text-[#2375b8]">
                      {formatBDT(don.amount, lang)}
                    </div>
                    <div className="text-[11px] uppercase text-slate-400">
                      {don.payment_method}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#2375b8] to-[#0f4c75] p-6 text-white space-y-3">
            <UserPlus className="w-8 h-8 text-sky-300" />
            <h3 className="font-july font-bold text-xl">
              {t("স্বেচ্ছাসেবক হিসেবে যুক্ত হোন", "Join as a Volunteer")}
            </h3>
            <p className="text-sm text-sky-100">
              {t(
                "দেশব্যাপী ৬৪ জেলায় ত্রাণ বিতরণ, মেডিকেল ক্যাম্প ও পথশিশু শিক্ষায় আমাদের সাথে কাঁধে কাঁধ মিলিয়ে কাজ করুন।",
                "Join thousands of dedicated youth volunteers serving across all 64 districts of Bangladesh."
              )}
            </p>
            <Link
              href="/be-a-volunteer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#0f4c75] font-july font-bold text-sm hover:bg-sky-50 transition"
            >
              <span>{t("নিবন্ধন ফর্ম পূরণ করুন", "Register Now")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Video Lightbox Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/15">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 text-white">
              <h3 className="font-july font-bold text-base truncate">
                {t(playingVideo.title_bn, playingVideo.title_en)}
              </h3>
              <button
                type="button"
                onClick={() => setPlayingVideo(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 cursor-pointer"
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
