"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FileCheck2, Search, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TaxRebateAndReceiptVerifyPage() {
  const { t, settings } = useLanguage();
  const router = useRouter();
  const [receiptNo, setReceiptNo] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (receiptNo.trim()) {
      router.push(`/donation/receipt/${encodeURIComponent(receiptNo.trim())}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-10">
      <div className="bg-white rounded-3xl border border-sky-200 p-7 sm:p-10 shadow-xs space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-july font-bold text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>{t("সরকারি আয়কর রেয়াত সুবিধা", "Government Tax Rebate Benefit")}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-july font-bold text-[#0f4c75]">
          {t(
            `${settings.org_name_bn}-এ দান করলে আয়কর রেয়াত (Tax Rebate) সুবিধা`,
            `Claim Income Tax Rebate on Donations to ${settings.org_name_en}`
          )}
        </h1>
        <p className="text-slate-700 leading-relaxed text-base sm:text-lg">
          {t(
            "জাতীয় রাজস্ব বোর্ড (NBR)-এর প্রজ্ঞাপন (SRO) অনুযায়ী আমাদের ফাউন্ডেশনে প্রদত্ত যাকাত, সদকা ও মানবিক অনুদানের বিপরীতে ব্যক্তি ও প্রাতিষ্ঠানিক করদাতাগণ বার্ষিক আয়কর রিটার্নে কর রেয়াত (Tax Rebate) সুবিধা গ্রহণ করতে পারেন।",
            "Individual and corporate taxpayers in Bangladesh are eligible to claim statutory Income Tax Rebates on Zakat and charitable donations made through official banking or digital channels, backed by our verified donation receipt."
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {[
            {
              title_bn: "১. ব্যাংক বা ডিজিটাল পেমেন্ট",
              title_en: "1. Digital or Bank Transfer",
              desc_bn: "বিকাশ, নগদ, কার্ড বা ব্যাংক ট্রান্সফারের মাধ্যমে অনুদান সম্পন্ন করুন।",
              desc_en: "Complete your contribution via bKash, Nagad, Card, or Bank.",
            },
            {
              title_bn: "২. ভেরিফায়েড রশিদ ডাউনলোড",
              title_en: "2. Download Official Receipt",
              desc_bn: "অনুদানের সাথে সাথেই ইউনিক রশিদ নম্বরসহ ডিজিটাল রশিদ সংগ্রহ করুন।",
              desc_en: "Save your unique FDN digital receipt as PDF.",
            },
            {
              title_bn: "৩. রিটার্নে সংযুক্ত করুন",
              title_en: "3. Attach to Tax Return",
              desc_bn: "বার্ষিক আয়কর রিটার্নের সাথে অনুদান রশিদ সংযুক্ত করে কর মওকুফ পান।",
              desc_en: "Submit the receipt with your annual NBR return.",
            },
          ].map((step, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[#f0f7fd] border border-sky-100">
              <div className="font-july font-bold text-[#0f4c75]">
                {t(step.title_bn, step.title_en)}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {t(step.desc_bn, step.desc_en)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Receipt Lookup Tool */}
      <div className="bg-gradient-to-br from-[#0f4c75] to-[#1788bf] rounded-3xl p-7 sm:p-10 text-white space-y-4">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-6 h-6 text-amber-300" />
          <h2 className="text-2xl font-july font-bold">
            {t("ডোনেশন রশিদ যাচাই ও ডাউনলোড করুন", "Verify & Download Donation Receipt")}
          </h2>
        </div>
        <p className="text-sm text-sky-100">
          {t(
            "আপনার রশিদ নম্বর (যেমন: FDN-20261103-A101) নিচে লিখে সার্চ করুন:",
            "Enter your receipt number (e.g., FDN-20261103-A101) to view and print:"
          )}
        </p>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={receiptNo}
            onChange={(e) => setReceiptNo(e.target.value)}
            placeholder="FDN-20261103-A101"
            className="flex-1 rounded-xl bg-white px-4 py-3 text-slate-900 font-mono text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-july font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{t("রশিদ খুঁজুন", "Verify Receipt")}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
