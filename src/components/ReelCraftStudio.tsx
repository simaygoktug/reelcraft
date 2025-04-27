"use client";

import { useState, useRef } from "react";
import { Download, Loader2, Sparkles, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

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

      const res = await fetch("/api/generate", { method: "POST", body: formData });
      const data = await res.json();

      if (data.error) {
        setCaption("Error: " + data.error);
        setHashtags("#Error");
      } else {
        setCaption(data.caption);
        setHashtags(data.hashtags);
      }
    } catch {
      setCaption("Error generating caption.");
      setHashtags("#Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    alert("Video download placeholder");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block text-5xl"
          >
            🎥
          </motion.span>
          <h1 className="mt-2 text-4xl font-extrabold text-gray-900">ReelCraft™ Studio</h1>
          <p className="mt-2 text-gray-500">
            Upload, auto-caption with AI, get hashtags & download in one click.
          </p>
        </div>

        {/* Pro tip */}
        <p className="text-center text-sm text-gray-400 italic mb-6">
          Pro tip: Name your file descriptively (e.g. <code className="font-mono">product-demo.mp4</code>) for best results.
        </p>

        <div className="space-y-6">
          {/* Upload */}
          <div>
            <label className="flex items-center text-gray-700 font-medium mb-2">
              <UploadCloud className="w-6 h-6 mr-2 text-purple-500" />
              Upload Your Video
            </label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-700 py-3 rounded-xl transition"
            >
              {videoFile?.name || "Click to Upload Video"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleUpload}
              className="hidden"
            />
          </div>

          {/* Generate */}
          <button
            onClick={handleGenerate}
            disabled={!videoFile || loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            Generate
          </button>

          {/* Results grid */}
          <div className="grid gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-purple-50 p-4 rounded-2xl shadow-inner"
            >
              <h3 className="text-purple-700 font-semibold mb-1">📝 Generated Caption</h3>
              <p className="text-gray-800">{loading ? "...processing..." : caption}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-orange-50 p-4 rounded-2xl shadow-inner"
            >
              <h3 className="text-orange-700 font-semibold mb-1">🔥 Trending Hashtags</h3>
              <p className="text-gray-800 whitespace-pre-wrap">{loading ? "...processing..." : hashtags}</p>
            </motion.div>
          </div>

          {/* Download */}
          <div className="text-right">
            <button
              onClick={handleDownload}
              disabled={!videoFile}
              className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-lg transition disabled:opacity-50"
            >
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
