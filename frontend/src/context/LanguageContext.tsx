"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SiteSettings } from "@/lib/types";
import { apiFetch } from "@/lib/api";

const FALLBACK_SETTINGS: SiteSettings = {
  org_name_bn: "ভ্রাতৃত্ব ফাউন্ডেশন",
  org_name_en: "Bhratritto Foundation",
  tagline_bn: "মানবতার কল্যাণে নিবেদিত একটি অলাভজনক দাতব্য সংস্থা",
  tagline_en: "মানবতার কল্যাণে নিবেদিত একটি অলাভজনক দাতব্য সংস্থা",
  about_short_bn:
    "ভ্রাতৃত্ব ফাউন্ডেশন একটি অলাভজনক ও মানবিক দাতব্য সংস্থা যা এতিম শিশু, অসহায় প্রবীণ, ক্ষুধার্ত মানুষের আহার, যাকাতভিত্তিক স্বাবলম্বীকরণ ও দুর্যোগ মোকাবিলায় নিরলস কাজ করছে।",
  about_short_en:
    "ভ্রাতৃত্ব ফাউন্ডেশন একটি অলাভজনক ও মানবিক দাতব্য সংস্থা যা এতিম শিশু, অসহায় প্রবীণ, ক্ষুধার্ত মানুষের আহার, যাকাতভিত্তিক স্বাবলম্বীকরণ ও দুর্যোগ মোকাবিলায় নিরলস কাজ করছে।",
  tax_rebate_notice_bn: "এই ফাউন্ডেশনে দান করলে সরকারি বিধি অনুযায়ী আয়কর রেয়াত (Tax Rebate) পাবেন।",
  tax_rebate_notice_en: "এই ফাউন্ডেশনে দান করলে সরকারি বিধি অনুযায়ী আয়কর রেয়াত (Tax Rebate) পাবেন।",
  phone_primary: "+880 1730-482279",
  phone_hotline: "+880 1321-146626",
  email: "info@foundation.org",
  address_bn: "৭/৩, আলিফ টাওয়ার (লেভেল ১), ব্লক ডি, লালমাটিয়া, ঢাকা-১২০৭",
  address_en: "৭/৩, আলিফ টাওয়ার (লেভেল ১), ব্লক ডি, লালমাটিয়া, ঢাকা-১২০৭",
  reg_info_bn: "১৮৬০ সালের সোসাইটিজ রেজিস্ট্রেশন অ্যাক্টের অধীনে বাংলাদেশ সরকার কর্তৃক নিবন্ধিত।",
  reg_info_en: "১৮৬০ সালের সোসাইটিজ রেজিস্ট্রেশন অ্যাক্টের অধীনে বাংলাদেশ সরকার কর্তৃক নিবন্ধিত।",
  sadaqah_bank: {
    bank_name: "The City Bank PLC",
    acc_name: "Bhratritto Foundation",
    acc_no: "1401873750001",
    branch: "New Market Branch",
    swift: "CIBLBDDH",
    routing: "225263527",
  },
  zakat_bank: {
    bank_name: "Islami Bank Bangladesh PLC",
    acc_name: "Bhratritto Foundation (Zakat)",
    acc_no: "20502050204462112",
    branch: "Dhanmondi Branch",
    swift: "IBBLBDDH",
    routing: "125261182",
  },
  mobile_banking: [
    { label: "বিকাশ (মার্চেন্ট পেমেন্ট)", number: "01730482278", type: "payment" },
    { label: "নগদ (মার্চেন্ট পেমেন্ট)", number: "01730482279", type: "payment" },
    { label: "বিকাশ (সেন্ড মানি)", number: "01730482280", type: "send_money" },
    { label: "রকেট (সেন্ড মানি)", number: "016747470160", type: "send_money" },
  ],
  impact_stats: [
    { value_bn: "১৫ লক্ষ+", value_en: "১৫ লক্ষ+", label_bn: "মোট উপকারভোগী মানুষ", label_en: "মোট উপকারভোগী মানুষ" },
    { value_bn: "১,৫০০+", value_en: "১,৫০০+", label_bn: "দৈনিক মেহমানখানায় আহার", label_en: "দৈনিক মেহমানখানায় আহার" },
    { value_bn: "৩,২০০+", value_en: "৩,২০০+", label_bn: "যাকাত স্বাবলম্বী পরিবার", label_en: "যাকাত স্বাবলম্বী পরিবার" },
    { value_bn: "৬৪ জেলা", value_en: "৬৪ জেলা", label_bn: "মানবিক কার্যক্রম বিস্তৃতি", label_en: "মানবিক কার্যক্রম বিস্তৃতি" },
  ],
  nisab_bdt: 115000,
};

interface LanguageContextValue {
  lang: "bn";
  setLang: (l: "bn") => void;
  t: (bn: string, en?: string) => string;
  settings: SiteSettings;
  refreshSettings: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "bn",
  setLang: () => {},
  t: (bn) => bn,
  settings: FALLBACK_SETTINGS,
  refreshSettings: async () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SETTINGS);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("foundation_lang", "bn");
    }
    apiFetch<Partial<SiteSettings>>("/api/public/settings")
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  const refreshSettings = async () => {
    try {
      const data = await apiFetch<Partial<SiteSettings>>("/api/public/settings");
      if (data && Object.keys(data).length > 0) {
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch {
      // ignore
    }
  };

  const t = (bn: string, _en?: string) => bn;

  return (
    <LanguageContext.Provider value={{ lang: "bn", setLang: () => {}, t, settings, refreshSettings }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
