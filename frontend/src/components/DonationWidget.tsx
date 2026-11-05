"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Heart,
  Loader2,
  ShieldCheck,
  Smartphone,
  CreditCard,
} from "lucide-react";
import { Campaign, Donation } from "@/lib/types";
import { apiFetch, formatBDT, toBnDigits } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

interface DonationWidgetProps {
  campaigns: Campaign[];
  defaultCampaignSlug?: string;
  defaultAmount?: number;
  lockedCampaign?: Campaign;
  compact?: boolean;
}

export default function DonationWidget({
  campaigns,
  defaultCampaignSlug,
  defaultAmount,
  lockedCampaign,
  compact = false,
}: DonationWidgetProps) {
  const { settings } = useLanguage();
  const router = useRouter();

  const initialSlug =
    lockedCampaign?.slug ||
    defaultCampaignSlug ||
    campaigns[0]?.slug ||
    "shelterhome";

  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug);
  const [amount, setAmount] = useState<string>(
    defaultAmount ? String(defaultAmount) : "1000"
  );
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("bkash");
  const [checkoutMode, setCheckoutMode] = useState<"instant" | "manual">("instant");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lockedCampaign) {
      setSelectedSlug(lockedCampaign.slug);
    } else if (defaultCampaignSlug) {
      setSelectedSlug(defaultCampaignSlug);
    }
  }, [lockedCampaign, defaultCampaignSlug]);

  useEffect(() => {
    if (defaultAmount && defaultAmount > 0) {
      setAmount(String(Math.round(defaultAmount)));
    }
  }, [defaultAmount]);

  const activeCampaign = useMemo(() => {
    if (lockedCampaign) return lockedCampaign;
    return campaigns.find((c) => c.slug === selectedSlug) || campaigns[0];
  }, [lockedCampaign, campaigns, selectedSlug]);

  const amountPresets = useMemo(() => {
    const raw = activeCampaign?.amount_options || "500,1000,2000,5000";
    return raw
      .replace(/"/g, "")
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n) && n > 0);
  }, [activeCampaign]);

  const handleCampaignChange = (slug: string) => {
    setSelectedSlug(slug);
    const found = campaigns.find((c) => c.slug === slug);
    if (found?.amount_options) {
      const first = Number(found.amount_options.replace(/"/g, "").split(",")[0]);
      if (first > 0 && !defaultAmount) setAmount(String(first));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount < 10) {
      setError("অনুগ্রহ করে ন্যূনতম ১০ টাকা পরিমাণ লিখুন");
      return;
    }
    if (checkoutMode === "manual" && !transactionId.trim()) {
      setError("ম্যানুয়াল ভেরিফিকেশনের জন্য ট্রানজেকশন আইডি (TrxID) লিখুন");
      return;
    }

    setSubmitting(true);
    try {
      const created = await apiFetch<Donation>("/api/public/donations", {
        method: "POST",
        body: JSON.stringify({
          campaign_id: activeCampaign?.id ?? null,
          campaign_slug: activeCampaign?.slug ?? selectedSlug,
          donor_name: donorName.trim(),
          donor_phone: donorPhone.trim(),
          donor_email: donorEmail.trim() || null,
          amount: numericAmount,
          donation_type: activeCampaign?.category === "zakat" ? "zakat" : "one_time",
          payment_method: paymentMethod,
          sender_number: checkoutMode === "manual" ? senderNumber : null,
          transaction_id: checkoutMode === "manual" ? transactionId : null,
          is_anonymous: isAnonymous,
          note: note.trim() || null,
          instant_checkout: checkoutMode === "instant",
        }),
      });
      router.push(`/donation/receipt/${created.receipt_no}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "অনুদান সম্পন্ন করতে সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-none shadow-sm sm:shadow-md border-y sm:border border-slate-200/90 overflow-hidden w-full max-w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a2540] to-[#0f3d64] px-4 sm:px-6 py-4 text-white">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-july font-bold">
            {lockedCampaign
              ? `${lockedCampaign.name_bn}-এ অনুদান দিন`
              : `${settings.org_name_bn}-কে অনুদান দিন`}
          </h2>
          <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
            <Heart className="w-4 h-4 fill-rose-300 text-rose-300" />
          </div>
        </div>
        <p className="text-xs text-sky-200/90 mt-0.5">
          শতভাগ স্বচ্ছতা ও শরীয়াহ নীতিমালা অনুসরণে পরিচালিত
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
        {/* Fund Selection */}
        {!lockedCampaign && (
          <div>
            <label className="block text-sm font-july font-bold text-slate-700 mb-1">
              তহবিল নির্বাচন করুন <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedSlug}
              onChange={(e) => handleCampaignChange(e.target.value)}
              className="w-full rounded-sm border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-[#2375b8] focus:bg-white focus:outline-none"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name_bn}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Amount Presets */}
        <div>
          <label className="block text-sm font-july font-bold text-slate-700 mb-1.5">
            অনুদানের পরিমাণ (টাকা) <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2 mb-2.5">
            {amountPresets.slice(0, 4).map((preset) => {
              const selected = Number(amount) === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(String(preset))}
                  className={`py-2 px-2 rounded-sm font-july font-bold text-xs sm:text-sm border transition cursor-pointer ${
                    selected
                      ? "bg-[#2375b8] text-white border-[#2375b8] shadow-xs"
                      : "bg-[#f0f7fd] text-[#0f4c75] border-sky-200 hover:border-[#2375b8]"
                  }`}
                >
                  {formatBDT(preset, "bn")}
                </button>
              );
            })}
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-july font-bold text-slate-500">
              ৳
            </span>
            <input
              type="number"
              min={10}
              step="any"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="অন্যান্য পরিমাণ লিখুন"
              className="w-full rounded-sm border border-slate-300 pl-8 pr-4 py-2.5 text-base font-bold text-slate-900 focus:border-[#2375b8] focus:outline-none"
            />
          </div>
        </div>

        {/* Checkout Mode Toggle */}
        <div>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-sm bg-slate-100 text-xs font-july font-bold">
            <button
              type="button"
              onClick={() => setCheckoutMode("instant")}
              className={`py-2 rounded-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
                checkoutMode === "instant"
                  ? "bg-white text-[#2375b8] shadow-xs"
                  : "text-slate-600"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>অনলাইন পেমেন্ট</span>
            </button>
            <button
              type="button"
              onClick={() => setCheckoutMode("manual")}
              className={`py-2 rounded-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
                checkoutMode === "manual"
                  ? "bg-white text-[#2375b8] shadow-xs"
                  : "text-slate-600"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>সেন্ড মানি (TrxID)</span>
            </button>
          </div>
        </div>

        {/* Payment Method Pills */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {[
            { id: "bkash", label: "বিকাশ", color: "border-pink-300 text-pink-700 bg-pink-50" },
            { id: "nagad", label: "নগদ", color: "border-orange-300 text-orange-700 bg-orange-50" },
            { id: "rocket", label: "রকেট", color: "border-purple-300 text-purple-700 bg-purple-50" },
            { id: "bank_transfer", label: "ব্যাংক / কার্ড", color: "border-sky-300 text-sky-800 bg-sky-50" },
          ].map((pm) => (
            <button
              key={pm.id}
              type="button"
              onClick={() => setPaymentMethod(pm.id)}
              className={`py-1.5 px-1 sm:px-2 rounded-sm text-[11px] sm:text-xs font-july font-bold border transition cursor-pointer truncate ${
                paymentMethod === pm.id
                  ? `${pm.color} ring-2 ring-[#2375b8]/40`
                  : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
              }`}
            >
              {pm.label}
            </button>
          ))}
        </div>

        {/* Manual TrxID Fields */}
        {checkoutMode === "manual" && (
          <div className="p-3 rounded-sm bg-amber-50 border border-amber-200 space-y-2.5 text-xs">
            <p className="text-amber-900 font-medium">
              প্রথমে আমাদের নাম্বারে ({settings.mobile_banking?.[0]?.number || "01730482278"}) টাকা পাঠিয়ে নিচে TrxID দিন:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                placeholder="প্রেরকের নম্বর (যেমন 017...)"
                className="rounded-sm border border-amber-300 bg-white px-3 py-2 text-sm text-slate-800"
              />
              <input
                type="text"
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="ট্রানজেকশন আইডি (TrxID) *"
                className="rounded-sm border border-amber-300 bg-white px-3 py-2 text-sm text-slate-800"
              />
            </div>
          </div>
        )}

        {/* Donor Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-july font-bold text-slate-700 mb-1">
              নাম <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              className="w-full rounded-sm border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-[#2375b8] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-july font-bold text-slate-700 mb-1">
              মোবাইল নম্বর <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={donorPhone}
              onChange={(e) => setDonorPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full rounded-sm border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-[#2375b8] focus:outline-none"
            />
          </div>
        </div>

        {!compact && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="ইমেইল (ঐচ্ছিক - রশিদের জন্য)"
              className="w-full rounded-sm border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-[#2375b8] focus:outline-none"
            />
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="দোয়া বা মন্তব্য (ঐচ্ছিক)"
              className="w-full rounded-sm border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-[#2375b8] focus:outline-none"
            />
          </div>
        )}

        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="rounded border-slate-300 text-[#2375b8]"
          />
          <span>
            ডোনার তালিকায় আমার নাম গোপন রাখুন (জনৈক দাতা)
          </span>
        </label>

        {error && (
          <div className="p-3 rounded-sm bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-5 rounded-sm bg-gradient-to-r from-[#2375b8] to-[#1788bf] hover:from-[#1b619c] hover:to-[#1374a6] text-white font-july font-bold text-base shadow-md flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>প্রক্রিয়াকরণ হচ্ছে...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>
                দান করুন (৳ {toBnDigits(Number(amount || 0).toLocaleString("en-IN"))})
              </span>
            </>
          )}
        </button>

        {/* Mastul Tax Rebate Notice */}
        <div className="pt-1 text-center text-xs text-slate-600 flex items-center justify-center gap-1.5 flex-wrap">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>দান করলে কর মওকুফ পাবেন।</span>
          <Link
            href="/gov-tax-rebate"
            className="text-[#2375b8] font-july font-bold hover:underline"
          >
            বিস্তারিত জানতে ক্লিক করুন।
          </Link>
        </div>
      </form>
    </div>
  );
}
