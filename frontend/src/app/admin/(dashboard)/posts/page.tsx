"use client";

import React, { useEffect, useState } from "react";
import { Edit3, Plus, Trash2, X } from "lucide-react";
import { adminFetch, formatDate } from "@/lib/api";
import { Post } from "@/lib/types";

const EMPTY_POST = {
  slug: "",
  post_type: "story",
  title_bn: "",
  title_en: "",
  excerpt_bn: "",
  excerpt_en: "",
  content_bn: "",
  content_en: "",
  cover_image: "",
  author_name: "মিডিয়া ডেস্ক",
  is_featured: true,
  is_published: true,
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_POST);

  const load = () => {
    adminFetch<Post[]>("/api/admin/posts")
      .then(setPosts)
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await adminFetch(`/api/admin/posts/${editId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await adminFetch("/api/admin/posts", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      setModalOpen(false);
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save post");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("পোস্টটি মুছে ফেলতে নিশ্চিত?")) return;
    await adminFetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-july font-bold text-[#0f4c75]">
            নিউজ ও স্টোরিজ পরিচালনা ({posts.length})
          </h1>
          <p className="text-xs text-slate-500">
            ফিল্ড স্টোরি, প্রেস বিজ্ঞপ্তি ও মানবিক সংবাদ প্রকাশ ও সম্পাদনা করুন
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditId(null);
            setForm(EMPTY_POST);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2375b8] text-white font-july font-bold text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পোস্ট লিখুন</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-july">
            <tr>
              <th className="px-4 py-3">শিরোনাম</th>
              <th className="px-4 py-3">ধরন</th>
              <th className="px-4 py-3">তারিখ</th>
              <th className="px-4 py-3">স্ট্যাটাস</th>
              <th className="px-4 py-3 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3.5">
                  <div className="font-july font-bold text-slate-900">{p.title_bn}</div>
                  <div className="text-xs text-slate-500">{p.title_en}</div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#2375b8] text-xs font-bold uppercase">
                    {p.post_type}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">
                  {formatDate(p.published_at, "bn")}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      p.is_published
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {p.is_published ? "প্রকাশিত" : "খসড়া"}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right space-x-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(p.id);
                      setForm({
                        slug: p.slug,
                        post_type: p.post_type,
                        title_bn: p.title_bn,
                        title_en: p.title_en,
                        excerpt_bn: p.excerpt_bn,
                        excerpt_en: p.excerpt_en,
                        content_bn: p.content_bn,
                        content_en: p.content_en,
                        cover_image: p.cover_image,
                        author_name: p.author_name,
                        is_featured: p.is_featured,
                        is_published: p.is_published,
                      });
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-sky-50 text-[#2375b8] cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-july font-bold text-lg text-[#0f4c75]">
                {editId ? "পোস্ট সম্পাদনা" : "নতুন নিউজ / স্টোরি"}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  required
                  placeholder="URL Slug * (e.g. flood-relief-2026)"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  className="rounded-xl border border-slate-300 px-3 py-2 font-mono"
                />
                <select
                  value={form.post_type}
                  onChange={(e) => setForm({ ...form, post_type: e.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2 bg-white"
                >
                  <option value="story">মানবিক গল্প (story)</option>
                  <option value="news">সংবাদ ও প্রেস (news)</option>
                </select>
                <input
                  placeholder="কভার ইমেজ URL"
                  value={form.cover_image}
                  onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
                <input
                  placeholder="লেখক / ডেস্ক"
                  value={form.author_name}
                  onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <textarea
                rows={2}
                placeholder="সারসংক্ষেপ (বাংলা)"
                value={form.excerpt_bn}
                onChange={(e) => setForm({ ...form, excerpt_bn: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
              <textarea
                rows={4}
                placeholder="বিস্তারিত মূল লেখা (বাংলা)"
                value={form.content_bn}
                onChange={(e) => setForm({ ...form, content_bn: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
              <textarea
                rows={3}
                placeholder="Full Content (English)"
                value={form.content_en}
                onChange={(e) => setForm({ ...form, content_en: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
              <label className="inline-flex items-center gap-2 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                />
                <span>প্রকাশিত (Published)</span>
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
