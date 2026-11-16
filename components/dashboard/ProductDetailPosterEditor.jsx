"use client";

import React, { useEffect, useRef, useState } from "react";
import MediaPicker from "@/components/dashboard/MediaPicker";
import { uploadAdminImage } from "@/lib/uploadImage";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.applebd.com";
const DEFAULTS = { enabled: false, image: { url: "", public_id: "" }, link: "" };

export default function ProductDetailPosterEditor() {
  const [cfg, setCfg] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/api/admin/settings`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const saved = d.settings?.productDetailPoster;
        if (saved) setCfg({ ...DEFAULTS, ...saved, image: { ...DEFAULTS.image, ...saved.image } });
      })
      .catch(() => setMessage({ type: "error", text: "Failed to load settings" }))
      .finally(() => setLoading(false));
  }, []);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const { asset } = await uploadAdminImage(file, "applebd/product-detail-poster");
      setCfg((prev) => ({ ...prev, image: { url: asset.url, public_id: asset.public_id } }));
    } catch (err) {
      setMessage({ type: "error", text: `Image upload failed: ${err.message}` });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const resp = await fetch(`${API}/api/admin/settings/storefront`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productDetailPoster: cfg }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Save failed");
      setMessage({ type: "success", text: "Saved! The poster is updated on product pages." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-16 text-center text-gray-400">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Product Detail Poster</h1>
          <p className="text-sm text-gray-500 mt-1">One shared poster displayed below the image gallery on every product detail page.</p>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 shrink-0">
          <input type="checkbox" checked={!!cfg.enabled} onChange={(e) => setCfg((p) => ({ ...p, enabled: e.target.checked }))} className="w-4 h-4" />
          {cfg.enabled ? "Enabled" : "Disabled"}
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Poster Image</label>
        <div className="min-h-40 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center">
          {cfg.image?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cfg.image.url} alt="Product detail poster preview" className="block max-h-[420px] w-full object-contain" />
          ) : <span className="text-sm text-gray-400">No poster selected</span>}
          {uploading && <span className="absolute rounded bg-white/90 px-3 py-2 text-sm">Uploading…</span>}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
        <div className="flex gap-2 mt-3">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="text-sm px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">Upload image</button>
          <button type="button" onClick={() => setPickerOpen(true)} className="text-sm px-3 py-2 border rounded-lg hover:bg-gray-50">Media library</button>
          {cfg.image?.url && <button type="button" onClick={() => setCfg((p) => ({ ...p, image: { url: "", public_id: "" } }))} className="text-sm px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">Remove image</button>}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Recommended artwork: <strong>1600 × 350 px (width × height)</strong>,
          approximately 4.6:1. It displays at up to 540 × 100 px on desktop and
          88 px high on mobile; edges may be cropped to fit, so keep important
          text and logos near the center. Removing the image clears its saved
          poster reference.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Optional Poster Link</label>
        <input value={cfg.link || ""} onChange={(e) => setCfg((p) => ({ ...p, link: e.target.value }))} placeholder="https://… or /products/" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
      </div>

      {message && <p className={`text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>{message.text}</p>}
      <button type="button" onClick={save} disabled={saving || uploading} className="px-6 py-2 bg-[#1D1D1F] text-white rounded-lg font-semibold disabled:opacity-50">{saving ? "Saving…" : "Save Product Detail Poster"}</button>

      <MediaPicker open={pickerOpen} onSelect={(asset) => { setCfg((p) => ({ ...p, image: { url: asset.url, public_id: asset.public_id } })); setPickerOpen(false); }} onClose={() => setPickerOpen(false)} />
    </div>
  );
}
