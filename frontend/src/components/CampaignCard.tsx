"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { Campaign } from "@/lib/types";

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
  const categoryLabel = CATEGORY_NAMES_BN[campaign.category] || campaign.category;

  return (
    <div className="group bg-white rounded-none sm:rounded-xl border border-slate-200/90 hover:border-[#1d6fad]/60 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col justify-between">
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
            <div className="w-full h-full bg-gradient-to-br from-[#1d6fad] to-[#0a2540]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {campaign.is_urgent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-red-600 text-white font-july font-bold text-xs shadow-xs">
                <Flame className="w-3 h-3 fill-white" />
                জরুরি তহবিল
              </span>
            )}
            <span className="px-2.5 py-1 rounded-sm bg-white/95 text-[#0a2540] font-july font-bold text-xs shadow-xs">
              {categoryLabel}
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 space-y-2">
          <Link href={`/donate/${campaign.slug}`}>
            <h3 className="font-july font-bold text-lg text-slate-900 group-hover:text-[#1d6fad] transition line-clamp-2 leading-snug">
              {campaign.name_bn}
            </h3>
          </Link>
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {campaign.short_desc_bn}
          </p>
        </div>
      </div>

      {/* Clean Bottom Action: Only বিস্তারিত Button */}
      <div className="p-5 pt-0">
        <Link
          href={`/donate/${campaign.slug}`}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-sm bg-slate-50 hover:bg-[#1d6fad] text-slate-700 hover:text-white border border-slate-200/90 hover:border-[#1d6fad] font-july font-bold text-sm transition-all duration-200 shadow-2xs group-hover:border-[#1d6fad]"
        >
          <span>বিস্তারিত দেখুন</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
