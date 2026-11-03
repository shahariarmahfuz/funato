"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Calculator } from "lucide-react";
import { TeamMember } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function ShariahBoardPage() {
  const { t } = useLanguage();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tab, setTab] = useState<"all" | "shariah" | "executive">("all");

  useEffect(() => {
    apiFetch<TeamMember[]>("/api/public/team")
      .then(setMembers)
      .catch(() => {});
  }, []);

  const filtered =
    tab === "all" ? members : members.filter((m) => m.board_type === tab);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 font-july font-bold text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>{t("শরীয়াহ সুপারভাইজরি ও পরিচালনা পর্ষদ", "Shariah & Governance Board")}</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-july font-bold text-[#0f4c75]">
          {t("সদস্যবৃন্দ ও শরীয়াহ বোর্ড", "Board Members & Shariah Scholars")}
        </h1>
        <p className="text-slate-600">
          {t(
            "আমাদের যাকাত, সদকায়ে জারিয়া ও শেল্টারহোম ওয়াকফ তহবিলসমূহ বিজ্ঞ আলেম-ওলামাদের সমন্বয়ে গঠিত শরীয়াহ বোর্ডের নীতিমালা অনুযায়ী শতভাগ স্বচ্ছতার সাথে পরিচালিত হয়।",
            "All Zakat, Sadaqah Jariyah, and Shelterhome funds are audited and guided by qualified Islamic scholars to ensure strict Shariah compliance."
          )}
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {[
          { id: "all", bn: "সকল সদস্য", en: "All Members" },
          { id: "shariah", bn: "শরীয়াহ বোর্ড", en: "Shariah Board" },
          { id: "executive", bn: "নির্বাহী পর্ষদ", en: "Executive Board" },
        ].map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setTab(b.id as "all" | "shariah" | "executive")}
            className={`px-4 py-2 rounded-full font-july font-bold text-sm cursor-pointer ${
              tab === b.id
                ? "bg-[#2375b8] text-white"
                : "bg-[#f0f7fd] text-slate-700 hover:bg-sky-100"
            }`}
          >
            {t(b.bn, b.en)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-3 shadow-xs"
          >
            <div className="w-28 h-28 rounded-full overflow-hidden mx-auto bg-slate-100 border-2 border-sky-200">
              {m.photo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.photo_url}
                  alt={t(m.name_bn, m.name_en)}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <span className="inline-block text-xs px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 font-july font-bold">
              {m.board_type === "shariah"
                ? t("শরীয়াহ বোর্ড", "Shariah Board")
                : t("নির্বাহী পর্ষদ", "Executive")}
            </span>
            <h3 className="font-july font-bold text-xl text-[#0f4c75]">
              {t(m.name_bn, m.name_en)}
            </h3>
            <p className="text-sm font-semibold text-[#2375b8]">
              {t(m.role_bn, m.role_en)}
            </p>
            <p className="text-sm text-slate-600">{t(m.bio_bn, m.bio_en)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-amber-50 border border-amber-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-july font-bold text-xl text-amber-950">
            {t("যাকাত মাসআলা বা হিসাব সম্পর্কে জানতে চান?", "Need Zakat Calculation Assistance?")}
          </h3>
          <p className="text-sm text-amber-900 mt-1">
            {t(
              "আমাদের অনলাইন যাকাত ক্যালকুলেটর ব্যবহার করুন অথবা শরীয়াহ ডেস্কে যোগাযোগ করুন।",
              "Use our online Zakat Calculator or reach out to our Shariah advisory desk."
            )}
          </p>
        </div>
        <Link
          href="/zakat-calculator"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-july font-bold shrink-0"
        >
          <Calculator className="w-4 h-4" />
          <span>{t("যাকাত ক্যালকুলেটর", "Open Zakat Calculator")}</span>
        </Link>
      </div>
    </div>
  );
}
