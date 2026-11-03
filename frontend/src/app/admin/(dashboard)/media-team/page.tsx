"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/api";
import { MediaVideo, TeamMember } from "@/lib/types";

export default function AdminMediaAndTeamPage() {
  const [tab, setTab] = useState<"videos" | "team">("videos");
  const [videos, setVideos] = useState<MediaVideo[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);

  const [vForm, setVForm] = useState({
    title_bn: "",
    title_en: "",
    youtube_url: "",
    youtube_id: "",
    thumbnail_url: "",
    duration: "04:30",
    is_featured: true,
    sort_order: 1,
    is_active: true,
  });

  const [mForm, setMForm] = useState({
    name_bn: "",
    name_en: "",
    role_bn: "",
    role_en: "",
    board_type: "shariah",
    bio_bn: "",
    bio_en: "",
    photo_url: "",
    sort_order: 1,
    is_active: true,
  });

  const loadAll = () => {
    adminFetch<MediaVideo[]>("/api/admin/videos").then(setVideos).catch(() => {});
    adminFetch<TeamMember[]>("/api/admin/team").then(setTeam).catch(() => {});
  };

  useEffect(() => {
    loadAll();
  }, []);

  const addVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const match = vForm.youtube_url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
    const ytId = vForm.youtube_id || (match ? match[1] : "aqz-KE-bpKQ");
    await adminFetch("/api/admin/videos", {
      method: "POST",
      body: JSON.stringify({ ...vForm, youtube_id: ytId }),
    });
    setVForm({
      title_bn: "",
      title_en: "",
      youtube_url: "",
      youtube_id: "",
      thumbnail_url: "",
      duration: "04:30",
      is_featured: true,
      sort_order: videos.length + 1,
      is_active: true,
    });
    loadAll();
  };

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminFetch("/api/admin/team", {
      method: "POST",
      body: JSON.stringify(mForm),
    });
    setMForm({
      name_bn: "",
      name_en: "",
      role_bn: "",
      role_en: "",
      board_type: "shariah",
      bio_bn: "",
      bio_en: "",
      photo_url: "",
      sort_order: team.length + 1,
      is_active: true,
    });
    loadAll();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-july font-bold text-[#0f4c75]">
          ভিডিও গ্যালারি ও শরিয়াহ/পরিচালনা পর্ষদ
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("videos")}
            className={`px-4 py-2 rounded-xl font-july font-bold text-sm cursor-pointer ${
              tab === "videos" ? "bg-[#2375b8] text-white" : "bg-white text-slate-700"
            }`}
          >
            ভিডিও গ্যালারি ({videos.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("team")}
            className={`px-4 py-2 rounded-xl font-july font-bold text-sm cursor-pointer ${
              tab === "team" ? "bg-[#2375b8] text-white" : "bg-white text-slate-700"
            }`}
          >
            সদস্য ও শরিয়াহ বোর্ড ({team.length})
          </button>
        </div>
      </div>

      {tab === "videos" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={addVideo}
            className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-sm h-fit"
          >
            <h2 className="font-july font-bold text-lg text-[#0f4c75]">
              নতুন ভিডিও যোগ করুন
            </h2>
            <input
              required
              placeholder="ভিডিও শিরোনাম (বাংলা) *"
              value={vForm.title_bn}
              onChange={(e) => setVForm({ ...vForm, title_bn: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            <input
              required
              placeholder="Video Title (English) *"
              value={vForm.title_en}
              onChange={(e) => setVForm({ ...vForm, title_en: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            <input
              required
              placeholder="YouTube URL (https://www.youtube.com/watch?v=...)"
              value={vForm.youtube_url}
              onChange={(e) => setVForm({ ...vForm, youtube_url: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Thumbnail URL (ঐচ্ছিক)"
                value={vForm.thumbnail_url}
                onChange={(e) => setVForm({ ...vForm, thumbnail_url: e.target.value })}
                className="rounded-xl border border-slate-300 px-3 py-2"
              />
              <input
                placeholder="সময়কাল (04:30)"
                value={vForm.duration}
                onChange={(e) => setVForm({ ...vForm, duration: e.target.value })}
                className="rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#2375b8] text-white font-july font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ভিডিও যুক্ত করুন</span>
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            {videos.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="font-july font-bold text-slate-900">{v.title_bn}</div>
                  <div className="text-xs text-slate-500">
                    ID: {v.youtube_id} • {v.duration}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await adminFetch(`/api/admin/videos/${v.id}`, { method: "DELETE" });
                    loadAll();
                  }}
                  className="p-2 rounded-lg bg-rose-50 text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={addMember}
            className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-sm h-fit"
          >
            <h2 className="font-july font-bold text-lg text-[#0f4c75]">
              নতুন সদস্য যোগ করুন
            </h2>
            <input
              required
              placeholder="নাম (বাংলা) *"
              value={mForm.name_bn}
              onChange={(e) => setMForm({ ...mForm, name_bn: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            <input
              required
              placeholder="Name (English) *"
              value={mForm.name_en}
              onChange={(e) => setMForm({ ...mForm, name_en: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="পদবি (বাংলা) *"
                value={mForm.role_bn}
                onChange={(e) => setMForm({ ...mForm, role_bn: e.target.value })}
                className="rounded-xl border border-slate-300 px-3 py-2"
              />
              <input
                required
                placeholder="Role (English) *"
                value={mForm.role_en}
                onChange={(e) => setMForm({ ...mForm, role_en: e.target.value })}
                className="rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
            <select
              value={mForm.board_type}
              onChange={(e) => setMForm({ ...mForm, board_type: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white"
            >
              <option value="shariah">শরিয়াহ বোর্ড (shariah)</option>
              <option value="executive">নির্বাহী পর্ষদ (executive)</option>
            </select>
            <input
              placeholder="ছবির URL (Photo URL)"
              value={mForm.photo_url}
              onChange={(e) => setMForm({ ...mForm, photo_url: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            <textarea
              rows={2}
              placeholder="সংক্ষিপ্ত পরিচিতি (বাংলা)"
              value={mForm.bio_bn}
              onChange={(e) => setMForm({ ...mForm, bio_bn: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#2375b8] text-white font-july font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>সদস্য যুক্ত করুন</span>
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            {team.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[11px] uppercase px-2 py-0.5 rounded bg-sky-50 text-[#2375b8] font-bold">
                    {m.board_type}
                  </span>
                  <div className="font-july font-bold text-slate-900 mt-0.5">
                    {m.name_bn} ({m.name_en})
                  </div>
                  <div className="text-xs text-slate-500">{m.role_bn}</div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await adminFetch(`/api/admin/team/${m.id}`, { method: "DELETE" });
                    loadAll();
                  }}
                  className="p-2 rounded-lg bg-rose-50 text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
