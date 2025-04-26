"use client";

import { useState, useRef } from "react";
import { Download, Loader2, Sparkles, UploadCloud } from "lucide-react";

export default function ReelCraftStudio() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("Generated caption will appear here");
  const [hashtags, setHashtags] = useState("Trending hashtags will appear here");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideoFile(file);
  };

  const handleGenerate = async () => {
    if (!videoFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", videoFile);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        setCaption("Error: " + data.error);
        setHashtags("#Error");
      } else {
        setCaption(data.caption);
        setHashtags(data.hashtags);
      }
    } catch (err) {
      console.error(err);
      setCaption("Error generating caption.");
      setHashtags("#Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    alert("Video download will trigger here (placeholder)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-12 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 flex items-center justify-center gap-3 mb-4">
          <span role="img" aria-label="camera">🎥</span> ReelCraft™ Studio
        </h1>
        <p className="text-center text-gray-500 mb-4 text-lg">
          Upload your video, auto-caption it with AI, get trending hashtags, and download in one click.
        </p>
        {/* 🚨 Kullanıcıya not: dosya isimlendirme */}
        <p className="text-center text-sm text-gray-400 italic mb-6">
          Pro tip: Name your video file descriptively (e.g. <code>product-demo.mp4</code>) for more accurate captions & hashtags.
        </p>

        <div className="space-y-8">
          {/* Custom Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
              <UploadCloud className="h-5 w-5" />
              Upload Your Video
            </label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-purple-400 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-3 rounded-xl transition"
            >
              {videoFile ? videoFile.name : "Click to Upload Video"}
            </button>
            <input
              type="file"
              accept="video/*"
              ref={fileInputRef}
              onChange={handleUpload}
              className="hidden"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!videoFile || loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl text-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            Generate Captions & Hashtags
          </button>

          {/* Caption Bubble */}
          <div className="bg-purple-100 p-4 rounded-2xl shadow-inner text-gray-800 text-sm">
            <label className="block text-xs font-semibold text-purple-800 mb-1">
              📝 Generated Caption
            </label>
            <div className="bg-white rounded-xl px-4 py-2">{caption}</div>
          </div>

          {/* Hashtag Bubble */}
          <div className="bg-orange-100 p-4 rounded-2xl shadow-inner text-gray-800 text-sm">
            <label className="block text-xs font-semibold text-orange-800 mb-1">
              🔥 Trending Hashtags
            </label>
            <div className="bg-white rounded-xl px-4 py-2">{hashtags}</div>
          </div>

          {/* Download Button */}
          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              disabled={!videoFile}
              className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> Download Edited Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
