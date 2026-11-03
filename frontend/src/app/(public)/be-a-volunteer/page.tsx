"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, UserPlus } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function VolunteerRegistrationPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    district: "ঢাকা",
    occupation: "",
    blood_group: "O+",
    skills: "",
    availability: "সপ্তাহান্তে / জরুরি দুর্যোগে",
    why_join: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/api/public/volunteers", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to register");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f0f7fd] text-[#2375b8] font-july font-bold text-sm">
          <UserPlus className="w-4 h-4" />
          <span>{t("মানবতার সেবক হোন", "Serve Humanity With Us")}</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-july font-bold text-[#0f4c75]">
          {t("স্বেচ্ছাসেবক নিবন্ধন ফর্ম", "Volunteer Registration Form")}
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          {t(
            "বন্যা ত্রাণ, মেহমানখানায় খাবার পরিবেশন, পথশিশুদের পাঠদান কিংবা ফ্রি মেডিকেল ক্যাম্পে স্বেচ্ছাসেবী হিসেবে যুক্ত হতে নিচের ফর্মটি পূরণ করুন।",
            "Join our nationwide volunteer network supporting disaster relief, daily meals, street-child education, and medical camps."
          )}
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-july font-bold text-emerald-950">
            {t(
              "অভিনন্দন! আপনার স্বেচ্ছাসেবক আবেদন সফলভাবে জমা হয়েছে।",
              "Thank You! Your Volunteer Application Has Been Received."
            )}
          </h2>
          <p className="text-emerald-800 text-sm">
            {t(
              "আমাদের ভলান্টিয়ার কো-অর্ডিনেটর শীঘ্রই আপনার মোবাইল নম্বরে যোগাযোগ করবেন।",
              "Our volunteer coordinator will contact you shortly after reviewing your profile."
            )}
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-july font-bold text-slate-700 mb-1">
                {t("পূর্ণ নাম *", "Full Name *")}
              </label>
              <input
                type="text"
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-july font-bold text-slate-700 mb-1">
                {t("মোবাইল নম্বর *", "Mobile Number *")}
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="01XXXXXXXXX"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-july font-bold text-slate-700 mb-1">
                {t("ইমেইল", "Email")}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-july font-bold text-slate-700 mb-1">
                {t("জেলা", "District")}
              </label>
              <input
                type="text"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-july font-bold text-slate-700 mb-1">
                {t("পেশা / শিক্ষাপ্রতিষ্ঠান", "Occupation / Institution")}
              </label>
              <input
                type="text"
                value={form.occupation}
                onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-july font-bold text-slate-700 mb-1">
                {t("রক্তের গ্রুপ", "Blood Group")}
              </label>
              <select
                value={form.blood_group}
                onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
              >
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-july font-bold text-slate-700 mb-1">
              {t("দক্ষতা বা আগ্রহের ক্ষেত্র", "Skills & Areas of Interest")}
            </label>
            <input
              type="text"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder={t(
                "যেমন: ত্রাণ বিতরণ, চিকিৎসা সেবা, শিক্ষকতা, গ্রাফিক ডিজাইন...",
                "e.g., Field relief, medical aid, teaching, media..."
              )}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-july font-bold text-slate-700 mb-1">
              {t("কেন স্বেচ্ছাসেবক হতে চান?", "Why do you want to volunteer?")}
            </label>
            <textarea
              rows={3}
              value={form.why_join}
              onChange={(e) => setForm({ ...form, why_join: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-[#2375b8] hover:bg-[#195d96] text-white font-july font-bold text-base flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
            <span>{t("স্বেচ্ছাসেবক হিসেবে নিবন্ধন করুন", "Submit Volunteer Application")}</span>
          </button>
        </form>
      )}
    </div>
  );
}
