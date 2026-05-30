// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useSocket } from "@/hooks/useSocket";
// import { useRouter } from "next/navigation";
// import { useState, useRef, useEffect, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import ParticipantPanel from "@/components/roundOne/Participantpanel";

// // ─── Demo video source — replace with your real URL ──────────────────────────
// // const DEFAULT_VIDEO_SRC = "https://www.w3schools.com/html/mov_bbb.mp4";
// const DEFAULT_VIDEO_SRC = "/videos/IB_Round_3.mp4";

// // ─── Types ───────────────────────────────────────────────────────────────────
// //
// interface Submission {
//   imageUrl: string;
//   userId: string;
// }

// interface ServerPlayer {
//   id: string;
//   isEliminated: boolean;
//   isConnected: boolean;
//   username?: string;
//   name?: string;
//   points?: number;
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
//             <div className="absolute inset-0 rounded-full border-2 border-t-green-400 border-r-emerald-500 border-b-transparent border-l-transparent animate-spin" />
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
//         <span className="px-3 py-1 rounded-full border border-green-400/40 bg-black/40 backdrop-blur-sm text-green-400 text-[11px] font-bold uppercase tracking-widest">
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
//             className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 relative pointer-events-none"
//             style={{ width: `${progress}%` }}
//           >
//             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-green-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
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
//             style={{ animation: "pulse2 1.2s ease-in-out infinite" }}
//           >
//             🌹
//           </span>
//           <p className="text-green-400 font-extrabold text-xl uppercase tracking-widest">
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
//                 stroke="rgba(34,197,94,0.2)"
//                 strokeWidth="4"
//               />
//               <circle
//                 cx="28"
//                 cy="28"
//                 r="24"
//                 fill="none"
//                 stroke="#22c55e"
//                 strokeWidth="4"
//                 strokeDasharray={CIRCUMFERENCE}
//                 strokeDashoffset={strokeOffset}
//                 strokeLinecap="round"
//                 className="transition-all duration-1000"
//               />
//             </svg>
//             <span className="absolute inset-0 flex items-center justify-center text-green-400 font-black text-xl">
//               {countdown}
//             </span>
//           </div>

//           <p className="text-white/50 text-sm tracking-widest">
//             Starting next round...
//           </p>

//           <button
//             onClick={advance}
//             className="mt-2 px-6 py-2.5 rounded-xl bg-green-400/20 border border-green-400/50 text-green-400 text-sm font-bold tracking-wider hover:bg-green-400/30 transition-colors"
//           >
//             Continue Now →
//           </button>
//         </div>
//       )}

//       <style>{`
//         @keyframes pulse2 {
//           0%,100% { transform:scale(1);   filter:drop-shadow(0 0 14px rgba(34,197,94,.6)); }
//           50%     { transform:scale(1.2); filter:drop-shadow(0 0 32px rgba(34,197,94,1)); }
//         }
//       `}</style>
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function EliminationGame() {
//   const router = useRouter();

//   const [submissions, setSubmissions] = useState<Submission[]>([]);
//   const [eliminated, setEliminated] = useState<string[]>([]);
//   const [loadingId, setLoadingId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   // ← NEW: controls the video modal
//   const [showVideo, setShowVideo] = useState(false);

//   const nextRoundIndex = 2;
//   const canNext = eliminated.length > 0;

//   const reduxPlayers = useSelector(
//     (state: RootState) => (state as any).participants?.players ?? [],
//   ) as ServerPlayer[];

//   const { sendEvent, isConnected } = useSocket({
//     GAME_EVENT: (payload) => {
//       console.log("🎮 Game Event received:", payload);
//       if (payload.type === "DATA_UPDATE" && payload.payload?.allSubmissions) {
//         setSubmissions(payload.payload.allSubmissions as Submission[]);
//       }
//     },
//   });

//   // ── Fires ELIMINATE socket event, marks player out on ACK ────────────────
//   const handleEliminate = (userId: string) => {
//     setLoadingId(userId);
//     sendEvent(
//       "GAME_EVENT",
//       {
//         gameId: "internet-bachelor-123",
//         type: "ELIMINATE",
//         payload: { playerIds: [userId], points: 200 },
//       },
//       (response) => {
//         console.log("✅ Eliminate ACK:", response);
//         setLoadingId(null);
//         setEliminated((prev) =>
//           prev.includes(userId) ? prev : [...prev, userId],
//         );
//       },
//     );
//   };

//   // ── Undo: just remove from local list ────────────────────────────────────
//   const handleUndo = (userId: string) => {
//     setEliminated((prev) => prev.filter((id) => id !== userId));
//   };

//   // ── "Next Round" button clicked → open video first ───────────────────────
//   const handleNextRoundClick = () => {
//     if (!canNext || loading) return;
//     setShowVideo(true);
//   };

//   // ── Video finished / skipped → send socket event + navigate ──────────────
//   const handleVideoFinish = () => {
//     setShowVideo(false);
//     setLoading(true);
//     sendEvent(
//       "GAME_EVENT",
//       {
//         gameId: "internet-bachelor-123",
//         type: "NEXT_ROUND",
//         payload: { roundIndex: nextRoundIndex },
//       },
//       (response) => {
//         console.log("✅ Next Round ACK:", response);
//         setLoading(false);
//         if (response.success) {
//           router.push("/round-two/round-two-four");
//         }
//       },
//     );
//   };

//   return (
//     <>
//       {/* Video modal — renders above everything when active */}
//       {showVideo && <VideoModal onFinish={handleVideoFinish} />}

//       <div className="max-w-7xl mx-auto">
//         {/* Top bar */}
//         <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-red-900/40 bg-black/40 backdrop-blur-sm">
//           <div className="flex items-center gap-3">
//             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
//             <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-red-400 uppercase">
//               Host Panel
//             </span>
//           </div>
//           <span className="text-xs text-gray-500 tracking-widest uppercase">
//             {isConnected() ? "🟢 Live" : "🔴 Offline"}
//           </span>
//         </div>

//         <div className="relative z-10 flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 sm:p-6 max-w-7xl mx-auto">
//           <div className="flex-1 min-w-0">
//             {/* Round header */}
//             <div className="text-center mb-6 sm:mb-8">
//               <div className="inline-flex items-center gap-3 mb-2">
//                 <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-red-600" />
//                 <span className="text-[10px] sm:text-xs text-red-500 tracking-[0.3em] uppercase font-bold">
//                   Round 2
//                 </span>
//                 <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-red-600" />
//               </div>
//               <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
//                 Round 2 –{" "}
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
//                   Pictures
//                 </span>
//               </h1>
//               <p className="mt-2 text-gray-500 text-xs sm:text-sm font-medium tracking-widest capitalize">
//                 Eliminate Down to 2
//               </p>
//             </div>

//             <div className="flex flex-col lg:flex-row gap-6">
//               {/* Player grid */}
//               <div className="flex-1">
//                 {submissions.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center min-h-[280px] rounded-xl border border-white/10 bg-white/[0.02] gap-4">
//                     <div className="w-8 h-8 border-2 border-red-500/40 border-t-red-500 rounded-full animate-spin" />
//                     <p className="text-gray-500 text-sm tracking-widest uppercase">
//                       Waiting for photo submissions…
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                     {submissions.map((submission, idx) => {
//                       const isEliminated = eliminated.includes(
//                         submission.userId,
//                       );
//                       const isThisLoading = loadingId === submission.userId;

//                       const reduxPlayer = reduxPlayers.find(
//                         (p) => p.id === submission.userId,
//                       );
//                       const displayName =
//                         reduxPlayer?.username ??
//                         reduxPlayer?.name ??
//                         `Player ${idx + 1}`;

//                       return (
//                         <div
//                           key={submission.userId}
//                           className={`relative rounded-xl overflow-hidden border transition-all duration-500 group
//                             ${
//                               isEliminated
//                                 ? "border-red-600/80 opacity-60 scale-[0.98]"
//                                 : "border-white/10 hover:border-red-500/40"
//                             } bg-gradient-to-b from-white/5 to-black/60`}
//                         >
//                           {/* Player label */}
//                           <div className="relative px-4 pt-3 pb-2 flex items-center justify-between">
//                             <span className="text-xs sm:text-sm font-black tracking-[0.15em] text-gray-300 uppercase">
//                               {displayName}
//                             </span>
//                             {isEliminated && (
//                               <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase bg-red-950/50 px-2 py-0.5 rounded-full border border-red-800/50">
//                                 Eliminated
//                               </span>
//                             )}
//                           </div>

//                           {/* Photo */}
//                           <div className="relative mx-3 rounded-lg overflow-hidden aspect-[4/3]">
//                             <img
//                               src={submission.imageUrl}
//                               alt={displayName}
//                               className={`w-full h-full object-cover object-top transition-all duration-500 ${
//                                 isEliminated
//                                   ? "grayscale brightness-50"
//                                   : "group-hover:scale-105"
//                               }`}
//                             />
//                             <div className="absolute inset-0 bg-gradient-to-b" />
//                             {isEliminated && (
//                               <div className="absolute inset-0 flex items-center justify-center">
//                                 <div className="text-4xl sm:text-6xl font-black text-red-500/80 rotate-[-15deg] tracking-tighter uppercase border-4 border-red-500/50 px-4 py-2 rounded-lg">
//                                   OUT
//                                 </div>
//                               </div>
//                             )}
//                           </div>

//                           {/* Eliminate / Undo button */}
//                           <div className="px-3 py-3">
//                             {isEliminated ? (
//                               <button
//                                 onClick={() => handleUndo(submission.userId)}
//                                 className="w-full py-2.5 rounded-lg font-black text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 active:scale-95 bg-red-950/60 text-red-400 border border-red-800/50 hover:bg-red-900/60"
//                               >
//                                 <span className="flex items-center justify-center gap-2">
//                                   <svg
//                                     className="w-4 h-4"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
//                                     />
//                                   </svg>
//                                   Undo — {displayName}
//                                 </span>
//                               </button>
//                             ) : (
//                               <button
//                                 onClick={() =>
//                                   handleEliminate(submission.userId)
//                                 }
//                                 disabled={isThisLoading || loadingId !== null}
//                                 className="w-full py-2.5 rounded-lg font-black text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 active:scale-95 bg-gradient-to-r from-red-900 to-red-800 hover:from-red-600 hover:to-red-500 text-white shadow-lg shadow-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
//                               >
//                                 {isThisLoading ? (
//                                   <span className="flex items-center justify-center gap-2">
//                                     <svg
//                                       className="w-4 h-4 animate-spin"
//                                       fill="none"
//                                       viewBox="0 0 24 24"
//                                     >
//                                       <circle
//                                         className="opacity-25"
//                                         cx="12"
//                                         cy="12"
//                                         r="10"
//                                         stroke="currentColor"
//                                         strokeWidth="4"
//                                       />
//                                       <path
//                                         className="opacity-75"
//                                         fill="currentColor"
//                                         d="M4 12a8 8 0 018-8v8z"
//                                       />
//                                     </svg>
//                                     Eliminating…
//                                   </span>
//                                 ) : (
//                                   `Eliminate ${displayName}`
//                                 )}
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}

//                 {/* Next Round — opens video modal first */}
//                 {canNext && (
//                   <div className="mt-6 sm:mt-8 flex justify-center">
//                     <button
//                       onClick={handleNextRoundClick}
//                       disabled={loading}
//                       className="px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-base tracking-[0.25em] uppercase transition-all duration-500 bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white shadow-xl shadow-green-900/60 hover:shadow-green-700/70 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
//                     >
//                       {loading ? "Processing…" : "Next Round →"}
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Sidebar */}
//               <ParticipantPanel />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
"use client";

import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ParticipantPanel from "@/components/roundOne/Participantpanel";

// ─── Demo video source ────────────────────────────────────────────────────────
const DEFAULT_VIDEO_SRC = "/videos/IB_Round_3.mp4";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Submission {
  imageUrl: string;
  userId: string;
}

interface ServerPlayer {
  id: string;
  isEliminated: boolean;
  isConnected: boolean;
  username?: string;
  name?: string;
  points?: number;
}

// ─── RouteLoadingOverlay ──────────────────────────────────────────────────────
// Shown immediately when navigation begins — masks the blank flash while
// router.push() resolves. z-[100] keeps it above everything else.

function RouteLoadingOverlay() {
  const [dots, setDots] = useState(0);
  const [phase, setPhase] = useState(0);

  const phases = [
    "Finding your place",
    "Getting you ready",
    "Joining the show",
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
            stroke="url(#egArcG)"
            strokeWidth="3"
            strokeDasharray="364"
            strokeDashoffset="274"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="egArcG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="absolute w-20 h-20"
          style={{ animation: "egCounterSpin 1.4s linear infinite" }}
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
          style={{ animation: "egRosePulse 1.8s ease-in-out infinite" }}
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
            style={{ animation: "egShimmerBar 1.6s ease-in-out infinite" }}
          />
        </div>
        <p className="text-white/25 text-[10px] tracking-[0.5em] uppercase mt-1">
          Please wait
        </p>
      </div>

      <style>{`
        @keyframes egRosePulse   { 0%,100%{transform:scale(1);filter:drop-shadow(0 0 10px rgba(239,68,68,.5))} 50%{transform:scale(1.18);filter:drop-shadow(0 0 26px rgba(239,68,68,1))} }
        @keyframes egCounterSpin { from{transform:rotate(90deg)} to{transform:rotate(-270deg)} }
        @keyframes egShimmerBar  { 0%{transform:translateX(-200%)} 100%{transform:translateX(500%)} }
      `}</style>
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
                stroke="url(#egVidArcG)"
                strokeWidth="3"
                strokeDasharray="364"
                strokeDashoffset="274"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="egVidArcG" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
            <svg
              className="absolute w-20 h-20"
              style={{ animation: "egCounterSpin 1.4s linear infinite" }}
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
              style={{ animation: "egRosePulse 1.8s ease-in-out infinite" }}
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
                style={{ animation: "egShimmerBar 1.6s ease-in-out infinite" }}
              />
            </div>
            <p className="text-white/25 text-[10px] tracking-[0.5em] uppercase mt-1">
              Please wait
            </p>
          </div>
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
        <span className="px-3 py-1 rounded-full border border-green-400/40 bg-black/40 backdrop-blur-sm text-green-400 text-[11px] font-bold uppercase tracking-widest">
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
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 relative pointer-events-none"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-green-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
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
            style={{ animation: "egRosePulseEnd 1.2s ease-in-out infinite" }}
          >
            🌹
          </span>
          <p className="text-green-400 font-extrabold text-xl uppercase tracking-widest">
            Video Complete!
          </p>
          <div className="relative w-16 h-16">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="rgba(34,197,94,0.2)"
                strokeWidth="4"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="4"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-green-400 font-black text-xl">
              {countdown}
            </span>
          </div>
          <p className="text-white/50 text-sm tracking-widest">
            Starting next round...
          </p>
          <button
            onClick={advance}
            className="mt-2 px-6 py-2.5 rounded-xl bg-green-400/20 border border-green-400/50 text-green-400 text-sm font-bold tracking-wider hover:bg-green-400/30 transition-colors"
          >
            Continue Now →
          </button>
        </div>
      )}

      <style>{`
        @keyframes egRosePulseEnd { 0%,100%{transform:scale(1);filter:drop-shadow(0 0 14px rgba(34,197,94,.6))} 50%{transform:scale(1.2);filter:drop-shadow(0 0 32px rgba(34,197,94,1))} }
      `}</style>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EliminationGame() {
  const router = useRouter();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [eliminated, setEliminated] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // showVideo    → video modal is open
  // isNavigating → video finished/skipped; RouteLoadingOverlay covers the screen
  //                while the socket ACK + router.push() resolve
  const [showVideo, setShowVideo] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const nextRoundIndex = 2;
  const canNext = eliminated.length > 0;

  const reduxPlayers = useSelector(
    (state: RootState) => (state as any).participants?.players ?? [],
  ) as ServerPlayer[];

  const { sendEvent, isConnected } = useSocket({
    GAME_EVENT: (payload) => {
      console.log("🎮 Game Event received:", payload);
      if (payload.type === "DATA_UPDATE" && payload.payload?.allSubmissions) {
        setSubmissions(payload.payload.allSubmissions as Submission[]);
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
        payload: { playerIds: [userId], points: 200 },
      },
      (response) => {
        console.log("✅ Eliminate ACK:", response);
        setLoadingId(null);
        setEliminated((prev) =>
          prev.includes(userId) ? prev : [...prev, userId],
        );
      },
    );
  };

  const handleUndo = (userId: string) => {
    setEliminated((prev) => prev.filter((id) => id !== userId));
  };

  const handleNextRoundClick = () => {
    if (!canNext || isNavigating) return;
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
        if (response.success) {
          router.push("/round-two/round-two-four");
        }
      },
    );
  }, [sendEvent, nextRoundIndex, router]);

  return (
    <>
      {/* RouteLoadingOverlay — z-[100], shown while router.push resolves */}
      {isNavigating && <RouteLoadingOverlay />}

      {/* VideoModal — z-50, only shown when not yet navigating */}
      {showVideo && !isNavigating && (
        <VideoModal onFinish={handleVideoFinish} />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-red-900/40 bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-red-400 uppercase">
              Host Panel
            </span>
          </div>
          <span className="text-xs text-gray-500 tracking-widest uppercase">
            {isConnected() ? "🟢 Live" : "🔴 Offline"}
          </span>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 sm:p-6 max-w-7xl mx-auto">
          <div className="flex-1 min-w-0">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-3 mb-2">
                <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-red-600" />
                <span className="text-[10px] sm:text-xs text-red-500 tracking-[0.3em] uppercase font-bold">
                  Round 2
                </span>
                <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-red-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
                Round 2 –{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                  Pictures
                </span>
              </h1>
              <p className="mt-2 text-gray-500 text-xs sm:text-sm font-medium tracking-widest capitalize">
                Eliminate Down to 2
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                {submissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[280px] rounded-xl border border-white/10 bg-white/[0.02] gap-4">
                    <div className="w-8 h-8 border-2 border-red-500/40 border-t-red-500 rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm tracking-widest uppercase">
                      Waiting for photo submissions…
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {submissions.map((submission, idx) => {
                      const isEliminated = eliminated.includes(
                        submission.userId,
                      );
                      const isThisLoading = loadingId === submission.userId;
                      const reduxPlayer = reduxPlayers.find(
                        (p) => p.id === submission.userId,
                      );
                      const displayName =
                        reduxPlayer?.username ??
                        reduxPlayer?.name ??
                        `Player ${idx + 1}`;

                      return (
                        <div
                          key={submission.userId}
                          className={`relative rounded-xl overflow-hidden border transition-all duration-500 group ${isEliminated ? "border-red-600/80 opacity-60 scale-[0.98]" : "border-white/10 hover:border-red-500/40"} bg-gradient-to-b from-white/5 to-black/60`}
                        >
                          <div className="relative px-4 pt-3 pb-2 flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-black tracking-[0.15em] text-gray-300 uppercase">
                              {displayName}
                            </span>
                            {isEliminated && (
                              <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase bg-red-950/50 px-2 py-0.5 rounded-full border border-red-800/50">
                                Eliminated
                              </span>
                            )}
                          </div>
                          <div className="relative mx-3 rounded-lg overflow-hidden aspect-[4/3]">
                            <img
                              src={submission.imageUrl}
                              alt={displayName}
                              className={`w-full h-full object-cover object-top transition-all duration-500 ${isEliminated ? "grayscale brightness-50" : "group-hover:scale-105"}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b" />
                            {isEliminated && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-4xl sm:text-6xl font-black text-red-500/80 rotate-[-15deg] tracking-tighter uppercase border-4 border-red-500/50 px-4 py-2 rounded-lg">
                                  OUT
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="px-3 py-3">
                            {isEliminated ? (
                              <button
                                onClick={() => handleUndo(submission.userId)}
                                className="w-full py-2.5 rounded-lg font-black text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 active:scale-95 bg-red-950/60 text-red-400 border border-red-800/50 hover:bg-red-900/60"
                              >
                                <span className="flex items-center justify-center gap-2">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                    />
                                  </svg>
                                  Undo — {displayName}
                                </span>
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleEliminate(submission.userId)
                                }
                                disabled={isThisLoading || loadingId !== null}
                                className="w-full py-2.5 rounded-lg font-black text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 active:scale-95 bg-gradient-to-r from-red-900 to-red-800 hover:from-red-600 hover:to-red-500 text-white shadow-lg shadow-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isThisLoading ? (
                                  <span className="flex items-center justify-center gap-2">
                                    <svg
                                      className="w-4 h-4 animate-spin"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      />
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                      />
                                    </svg>
                                    Eliminating…
                                  </span>
                                ) : (
                                  `Eliminate ${displayName}`
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {canNext && (
                  <div className="mt-6 sm:mt-8 flex justify-center">
                    <button
                      onClick={handleNextRoundClick}
                      disabled={isNavigating}
                      className="px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-base tracking-[0.25em] uppercase transition-all duration-500 bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white shadow-xl shadow-green-900/60 hover:shadow-green-700/70 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      {isNavigating ? "Processing…" : "Next Round →"}
                    </button>
                  </div>
                )}
              </div>

              <ParticipantPanel />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
