"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { settings } = useLanguage();

  return (
    <div className="no-print">
      {/* Main Elegant Slate Navy Footer */}
      <footer className="bg-[#071626] text-slate-300 pt-14 pb-8 px-4 border-t border-slate-800">
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
            <Link href="/admin" className="hover:text-white transition">
              অ্যাডমিন প্যানেল
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
