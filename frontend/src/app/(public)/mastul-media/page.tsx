"use client";

import React, { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import { MediaVideo } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function MediaVideosPage() {
  const { t } = useLanguage();
  const [videos, setVideos] = useState<MediaVideo[]>([]);
  const [playing, setPlaying] = useState<MediaVideo | null>(null);

  useEffect(() => {
    apiFetch<MediaVideo[]>("/api/public/videos")
      .then(setVideos)
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-block px-3.5 py-1 rounded-full bg-[#f0f7fd] text-[#2375b8] font-july font-bold text-sm">
          {t("মিডিয়া ও ডকুমেন্টারি", "Media & Documentaries")}
        </span>
        <h1 className="text-3xl sm:text-4xl font-july font-bold text-[#0f4c75]">
          {t("আমাদের কার্যক্রম সম্পর্কে ভিডিও গ্যালারি", "Video Gallery of Our Work")}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid) => (
          <button
            key={vid.id}
            type="button"
            onClick={() => setPlaying(vid)}
            className="group text-left bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition cursor-pointer"
          >
            <div className="relative h-56 bg-slate-900 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  vid.thumbnail_url ||
                  `https://img.youtube.com/vi/${vid.youtube_id}/hqdefault.jpg`
                }
                alt={t(vid.title_bn, vid.title_en)}
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#2375b8] group-hover:bg-rose-600 text-white flex items-center justify-center shadow-lg transition">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/75 text-white text-xs font-mono">
                {vid.duration}
              </span>
            </div>
            <div className="p-5">
              <h2 className="font-july font-bold text-lg text-[#0f4c75] group-hover:text-[#2375b8]">
                {t(vid.title_bn, vid.title_en)}
              </h2>
            </div>
          </button>
        ))}
      </div>

      {playing && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl overflow-hidden max-w-4xl w-full border border-white/15">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 text-white">
              <h3 className="font-july font-bold truncate">
                {t(playing.title_bn, playing.title_en)}
              </h3>
              <button
                type="button"
                onClick={() => setPlaying(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${playing.youtube_id}?autoplay=1`}
                title={playing.title_en}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
