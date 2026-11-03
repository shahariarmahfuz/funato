"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Post } from "@/lib/types";
import { apiFetch, formatDate } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function NewsStoriesPage() {
  const { lang, t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Post[]>("/api/public/posts")
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? posts : posts.filter((p) => p.post_type === filter);

  return (
    <div className="bg-[#FDFDFC] py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#f0f7fd] text-[#2375b8] font-july font-bold text-sm mb-2">
              {t("মানবিক গল্প ও সংবাদ", "Humanitarian Stories & Press")}
            </span>
            <h1 className="text-3xl sm:text-4xl font-july font-bold text-[#0f4c75]">
              {t("নিউজ & স্টোরিজ", "News & Impact Stories")}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: "all", bn: "সকল পোস্ট", en: "All" },
              { id: "story", bn: "মানবিক গল্প", en: "Field Stories" },
              { id: "news", bn: "সংবাদ ও প্রেস", en: "Press & News" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-full font-july font-bold text-sm cursor-pointer transition ${
                  filter === tab.id
                    ? "bg-[#2375b8] text-white"
                    : "bg-[#f0f7fd] text-slate-700 hover:bg-sky-100"
                }`}
              >
                {t(tab.bn, tab.en)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <Link
                key={post.id}
                href={`/news-stories/${post.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col"
              >
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.cover_image}
                    alt={t(post.title_bn, post.title_en)}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-[#2375b8] font-july font-bold text-xs uppercase">
                    {post.post_type === "story"
                      ? t("মানবিক গল্প", "Story")
                      : t("সংবাদ", "News")}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(post.published_at, lang)}</span>
                      <span>•</span>
                      <span>{post.author_name}</span>
                    </div>
                    <h2 className="font-july font-bold text-lg text-[#0f4c75] group-hover:text-[#2375b8] line-clamp-2">
                      {t(post.title_bn, post.title_en)}
                    </h2>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                      {t(post.excerpt_bn, post.excerpt_en)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-july font-bold text-[#2375b8]">
                    {t("সম্পূর্ণ পড়ুন", "Read Full Article")}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
