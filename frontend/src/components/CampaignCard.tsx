"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Flame, Heart, Users } from "lucide-react";
import { Campaign } from "@/lib/types";
import { formatBDT, toBnDigits } from "@/lib/api";

const CATEGORY_NAMES_BN: Record<string, string> = {
  shelter: "শেল্টারহোম",
  food: "মেহমানখানা",
  zakat: "যাকাত",
  orphan: "এতিমখানা",
  emergency: "জরুরি ত্রাণ",
  sadaqah: "সদকায়ে জারিয়া",
  education: "শিক্ষা",
  health: "স্বাস্থ্য ও দাফন",
  environment: "বৃক্ষরোপণ",
  general: "সাধারণ তহবিল",
};

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const pct =
    campaign.goal_amount > 0
      ? Math.min(100, Math.round((campaign.raised_amount / campaign.goal_amount) * 100))
      : 0;

  const categoryLabel = CATEGORY_NAMES_BN[campaign.category] || campaign.category;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-sky-400 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Cover Image */}
        <Link href={`/donate/${campaign.slug}`} className="relative h-52 overflow-hidden block bg-slate-100">
          {campaign.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={campaign.cover_image}
              alt={campaign.name_bn}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2375b8] to-[#0f4c75]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {campaign.is_urgent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600 text-white font-july font-bold text-xs shadow-sm">
                <Flame className="w-3 h-3 fill-white" />
                জরুরি তহবিল
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full bg-white/95 text-[#0f4c75] font-july font-bold text-xs shadow-sm">
              {categoryLabel}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full font-medium">
              <Users className="w-3.5 h-3.5 text-sky-300" />
              {toBnDigits(campaign.donor_count)} জন দাতা
            </span>
            <span className="font-july font-bold bg-[#2375b8] px-2.5 py-1 rounded-full shadow-xs">
              {toBnDigits(pct)}% সম্পন্ন
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 space-y-2">
          <Link href={`/donate/${campaign.slug}`}>
            <h3 className="font-july font-bold text-lg text-[#0f4c75] group-hover:text-[#2375b8] transition line-clamp-2 leading-snug">
              {campaign.name_bn}
            </h3>
          </Link>
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {campaign.short_desc_bn}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2375b8] via-[#1788bf] to-emerald-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs mt-1.5 text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px]">সংগৃহীত</span>
              <span className="font-july font-bold text-sm text-[#0f4c75]">
                {formatBDT(campaign.raised_amount, "bn")}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">লক্ষ্যমাত্রা</span>
              <span className="font-july font-bold text-sm text-slate-700">
                {formatBDT(campaign.goal_amount, "bn")}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          <Link
            href={`/donate/${campaign.slug}`}
            className="col-span-3 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#2375b8] to-[#1788bf] hover:from-[#1b619c] hover:to-[#1374a6] text-white font-july font-bold text-sm shadow-xs hover:shadow-md transition cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>দান করুন</span>
          </Link>
          <Link
            href={`/donate/${campaign.slug}`}
            className="col-span-2 inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-[#f0f7fd] hover:bg-sky-100 text-[#2375b8] font-july font-bold text-sm transition cursor-pointer"
          >
            <span>বিস্তারিত</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
