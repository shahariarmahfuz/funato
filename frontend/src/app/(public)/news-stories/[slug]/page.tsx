"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Heart, User } from "lucide-react";
import { Post } from "@/lib/types";
import { apiFetch, formatDate } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function SinglePostPage() {
  const params = useParams<{ slug: string }>();
  const { lang, t } = useLanguage();
  const [data, setData] = useState<{ post: Post; related_posts: Post[] } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.slug) return;
    apiFetch<{ post: Post; related_posts: Post[] }>(`/api/public/posts/${params.slug}`)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="h-96 rounded-3xl bg-slate-100 animate-pulse" />
      </div>
    );
  }

  if (!data?.post) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-2xl font-july font-bold">
          {t("পোস্টটি পাওয়া যায়নি", "Article Not Found")}
        </h1>
        <Link
          href="/news-stories"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#2375b8] text-white font-july font-bold"
        >
          {t("সকল সংবাদে ফিরে যান", "Back to News")}
        </Link>
      </div>
    );
  }

  const { post, related_posts } = data;

  return (
    <article className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <Link
        href="/news-stories"
        className="inline-flex items-center gap-1.5 text-sm font-july font-bold text-[#2375b8] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t("সকল নিউজ ও স্টোরিজ", "Back to News & Stories")}</span>
      </Link>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="px-3 py-1 rounded-full bg-[#f0f7fd] text-[#2375b8] font-july font-bold uppercase">
            {post.post_type}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.published_at, lang)}
          </span>
          <span className="inline-flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {post.author_name}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-july font-bold text-[#0f4c75] leading-snug">
          {t(post.title_bn, post.title_en)}
        </h1>
      </div>

      {post.cover_image && (
        <div className="rounded-3xl overflow-hidden border border-slate-200 max-h-[460px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image}
            alt={t(post.title_bn, post.title_en)}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 text-lg text-slate-800 whitespace-pre-line leading-relaxed">
        {t(post.content_bn, post.content_en)}
      </div>

      <div className="rounded-2xl bg-[#f0f7fd] border border-sky-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-july font-bold text-xl text-[#0f4c75]">
            {t(
              "এমন হাজারো মানুষের পাশে দাঁড়াতে চান?",
              "Want to Stand Beside Families Like These?"
            )}
          </h3>
          <p className="text-sm text-slate-600">
            {t(
              "আপনার সামান্য অনুদানও একটি পরিবারের জীবনে স্থায়ী পরিবর্তন আনতে পারে।",
              "Even a modest contribution creates lasting dignity for a family in need."
            )}
          </p>
        </div>
        <Link
          href="/donate"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2375b8] text-white font-july font-bold shrink-0"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>{t("এখনই অনুদান দিন", "Donate Now")}</span>
        </Link>
      </div>

      {related_posts.length > 0 && (
        <div className="pt-6 space-y-4">
          <h2 className="text-2xl font-july font-bold text-[#0f4c75]">
            {t("আরও পড়ুন", "Related Stories")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related_posts.map((rp) => (
              <Link
                key={rp.id}
                href={`/news-stories/${rp.slug}`}
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-sky-300 transition"
              >
                <h3 className="font-july font-bold text-base text-[#0f4c75] line-clamp-2">
                  {t(rp.title_bn, rp.title_en)}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  {t(rp.excerpt_bn, rp.excerpt_en)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
