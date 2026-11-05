"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Award, CheckCircle2, Eye, Heart, ShieldCheck, Target } from "lucide-react";
import { TeamMember } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { t, settings } = useLanguage();
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    apiFetch<TeamMember[]>("/api/public/team")
      .then(setMembers)
      .catch(() => {});
  }, []);

  return (
    <div className="bg-[#FDFDFC] py-12 px-4 space-y-14">
      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center space-y-4">
        <span className="inline-block px-3.5 py-1 rounded-full bg-[#f0f7fd] text-[#2375b8] font-july font-bold text-sm">
          {t("আমাদের পরিচিতি", "Who We Are")}
        </span>
        <h1 className="text-3xl sm:text-5xl font-july font-bold text-[#0f4c75]">
          {t(settings.org_name_bn, settings.org_name_en)}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {t(settings.about_short_bn, settings.about_short_en)}
        </p>
      </section>

      {/* Story + Mission/Vision */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-9 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#2375b8] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-july font-bold text-[#0f4c75]">
            {t("আমাদের পথচলা ও লক্ষ্য (Mission)", "Our Journey & Mission")}
          </h2>
          <p className="text-slate-700 leading-relaxed">
            {t(
              "২০১২ সালে ধানমন্ডির রবীন্দ্র সরোবরে সুবিধাবঞ্চিত পথশিশুদের খোলা আকাশের নিচে পাঠদানের একটি ক্ষুদ্র প্রয়াস থেকে যাত্রা শুরু হয়। সময়ের পরিক্রমায় আজ এতিমখানা, ইসলামিক শেল্টারহোম কমপ্লেক্স, দৈনিক মেহমানখানা, যাকাতভিত্তিক স্বাবলম্বীকরণ, ফ্রি অ্যাম্বুলেন্স ও দাফন-কাফন সেবার মাধ্যমে দেশের ৬৪ জেলায় মানবিক সহায়তা পৌঁছে দেওয়া হচ্ছে।",
              "What began in 2012 as a small open-air footpath school for street children in Dhaka has grown into a nationwide humanitarian institution operating across all 64 districts with orphanages, community kitchens, Shariah-guided Zakat empowerment, free ambulances, and disaster relief."
            )}
          </p>
        </div>

        <div className="bg-[#f0f7fd] rounded-3xl border border-sky-200 p-7 sm:p-9 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#2375b8] flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-july font-bold text-[#0f4c75]">
            {t("আমাদের রূপকল্প ও স্বচ্ছতা (Vision & Governance)", "Vision & Accountability")}
          </h2>
          <ul className="space-y-2.5 text-slate-700">
            {[
              t(
                "এনজিও বিষয়ক ব্যুরো, সমাজসেবা অধিদপ্তর ও জয়েন্ট স্টক কোম্পানিজ কর্তৃক নিবন্ধিত",
                "Registered with NGO Affairs Bureau, Dept. of Social Services & RJSC"
              ),
              t(
                "স্বতন্ত্র শরীয়াহ সুপারভাইজরি বোর্ডের প্রত্যক্ষ তত্ত্বাবধানে যাকাত সংগ্রহ ও বণ্টন",
                "Strict Zakat governance under an independent Shariah Supervisory Board"
              ),
              t(
                "বার্ষিক বহিঃনিরীক্ষা (External Audit) এবং দাতাদের জন্য আয়কর রেয়াত সনদ সুবিধা",
                "Annual external financial audits & NBR Income Tax Rebate eligibility"
              ),
              t(
                "ত্রাণনির্ভরতা কমিয়ে প্রতিটি দরিদ্র পরিবারকে স্থায়ীভাবে উপার্জনক্ষম করে গড়ে তোলা",
                "Transitioning families from aid dependency to dignified self-reliance"
              ),
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#2375b8] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Leadership & Shariah Preview */}
      {members.length > 0 && (
        <section className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-july font-bold text-[#0f4c75]">
              {t("নেতৃত্ব ও শরীয়াহ উপদেষ্টা পর্ষদ", "Leadership & Shariah Board")}
            </h2>
            <Link
              href="/shariah-board"
              className="text-sm font-july font-bold text-[#2375b8] hover:underline"
            >
              {t("সকল সদস্য দেখুন →", "View Full Board →")}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-5 text-center space-y-3"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-slate-100 border-2 border-sky-200">
                  {m.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.photo_url}
                      alt={t(m.name_bn, m.name_en)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#2375b8] font-bold text-2xl">
                      {m.name_en[0]}
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-[11px] uppercase px-2.5 py-0.5 rounded-full bg-sky-50 text-[#2375b8] font-july font-bold">
                    {m.board_type === "shariah"
                      ? t("শরীয়াহ বোর্ড", "Shariah Board")
                      : t("নির্বাহী পর্ষদ", "Executive")}
                  </span>
                  <h3 className="font-july font-bold text-lg text-[#0f4c75] mt-1.5">
                    {t(m.name_bn, m.name_en)}
                  </h3>
                  <p className="text-xs text-[#2375b8] font-semibold">
                    {t(m.role_bn, m.role_en)}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    {t(m.bio_bn, m.bio_en)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-[#0f4c75] to-[#1788bf] p-8 sm:p-10 text-white text-center space-y-4">
        <Award className="w-10 h-10 text-amber-300 mx-auto" />
        <h2 className="text-2xl sm:text-3xl font-july font-bold">
          {t("মানবিক বাংলাদেশ গড়ার অভিযাত্রায় শরিক হোন", "Partner With Us for Humanity")}
        </h2>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#0f4c75] font-july font-bold hover:bg-slate-50 transition"
          >
            <Heart className="w-4 h-4 fill-[#2375b8] text-[#2375b8]" />
            <span>{t("অনুদান প্রদান করুন", "Donate Now")}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
