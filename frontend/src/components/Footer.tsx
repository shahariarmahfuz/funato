"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Check,
  Copy,
  Heart,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { settings } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sadaqah = settings.sadaqah_bank;
  const zakat = settings.zakat_bank;

  return (
    <div className="no-print">
      {/* Signature Pre-Footer: অনুদানের অন্যান্য উপায় */}
      <section className="bg-slate-50/90 border-t border-slate-200/80 py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block px-3 py-1 rounded-sm bg-sky-100/80 text-[#1d6fad] border border-sky-200/50 font-july font-bold text-sm mb-2">
              ব্যাংক ও মোবাইল ব্যাংকিং
            </span>
            <h2 className="text-2xl sm:text-3xl font-july font-bold text-[#0a2540]">
              অনুদানের অন্যান্য উপায়
            </h2>
            <p className="text-slate-600 mt-1.5 text-sm sm:text-base">
              সরাসরি ব্যাংক অ্যাকাউন্ট অথবা বিকাশ, নগদ ও রকেটের মাধ্যমে অনুদান ও যাকাত পাঠাতে পারেন
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* কলাম ১: সাদাকা ও সাধারণ ব্যাংক হিসাব */}
            <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200/90 hover:shadow-sm transition flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-lg bg-sky-50 text-[#1d6fad] flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-july font-bold text-[#0a2540]">
                      সাদাকা ও সাধারণ তহবিল
                    </h3>
                    <p className="text-xs text-slate-500">
                      অফিসিয়াল ব্যাংক অ্যাকাউন্ট
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-700 bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="font-july font-bold text-base text-[#1d6fad]">
                    {sadaqah?.bank_name}
                  </div>
                  <div>
                    <span className="text-slate-500">হিসাবের নাম:</span>{" "}
                    <span className="font-semibold text-slate-800">{sadaqah?.acc_name}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-md border border-slate-200">
                    <div>
                      <span className="text-xs text-slate-400 block">হিসাব নম্বর:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {sadaqah?.acc_no}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(sadaqah?.acc_no || "", "sadaqah")}
                      className="text-xs px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-july font-bold inline-flex items-center gap-1 cursor-pointer transition"
                    >
                      {copiedKey === "sadaqah" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>কপি</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-600">
                    <div>শাখা: {sadaqah?.branch}</div>
                    <div>সুইফট কোড: {sadaqah?.swift}</div>
                    <div className="col-span-2">রাউটিং নম্বর: {sadaqah?.routing}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* কলাম ২: যাকাত ব্যাংক হিসাব */}
            <div className="bg-white rounded-xl p-6 shadow-xs border border-emerald-200/80 hover:shadow-sm transition flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-july font-bold text-emerald-950">
                      যাকাত তহবিল
                    </h3>
                    <p className="text-xs text-emerald-700 font-medium">
                      শরীয়াহ সুপারভাইজড ব্যাংক হিসাব
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-700 bg-emerald-50/40 rounded-lg p-4 border border-emerald-100">
                  <div className="font-july font-bold text-base text-emerald-800">
                    {zakat?.bank_name}
                  </div>
                  <div>
                    <span className="text-slate-500">হিসাবের নাম:</span>{" "}
                    <span className="font-semibold text-slate-800">{zakat?.acc_name}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-md border border-emerald-200">
                    <div>
                      <span className="text-xs text-slate-400 block">হিসাব নম্বর:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {zakat?.acc_no}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(zakat?.acc_no || "", "zakat")}
                      className="text-xs px-2.5 py-1.5 rounded-md bg-emerald-100/70 hover:bg-emerald-200 text-emerald-800 font-july font-bold inline-flex items-center gap-1 cursor-pointer transition"
                    >
                      {copiedKey === "zakat" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>কপি</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-600">
                    <div>শাখা: {zakat?.branch}</div>
                    <div>সুইফট কোড: {zakat?.swift}</div>
                    <div className="col-span-2">রাউটিং নম্বর: {zakat?.routing}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* কলাম ৩: মোবাইল ব্যাংকিং */}
            <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200/90 hover:shadow-sm transition flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-july font-bold text-[#0a2540]">
                      মোবাইল ব্যাংকিং
                    </h3>
                    <p className="text-xs text-slate-500">
                      বিকাশ • নগদ • রকেট
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {(settings.mobile_banking || []).map((mb: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-sm"
                    >
                      <div>
                        <span className="text-xs text-slate-500 block">{mb.label}</span>
                        <span className="font-mono font-bold text-slate-800">
                          {mb.number}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText(mb.number, `mb-${idx}`)}
                        className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-sky-300 text-slate-700 font-july font-bold inline-flex items-center gap-1 cursor-pointer transition"
                      >
                        {copiedKey === `mb-${idx}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>কপি</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>কপি</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/donate"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#1d6fad] hover:bg-[#165a8e] text-white font-july font-bold text-sm shadow-xs transition"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>অনলাইনে প্রদান করুন — এখানে দান করুন</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Elegant Slate Navy Footer */}
      <footer className="bg-[#071626] text-slate-300 pt-14 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          {/* Org Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 shadow-xs border border-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="ভ্রাতৃত্ব ফাউন্ডেশন লোগো"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-july font-bold text-xl text-white">
                {settings.org_name_bn}
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {settings.about_short_bn}
            </p>
            <div className="space-y-2 text-sm text-slate-300 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-1" />
                <span>{settings.address_bn}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{settings.phone_primary}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          {/* মেনু */}
          <div>
            <h4 className="font-july font-bold text-white text-lg mb-4">
              মেনু
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about-mastul" className="hover:text-sky-300 transition">
                  মাস্তুল সম্পর্কে
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-sky-300 transition">
                  কার্যক্রমসমূহ ও তহবিল
                </Link>
              </li>
              <li>
                <Link href="/news-stories" className="hover:text-sky-300 transition">
                  নিউজ & স্টোরিজ
                </Link>
              </li>
              <li>
                <Link href="/mastul-media" className="hover:text-sky-300 transition">
                  ভিডিও গ্যালারি
                </Link>
              </li>
              <li>
                <Link href="/shariah-board" className="hover:text-sky-300 transition">
                  সদস্যবৃন্দ ও শরিয়াহ বোর্ড
                </Link>
              </li>
            </ul>
          </div>

          {/* যুক্ত হোন */}
          <div>
            <h4 className="font-july font-bold text-white text-lg mb-4">
              যুক্ত হোন
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/be-a-volunteer" className="hover:text-sky-300 transition">
                  স্বেচ্ছাসেবক নিবন্ধন
                </Link>
              </li>
              <li>
                <Link href="/zakat-calculator" className="hover:text-sky-300 transition">
                  যাকাত ক্যালকুলেটর
                </Link>
              </li>
              <li>
                <Link href="/donate/shelterhome" className="hover:text-sky-300 transition">
                  শেল্টারহোম আজীবন সদস্যপদ
                </Link>
              </li>
              <li>
                <Link href="/gov-tax-rebate" className="hover:text-sky-300 transition">
                  আয়কর রেয়াত ও রশিদ যাচাই
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sky-300 transition">
                  যোগাযোগ করুন
                </Link>
              </li>
            </ul>
          </div>

          {/* রেজিস্ট্রেশন ও অ্যাকশন */}
          <div className="space-y-4">
            <h4 className="font-july font-bold text-white text-lg">
              আইনি নিবন্ধন ও স্বচ্ছতা
            </h4>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed space-y-2">
              <p>{settings.reg_info_bn}</p>
              <p className="text-amber-300">
                {settings.tax_rebate_notice_bn}
              </p>
            </div>
            <Link
              href="/donate"
              className="inline-flex w-full items-center justify-center gap-2 py-3 rounded-xl bg-[#1d6fad] hover:bg-[#165a8e] text-white font-july font-bold shadow-md transition"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>মানবতার সেবায় দান করুন</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {settings.org_name_bn}। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-4">
            <Link href="/gov-tax-rebate" className="hover:text-white transition">
              রশিদ যাচাই
            </Link>
            <Link href="/admin" className="hover:text-white transition">
              অ্যাডমিন প্যানেল
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
