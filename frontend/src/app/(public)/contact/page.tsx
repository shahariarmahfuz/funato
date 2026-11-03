"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { t, settings } = useLanguage();
  const [form, setForm] = useState({
    inquiry_type: "general",
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch("/api/public/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-block px-3.5 py-1 rounded-full bg-[#f0f7fd] text-[#2375b8] font-july font-bold text-sm">
          {t("সার্বক্ষণিক যোগাযোগ", "Get in Touch")}
        </span>
        <h1 className="text-3xl sm:text-4xl font-july font-bold text-[#0f4c75]">
          {t("আমাদের সাথে যোগাযোগ করুন", "Contact Our Foundation")}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#f0f7fd] rounded-3xl border border-sky-200 p-6 sm:p-8 space-y-6">
            <h2 className="font-july font-bold text-2xl text-[#0f4c75]">
              {t("প্রধান কার্যালয়", "Headquarters")}
            </h2>
            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#2375b8] shrink-0 mt-0.5" />
                <div>
                  <div className="font-july font-bold text-slate-900">
                    {t("ঠিকানা", "Address")}
                  </div>
                  <div>{t(settings.address_bn, settings.address_en)}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#2375b8] shrink-0 mt-0.5" />
                <div>
                  <div className="font-july font-bold text-slate-900">
                    {t("হটলাইন ও ডোনার সাপোর্ট", "Hotline & Donor Care")}
                  </div>
                  <div>{settings.phone_primary}</div>
                  <div>{settings.phone_hotline}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#2375b8] shrink-0 mt-0.5" />
                <div>
                  <div className="font-july font-bold text-slate-900">
                    {t("ইমেইল", "Official Email")}
                  </div>
                  <div>{settings.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {sent ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-2xl font-july font-bold text-emerald-950">
                {t("আপনার বার্তা সফলভাবে পাঠানো হয়েছে!", "Message Sent Successfully!")}
              </h3>
              <p className="text-sm text-emerald-800">
                {t(
                  "আমাদের প্রতিনিধি দ্রুততম সময়ে আপনার সাথে যোগাযোগ করবেন।",
                  "Our support desk will respond to your inquiry shortly."
                )}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-july font-bold text-slate-700 mb-1">
                    {t("বিষয়ের ধরন", "Inquiry Type")}
                  </label>
                  <select
                    value={form.inquiry_type}
                    onChange={(e) => setForm({ ...form, inquiry_type: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                  >
                    <option value="general">
                      {t("সাধারণ জিজ্ঞাসা", "General Inquiry")}
                    </option>
                    <option value="shelterhome">
                      {t("শেল্টারহোম আজীবন সদস্যপদ ফর্ম", "Shelterhome Membership")}
                    </option>
                    <option value="sponsor_child">
                      {t("এতিম শিশু স্পন্সরশিপ", "Sponsor an Orphan Child")}
                    </option>
                    <option value="zakat_advisory">
                      {t("যাকাত ও শরীয়াহ পরামর্শ", "Zakat & Shariah Advisory")}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-july font-bold text-slate-700 mb-1">
                    {t("আপনার নাম *", "Your Name *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-july font-bold text-slate-700 mb-1">
                    {t("মোবাইল নম্বর *", "Mobile Number *")}
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-july font-bold text-slate-700 mb-1">
                    {t("ইমেইল", "Email")}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-july font-bold text-slate-700 mb-1">
                  {t("বিষয়", "Subject")}
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-july font-bold text-slate-700 mb-1">
                  {t("বিস্তারিত বার্তা *", "Message *")}
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-[#2375b8] hover:bg-[#195d96] text-white font-july font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{t("বার্তা পাঠান", "Send Message")}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
