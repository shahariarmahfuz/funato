"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Heart,
  Printer,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Donation } from "@/lib/types";
import { apiFetch, formatBDT, formatDate } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

const METHOD_NAMES_BN: Record<string, string> = {
  bkash: "বিকাশ",
  nagad: "নগদ",
  rocket: "রকেট",
  bank_transfer: "ব্যাংক ট্রান্সফার / কার্ড",
};

export default function DonationReceiptPage() {
  const params = useParams<{ receiptNo: string }>();
  const { settings } = useLanguage();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.receiptNo) return;
    apiFetch<Donation>(`/api/public/donations/receipt/${params.receiptNo}`)
      .then(setDonation)
      .catch(() => setDonation(null))
      .finally(() => setLoading(false));
  }, [params?.receiptNo]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4">
        <div className="h-96 rounded-3xl bg-slate-100 animate-pulse" />
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-2xl font-july font-bold text-slate-800">
          রশিদ খুঁজে পাওয়া যায়নি
        </h1>
        <Link
          href="/donate"
          className="inline-block px-6 py-2.5 rounded-xl bg-[#2375b8] text-white font-july font-bold"
        >
          তহবিল পাতায় ফিরে যান
        </Link>
      </div>
    );
  }

  const paymentMethodLabel =
    METHOD_NAMES_BN[donation.payment_method] || donation.payment_method;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl border-2 border-sky-200 shadow-xl overflow-hidden">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-[#0f4c75] to-[#1788bf] p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 flex items-center justify-center overflow-hidden shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="ভ্রাতৃত্ব ফাউন্ডেশন লোগো"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-july font-bold">
                {settings.org_name_bn}
              </h1>
              <p className="text-xs text-sky-100">
                অফিসিয়াল ডিজিটাল অনুদান রশিদ
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-xs text-sky-200">রশিদ নম্বর</div>
            <div className="font-mono font-bold text-lg">{donation.receipt_no}</div>
          </div>
        </div>

        {/* Status Banner */}
        <div className="px-6 sm:px-8 pt-6">
          {donation.status === "completed" ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-july font-bold">
                  জাযাকাল্লাহু খাইরান! আপনার অনুদান সফলভাবে গৃহীত ও ভেরিফায়েড হয়েছে।
                </div>
                <div className="text-xs text-emerald-700">
                  নিচের রশিদটি আয়কর রেয়াত (Tax Rebate) দাবির জন্য প্রিন্ট বা সংরক্ষণ করতে পারেন।
                </div>
              </div>
            </div>
          ) : donation.status === "pending" ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-900">
              <Clock className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <div className="font-july font-bold">
                  আপনার অনুদানের তথ্য জমা হয়েছে (ভেরিফিকেশন অপেক্ষমাণ)
                </div>
                <div className="text-xs text-amber-800">
                  আমাদের অর্থ বিভাগ আপনার ট্রানজেকশন আইডি যাচাই করার সাথে সাথে এই রশিদটি স্বয়ংক্রিয়ভাবে ভেরিফায়েড দেখাবে।
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-900">
              <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
              <div className="font-july font-bold">
                এই ট্রানজেকশনটি বাতিল করা হয়েছে
              </div>
            </div>
          )}
        </div>

        {/* Receipt Table */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-200 text-sm">
            <div>
              <span className="text-slate-400 block text-xs">দাতার নাম</span>
              <span className="font-july font-bold text-base text-slate-900">
                {donation.donor_name}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">মোবাইল নম্বর</span>
              <span className="font-semibold text-slate-800">{donation.donor_phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">নির্বাচিত তহবিল</span>
              <span className="font-july font-bold text-[#2375b8]">
                {donation.campaign_title_bn}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">তারিখ</span>
              <span className="font-semibold text-slate-800">
                {formatDate(donation.created_at, "bn")}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">পেমেন্ট মাধ্যম</span>
              <span className="font-july font-bold text-slate-800">
                {paymentMethodLabel}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">ট্রানজেকশন আইডি (TrxID)</span>
              <span className="font-mono font-bold text-slate-800">
                {donation.transaction_id || "—"}
              </span>
            </div>
          </div>

          {/* Total Box */}
          <div className="flex items-center justify-between p-5 rounded-2xl bg-[#f0f7fd] border border-sky-200">
            <div>
              <span className="text-xs text-slate-500 block">
                মোট প্রদত্ত অনুদানের পরিমাণ
              </span>
              <span className="text-xs text-emerald-700 font-medium inline-flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {settings.tax_rebate_notice_bn}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-july font-bold text-[#0f4c75]">
              {formatBDT(donation.amount, "bn")}
            </div>
          </div>

          <div className="text-xs text-slate-500 border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>{settings.address_bn}</span>
            <span>হটলাইন: {settings.phone_primary}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 no-print">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f4c75] hover:bg-[#195d96] text-white font-july font-bold text-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>রশিদ প্রিন্ট / সংরক্ষণ করুন</span>
            </button>
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#2375b8] font-july font-bold text-sm"
            >
              আরও একটি তহবিলে দান করুন →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
