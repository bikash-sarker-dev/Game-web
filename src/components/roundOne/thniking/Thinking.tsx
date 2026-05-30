// "use client";

// import Button from "@/components/share/ButtonPrimary";
// import { useRouter } from "next/navigation";
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import ParticipantPanel from "../Participantpanel";
// import { useSocket } from "@/hooks/useSocket";
// import { ArrowRight } from "lucide-react";

// // ─── Types ───────────────────────────────────────────────────────────────────

// interface Submission {
//   userId: string;
//   answer: string;
// }

// interface Player {
//   userId: string;
//   answer: string;
//   index: number;
// }

// interface CanNextPayload {
//   label: string;
//   nextRoundIndex: number;
// }

// // ─── Demo video source — replace with your real URL ──────────────────────────
// // const DEFAULT_VIDEO_SRC = "https://www.w3schools.com/html/mov_bbb.mp4";
// const DEFAULT_VIDEO_SRC = "/videos/IB_Round_2.mp4";

// // ─── Typing Hook ─────────────────────────────────────────────────────────────

// function useTypingEffect(text: string, speed = 38) {
//   const [displayed, setDisplayed] = useState("");
//   useEffect(() => {
//     setDisplayed("");
//     if (!text) return;
//     let i = 0;
//     const iv = setInterval(() => {
//       i++;
//       setDisplayed(text.slice(0, i));
//       if (i >= text.length) clearInterval(iv);
//     }, speed);
//     return () => clearInterval(iv);
//   }, [text, speed]);
//   return displayed;
// }

// // ─── PlayerCard ──────────────────────────────────────────────────────────────

// const CARD_COLORS = [
//   "#f97316",
//   "#60a5fa",
//   "#34d399",
//   "#a78bfa",
//   "#fbbf24",
//   "#f472b6",
//   "#22d3ee",
//   "#86efac",
// ];

// function PlayerCard({
//   player,
//   onEliminate,
//   loading,
// }: {
//   player: Player;
//   onEliminate: (userId: string) => void;
//   loading: boolean;
// }) {
//   const displayed = useTypingEffect(player.answer);
//   const color = CARD_COLORS[player.index % CARD_COLORS.length];

//   return (
//     <div
//       className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500"
//       style={{
//         background: "linear-gradient(160deg, #1a0808 0%, #0e0404 100%)",
//         border: "1.5px solid rgba(220,38,38,0.38)",
//         boxShadow:
//           "0 0 40px rgba(180,20,20,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
//       }}
//     >
//       <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

//       {/* Header */}
//       <div className="px-5 pt-5 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <span
//             className="w-1.5 h-1.5 rounded-full"
//             style={{ background: color }}
//           />
//           <span className="text-[11px] font-black tracking-[0.22em] text-zinc-400 uppercase">
//             Player {player.index + 1}
//           </span>
//         </div>
//         <span className="text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border text-emerald-400 bg-emerald-400/10 border-emerald-400/30">
//           ANSWERED
//         </span>
//       </div>

//       {/* Avatar */}
//       <div className="flex justify-center py-4">
//         <div
//           className="p-[3px] rounded-full"
//           style={{
//             background: `conic-gradient(${color}80, transparent, ${color}80)`,
//           }}
//         >
//           <div
//             className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-black"
//             style={{
//               background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}44)`,
//               boxShadow: `0 0 20px ${color}50`,
//             }}
//           >
//             {player.index + 1}
//           </div>
//         </div>
//       </div>

//       <div className="mx-4 h-px bg-white/5 mb-3" />

//       {/* Answer Box */}
//       <div
//         className="mx-4 mb-4 rounded-xl flex items-center justify-center min-h-[100px] relative overflow-hidden px-4 py-4"
//         style={{
//           background: "rgba(0,0,0,0.42)",
//           border: "1px solid rgba(255,255,255,0.05)",
//         }}
//       >
//         <p className="text-zinc-200 text-sm leading-relaxed font-medium text-center">
//           "{displayed}"
//           <span className="animate-pulse text-red-400 ml-0.5">|</span>
//         </p>
//       </div>

//       {/* Eliminate Button */}
//       <div className="px-4 pb-5 flex justify-center">
//         <Button
//           variant="game"
//           onClick={() => onEliminate(player.userId)}
//           disabled={loading}
//         >
//           {loading ? "Eliminating..." : `ELIMINATE P${player.index + 1}`}
//         </Button>
//       </div>
//     </div>
//   );
// }

// // ─── VideoModal ───────────────────────────────────────────────────────────────

// function VideoModal({ onFinish }: { onFinish: () => void }) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const [isLoading, setIsLoading] = useState(true);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [speed, setSpeed] = useState(1);
//   const [showEnded, setShowEnded] = useState(false);
//   const [countdown, setCountdown] = useState(3);
//   const [showControls, setShowControls] = useState(true);

//   const CIRCUMFERENCE = 2 * Math.PI * 24;

//   // Auto-play
//   useEffect(() => {
//     videoRef.current?.play().catch(() => {});
//   }, []);

//   // Auto-hide controls after 3 s of inactivity
//   const resetControlsTimer = useCallback(() => {
//     setShowControls(true);
//     if (controlsTimer.current) clearTimeout(controlsTimer.current);
//     controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
//   }, []);

//   useEffect(() => {
//     resetControlsTimer();
//     return () => {
//       if (controlsTimer.current) clearTimeout(controlsTimer.current);
//     };
//   }, [resetControlsTimer]);

//   const advance = useCallback(() => {
//     if (countdownRef.current) clearInterval(countdownRef.current);
//     setShowEnded(false);
//     onFinish();
//   }, [onFinish]);

//   useEffect(() => {
//     if (!showEnded) return;
//     let count = 3;
//     setCountdown(count);
//     countdownRef.current = setInterval(() => {
//       count -= 1;
//       setCountdown(count);
//       if (count <= 0) advance();
//     }, 1000);
//     return () => {
//       if (countdownRef.current) clearInterval(countdownRef.current);
//     };
//   }, [showEnded, advance]);

//   function handleCanPlay() {
//     setIsLoading(false);
//     videoRef.current?.play().catch(() => {});
//   }

//   function handlePlayPause() {
//     if (!videoRef.current) return;
//     videoRef.current.paused
//       ? videoRef.current.play()
//       : videoRef.current.pause();
//     resetControlsTimer();
//   }

//   function handleTimeUpdate() {
//     const v = videoRef.current;
//     if (!v) return;
//     const dur = v.duration || 0;
//     const cur = v.currentTime || 0;
//     setCurrentTime(cur);
//     setDuration(dur);
//     setProgress(dur ? (cur / dur) * 100 : 0);
//   }

//   function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
//     const v = videoRef.current;
//     if (!v) return;
//     const rect = e.currentTarget.getBoundingClientRect();
//     v.currentTime = ((e.clientX - rect.left) / rect.width) * (v.duration || 0);
//     resetControlsTimer();
//   }

//   function handleSpeedChange(e: React.ChangeEvent<HTMLSelectElement>) {
//     const val = parseFloat(e.target.value);
//     setSpeed(val);
//     if (videoRef.current) videoRef.current.playbackRate = val;
//     resetControlsTimer();
//   }

//   function handleEnded() {
//     setIsPlaying(false);
//     setShowEnded(true);
//     setShowControls(true);
//   }

//   function fmt(s: number) {
//     s = Math.floor(s || 0);
//     return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
//   }

//   const strokeOffset = CIRCUMFERENCE - ((3 - countdown) / 3) * CIRCUMFERENCE;

//   return (
//     <div
//       className="fixed inset-0 z-50 bg-black flex flex-col"
//       onMouseMove={resetControlsTimer}
//       onTouchStart={resetControlsTimer}
//     >
//       {/* Video fills entire screen */}
//       <video
//         ref={videoRef}
//         src={DEFAULT_VIDEO_SRC}
//         className="absolute inset-0 w-full h-full object-cover"
//         onCanPlay={handleCanPlay}
//         onPlay={() => setIsPlaying(true)}
//         onPause={() => setIsPlaying(false)}
//         onTimeUpdate={handleTimeUpdate}
//         onEnded={handleEnded}
//         playsInline
//         onClick={handlePlayPause}
//       />

//       {/* Loading spinner */}
//       {isLoading && (
//         <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-5 z-20">
//           <div className="relative w-16 h-16">
//             <div className="absolute inset-0 rounded-full border-2 border-white/10" />
//             <div className="absolute inset-0 rounded-full border-2 border-t-amber-400 border-r-rose-500 border-b-transparent border-l-transparent animate-spin" />
//           </div>
//           <p className="text-white/50 text-xs uppercase tracking-[0.3em] font-semibold">
//             Loading video...
//           </p>
//         </div>
//       )}

//       {/* Top gradient — label + skip */}
//       <div
//         className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 pt-6 pb-16 transition-opacity duration-500"
//         style={{
//           opacity: showControls ? 1 : 0,
//           background:
//             "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)",
//         }}
//       >
//         <span className="px-3 py-1 rounded-full border border-red-400/40 bg-black/40 backdrop-blur-sm text-red-400 text-[11px] font-bold uppercase tracking-widest">
//           🎬 Round Transition
//         </span>
//         <button
//           onClick={advance}
//           className="px-4 py-2 rounded-xl border border-white/20 bg-black/40 backdrop-blur-sm text-white/80 text-xs font-bold tracking-wider hover:bg-white/10 transition-colors"
//         >
//           ⏭ Skip
//         </button>
//       </div>

//       {/* Bottom gradient — progress + controls */}
//       <div
//         className="absolute bottom-0 inset-x-0 z-30 px-6 pb-8 pt-16 transition-opacity duration-500"
//         style={{
//           opacity: showControls ? 1 : 0,
//           background:
//             "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
//         }}
//       >
//         {/* Progress bar */}
//         <div
//           className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-4 group"
//           onClick={handleProgressClick}
//         >
//           <div
//             className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400 relative pointer-events-none"
//             style={{ width: `${progress}%` }}
//           >
//             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-red-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
//           </div>
//         </div>

//         {/* Controls row */}
//         <div className="flex items-center gap-4">
//           <button
//             onClick={handlePlayPause}
//             className="w-11 h-11 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm text-white flex items-center justify-center text-base hover:bg-white/10 transition-colors flex-shrink-0"
//           >
//             {isPlaying ? "⏸" : "▶"}
//           </button>

//           <span className="text-white/60 text-xs tracking-wide tabular-nums flex-shrink-0">
//             {fmt(currentTime)} / {fmt(duration)}
//           </span>

//           <div className="flex-1" />

//           <select
//             value={speed}
//             onChange={handleSpeedChange}
//             className="bg-black/50 border border-white/20 text-white/80 rounded-lg px-2 py-1.5 text-xs font-bold tracking-wider cursor-pointer flex-shrink-0 backdrop-blur-sm"
//           >
//             <option value={0.5}>0.5×</option>
//             <option value={1}>1×</option>
//             <option value={1.5}>1.5×</option>
//             <option value={2}>2×</option>
//             <option value={3}>3×</option>
//           </select>
//         </div>
//       </div>

//       {/* Video ended overlay */}
//       {showEnded && (
//         <div className="absolute inset-0 z-40 bg-black/70 flex flex-col items-center justify-center gap-5">
//           <span
//             className="text-6xl"
//             style={{ animation: "rosePulse2 1.2s ease-in-out infinite" }}
//           >
//             🌹
//           </span>
//           <p className="text-red-400 font-extrabold text-xl uppercase tracking-widest">
//             Video Complete!
//           </p>

//           {/* Countdown ring */}
//           <div className="relative w-16 h-16">
//             <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
//               <circle
//                 cx="28"
//                 cy="28"
//                 r="24"
//                 fill="none"
//                 stroke="rgba(239,68,68,0.2)"
//                 strokeWidth="4"
//               />
//               <circle
//                 cx="28"
//                 cy="28"
//                 r="24"
//                 fill="none"
//                 stroke="#ef4444"
//                 strokeWidth="4"
//                 strokeDasharray={CIRCUMFERENCE}
//                 strokeDashoffset={strokeOffset}
//                 strokeLinecap="round"
//                 className="transition-all duration-1000"
//               />
//             </svg>
//             <span className="absolute inset-0 flex items-center justify-center text-red-400 font-black text-xl">
//               {countdown}
//             </span>
//           </div>

//           <p className="text-white/50 text-sm tracking-widest">
//             Starting next round...
//           </p>

//           <button
//             onClick={advance}
//             className="mt-2 px-6 py-2.5 rounded-xl bg-red-400/20 border border-red-400/50 text-red-400 text-sm font-bold tracking-wider hover:bg-red-400/30 transition-colors"
//           >
//             Continue Now →
//           </button>
//         </div>
//       )}

//       <style>{`
//         @keyframes rosePulse2 {
//           0%,100% { transform:scale(1);   filter:drop-shadow(0 0 14px rgba(239,68,68,.6)); }
//           50%     { transform:scale(1.2); filter:drop-shadow(0 0 32px rgba(239,68,68,1)); }
//         }
//       `}</style>
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function ThinkingProccess() {
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [timer, setTimer] = useState(120);
//   const [loadingId, setLoadingId] = useState<string | null>(null);
//   const [canNext, setCanNext] = useState(false);
//   const [nextLabel, setNextLabel] = useState("Start Next Round");
//   const [nextRoundIndex, setNextRoundIndex] = useState(1);

//   // ← NEW: controls whether the video modal is visible
//   const [showVideo, setShowVideo] = useState(false);

//   const router = useRouter();

//   const { sendEvent } = useSocket({
//     GAME_EVENT: (payload) => {
//       console.log("🎮 Game Event received:", payload);

//       if (payload.type === "ANSWER_SUBMITTED") {
//         const submissions: Submission[] = payload.payload.allSubmissions || [];
//         setPlayers(
//           submissions.map((s, i) => ({
//             userId: s.userId,
//             answer: s.answer,
//             index: i,
//           })),
//         );
//       }

//       if (payload.type === "CAN_NEXT") {
//         const data: CanNextPayload = payload.payload;
//         setCanNext(true);
//         setNextLabel(data.label || "Start Next Round");
//         setNextRoundIndex(data.nextRoundIndex || 1);
//       }
//     },
//   });

//   const handleEliminate = (userId: string) => {
//     setLoadingId(userId);
//     sendEvent(
//       "GAME_EVENT",
//       {
//         gameId: "internet-bachelor-123",
//         type: "ELIMINATE",
//         payload: { playerIds: [userId], points: 100 },
//       },
//       (response) => {
//         console.log("✅ Eliminate ACK:", response);
//         setLoadingId(null);
//       },
//     );
//   };

//   // Called when the "Next Round" button is clicked → open video first
//   const handleNextRoundClick = () => {
//     setShowVideo(true);
//   };

//   // Called when the video finishes or is skipped → send socket event + navigate
//   const handleVideoFinish = () => {
//     setShowVideo(false);
//     sendEvent(
//       "GAME_EVENT",
//       {
//         gameId: "internet-bachelor-123",
//         type: "NEXT_ROUND",
//         payload: { roundIndex: nextRoundIndex },
//       },
//       (response) => {
//         console.log("✅ Next Round ACK:", response);
//         router.push("/round-two/round-two-two");
//       },
//     );
//   };

//   // Timer
//   useEffect(() => {
//     if (timer <= 0) return;
//     const iv = setInterval(() => setTimer((t) => Math.max(0, t - 1)), 1000);
//     return () => clearInterval(iv);
//   }, [timer]);

//   const fmt = (s: number) =>
//     `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

//   return (
//     <>
//       {/* Video modal — renders above everything when active */}
//       {showVideo && <VideoModal onFinish={handleVideoFinish} />}

//       <div className="min-h-screen w-full flex flex-col items-center">
//         {/* Hero Title */}
//         <div className="w-full max-w-6xl px-4 pt-6 pb-8 text-center">
//           <p className="text-red-500/50 text-xs tracking-[0.35em] font-bold uppercase mb-3">
//             HOST CONTROL PANEL
//           </p>
//           <h1 className="text-4xl sm:text-5xl uppercase font-black tracking-widest text-white">
//             ROUND 1 — Questions
//           </h1>
//           <p className="text-red-500/50 text-base tracking-[0.10em] font-bold capitalize mt-3">
//             Eliminate Down to {players.length}
//           </p>
//         </div>

//         {/* Stats */}
//         <div className="w-full max-w-7xl px-4 pb-8 flex flex-wrap justify-center gap-3">
//           {[
//             { label: "ROUND", value: "1 of 3" },
//             { label: "POINTS", value: "100 pts" },
//             { label: "ANSWERED", value: `${players.length} / 7` },
//           ].map((s) => (
//             <div
//               key={s.label}
//               className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
//             >
//               <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
//                 {s.label}
//               </span>
//               <span className="text-sm font-bold text-zinc-200">{s.value}</span>
//             </div>
//           ))}
//         </div>

//         <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 flex gap-6">
//           {/* Player Cards Grid + Next Round Button */}
//           <div className="flex-1 flex flex-col">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 content-start flex-1">
//               {players.length === 0 ? (
//                 <div className="col-span-2 flex flex-col items-center justify-center min-h-[300px] gap-4">
//                   <div className="flex gap-2">
//                     {[0, 1, 2].map((i) => (
//                       <span
//                         key={i}
//                         className="w-3 h-3 rounded-full bg-zinc-600 animate-bounce"
//                         style={{ animationDelay: `${i * 150}ms` }}
//                       />
//                     ))}
//                   </div>
//                   <p className="text-zinc-500 text-sm uppercase tracking-widest">
//                     Waiting for player answers...
//                   </p>
//                 </div>
//               ) : (
//                 players.map((player) => (
//                   <PlayerCard
//                     key={player.userId}
//                     player={player}
//                     onEliminate={handleEliminate}
//                     loading={loadingId === player.userId}
//                   />
//                 ))
//               )}
//             </div>

//             {/* Next Round Button — opens video modal */}
//             {canNext && (
//               <div className="mt-10 flex justify-center pb-6">
//                 <Button
//                   variant="game"
//                   onClick={handleNextRoundClick}
//                   className="flex items-center gap-3 px-12 py-4 text-lg font-bold
//                      shadow-2xl shadow-red-600/40 hover:shadow-red-500/60
//                      hover:scale-105 active:scale-100 transition-all duration-300
//                      min-w-[320px]"
//                 >
//                   {nextLabel}
//                   <ArrowRight className="w-6 h-6" />
//                 </Button>
//               </div>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="hidden lg:block w-[340px] flex-shrink-0 self-start sticky top-6">
//             <ParticipantPanel />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
"use client";

import Button from "@/components/share/ButtonPrimary";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ParticipantPanel from "../Participantpanel";
import { useSocket } from "@/hooks/useSocket";
import { ArrowRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Submission {
  userId: string;
  answer: string;
}

interface Player {
  userId: string;
  answer: string;
  index: number;
}

interface CanNextPayload {
  label: string;
  nextRoundIndex: number;
}

// ─── Demo video source ────────────────────────────────────────────────────────
const DEFAULT_VIDEO_SRC = "/videos/IB_Round_2.mp4";

// ─── Typing Hook ──────────────────────────────────────────────────────────────

function useTypingEffect(text: string, speed = 38) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return displayed;
}

// ─── RouteLoadingOverlay ──────────────────────────────────────────────────────
// Shown immediately when navigation begins — masks the blank flash while
// router.push() resolves. z-[100] keeps it above everything else.

function RouteLoadingOverlay() {
  const [dots, setDots] = useState(0);
  const [phase, setPhase] = useState(0);

  const phases = [
    "Preparing next round",
    "Setting the stage",
    "Starting your game",
  ];

  useEffect(() => {
    const dotTimer = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    const phaseTimer = setInterval(
      () => setPhase((p) => Math.min(p + 1, phases.length - 1)),
      900,
    );
    return () => {
      clearInterval(dotTimer);
      clearInterval(phaseTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#5C1A0060,transparent_70%)] pointer-events-none" />

      <div className="relative flex items-center justify-center mb-10">
        <div
          className="absolute w-36 h-36 rounded-full border border-amber-400/20 animate-ping"
          style={{ animationDuration: "1.8s" }}
        />
        <div
          className="absolute w-28 h-28 rounded-full border border-rose-500/30 animate-ping"
          style={{ animationDuration: "1.3s", animationDelay: "0.3s" }}
        />
        <svg
          className="absolute w-32 h-32 -rotate-90 animate-spin"
          style={{ animationDuration: "2s" }}
          viewBox="0 0 128 128"
        >
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="rgba(245,158,11,0.1)"
            strokeWidth="3"
          />
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="url(#tpArcG)"
            strokeWidth="3"
            strokeDasharray="364"
            strokeDashoffset="274"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="tpArcG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="absolute w-20 h-20"
          style={{ animation: "tpCounterSpin 1.4s linear infinite" }}
          viewBox="0 0 80 80"
        >
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="rgba(239,68,68,0.15)"
            strokeWidth="2"
          />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="214"
            strokeDashoffset="160"
            strokeLinecap="round"
          />
        </svg>
        <span
          className="text-4xl z-10"
          style={{ animation: "tpRosePulse 1.8s ease-in-out infinite" }}
        >
          🌹
        </span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="text-amber-400 font-extrabold text-sm uppercase tracking-[0.35em]">
          {phases[phase]}
          {".".repeat(dots)}
        </p>
        <div className="w-56 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400"
            style={{ animation: "tpShimmerBar 1.6s ease-in-out infinite" }}
          />
        </div>
        <p className="text-white/25 text-[10px] tracking-[0.5em] uppercase mt-1">
          Please wait
        </p>
      </div>

      <style>{`
        @keyframes tpRosePulse   { 0%,100%{transform:scale(1);filter:drop-shadow(0 0 10px rgba(239,68,68,.5))} 50%{transform:scale(1.18);filter:drop-shadow(0 0 26px rgba(239,68,68,1))} }
        @keyframes tpCounterSpin { from{transform:rotate(90deg)} to{transform:rotate(-270deg)} }
        @keyframes tpShimmerBar  { 0%{transform:translateX(-200%)} 100%{transform:translateX(500%)} }
      `}</style>
    </div>
  );
}

// ─── PlayerCard ───────────────────────────────────────────────────────────────

const CARD_COLORS = [
  "#f97316",
  "#60a5fa",
  "#34d399",
  "#a78bfa",
  "#fbbf24",
  "#f472b6",
  "#22d3ee",
  "#86efac",
];

function PlayerCard({
  player,
  onEliminate,
  loading,
}: {
  player: Player;
  onEliminate: (userId: string) => void;
  loading: boolean;
}) {
  const displayed = useTypingEffect(player.answer);
  const color = CARD_COLORS[player.index % CARD_COLORS.length];

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        background: "linear-gradient(160deg, #1a0808 0%, #0e0404 100%)",
        border: "1.5px solid rgba(220,38,38,0.38)",
        boxShadow:
          "0 0 40px rgba(180,20,20,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

      <div className="px-5 pt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: color }}
          />
          <span className="text-[11px] font-black tracking-[0.22em] text-zinc-400 uppercase">
            Player {player.index + 1}
          </span>
        </div>
        <span className="text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border text-emerald-400 bg-emerald-400/10 border-emerald-400/30">
          ANSWERED
        </span>
      </div>

      <div className="flex justify-center py-4">
        <div
          className="p-[3px] rounded-full"
          style={{
            background: `conic-gradient(${color}80, transparent, ${color}80)`,
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-black"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}44)`,
              boxShadow: `0 0 20px ${color}50`,
            }}
          >
            {player.index + 1}
          </div>
        </div>
      </div>

      <div className="mx-4 h-px bg-white/5 mb-3" />

      <div
        className="mx-4 mb-4 rounded-xl flex items-center justify-center min-h-[100px] relative overflow-hidden px-4 py-4"
        style={{
          background: "rgba(0,0,0,0.42)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <p className="text-zinc-200 text-sm leading-relaxed font-medium text-center">
          "{displayed}"
          <span className="animate-pulse text-red-400 ml-0.5">|</span>
        </p>
      </div>

      <div className="px-4 pb-5 flex justify-center">
        <Button
          variant="game"
          onClick={() => onEliminate(player.userId)}
          disabled={loading}
        >
          {loading ? "Eliminating..." : `ELIMINATE P${player.index + 1}`}
        </Button>
      </div>
    </div>
  );
}

// ─── VideoModal ───────────────────────────────────────────────────────────────
// onFinish is called when the user skips or the countdown ends.
// The parent sets isNavigating=true BEFORE calling router.push so the
// RouteLoadingOverlay is already visible during the async navigation.

function VideoModal({ onFinish }: { onFinish: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showEnded, setShowEnded] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showControls, setShowControls] = useState(true);

  const CIRCUMFERENCE = 2 * Math.PI * 24;

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    };
  }, [resetControlsTimer]);

  // advance() → just call onFinish(). The parent handles showing the overlay.
  const advance = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setShowEnded(false);
    onFinish();
  }, [onFinish]);

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
    videoRef.current.paused
      ? videoRef.current.play()
      : videoRef.current.pause();
    resetControlsTimer();
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
    v.currentTime = ((e.clientX - rect.left) / rect.width) * (v.duration || 0);
    resetControlsTimer();
  }
  function handleSpeedChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = parseFloat(e.target.value);
    setSpeed(val);
    if (videoRef.current) videoRef.current.playbackRate = val;
    resetControlsTimer();
  }
  function handleEnded() {
    setIsPlaying(false);
    setShowEnded(true);
    setShowControls(true);
  }
  function fmt(s: number) {
    s = Math.floor(s || 0);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  const strokeOffset = CIRCUMFERENCE - ((3 - countdown) / 3) * CIRCUMFERENCE;

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col"
      onMouseMove={resetControlsTimer}
      onTouchStart={resetControlsTimer}
    >
      <video
        ref={videoRef}
        src={DEFAULT_VIDEO_SRC}
        className="absolute inset-0 w-full h-full object-cover"
        onCanPlay={handleCanPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        playsInline
        onClick={handlePlayPause}
      />

      {/* Video buffer loading spinner — matches the RouteLoadingOverlay style */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-5 z-20">
          <div className="relative flex items-center justify-center">
            <div
              className="absolute w-36 h-36 rounded-full border border-amber-400/20 animate-ping"
              style={{ animationDuration: "1.8s" }}
            />
            <div
              className="absolute w-28 h-28 rounded-full border border-rose-500/30 animate-ping"
              style={{ animationDuration: "1.3s", animationDelay: "0.3s" }}
            />
            <svg
              className="absolute w-32 h-32 -rotate-90 animate-spin"
              style={{ animationDuration: "2s" }}
              viewBox="0 0 128 128"
            >
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="rgba(245,158,11,0.1)"
                strokeWidth="3"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="url(#tpVidArcG)"
                strokeWidth="3"
                strokeDasharray="364"
                strokeDashoffset="274"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="tpVidArcG" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
            <svg
              className="absolute w-20 h-20"
              style={{ animation: "tpCounterSpin 1.4s linear infinite" }}
              viewBox="0 0 80 80"
            >
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="rgba(239,68,68,0.15)"
                strokeWidth="2"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="214"
                strokeDashoffset="160"
                strokeLinecap="round"
              />
            </svg>
            <span
              className="text-4xl z-10"
              style={{ animation: "tpRosePulse 1.8s ease-in-out infinite" }}
            >
              🌹
            </span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <p className="text-amber-400 font-extrabold text-sm uppercase tracking-[0.35em]">
              Loading video...
            </p>
            <div className="w-56 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full w-1/3 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400"
                style={{ animation: "tpShimmerBar 1.6s ease-in-out infinite" }}
              />
            </div>
            <p className="text-white/25 text-[10px] tracking-[0.5em] uppercase mt-1">
              Please wait
            </p>
          </div>
          <style>{`
            @keyframes tpRosePulse   { 0%,100%{transform:scale(1);filter:drop-shadow(0 0 10px rgba(239,68,68,.5))} 50%{transform:scale(1.18);filter:drop-shadow(0 0 26px rgba(239,68,68,1))} }
            @keyframes tpCounterSpin { from{transform:rotate(90deg)} to{transform:rotate(-270deg)} }
            @keyframes tpShimmerBar  { 0%{transform:translateX(-200%)} 100%{transform:translateX(500%)} }
          `}</style>
        </div>
      )}

      {/* Top gradient — label + skip */}
      <div
        className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 pt-6 pb-16 transition-opacity duration-500"
        style={{
          opacity: showControls ? 1 : 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)",
        }}
      >
        <span className="px-3 py-1 rounded-full border border-red-400/40 bg-black/40 backdrop-blur-sm text-red-400 text-[11px] font-bold uppercase tracking-widest">
          🎬 Round Transition
        </span>
        <button
          onClick={advance}
          className="px-4 py-2 rounded-xl border border-white/20 bg-black/40 backdrop-blur-sm text-white/80 text-xs font-bold tracking-wider hover:bg-white/10 transition-colors"
        >
          ⏭ Skip
        </button>
      </div>

      {/* Bottom gradient — progress + controls */}
      <div
        className="absolute bottom-0 inset-x-0 z-30 px-6 pb-8 pt-16 transition-opacity duration-500"
        style={{
          opacity: showControls ? 1 : 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
        }}
      >
        <div
          className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-4 group"
          onClick={handleProgressClick}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400 relative pointer-events-none"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-red-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePlayPause}
            className="w-11 h-11 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm text-white flex items-center justify-center text-base hover:bg-white/10 transition-colors flex-shrink-0"
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <span className="text-white/60 text-xs tracking-wide tabular-nums flex-shrink-0">
            {fmt(currentTime)} / {fmt(duration)}
          </span>
          <div className="flex-1" />
          <select
            value={speed}
            onChange={handleSpeedChange}
            className="bg-black/50 border border-white/20 text-white/80 rounded-lg px-2 py-1.5 text-xs font-bold tracking-wider cursor-pointer flex-shrink-0 backdrop-blur-sm"
          >
            <option value={0.5}>0.5×</option>
            <option value={1}>1×</option>
            <option value={1.5}>1.5×</option>
            <option value={2}>2×</option>
            <option value={3}>3×</option>
          </select>
        </div>
      </div>

      {/* Video ended overlay */}
      {showEnded && (
        <div className="absolute inset-0 z-40 bg-black/70 flex flex-col items-center justify-center gap-5">
          <span
            className="text-6xl"
            style={{ animation: "tpRosePulseEnd 1.2s ease-in-out infinite" }}
          >
            🌹
          </span>
          <p className="text-red-400 font-extrabold text-xl uppercase tracking-widest">
            Video Complete!
          </p>
          <div className="relative w-16 h-16">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="rgba(239,68,68,0.2)"
                strokeWidth="4"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="4"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-red-400 font-black text-xl">
              {countdown}
            </span>
          </div>
          <p className="text-white/50 text-sm tracking-widest">
            Starting next round...
          </p>
          <button
            onClick={advance}
            className="mt-2 px-6 py-2.5 rounded-xl bg-red-400/20 border border-red-400/50 text-red-400 text-sm font-bold tracking-wider hover:bg-red-400/30 transition-colors"
          >
            Continue Now →
          </button>
        </div>
      )}

      <style>{`
        @keyframes tpRosePulseEnd { 0%,100%{transform:scale(1);filter:drop-shadow(0 0 14px rgba(239,68,68,.6))} 50%{transform:scale(1.2);filter:drop-shadow(0 0 32px rgba(239,68,68,1))} }
      `}</style>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ThinkingProccess() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [timer, setTimer] = useState(120);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [canNext, setCanNext] = useState(false);
  const [nextLabel, setNextLabel] = useState("Start Next Round");
  const [nextRoundIndex, setNextRoundIndex] = useState(1);

  // showVideo    → video modal is open
  // isNavigating → video finished/skipped; RouteLoadingOverlay covers the screen
  //                while the socket ACK + router.push() resolve
  const [showVideo, setShowVideo] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const router = useRouter();

  const { sendEvent } = useSocket({
    GAME_EVENT: (payload) => {
      console.log("🎮 Game Event received:", payload);
      if (payload.type === "ANSWER_SUBMITTED") {
        const submissions: Submission[] = payload.payload.allSubmissions || [];
        setPlayers(
          submissions.map((s, i) => ({
            userId: s.userId,
            answer: s.answer,
            index: i,
          })),
        );
      }
      if (payload.type === "CAN_NEXT") {
        const data: CanNextPayload = payload.payload;
        setCanNext(true);
        setNextLabel(data.label || "Start Next Round");
        setNextRoundIndex(data.nextRoundIndex || 1);
      }
    },
  });

  const handleEliminate = (userId: string) => {
    setLoadingId(userId);
    sendEvent(
      "GAME_EVENT",
      {
        gameId: "internet-bachelor-123",
        type: "ELIMINATE",
        payload: { playerIds: [userId], points: 100 },
      },
      (response) => {
        console.log("✅ Eliminate ACK:", response);
        setLoadingId(null);
      },
    );
  };

  const handleNextRoundClick = () => {
    setShowVideo(true);
  };

  // Called by VideoModal when user skips OR the post-video countdown finishes.
  // Flow:
  //   1. setIsNavigating(true)  → RouteLoadingOverlay mounts IMMEDIATELY (z-[100])
  //   2. setShowVideo(false)    → video unmounts
  //   3. sendEvent + router.push → async, overlay keeps screen covered
  const handleVideoFinish = useCallback(() => {
    setIsNavigating(true); // show overlay RIGHT NOW — no blank flash
    setShowVideo(false); // unmount video
    sendEvent(
      "GAME_EVENT",
      {
        gameId: "internet-bachelor-123",
        type: "NEXT_ROUND",
        payload: { roundIndex: nextRoundIndex },
      },
      (response) => {
        console.log("✅ Next Round ACK:", response);
        router.push("/round-two/round-two-two");
      },
    );
  }, [sendEvent, nextRoundIndex, router]);

  useEffect(() => {
    if (timer <= 0) return;
    const iv = setInterval(() => setTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, [timer]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <>
      {/* RouteLoadingOverlay — z-[100], shown while router.push resolves */}
      {isNavigating && <RouteLoadingOverlay />}

      {/* VideoModal — z-50, only shown when not yet navigating */}
      {showVideo && !isNavigating && (
        <VideoModal onFinish={handleVideoFinish} />
      )}

      <div className="min-h-screen w-full flex flex-col items-center">
        <div className="w-full max-w-6xl px-4 pt-6 pb-8 text-center">
          <p className="text-red-500/50 text-xs tracking-[0.35em] font-bold uppercase mb-3">
            HOST CONTROL PANEL
          </p>
          <h1 className="text-4xl sm:text-5xl uppercase font-black tracking-widest text-white">
            ROUND 1 — Questions
          </h1>
          <p className="text-red-500/50 text-base tracking-[0.10em] font-bold capitalize mt-3">
            Eliminate Down to {players.length}
          </p>
        </div>

        <div className="w-full max-w-7xl px-4 pb-8 flex flex-wrap justify-center gap-3">
          {[
            { label: "ROUND", value: "1 of 3" },
            { label: "POINTS", value: "100 pts" },
            { label: "ANSWERED", value: `${players.length} / 7` },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                {s.label}
              </span>
              <span className="text-sm font-bold text-zinc-200">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 flex gap-6">
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 content-start flex-1">
              {players.length === 0 ? (
                <div className="col-span-2 flex flex-col items-center justify-center min-h-[300px] gap-4">
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-3 h-3 rounded-full bg-zinc-600 animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                  <p className="text-zinc-500 text-sm uppercase tracking-widest">
                    Waiting for player answers...
                  </p>
                </div>
              ) : (
                players.map((player) => (
                  <PlayerCard
                    key={player.userId}
                    player={player}
                    onEliminate={handleEliminate}
                    loading={loadingId === player.userId}
                  />
                ))
              )}
            </div>

            {canNext && (
              <div className="mt-10 flex justify-center pb-6">
                <Button
                  variant="game"
                  onClick={handleNextRoundClick}
                  className="flex items-center gap-3 px-12 py-4 text-lg font-bold shadow-2xl shadow-red-600/40 hover:shadow-red-500/60 hover:scale-105 active:scale-100 transition-all duration-300 min-w-[320px]"
                >
                  {nextLabel}
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </div>
            )}
          </div>

          <div className="hidden lg:block w-[340px] flex-shrink-0 self-start sticky top-6">
            <ParticipantPanel />
          </div>
        </div>
      </div>
    </>
  );
}
