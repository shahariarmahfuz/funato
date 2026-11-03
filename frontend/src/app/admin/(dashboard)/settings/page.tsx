"use client";

import React, { useEffect, useState } from "react";
import { Check, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/api";
import { SiteSettings } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminSettingsPage() {
  const { refreshSettings } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
  });
  const [pwStatus, setPwStatus] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<SiteSettings>("/api/admin/settings")
      .then(setSettings)
      .catch(() => {});
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await adminFetch("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify({ settings }),
      });
      await refreshSettings();
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwStatus(null);
    try {
      await adminFetch("/api/admin/auth/password", {
        method: "PUT",
        body: JSON.stringify(passwords),
      });
      setPwStatus("পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!");
      setPasswords({ current_password: "", new_password: "" });
    } catch (err: unknown) {
      setPwStatus(err instanceof Error ? err.message : "Failed");
    }
  };

  if (!settings) {
    return <div className="p-8 text-center text-slate-400">লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-july font-bold text-[#0f4c75]">
          সাইট ব্র্যান্ডিং, ব্যাংক ও মোবাইল ব্যাংকিং সেটিংস
        </h1>
        <p className="text-xs text-slate-500">
          ফাউন্ডেশনের নাম, ঠিকানা, সাদাকা ও যাকাত ব্যাংক হিসাব এবং বিকাশ/নগদ নম্বর এখান থেকে পরিবর্তন করলে সাথে সাথে পুরো ওয়েবসাইটে আপডেট হবে
        </p>
      </div>

      <form onSubmit={saveSettings} className="space-y-6 text-sm">
        {/* Branding & Contact */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-july font-bold text-lg text-[#0f4c75]">
            ১. ফাউন্ডেশন পরিচিতি ও যোগাযোগ তথ্য
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-july font-bold mb-1">
                সংস্থার নাম (বাংলা)
              </label>
              <input
                value={settings.org_name_bn}
                onChange={(e) =>
                  setSettings({ ...settings, org_name_bn: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-july font-bold mb-1">
                Organization Name (English)
              </label>
              <input
                value={settings.org_name_en}
                onChange={(e) =>
                  setSettings({ ...settings, org_name_en: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-july font-bold mb-1">
                প্রধান ফোন
              </label>
              <input
                value={settings.phone_primary}
                onChange={(e) =>
                  setSettings({ ...settings, phone_primary: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-july font-bold mb-1">
                হটলাইন নম্বর
              </label>
              <input
                value={settings.phone_hotline}
                onChange={(e) =>
                  setSettings({ ...settings, phone_hotline: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-july font-bold mb-1">ইমেইল</label>
              <input
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-july font-bold mb-1">
                যাকাত নিসাব সীমা (টাকা)
              </label>
              <input
                type="number"
                value={settings.nisab_bdt}
                onChange={(e) =>
                  setSettings({ ...settings, nisab_bdt: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-july font-bold mb-1">
              ঠিকানা (বাংলা)
            </label>
            <input
              value={settings.address_bn}
              onChange={(e) =>
                setSettings({ ...settings, address_bn: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h2 className="font-july font-bold text-lg text-[#0f4c75]">
              ২. সাদাকা ব্যাংক হিসাব
            </h2>
            {(["bank_name", "acc_name", "acc_no", "branch", "swift", "routing"] as const).map(
              (field) => (
                <input
                  key={field}
                  placeholder={field}
                  value={settings.sadaqah_bank?.[field] || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sadaqah_bank: {
                        ...settings.sadaqah_bank,
                        [field]: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              )
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h2 className="font-july font-bold text-lg text-amber-900">
              ৩. যাকাত ব্যাংক হিসাব
            </h2>
            {(["bank_name", "acc_name", "acc_no", "branch", "swift", "routing"] as const).map(
              (field) => (
                <input
                  key={field}
                  placeholder={field}
                  value={settings.zakat_bank?.[field] || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      zakat_bank: {
                        ...settings.zakat_bank,
                        [field]: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              )
            )}
          </div>
        </div>

        {/* Mobile Banking Numbers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-july font-bold text-lg text-[#0f4c75]">
              ৪. মোবাইল ব্যাংকিং নম্বরসমূহ (bKash / Nagad / Rocket)
            </h2>
            <button
              type="button"
              onClick={() =>
                setSettings({
                  ...settings,
                  mobile_banking: [
                    ...(settings.mobile_banking || []),
                    { label: "bKash (Send Money)", number: "", type: "send_money" },
                  ],
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-[#2375b8] text-xs font-july font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন নম্বর যোগ করুন</span>
            </button>
          </div>
          <div className="space-y-2.5">
            {(settings.mobile_banking || []).map((mb, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  value={mb.label}
                  onChange={(e) => {
                    const next = [...settings.mobile_banking];
                    next[idx] = { ...next[idx], label: e.target.value };
                    setSettings({ ...settings, mobile_banking: next });
                  }}
                  placeholder="Label (e.g. bKash Payment)"
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2"
                />
                <input
                  value={mb.number}
                  onChange={(e) => {
                    const next = [...settings.mobile_banking];
                    next[idx] = { ...next[idx], number: e.target.value };
                    setSettings({ ...settings, mobile_banking: next });
                  }}
                  placeholder="017XXXXXXXX"
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2 font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = settings.mobile_banking.filter((_, i) => i !== idx);
                    setSettings({ ...settings, mobile_banking: next });
                  }}
                  className="p-2 rounded-lg bg-rose-50 text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2375b8] hover:bg-[#195d96] text-white font-july font-bold text-base cursor-pointer"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>সকল সেটিংস সংরক্ষণ করুন</span>
          </button>
          {savedMsg && (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-july font-bold">
              <Check className="w-4 h-4" />
              সেটিংস সফলভাবে আপডেট হয়েছে!
            </span>
          )}
        </div>
      </form>

      {/* Admin Password Update */}
      <form
        onSubmit={changePassword}
        className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-sm"
      >
        <h2 className="font-july font-bold text-lg text-[#0f4c75]">
          ৫. অ্যাডমিন পাসওয়ার্ড পরিবর্তন
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="password"
            required
            placeholder="বর্তমান পাসওয়ার্ড"
            value={passwords.current_password}
            onChange={(e) =>
              setPasswords({ ...passwords, current_password: e.target.value })
            }
            className="rounded-xl border border-slate-300 px-3 py-2"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="নতুন পাসওয়ার্ড (ন্যূনতম ৬ অক্ষর)"
            value={passwords.new_password}
            onChange={(e) =>
              setPasswords({ ...passwords, new_password: e.target.value })
            }
            className="rounded-xl border border-slate-300 px-3 py-2"
          />
        </div>
        {pwStatus && <div className="text-xs font-bold text-[#2375b8]">{pwStatus}</div>}
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#0f4c75] text-white font-july font-bold cursor-pointer"
        >
          পাসওয়ার্ড আপডেট করুন
        </button>
      </form>
    </div>
  );
}
