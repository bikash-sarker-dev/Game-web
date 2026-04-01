"use client";

import Button from "@/components/share/ButtonPrimary";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useCallback, useEffect } from "react";

interface Contestant {
  id: number;
  name: string;
  avatar: string;
  active: boolean;
}

const PLACEHOLDER_AVATARS = Array.from(
  { length: 8 },
  (_, i) => `https://api.dicebear.com/8.x/adventurer/svg?seed=${i + 1}`,
);

const INITIAL_CONTESTANTS: Contestant[] = PLACEHOLDER_AVATARS.map((av, i) => ({
  id: i + 1,
  name: `Contestant ${i + 1}`,
  avatar: av,
  active: true,
}));

export default function RoundTwoStart() {
  const [contestants] = useState<Contestant[]>(INITIAL_CONTESTANTS);
  const [activeContestant, setActiveContestant] = useState<number>(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const current = contestants.find((c) => c.id === activeContestant)!;

  useEffect(() => {
    if (!isUploading) return;
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2500);
          return 100;
        }
        return p + Math.random() * 18;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isUploading]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setIsUploading(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const clearImage = () => {
    setUploadedImage(null);
    setUploadProgress(0);
    setShowSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen  text-white flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* atmospheric glow */}

      {/* header */}
      <header className="relative z-10 w-full max-w-4xl mb-6 sm:mb-8 mt-8">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.3em] text-red-500/70 uppercase font-medium">
              Live Session
            </span>
            <h1 className="text-xl sm:text-2xl mt-3 font-bold tracking-tight text-white">
              {current.name}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-xs text-red-400 font-medium tracking-wider">
              LIVE
            </span>
          </div>
        </div>
        <div className="mt-3 h-px bg-gradient-to-r from-red-600/80 via-red-400/30 to-transparent" />
      </header>

      {/* main card */}
      <main className="relative z-10 w-full max-w-4xl">
        <div
          className="rounded-2xl border border-red-600/40 bg-black/60 backdrop-blur-md overflow-hidden"
          style={{
            boxShadow:
              "0 0 0 1px rgba(220,38,38,0.15), 0 0 60px -10px rgba(220,38,38,0.3)",
          }}
        >
          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-white/5">
            <h2 className="text-lg sm:text-xl font-bold text-center text-red-500 tracking-wide">
              Take Photo
            </h2>
            <p className="text-sm text-center text-gray-400 mt-0.5">
              Take your photo and send it
            </p>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            {showSuccess && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Photo uploaded successfully!
              </div>
            )}

            {!uploadedImage ? (
              <div
                onDrop={onDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-4 min-h-[220px] sm:min-h-[280px] md:min-h-[320px] transition-all duration-300 group select-none ${isDragging ? "border-red-500 bg-red-500/10 scale-[1.01]" : "border-white/10 bg-white/[0.02] hover:border-red-500/50 hover:bg-red-500/5"}`}
              >
                {isDragging && (
                  <div className="absolute inset-0 rounded-xl border-2 border-red-400 animate-pulse" />
                )}
                <div
                  className={`p-4 rounded-2xl transition-all duration-300 ${isDragging ? "bg-red-500/20" : "bg-white/5 group-hover:bg-red-500/10"}`}
                >
                  <svg
                    className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-300 ${isDragging ? "text-red-400" : "text-gray-500 group-hover:text-red-400"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                </div>
                <div className="text-center px-4">
                  <p
                    className={`font-semibold text-base sm:text-lg transition-colors duration-300 ${isDragging ? "text-red-300" : "text-gray-300 group-hover:text-white"}`}
                  >
                    {isDragging ? "Drop your photo here" : "Choose File"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Drag & drop or click to browse · PNG, JPG, WEBP
                  </p>
                </div>
                <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-red-600/40 rounded-tl-sm" />
                <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-red-600/40 rounded-tr-sm" />
                <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-red-600/40 rounded-bl-sm" />
                <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-red-600/40 rounded-br-sm" />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40">
                <img
                  src={uploadedImage}
                  alt="Uploaded preview"
                  className="w-full object-cover max-h-[320px] sm:max-h-[400px]"
                  style={{ objectPosition: "center top" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                {isUploading && (
                  <div className="absolute bottom-0 left-0 right-0">
                    <div className="h-1 bg-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-100 ease-linear"
                        style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                      />
                    </div>
                    <div className="px-4 pb-3 pt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-300">Uploading…</span>
                      <span className="text-xs text-red-400 font-medium">
                        {Math.min(Math.round(uploadProgress), 100)}%
                      </span>
                    </div>
                  </div>
                )}
                {!isUploading && (
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-black/60 backdrop-blur border border-white/20 text-white hover:bg-white/10 transition-all"
                    >
                      Change
                    </button>
                    <button
                      onClick={clearImage}
                      className="p-1.5 rounded-lg bg-black/60 backdrop-blur border border-white/20 text-gray-300 hover:text-red-400 hover:border-red-500/50 transition-all"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onInputChange}
            />

            {uploadedImage && !isUploading && (
              <div className="mt-6 flex justify-center">
                <Button
                  variant="game"
                  onClick={() => {
                    setIsUploading(true);
                    router.push("/round-two/round-two-two");
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Send Photo
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* contestants strip */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-gray-400 tracking-[0.2em] uppercase font-medium">
            Active Contestants
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {contestants.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveContestant(c.id);
                  clearImage();
                }}
                className={`relative rounded-full transition-all duration-300 group ${
                  activeContestant === c.id
                    ? "ring-2 ring-red-500 ring-offset-2 ring-offset-[#0a0a0a] scale-110"
                    : "ring-2 ring-white/10 hover:ring-red-500/50 hover:scale-105"
                }`}
                title={c.name}
              >
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover bg-zinc-800"
                />
                {activeContestant === c.id && (
                  <span
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500"
                    style={{ boxShadow: "0 0 6px 2px rgba(239,68,68,0.6)" }}
                  />
                )}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-600 mt-1">
            Select a contestant to upload their photo
          </p>
        </div>
      </main>

      <footer className="relative z-10 mt-10 pb-4 text-center">
        <p className="text-[10px] tracking-widest text-gray-700 uppercase">
          © 2026 · Contestant Portal
        </p>
      </footer>
    </div>
  );
}
