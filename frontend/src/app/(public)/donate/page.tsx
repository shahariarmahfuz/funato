"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Campaign } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import CampaignCard from "@/components/CampaignCard";
import DonationWidget from "@/components/DonationWidget";

function DonateDirectoryContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const preselectedFund = searchParams.get("fund") || undefined;
  const preselectedAmount = Number(searchParams.get("amount") || 0) || undefined;

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Campaign[]>("/api/public/campaigns")
      .then(setCampaigns)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = campaigns.filter((c) => {
    const matchCat = category === "all" || c.category === category;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      c.name_bn.toLowerCase().includes(q) ||
      c.name_en.toLowerCase().includes(q) ||
      c.short_desc_bn.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const categories = [
    { id: "all", bn: "সকল তহবিল", en: "All Funds" },
    { id: "shelter", bn: "শেল্টারহোম", en: "Shelterhome" },
    { id: "food", bn: "মেহমানখানা", en: "Mehmankhana" },
    { id: "zakat", bn: "যাকাত", en: "Zakat" },
    { id: "orphan", bn: "এতিমখানা", en: "Orphanage" },
    { id: "emergency", bn: "জরুরি ত্রাণ", en: "Emergency" },
    { id: "sadaqah", bn: "সদকায়ে জারিয়া", en: "Sadaqah" },
    { id: "education", bn: "শিক্ষা", en: "Education" },
    { id: "health", bn: "স্বাস্থ্য ও দাফন", en: "Health & Burial" },
    { id: "environment", bn: "বৃক্ষরোপণ", en: "Tree Plantation" },
  ];

  return (
    <div className="bg-[#FDFDFC]">
      {/* Page Banner + Quick Donate */}
      <section className="bg-gradient-to-b from-[#e8f4fc] to-[#FDFDFC] py-10 px-4 border-b border-sky-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-sky-100 text-[#2375b8] font-july font-bold text-sm">
              {t("মানবিক কার্যক্রম ও তহবিলসমূহ", "Humanitarian Programs & Funds")}
            </span>
            <h1 className="text-3xl sm:text-4xl font-july font-bold text-[#0f4c75] leading-snug">
              {t(
                "আপনার পছন্দের মানবিক তহবিলে নিরাপদে অনুদান প্রদান করুন",
                "Contribute Securely to Any Humanitarian Fund"
              )}
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {t(
                "যাকাত, সদকায়ে জারিয়া, এতিম স্পন্সরশিপ, মেহমানখানা কিংবা জরুরি ত্রাণ—প্রতিটি তহবিলের অর্থ নির্ধারিত খাতে শতভাগ স্বচ্ছতার সাথে ব্যয় করা হয়। অনুদান সম্পন্ন হলেই পাবেন অফিসিয়াল ডিজিটাল রশিদ।",
                "Whether Zakat, Sadaqah Jariyah, Orphan Sponsorship, or Daily Community Meals—every contribution goes directly to its designated fund with an instant official receipt."
              )}
            </p>
          </div>
          <div className="lg:col-span-5">
            {campaigns.length > 0 && (
              <DonationWidget
                campaigns={campaigns}
                defaultCampaignSlug={preselectedFund}
                defaultAmount={preselectedAmount}
              />
            )}
          </div>
        </div>
      </section>

      {/* Filter & Campaign Grid */}
      <section className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`px-3.5 py-2 rounded-full font-july font-bold text-sm whitespace-nowrap transition cursor-pointer ${
                  category === cat.id
                    ? "bg-[#2375b8] text-white"
                    : "bg-[#f0f7fd] text-slate-700 hover:bg-sky-100"
                }`}
              >
                {t(cat.bn, cat.en)}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("প্রকল্প খুঁজুন...", "Search programs...")}
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-[#2375b8] focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="p-16 text-center">Loading...</div>}>
      <DonateDirectoryContent />
    </Suspense>
  );
}
