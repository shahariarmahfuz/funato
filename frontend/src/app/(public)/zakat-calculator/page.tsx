"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calculator, CheckCircle2, Heart, Info, RotateCcw } from "lucide-react";
import { formatBDT } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function ZakatCalculatorPage() {
  const { lang, t, settings } = useLanguage();

  const [cash, setCash] = useState("");
  const [bank, setBank] = useState("");
  const [goldSilver, setGoldSilver] = useState("");
  const [investments, setInvestments] = useState("");
  const [businessGoods, setBusinessGoods] = useState("");
  const [receivables, setReceivables] = useState("");
  const [debts, setDebts] = useState("");
  const [nisab, setNisab] = useState(String(settings.nisab_bdt || 115000));

  const val = (s: string) => Math.max(0, Number(s) || 0);

  const totalAssets =
    val(cash) +
    val(bank) +
    val(goldSilver) +
    val(investments) +
    val(businessGoods) +
    val(receivables);

  const totalDebts = val(debts);
  const netWealth = Math.max(0, totalAssets - totalDebts);
  const nisabThreshold = val(nisab) || 115000;
  const isEligible = netWealth >= nisabThreshold;
  const payableZakat = isEligible ? Math.round(netWealth * 0.025) : 0;

  const resetAll = () => {
    setCash("");
    setBank("");
    setGoldSilver("");
    setInvestments("");
    setBusinessGoods("");
    setReceivables("");
    setDebts("");
  };

  const fields = [
    {
      label_bn: "হাতে গচ্ছিত নগদ অর্থ (টাকা)",
      label_en: "Cash in Hand (BDT)",
      value: cash,
      setter: setCash,
    },
    {
      label_bn: "ব্যাংক অ্যাকাউন্ট ও মোবাইল ওয়ালেটে জমা অর্থ",
      label_en: "Bank Savings & Mobile Wallets (BDT)",
      value: bank,
      setter: setBank,
    },
    {
      label_bn: "স্বর্ণ ও রৌপ্যের বর্তমান বিক্রয়মূল্য",
      label_en: "Current Market Value of Gold & Silver",
      value: goldSilver,
      setter: setGoldSilver,
    },
    {
      label_bn: "শেয়ার, সঞ্চয়পত্র ও বিনিয়োগের বর্তমান মূল্য",
      label_en: "Shares, FDR & Halal Investments",
      value: investments,
      setter: setInvestments,
    },
    {
      label_bn: "ব্যবসায়িক পণ্য ও মজুদের বর্তমান পাইকারি মূল্য",
      label_en: "Business Inventory & Trade Goods",
      value: businessGoods,
      setter: setBusinessGoods,
    },
    {
      label_bn: "অন্যের কাছে পাওনা নিশ্চিত ঋণ",
      label_en: "Recoverable Loans Given to Others",
      value: receivables,
      setter: setReceivables,
    },
  ];

  return (
    <div className="bg-[#FDFDFC] py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 font-july font-bold text-sm">
            <Calculator className="w-4 h-4" />
            <span>{t("শরীয়াহ সম্মত যাকাত হিসাব", "Shariah-Compliant Zakat Calculator")}</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-july font-bold text-[#0f4c75]">
            {t("সহজেই আপনার বার্ষিক যাকাত হিসাব করুন", "Calculate Your Annual Zakat Easily")}
          </h1>
          <p className="text-slate-600">
            {t(
              "সাড়ে ৭ ভরি স্বর্ণ অথবা সাড়ে ৫২ ভরি রৌপ্যের সমমূল্য (নিসাব) পরিমাণ যাকাতযোগ্য সম্পদ পূর্ণ এক চন্দ্রবছর স্থায়ী হলে মোট নিট সম্পদের ২.৫% যাকাত প্রদান ফরজ।",
              "If your net Zakatable wealth equals or exceeds the Nisab threshold for one lunar year, 2.5% is obligatory as Zakat."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-july font-bold text-xl text-[#0f4c75]">
                {t("আপনার যাকাতযোগ্য সম্পদের বিবরণ", "Your Zakatable Assets")}
              </h2>
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-1 text-xs font-july font-bold text-slate-500 hover:text-rose-600 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t("রিসেট", "Reset")}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((f, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-july font-bold text-slate-700 mb-1">
                    {t(f.label_bn, f.label_en)}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      ৳
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={f.value}
                      onChange={(e) => f.setter(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-xl border border-slate-300 pl-8 pr-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#2375b8] focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-july font-bold text-rose-700 mb-1">
                  {t(
                    "বাদ: তাৎক্ষণিক পরিশোধযোগ্য ঋণ / দায়",
                    "Less: Immediate Debts & Liabilities"
                  )}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400 font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={debts}
                    onChange={(e) => setDebts(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-rose-200 bg-rose-50/30 pl-8 pr-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-july font-bold text-amber-800 mb-1">
                  {t(
                    "বর্তমান নিসাব মূল্যমান (৫২.৫ ভরি রৌপ্য সমমান)",
                    "Current Silver Nisab Threshold (BDT)"
                  )}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={nisab}
                    onChange={(e) => setNisab(e.target.value)}
                    className="w-full rounded-xl border border-amber-300 bg-amber-50/40 pl-8 pr-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0f4c75] to-[#1788bf] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 lg:sticky lg:top-24">
            <h3 className="font-july font-bold text-2xl">
              {t("যাকাত হিসাবের ফলাফল", "Zakat Summary")}
            </h3>

            <div className="space-y-3 text-sm bg-white/10 rounded-2xl p-4">
              <div className="flex justify-between">
                <span className="text-sky-100">{t("মোট যাকাতযোগ্য সম্পদ", "Total Assets")}</span>
                <span className="font-july font-bold">{formatBDT(totalAssets, lang)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sky-100">{t("বাদ: ঋণ ও দায়", "Less: Liabilities")}</span>
                <span className="font-july font-bold">- {formatBDT(totalDebts, lang)}</span>
              </div>
              <div className="border-t border-white/15 pt-2 flex justify-between text-base">
                <span className="font-july font-bold">{t("নিট যাকাতযোগ্য সম্পদ", "Net Wealth")}</span>
                <span className="font-july font-bold text-amber-300">
                  {formatBDT(netWealth, lang)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-sky-200">
                <span>{t("নিসাব সীমা", "Nisab Threshold")}</span>
                <span>{formatBDT(nisabThreshold, lang)}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 text-slate-900 text-center space-y-2">
              <div className="text-xs font-july font-bold uppercase tracking-wider text-slate-500">
                {t("আপনার প্রদেয় মোট যাকাত (২.৫%)", "Total Payable Zakat (2.5%)")}
              </div>
              <div className="text-3xl sm:text-4xl font-july font-bold text-[#2375b8]">
                {formatBDT(payableZakat, lang)}
              </div>
              {isEligible ? (
                <div className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {t(
                      "আপনার সম্পদ নিসাব অতিক্রম করেছে — যাকাত প্রযোজ্য",
                      "Net wealth meets Nisab — Zakat is obligatory"
                    )}
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Info className="w-4 h-4" />
                  <span>
                    {t(
                      "নিট সম্পদ নিসাব সীমার নিচে রয়েছে",
                      "Net wealth is currently below Nisab"
                    )}
                  </span>
                </div>
              )}
            </div>

            <Link
              href={`/donate?fund=zakat&amount=${payableZakat > 0 ? payableZakat : 2500}`}
              className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-july font-bold text-base shadow-lg flex items-center justify-center gap-2 transition"
            >
              <Heart className="w-5 h-5 fill-slate-950" />
              <span>
                {payableZakat > 0
                  ? t(
                      `${formatBDT(payableZakat, lang)} যাকাত তহবিলে প্রদান করুন`,
                      `Pay ${formatBDT(payableZakat, lang)} to Zakat Fund`
                    )
                  : t("যাকাত তহবিলে দান করুন", "Donate to Zakat Fund")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
