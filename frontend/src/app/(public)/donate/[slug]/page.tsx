"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Heart,
  Users,
} from "lucide-react";
import { Campaign, PublicDonor } from "@/lib/types";
import { apiFetch, formatBDT, toBnDigits } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import DonationWidget from "@/components/DonationWidget";
import CampaignCard from "@/components/CampaignCard";

interface CampaignDetailResponse {
  campaign: Campaign;
  recent_donors: PublicDonor[];
  related_campaigns: Campaign[];
}

export default function CampaignDetailPage() {
  const params = useParams<{ slug: string }>();
  const { lang, t } = useLanguage();
  const [detail, setDetail] = useState<CampaignDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.slug) return;
    setLoading(true);
    apiFetch<CampaignDetailResponse>(`/api/public/campaigns/${params.slug}`)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="h-96 rounded-3xl bg-slate-100 animate-pulse" />
      </div>
    );
  }

  if (!detail?.campaign) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-2xl font-july font-bold text-slate-800">
          {t("তহবিলটি খুঁজে পাওয়া যায়নি", "Campaign Not Found")}
        </h1>
        <Link
          href="/donate"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2375b8] text-white font-july font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("সকল তহবিলে ফিরে যান", "Back to Programs")}</span>
        </Link>
      </div>
    );
  }

  const { campaign, recent_donors, related_campaigns } = detail;
  const pct =
    campaign.goal_amount > 0
      ? Math.min(100, Math.round((campaign.raised_amount / campaign.goal_amount) * 100))
      : 0;

  return (
    <div className="bg-[#FDFDFC]">
      {/* Breadcrumb + Top */}
      <div className="bg-[#f0f7fd] border-b border-sky-100 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/donate"
            className="inline-flex items-center gap-1.5 text-sm font-july font-bold text-[#2375b8] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("সকল কার্যক্রমসমূহ", "All Programs")}</span>
          </Link>
          <h1 className="text-2xl sm:text-4xl font-july font-bold text-[#0f4c75]">
            {t(campaign.name_bn, campaign.name_en)}
          </h1>
          <p className="text-slate-600 mt-1.5 max-w-3xl">
            {t(campaign.short_desc_bn, campaign.short_desc_en)}
          </p>
        </div>
      </div>

      {/* Main Content + Sticky Donation Form */}
      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols */}
        <div className="lg:col-span-7 space-y-8">
          {/* Cover + Progress */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="h-72 sm:h-96 bg-slate-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={campaign.cover_image}
                alt={t(campaign.name_bn, campaign.name_en)}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                  <Users className="w-4 h-4 text-[#2375b8]" />
                  {lang === "bn"
                    ? toBnDigits(campaign.donor_count)
                    : campaign.donor_count}{" "}
                  {t("জন দাতা অংশ নিয়েছেন", "Supporters Contributed")}
                </span>
                <span className="font-july font-bold text-[#2375b8]">
                  {lang === "bn" ? `${toBnDigits(pct)}%` : `${pct}%`}{" "}
                  {t("সম্পন্ন", "Funded")}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-sky-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2375b8] to-[#1788bf]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xs text-slate-400 block">
                    {t("মোট সংগৃহীত তহবিল", "Total Raised")}
                  </span>
                  <span className="font-july font-bold text-xl text-[#0f4c75]">
                    {formatBDT(campaign.raised_amount, lang)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">
                    {t("লক্ষ্যমাত্রা", "Target Goal")}
                  </span>
                  <span className="font-july font-bold text-xl text-slate-700">
                    {formatBDT(campaign.goal_amount, lang)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-july font-bold text-[#0f4c75]">
              {t("প্রকল্প পরিচিতি ও উদ্দেশ্য", "About This Initiative")}
            </h2>
            <div className="text-slate-700 whitespace-pre-line leading-relaxed text-base sm:text-lg">
              {t(campaign.description_bn, campaign.description_en)}
            </div>
          </div>

          {/* Expenditure Sectors */}
          {(campaign.expenditure_sector_bn || campaign.expenditure_sector_en) && (
            <div className="bg-[#f0f7fd] rounded-2xl border border-sky-200 p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-[#0f4c75]">
                <CheckCircle2 className="w-6 h-6 text-[#2375b8]" />
                <h3 className="text-xl font-july font-bold">
                  {t("এই তহবিলের ব্যয়ের খাতসমূহ", "Where Your Donation Goes")}
                </h3>
              </div>
              <div className="text-slate-700 whitespace-pre-line leading-relaxed">
                {t(campaign.expenditure_sector_bn, campaign.expenditure_sector_en)}
              </div>
            </div>
          )}

          {/* Quran & Hadith References (Just like Mastul's /donate/shelterhome) */}
          {(campaign.quran_hadith_bn || campaign.quran_hadith_en) && (
            <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-amber-900">
                <BookOpen className="w-6 h-6 text-amber-700" />
                <h3 className="text-xl font-july font-bold">
                  {t(
                    "আমরা কেন মানুষকে সাহায্য করবো? (কুরআন ও হাদিসের বাণী)",
                    "Scriptural Inspiration (Quran & Hadith)"
                  )}
                </h3>
              </div>
              <blockquote className="text-slate-800 whitespace-pre-line leading-relaxed italic border-l-4 border-amber-400 pl-4">
                {t(campaign.quran_hadith_bn, campaign.quran_hadith_en)}
              </blockquote>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Sticky Donation Box + Recent Donors */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <DonationWidget campaigns={[campaign]} lockedCampaign={campaign} />

          {recent_donors.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <h3 className="font-july font-bold text-base text-[#0f4c75] flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>
                  {t("এই প্রকল্পে সাম্প্রতিক দাতাবৃন্দ", "Recent Supporters")}
                </span>
              </h3>
              <div className="space-y-2.5">
                {recent_donors.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between text-sm px-3 py-2 rounded-xl bg-slate-50"
                  >
                    <span className="font-semibold text-slate-800">{d.donor_name}</span>
                    <span className="font-july font-bold text-[#2375b8]">
                      {formatBDT(d.amount, lang)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Campaigns */}
      {related_campaigns.length > 0 && (
        <section className="max-w-7xl mx-auto py-12 px-4 border-t border-slate-200">
          <h2 className="text-2xl font-july font-bold text-[#0f4c75] mb-6">
            {t("অন্যান্য চলমান তহবিলসমূহ", "Other Ongoing Initiatives")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related_campaigns.map((rc) => (
              <CampaignCard key={rc.id} campaign={rc} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
