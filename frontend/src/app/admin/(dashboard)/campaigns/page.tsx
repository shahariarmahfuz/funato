"use client";

import React, { useEffect, useState } from "react";
import { Edit3, Plus, Trash2, X } from "lucide-react";
import { adminFetch, formatBDT } from "@/lib/api";
import { Campaign } from "@/lib/types";

const EMPTY_FORM = {
  slug: "",
  name_bn: "",
  name_en: "",
  category: "general",
  short_desc_bn: "",
  short_desc_en: "",
  description_bn: "",
  description_en: "",
  quran_hadith_bn: "",
  quran_hadith_en: "",
  expenditure_sector_bn: "",
  expenditure_sector_en: "",
  payment_guideline_bn: "",
  payment_guideline_en: "",
  amount_options: "500,1000,2000,5000",
  goal_amount: 1000000,
  raised_amount: 0,
  donor_count: 0,
  cover_image: "",
  is_featured: true,
  is_urgent: false,
  is_active: true,
  sort_order: 0,
};

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    adminFetch<Campaign[]>("/api/admin/campaigns")
      .then(setCampaigns)
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, sort_order: campaigns.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (c: Campaign) => {
    setEditingId(c.id);
    setForm({
      slug: c.slug,
      name_bn: c.name_bn,
      name_en: c.name_en,
      category: c.category,
      short_desc_bn: c.short_desc_bn,
      short_desc_en: c.short_desc_en,
      description_bn: c.description_bn,
      description_en: c.description_en,
      quran_hadith_bn: c.quran_hadith_bn,
      quran_hadith_en: c.quran_hadith_en,
      expenditure_sector_bn: c.expenditure_sector_bn,
      expenditure_sector_en: c.expenditure_sector_en,
      payment_guideline_bn: c.payment_guideline_bn,
      payment_guideline_en: c.payment_guideline_en,
      amount_options: c.amount_options,
      goal_amount: c.goal_amount,
      raised_amount: c.raised_amount,
      donor_count: c.donor_count,
      cover_image: c.cover_image,
      is_featured: c.is_featured,
      is_urgent: c.is_urgent,
      is_active: c.is_active,
      sort_order: c.sort_order,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await adminFetch(`/api/admin/campaigns/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await adminFetch("/api/admin/campaigns", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      setModalOpen(false);
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving campaign");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি এই তহবিলটি মুছে ফেলতে নিশ্চিত?")) return;
    await adminFetch(`/api/admin/campaigns/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-july font-bold text-[#0f4c75]">
            তহবিল ও প্রকল্পসমূহ পরিচালনা ({campaigns.length})
          </h1>
          <p className="text-xs text-slate-500">
            নতুন অনুদান প্রকল্প তৈরি, তথ্য সম্পাদনা, লক্ষ্যমাত্রা ও কুরআন/হাদিস রেফারেন্স আপডেট করুন
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2375b8] hover:bg-[#195d96] text-white font-july font-bold text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন তহবিল যোগ করুন</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-july">
              <tr>
                <th className="px-4 py-3">ক্রম</th>
                <th className="px-4 py-3">প্রকল্প / তহবিল</th>
                <th className="px-4 py-3">ক্যাটাগরি</th>
                <th className="px-4 py-3">সংগৃহীত / লক্ষ্যমাত্রা</th>
                <th className="px-4 py-3">স্ট্যাটাস</th>
                <th className="px-4 py-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs">{c.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="font-july font-bold text-slate-900">{c.name_bn}</div>
                    <div className="text-xs text-slate-500">
                      {c.name_en} • <span className="font-mono">/{c.slug}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#2375b8] text-xs font-july font-bold uppercase">
                      {c.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div className="font-july font-bold text-slate-900">
                      {formatBDT(c.raised_amount, "bn")}
                    </div>
                    <div className="text-slate-400">
                      লক্ষ্য: {formatBDT(c.goal_amount, "bn")}
                    </div>
                  </td>
                  <td className="px-4 py-3 space-x-1">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        c.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {c.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </span>
                    {c.is_urgent && (
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-xs font-bold">
                        জরুরি
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="p-1.5 rounded-lg bg-sky-50 text-[#2375b8] hover:bg-sky-100 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xl font-july font-bold text-[#0f4c75]">
                {editingId ? "তহবিল সম্পাদনা করুন" : "নতুন তহবিল তৈরি করুন"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-july font-bold mb-1">
                    নাম (বাংলা) *
                  </label>
                  <input
                    required
                    value={form.name_bn}
                    onChange={(e) => setForm({ ...form, name_bn: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-july font-bold mb-1">
                    Name (English) *
                  </label>
                  <input
                    required
                    value={form.name_en}
                    onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-july font-bold mb-1">
                    URL Slug * (e.g., winter-blanket)
                  </label>
                  <input
                    required
                    value={form.slug}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-july font-bold mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white"
                  >
                    {[
                      "shelter",
                      "food",
                      "zakat",
                      "orphan",
                      "emergency",
                      "sadaqah",
                      "education",
                      "health",
                      "environment",
                      "general",
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-july font-bold mb-1">
                    লক্ষ্যমাত্রা (Goal BDT)
                  </label>
                  <input
                    type="number"
                    value={form.goal_amount}
                    onChange={(e) =>
                      setForm({ ...form, goal_amount: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-july font-bold mb-1">
                    সংগৃহীত পরিমাণ (Raised BDT)
                  </label>
                  <input
                    type="number"
                    value={form.raised_amount}
                    onChange={(e) =>
                      setForm({ ...form, raised_amount: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-july font-bold mb-1">
                    অ্যামাউন্ট অপশন (কমা দিয়ে, যেমন 500,1000,5000)
                  </label>
                  <input
                    value={form.amount_options}
                    onChange={(e) => setForm({ ...form, amount_options: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-july font-bold mb-1">
                    কভার ইমেজ URL
                  </label>
                  <input
                    value={form.cover_image}
                    onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-july font-bold mb-1">
                    সংক্ষিপ্ত বিবরণ (বাংলা)
                  </label>
                  <textarea
                    rows={2}
                    value={form.short_desc_bn}
                    onChange={(e) => setForm({ ...form, short_desc_bn: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-july font-bold mb-1">
                    Short Description (EN)
                  </label>
                  <textarea
                    rows={2}
                    value={form.short_desc_en}
                    onChange={(e) => setForm({ ...form, short_desc_en: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-july font-bold mb-1">
                  বিস্তারিত বিবরণ (বাংলা)
                </label>
                <textarea
                  rows={3}
                  value={form.description_bn}
                  onChange={(e) => setForm({ ...form, description_bn: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-july font-bold mb-1">
                    ব্যয়ের খাত (বাংলা)
                  </label>
                  <textarea
                    rows={2}
                    value={form.expenditure_sector_bn}
                    onChange={(e) =>
                      setForm({ ...form, expenditure_sector_bn: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-july font-bold mb-1">
                    কুরআন ও হাদিস রেফারেন্স (বাংলা)
                  </label>
                  <textarea
                    rows={2}
                    value={form.quran_hadith_bn}
                    onChange={(e) =>
                      setForm({ ...form, quran_hadith_bn: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-2">
                <label className="inline-flex items-center gap-2 text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  />
                  <span>সক্রিয় (Active)</span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  />
                  <span>হোমপেজে ফিচার্ড</span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-bold text-rose-700">
                  <input
                    type="checkbox"
                    checked={form.is_urgent}
                    onChange={(e) => setForm({ ...form, is_urgent: e.target.checked })}
                  />
                  <span>জরুরি ব্যাজ (Urgent)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-july font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-[#2375b8] text-white font-july font-bold cursor-pointer"
                >
                  {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
