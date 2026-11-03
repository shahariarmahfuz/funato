"use client";

import React, { useEffect, useState } from "react";
import { Edit3, Plus, Trash2, X } from "lucide-react";
import { adminFetch } from "@/lib/api";
import { HeroSlide } from "@/lib/types";

const EMPTY_SLIDE = {
  badge_bn: "মানবতার সেবায়",
  badge_en: "Serving Humanity",
  title_bn: "",
  title_en: "",
  subtitle_bn: "",
  subtitle_en: "",
  image_url: "",
  cta_text_bn: "দান করুন",
  cta_text_en: "Donate Now",
  cta_link: "/donate",
  sort_order: 1,
  is_active: true,
};

export default function AdminSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_SLIDE);

  const load = () => {
    adminFetch<HeroSlide[]>("/api/admin/slides")
      .then(setSlides)
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await adminFetch(`/api/admin/slides/${editId}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
    } else {
      await adminFetch("/api/admin/slides", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }
    setModalOpen(false);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("স্লাইডটি মুছে ফেলবেন?")) return;
    await adminFetch(`/api/admin/slides/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-july font-bold text-[#0f4c75]">
            হোমপেজ হিরো স্লাইডার ({slides.length})
          </h1>
          <p className="text-xs text-slate-500">
            ওয়েবসাইটের প্রথম পাতার ব্যানার স্লাইডারসমূহ যোগ বা সম্পাদনা করুন
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditId(null);
            setForm({ ...EMPTY_SLIDE, sort_order: slides.length + 1 });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2375b8] text-white font-july font-bold text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন স্লাইড</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="h-44 bg-slate-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image_url}
                  alt={s.title_bn}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 text-white text-xs font-bold">
                  #{s.sort_order} • {s.is_active ? "Active" : "Hidden"}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <div className="text-xs text-[#2375b8] font-july font-bold">
                  {s.badge_bn}
                </div>
                <h3 className="font-july font-bold text-base text-slate-900 line-clamp-2">
                  {s.title_bn}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">{s.subtitle_bn}</p>
              </div>
            </div>
            <div className="p-4 pt-0 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditId(s.id);
                  setForm({
                    badge_bn: s.badge_bn,
                    badge_en: s.badge_en,
                    title_bn: s.title_bn,
                    title_en: s.title_en,
                    subtitle_bn: s.subtitle_bn,
                    subtitle_en: s.subtitle_en,
                    image_url: s.image_url,
                    cta_text_bn: s.cta_text_bn,
                    cta_text_en: s.cta_text_en,
                    cta_link: s.cta_link,
                    sort_order: s.sort_order,
                    is_active: s.is_active,
                  });
                  setModalOpen(true);
                }}
                className="p-2 rounded-lg bg-sky-50 text-[#2375b8] cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(s.id)}
                className="p-2 rounded-lg bg-rose-50 text-rose-600 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-july font-bold text-lg text-[#0f4c75]">
                {editId ? "স্লাইড সম্পাদনা" : "নতুন হিরো স্লাইড"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="শিরোনাম (বাংলা) *"
                  value={form.title_bn}
                  onChange={(e) => setForm({ ...form, title_bn: e.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
                <input
                  required
                  placeholder="Title (English) *"
                  value={form.title_en}
                  onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
                <input
                  placeholder="ব্যাজ (বাংলা)"
                  value={form.badge_bn}
                  onChange={(e) => setForm({ ...form, badge_bn: e.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
                <input
                  placeholder="Badge (English)"
                  value={form.badge_en}
                  onChange={(e) => setForm({ ...form, badge_en: e.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <input
                required
                placeholder="ব্যাকগ্রাউন্ড ইমেজ URL *"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
              <textarea
                rows={2}
                placeholder="সাবটাইটেল (বাংলা)"
                value={form.subtitle_bn}
                onChange={(e) => setForm({ ...form, subtitle_bn: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
              <textarea
                rows={2}
                placeholder="Subtitle (English)"
                value={form.subtitle_en}
                onChange={(e) => setForm({ ...form, subtitle_en: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  placeholder="বাটন টেক্সট (বাংলা)"
                  value={form.cta_text_bn}
                  onChange={(e) => setForm({ ...form, cta_text_bn: e.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
                <input
                  placeholder="CTA Link (/donate)"
                  value={form.cta_link}
                  onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Order"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({ ...form, sort_order: Number(e.target.value) })
                  }
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                <span>সক্রিয় (Active)</span>
              </label>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border font-july font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2375b8] text-white font-july font-bold cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
