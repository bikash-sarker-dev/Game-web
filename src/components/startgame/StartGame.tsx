// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSocket } from "@/hooks/useSocket";
// import { useSelector } from "react-redux";

// const StartGame: React.FC = () => {
//   const router = useRouter();

//   const currentUser = useSelector((state: any) => state.user.user);
//   console.log(currentUser.name, currentUser.avatar);

//   const { sendEvent } = useSocket({
//     GAME_STARTED: (payload) => {
//       console.log("🎮 Game Started:", payload);
//       alert("Game Started!");
//     },

//     PLAYERS_UPDATE: (payload) => {
//       console.log("👥 Players:", payload);
//     },
//   });

//   // Particles
//   useEffect(() => {
//     const container = document.getElementById("particles");
//     if (!container) return;

//     for (let i = 0; i < 28; i++) {
//       const p = document.createElement("div");
//       const size = Math.random() * 4 + 2;
//       p.style.position = "absolute";
//       p.style.width = `${size}px`;
//       p.style.height = `${size}px`;
//       p.style.borderRadius = "50%";
//       p.style.left = `${Math.random() * 100}%`;
//       p.style.top = `${Math.random() * 100}%`;
//       p.style.background = "radial-gradient(circle,#FFE566,#FF8C00)";
//       p.style.boxShadow = `0 0 ${size * 2}px #FFD700`;
//       p.style.opacity = String(0.25 + Math.random() * 0.55);
//       p.style.animation = `floatParticle ${4 + Math.random() * 7}s ease-in-out infinite`;
//       p.style.animationDelay = `${Math.random() * 5}s`;
//       container.appendChild(p);
//     }
//   }, []);

//   const handleCreateGame = () => {
//     sendEvent("CREATE_GAME", { gameType: "INTERNET_BACHELOR" }, (response) => {
//       console.log("✅ Server ACK:", response);
//       if (response.success) {
//         router.push("/host");
//       }
//     });
//   };

//   const handleJoinGame = () => {
//     const payload = {
//       gameId: "internet-bachelor-123",
//       name: currentUser.name,
//       avatar: currentUser.avatar,
//     };

//     console.log("🚀 Sending payload:", payload);

//     sendEvent("JOIN_GAME", payload, (response) => {
//       console.log("✅ ACK:", response);
//     });
//   };

//   return (
//     <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-serif">
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#8B1A00,transparent_60%),radial-gradient(ellipse_at_bottom,#0A0000,#000)]" />

//       <div className="absolute bottom-0 w-full opacity-60">
//         <svg viewBox="0 0 1400 500" className="w-full h-[55vh]">
//           <rect width="100%" height="100%" fill="url(#g)" />
//           <defs>
//             <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#5C1A00" />
//               <stop offset="100%" stopColor="#1A0500" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </div>

//       <div id="particles" className="absolute inset-0 pointer-events-none" />

//       <div className="relative z-10 -top-12 flex flex-col items-center text-center px-6">
//         <p className="uppercase tracking-[0.4em] text-yellow-400 text-xs mb-4 italic">
//           Season One · Premium Edition
//         </p>

//         <div className="relative flex flex-col items-center mb-6">
//           <img
//             src="./bachelor-bg-removebg-preview.png"
//             alt="premium edition"
//             className="w-xl opacity-90"
//           />
//           <h2 className="mt-3 text-white font-extrabold text-lg md:text-2xl tracking-widest uppercase">
//             Legendary Experience
//           </h2>
//         </div>

//         <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-orange-700 text-4xl md:text-6xl font-black tracking-widest">
//           INTERNET BACHELOR
//         </h1>

//         <p className="text-red-300 italic mt-2 text-lg md:text-xl">
//           Connect. Find Love.
//         </p>

//         <div className="flex flex-wrap gap-6 mt-10 justify-center">
//           <button
//             onClick={handleCreateGame}
//             className="relative px-8 py-4 font-bold uppercase tracking-widest text-black bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-600 clip-path-polygon shadow-[0_0_40px_rgba(255,180,0,0.6)] hover:scale-105 transition"
//           >
//             BE THE BACHELOR
//             <span className="block text-xs font-light italic">(1 Token)</span>
//           </button>

//           <button
//             onClick={handleJoinGame}
//             className="relative px-8 py-4 font-bold uppercase tracking-widest text-teal-100 border border-teal-400 bg-gradient-to-br from-teal-500 to-teal-900 hover:scale-105 transition shadow-lg"
//           >
//             BE A CONTESTANT
//           </button>
//         </div>
//       </div>

//       <style>{`
//         @keyframes floatParticle {
//           0%,100% { transform: translateY(0); }
//           50% { transform: translateY(-30px); }
//         }
//         .clip-path-polygon {
//           clip-path: polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default StartGame;

"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { useSelector } from "react-redux";

const DEFAULT_VIDEO_SRC = "/videos/IB_2.mp4";

// ---------------------------------------------------------------------------
// VideoModal
// ---------------------------------------------------------------------------
function VideoModal({ onCreateGame }: { onCreateGame: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showEnded, setShowEnded] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const CIRCUMFERENCE = 2 * Math.PI * 24;

  // Auto-play on mount
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  // Countdown after video ends → call onCreateGame
  const advance = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setShowEnded(false);
    onCreateGame();
  }, [onCreateGame]);

  useEffect(() => {
    if (!showEnded) return;
    let count = 3;
    setCountdown(count);
    countdownRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) advance();
    }, 1000);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [showEnded, advance]);

  function handleCanPlay() {
    setIsLoading(false);
    videoRef.current?.play().catch(() => {});
  }

  function handlePlayPause() {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }

  function handleTimeUpdate() {
    const v = videoRef.current;
    if (!v) return;
    const dur = v.duration || 0;
    const cur = v.currentTime || 0;
    setCurrentTime(cur);
    setDuration(dur);
    setProgress(dur ? (cur / dur) * 100 : 0);
  }

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * (v.duration || 0);
  }

  function handleSpeedChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = parseFloat(e.target.value);
    setSpeed(val);
    if (videoRef.current) videoRef.current.playbackRate = val;
  }

  function handleEnded() {
    setIsPlaying(false);
    setShowEnded(true);
  }

  function fmt(s: number) {
    s = Math.floor(s || 0);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  const strokeOffset = CIRCUMFERENCE - ((3 - countdown) / 3) * CIRCUMFERENCE;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl flex flex-col gap-4">
        {/* Video wrapper */}
        <div className="relative rounded-2xl bg-black overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-5 z-10">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                <div className="absolute inset-0 rounded-full border-2 border-t-amber-400 border-r-rose-500 border-b-transparent border-l-transparent animate-spin" />
              </div>
              <p className="text-white/50 text-xs uppercase tracking-[0.3em] font-semibold">
                Loading video...
              </p>
            </div>
          )}

          <video
            ref={videoRef}
            src={DEFAULT_VIDEO_SRC}
            className="w-full max-h-[75vh] object-cover bg-black"
            onCanPlay={handleCanPlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            playsInline
          />

          {/* Video ended overlay */}
          {showEnded && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4">
              <span className="text-5xl animate-bounce">🌹</span>
              <p className="text-amber-400 font-extrabold text-lg uppercase tracking-widest">
                Video Complete!
              </p>
              <div className="relative w-14 h-14">
                <svg
                  className="absolute inset-0 -rotate-90"
                  viewBox="0 0 56 56"
                >
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="rgba(245,158,11,0.2)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="4"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-amber-400 font-black text-lg">
                  {countdown}
                </span>
              </div>
              <p className="text-white/40 text-xs tracking-widest">
                Starting game...
              </p>
            </div>
          )}
        </div>

        {/* Controls bar */}
        <div className="rounded-2xl border border-amber-500/20 bg-black/70 backdrop-blur-sm px-5 py-4 flex items-center gap-4 flex-wrap">
          {/* Play / Pause */}
          <button
            onClick={handlePlayPause}
            className="w-10 h-10 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-400 flex items-center justify-center text-sm hover:bg-amber-400/20 transition-colors flex-shrink-0"
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          {/* Progress */}
          <div className="flex-1 min-w-[120px] flex flex-col gap-1">
            <div
              className="w-full h-1 bg-white/10 rounded-full cursor-pointer relative"
              onClick={handleProgressClick}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500 pointer-events-none"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white/40 text-[10px] tracking-wide">
              {fmt(currentTime)} / {fmt(duration)}
            </span>
          </div>

          {/* Speed */}
          <select
            value={speed}
            onChange={handleSpeedChange}
            className="bg-black/60 border border-amber-400/40 text-amber-400 rounded-lg px-2 py-1.5 text-xs font-bold tracking-wider cursor-pointer flex-shrink-0"
          >
            <option value={0.5}>0.5×</option>
            <option value={1}>1×</option>
            <option value={1.5}>1.5×</option>
            <option value={2}>2×</option>
            <option value={3}>3×</option>
          </select>

          {/* Skip — also acts as Next */}
          <button
            onClick={advance}
            className="px-4 py-2 rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-400 text-xs font-bold tracking-wider hover:bg-amber-400/20 transition-colors flex-shrink-0"
          >
            ⏭ Skip
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StartGame (main component)
// ---------------------------------------------------------------------------
const StartGame: React.FC = () => {
  const router = useRouter();
  const currentUser = useSelector((state: any) => state.user.user);

  const [showVideoModal, setShowVideoModal] = useState(false);

  const { sendEvent } = useSocket({
    GAME_STARTED: (payload) => {
      console.log("🎮 Game Started:", payload);
      alert("Game Started!");
    },
    PLAYERS_UPDATE: (payload) => {
      console.log("👥 Players:", payload);
    },
  });

  // Particles
  useEffect(() => {
    const container = document.getElementById("particles");
    if (!container) return;
    for (let i = 0; i < 28; i++) {
      const p = document.createElement("div");
      const size = Math.random() * 4 + 2;
      p.style.position = "absolute";
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.borderRadius = "50%";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.background = "radial-gradient(circle,#FFE566,#FF8C00)";
      p.style.boxShadow = `0 0 ${size * 2}px #FFD700`;
      p.style.opacity = String(0.25 + Math.random() * 0.55);
      p.style.animation = `floatParticle ${4 + Math.random() * 7}s ease-in-out infinite`;
      p.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(p);
    }
  }, []);

  // Called when video ends naturally OR Skip is clicked
  const handleCreateGame = useCallback(() => {
    setShowVideoModal(false);
    sendEvent("CREATE_GAME", { gameType: "INTERNET_BACHELOR" }, (response) => {
      console.log("✅ Server ACK:", response);
      if (response.success) {
        router.push("/host");
      }
    });
  }, [sendEvent, router]);

  const handleJoinGame = () => {
    const payload = {
      gameId: "internet-bachelor-123",
      name: currentUser.name,
      avatar: currentUser.avatar,
    };
    console.log("🚀 Sending payload:", payload);
    sendEvent("JOIN_GAME", payload, (response) => {
      console.log("✅ ACK:", response);
      if (response.success) {
        router.push("/ready-game");
      }
    });
  };

  return (
    <>
      <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-serif">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#8B1A00,transparent_60%),radial-gradient(ellipse_at_bottom,#0A0000,#000)]" />

        <div className="absolute bottom-0 w-full opacity-60">
          <svg viewBox="0 0 1400 500" className="w-full h-[55vh]">
            <rect width="100%" height="100%" fill="url(#g)" />
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5C1A00" />
                <stop offset="100%" stopColor="#1A0500" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div id="particles" className="absolute inset-0 pointer-events-none" />

        <div className="relative z-10 -top-12 flex flex-col items-center text-center px-6">
          <p className="uppercase tracking-[0.4em] text-yellow-400 text-xs mb-4 italic">
            Season One · Premium Edition
          </p>

          <div className="relative flex flex-col items-center mb-6">
            <img
              src="./bachelor-bg-removebg-preview.png"
              alt="premium edition"
              className="w-xl opacity-90"
            />
            <h2 className="mt-3 text-white font-extrabold text-lg md:text-2xl tracking-widest uppercase">
              Legendary Experience
            </h2>
          </div>

          <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-orange-700 text-4xl md:text-6xl font-black tracking-widest">
            INTERNET BACHELOR
          </h1>

          <p className="text-red-300 italic mt-2 text-lg md:text-xl">
            Connect. Find Love.
          </p>

          <div className="flex flex-wrap gap-6 mt-10 justify-center">
            {/* Opens video modal first, then creates game after video */}
            <button
              onClick={() => setShowVideoModal(true)}
              className="relative px-8 py-4 font-bold uppercase tracking-widest text-black bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-600 clip-path-polygon shadow-[0_0_40px_rgba(255,180,0,0.6)] hover:scale-105 transition"
            >
              BE THE BACHELOR
              <span className="block text-xs font-light italic">(1 Token)</span>
            </button>

            <button
              onClick={handleJoinGame}
              className="relative px-8 py-4 font-bold uppercase tracking-widest text-teal-100 border border-teal-400 bg-gradient-to-br from-teal-500 to-teal-900 hover:scale-105 transition shadow-lg"
            >
              BE A CONTESTANT
            </button>
          </div>
        </div>

        <style>{`
          @keyframes floatParticle {
            0%,100% { transform: translateY(0); }
            50% { transform: translateY(-30px); }
          }
          .clip-path-polygon {
            clip-path: polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%);
          }
        `}</style>
      </div>

      {/* Video Modal — rendered outside the main div so it overlays everything */}
      {showVideoModal && <VideoModal onCreateGame={handleCreateGame} />}
    </>
  );
};

export default StartGame;
