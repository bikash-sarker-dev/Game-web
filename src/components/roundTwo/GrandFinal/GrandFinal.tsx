/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import ParticipantPanel from "@/components/roundOne/Participantpanel";
// import { useSocket } from "@/hooks/useSocket";
// import { useRouter } from "next/navigation";
// import { useState, useEffect, useRef, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";

// import Button from "@/components/share/ButtonPrimary";

// import { GameWinner, setGameOver } from "@/redux/features/winner/Gameoverslice";
// import { VideoCallModal } from "./HostVideoCall";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface Player {
//   id: string;
//   name?: string;
//   avatar?: string;
//   socketId: string;
//   isEliminated: boolean;
//   isReady: boolean;
//   isConnected: boolean;
//   hasNetworkIssue: boolean;
//   hasSubmitted: boolean;
//   points: number;
// }

// const BG_COLORS = ["#1a6abf", "#2a2a2a", "#6b1a1a", "#1a5c2a"];
// const GAME_ID = "internet-bachelor-123";
// const ELIMINATE_POINTS = 100;

// // ─── DeclareNeitherScreen ─────────────────────────────────────────────────────
// function DeclareNeitherScreen() {
//   const router = useRouter();
//   const [visible, setVisible] = useState(false);
//   const [showSubtitle, setShowSubtitle] = useState(false);
//   const [showBody, setShowBody] = useState(false);
//   const [showButton, setShowButton] = useState(false);

//   useEffect(() => {
//     const t1 = setTimeout(() => setVisible(true), 100);
//     const t2 = setTimeout(() => setShowSubtitle(true), 700);
//     const t3 = setTimeout(() => setShowBody(true), 1200);
//     const t4 = setTimeout(() => setShowButton(true), 1800);
//     return () => [t1, t2, t3, t4].forEach(clearTimeout);
//   }, []);

//   return (
//     <div
//       className={`
//         fixed inset-0 z-50 flex items-center justify-center
//         bg-black/95 backdrop-blur-sm
//         transition-opacity duration-700
//         ${visible ? "opacity-100" : "opacity-0"}
//       `}
//     >
//       {/* Background grid */}
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           backgroundImage: `
//             radial-gradient(circle at 50% 40%, rgba(220,38,38,0.06) 0%, transparent 65%),
//             linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
//           `,
//           backgroundSize: "100% 100%, 48px 48px, 48px 48px",
//         }}
//       />

//       {/* Corner marks */}
//       <span className="absolute top-6 left-6 text-neutral-800 text-xs font-mono tracking-widest select-none">
//         ◻ SESSION END
//       </span>
//       <span className="absolute top-6 right-6 text-neutral-800 text-xs font-mono tracking-widest select-none">
//         NO WINNER ◻
//       </span>
//       <span className="absolute bottom-6 left-6 text-neutral-800 text-xs font-mono tracking-widest select-none">
//         ROUND CONCLUDED
//       </span>
//       <span className="absolute bottom-6 right-6 text-neutral-800 text-xs font-mono tracking-widest select-none">
//         HOST DECISION ◻
//       </span>

//       {/* Main content */}
//       <div className="relative z-10 w-full max-w-lg mx-4 text-center flex flex-col items-center">
//         {/* Icon */}
//         <div
//           className={`mb-8 transition-all duration-700 ${visible ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
//         >
//           <div
//             className="relative w-28 h-28 rounded-full flex items-center justify-center mx-auto"
//             style={{
//               border: "1px solid rgba(220,38,38,0.25)",
//               boxShadow:
//                 "0 0 48px rgba(220,38,38,0.08), inset 0 0 24px rgba(0,0,0,0.4)",
//             }}
//           >
//             <div
//               className="absolute inset-2 rounded-full"
//               style={{ border: "1px solid rgba(220,38,38,0.15)" }}
//             />
//             <span className="text-5xl relative z-10 select-none">🚫</span>
//           </div>
//         </div>

//         {/* Headline */}
//         <h1
//           className={`text-4xl sm:text-5xl font-black tracking-[0.12em] uppercase text-white transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
//         >
//           No Winner
//         </h1>

//         {/* Divider */}
//         <div
//           className={`flex items-center gap-3 my-5 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
//         >
//           <div className="h-px w-20 bg-gradient-to-r from-transparent to-red-700/60" />
//           <div className="w-1 h-1 rounded-full bg-red-600" />
//           <span className="text-red-500 text-[10px] font-black tracking-[0.4em] uppercase">
//             Declared
//           </span>
//           <div className="w-1 h-1 rounded-full bg-red-600" />
//           <div className="h-px w-20 bg-gradient-to-l from-transparent to-red-700/60" />
//         </div>

//         {/* Subtitle */}
//         <p
//           className={`text-neutral-400 text-sm tracking-[0.25em] uppercase font-semibold mb-8 transition-all duration-700 ${showSubtitle ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
//         >
//           The Host has ended this round
//         </p>

//         {/* Body card */}
//         <div
//           className={`w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 mb-8 transition-all duration-700 ${showBody ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
//         >
//           <p className="text-neutral-300 text-sm leading-relaxed mb-4">
//             After careful consideration, the host has decided that{" "}
//             <span className="text-white font-bold">no contestant</span> will be
//             declared the winner of this round.
//           </p>
//           <p className="text-neutral-500 text-xs leading-relaxed">
//             This decision is final. No points have been awarded, and no
//             elimination has taken place. The round has been closed without a
//             declared winner.
//           </p>

//           <div className="my-5 h-px bg-white/[0.08]" />

//           <div className="flex items-center justify-center gap-8 text-center">
//             <div>
//               <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono mb-1">
//                 Winner
//               </p>
//               <p className="text-sm font-black text-red-500 tracking-widest uppercase">
//                 None
//               </p>
//             </div>
//             <div className="w-px h-8 bg-white/10" />
//             <div>
//               <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono mb-1">
//                 Points Awarded
//               </p>
//               <p className="text-sm font-black text-neutral-400 tracking-widest">
//                 0
//               </p>
//             </div>
//             <div className="w-px h-8 bg-white/10" />
//             <div>
//               <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono mb-1">
//                 Status
//               </p>
//               <p className="text-sm font-black text-orange-500 tracking-widest uppercase">
//                 Closed
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* CTA */}
//         <div
//           className={`w-full transition-all duration-700 ${showButton ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
//         >
//           <button
//             onClick={() => router.push("/")}
//             className="w-full py-4 rounded-xl border border-white/15 text-xs font-black tracking-[0.3em] uppercase text-white/80 hover:bg-white/5 hover:border-white/25 hover:text-white transition-all duration-300 cursor-pointer"
//           >
//             Return to Dashboard
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── PlayerCard ───────────────────────────────────────────────────────────────
// function PlayerCard({
//   player,
//   index,
//   onCall,
//   onEliminate,
//   isEliminating,
//   isCallDisabled,
// }: {
//   player: Player;
//   index: number;
//   onCall: (p: Player, i: number) => void;
//   onEliminate: (p: Player) => void;
//   isEliminating: boolean;
//   isCallDisabled: boolean;
// }) {
//   const name = player.name ?? `Player ${index + 1}`;
//   const isEliminated = player.isEliminated;

//   return (
//     <>
//       <div
//         className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-500 ${
//           isEliminated
//             ? "border-red-900/60 opacity-50 grayscale"
//             : "border-white/10 bg-gradient-to-b from-neutral-900/90 to-black/95 hover:border-orange-500/40 hover:shadow-[0_0_24px_rgba(249,115,22,0.15)]"
//         }`}
//       >
//         {/* Status badges */}
//         <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
//           <span
//             className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full ${
//               player.isConnected
//                 ? "bg-green-500/20 text-green-400 border border-green-500/40"
//                 : "bg-red-500/20 text-red-400 border border-red-500/40"
//             }`}
//           >
//             {player.isConnected ? "● ONLINE" : "● OFFLINE"}
//           </span>
//           {player.hasNetworkIssue && (
//             <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
//               ⚠ NET
//             </span>
//           )}
//         </div>

//         {/* Name + ID */}
//         <div className="text-center pt-4 pb-2 px-4">
//           <p className="text-white font-black text-sm tracking-widest uppercase truncate">
//             {name}
//           </p>
//           <p className="text-white/35 text-[9px] tracking-[0.3em] uppercase font-mono mt-1">
//             ID
//           </p>
//           <p className="text-white/50 font-mono text-[10px] break-all mt-0.5">
//             {player.id}
//           </p>
//         </div>

//         {/* Avatar */}
//         <div className="relative w-full aspect-square overflow-hidden px-4">
//           <img
//             src={player.avatar}
//             alt={name}
//             className="w-full h-full object-cover object-top rounded-xl transition-transform duration-700 hover:scale-105"
//             style={{ backgroundColor: BG_COLORS[index % BG_COLORS.length] }}
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none rounded-xl" />
//           <div className="absolute bottom-3 left-7 bg-black/70 border border-white/10 rounded-lg px-2 py-1">
//             <span className="text-yellow-400 text-xs font-black">
//               ⭐ {player.points}
//             </span>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="p-4 flex flex-col gap-2">
//           {/* Video Call */}
//           <button
//             onClick={() => onCall(player, index)}
//             disabled={isEliminated || isEliminating || isCallDisabled}
//             title={
//               isCallDisabled ? "Call already ended for this player" : undefined
//             }
//             className={`w-full py-3 rounded-xl text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 text-white flex items-center justify-center gap-2
//             ${
//               isCallDisabled
//                 ? "bg-neutral-700/50 border border-neutral-600/40 cursor-not-allowed opacity-50"
//                 : "bg-green-700 hover:bg-green-800 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
//             }
//           `}
//           >
//             {isCallDisabled ? (
//               <>
//                 <span>🔇</span> Call Ended
//               </>
//             ) : (
//               <>
//                 <span>🎥</span> Video Call
//               </>
//             )}
//           </button>

//           {/* Eliminate */}
//           <Button
//             variant="game"
//             onClick={() => onEliminate(player)}
//             disabled={isEliminating || isEliminated}
//             className="w-full flex items-center justify-center gap-2"
//           >
//             {isEliminated ? (
//               <>
//                 <span>💀</span> Eliminated
//               </>
//             ) : isEliminating ? (
//               <>
//                 <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />{" "}
//                 Eliminating…
//               </>
//             ) : (
//               <>
//                 <span>⚡</span> Eliminate Player
//               </>
//             )}
//           </Button>
//         </div>
//       </div>
//       {/* ── Declare Neither ─────────────────────────────────────────────── */}
//     </>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function GrandFinale() {
//   const [activeCall, setActiveCall] = useState<{
//     player: Player;
//     index: number;
//   } | null>(null);
//   const [acceptedUserId, setAcceptedUserId] = useState<string | null>(null);
//   const [rejectedUserId, setRejectedUserId] = useState<string | null>(null);
//   const [endedCallIds, setEndedCallIds] = useState<Set<string>>(new Set());
//   const [eliminatingId, setEliminatingId] = useState<string | null>(null);

//   // ── DECLARE NEITHER state ─────────────────────────────────────────────────
//   const [isDeclaring, setIsDeclaring] = useState(false);
//   const [showNeitherScreen, setShowNeitherScreen] = useState(false);
//   const [declareError, setDeclareError] = useState<string | null>(null);

//   const router = useRouter();
//   const dispatch = useDispatch();

//   const currentUser = useSelector((state: any) => state.user.user);
//   const participants = useSelector((state: any) => state.participants.players);
//   const isGameOver = useSelector((state: any) => state.gameOver.isGameOver);

//   const activePlayers = participants.filter((p: Player) => !p.isEliminated);

//   useEffect(() => {
//     if (isGameOver) {
//       router.push("/round-two/round-two-six");
//     }
//   }, [isGameOver]);

//   // ── Socket events ─────────────────────────────────────────────────────────
//   const { isConnected, sendEvent } = useSocket({
//     GAME_EVENT: (payload: any) => {
//       console.log("🎮 GAME_EVENT received (host):", payload);

//       if (payload?.type === "CALL_ACCEPTED") {
//         setAcceptedUserId(payload?.payload?.userId);
//       }
//       if (payload?.type === "CALL_REJECTED") {
//         setRejectedUserId(payload?.payload?.userId);
//       }
//       if (payload?.type === "GAME_ENDED" && payload?.payload?.winner) {
//         const winner: GameWinner = payload.payload.winner;
//         dispatch(setGameOver(winner));
//       }
//     },
//   });

//   const callAccepted = !!activeCall && acceptedUserId === activeCall.player.id;
//   const callRejected =
//     !!activeCall && rejectedUserId === activeCall.player.id && !callAccepted;

//   // ── Close call ────────────────────────────────────────────────────────────
//   const handleCloseCall = useCallback(() => {
//     if (activeCall) {
//       setEndedCallIds((prev) => new Set(prev).add(activeCall.player.id));
//     }
//     setActiveCall(null);
//     setAcceptedUserId(null);
//     setRejectedUserId(null);
//   }, [activeCall]);

//   // ── Eliminate ─────────────────────────────────────────────────────────────
//   const handleEliminate = useCallback(
//     (player: Player) => {
//       if (eliminatingId) return;
//       setEliminatingId(player.id);

//       sendEvent(
//         "GAME_EVENT",
//         {
//           gameId: GAME_ID,
//           type: "ELIMINATE",
//           payload: {
//             playerIds: [player.id],
//             points: ELIMINATE_POINTS,
//             winnerPoints: 400,
//           },
//         },
//         (response: any) => {
//           if (response?.success) {
//             if (response?.winner) {
//               dispatch(setGameOver(response.winner as GameWinner));
//             } else {
//               setEliminatingId(null);
//             }
//           } else {
//             console.warn("❌ Eliminate failed:", response);
//             setEliminatingId(null);
//           }
//         },
//       );
//     },
//     [sendEvent, dispatch, eliminatingId],
//   );

//   // ── Declare Neither ───────────────────────────────────────────────────────
//   const handleDeclareNeither = useCallback(() => {
//     if (isDeclaring) return;
//     setIsDeclaring(true);
//     setDeclareError(null);

//     sendEvent(
//       "GAME_EVENT",
//       {
//         gameId: GAME_ID,
//         type: "DECLARE_NEITHER",
//         payload: {},
//       },
//       (response: any) => {
//         console.log("🚫 DECLARE_NEITHER ACK:", response);
//         if (response?.success) {
//           router.push("/no-winner");
//         } else {
//           console.warn("❌ Declare Neither failed:", response);
//           setDeclareError("Failed to declare. Please try again.");
//           setIsDeclaring(false);
//         }
//       },
//     );
//   }, [sendEvent, isDeclaring, router]);

//   return (
//     <div className="w-full max-w-7xl mx-auto relative overflow-hidden font-sans">
//       {/* Top bar */}
//       <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-red-900/30">
//         <span className="text-white/80 text-sm font-semibold tracking-widest uppercase">
//           {isConnected() ? "🟢 Live" : "🔴 Offline"} Host Panel
//         </span>
//         <div className="flex items-center gap-2">
//           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
//           <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
//             Live
//           </span>
//         </div>
//       </div>

//       <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
//         {/* Title */}
//         <div className="text-center mb-10 space-y-2">
//           <h1 className="text-3xl sm:text-4xl font-black tracking-[0.15em] uppercase text-white drop-shadow-[0_0_30px_rgba(220,38,38,0.4)]">
//             The Grand Finale
//           </h1>
//           <p className="text-red-500 text-sm font-black tracking-[0.4em]  capitalize animate-pulse">
//             Pick Final Winner
//           </p>
//           <div className="flex items-center justify-center gap-4 pt-2">
//             <div className="h-px w-32 bg-gradient-to-r from-transparent to-red-700" />
//             <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
//             <div className="h-px w-32 bg-gradient-to-l from-transparent to-red-700" />
//           </div>
//         </div>

//         <div className="text-center mb-6">
//           <span className="text-neutral-400 text-xs tracking-widest uppercase">
//             Active Players:{" "}
//             <span className="text-white font-black">
//               {activePlayers.length}
//             </span>
//           </span>
//         </div>

//         {/* Declare error toast */}
//         {declareError && (
//           <div className="mb-4 mx-auto max-w-sm text-center bg-red-900/30 border border-red-700/40 rounded-xl px-4 py-2">
//             <p className="text-red-400 text-xs font-bold tracking-widest uppercase">
//               {declareError}
//             </p>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] gap-4 lg:gap-6">
//           <div className="lg:col-span-2 space-y-4">
//             {activePlayers.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-24 text-center">
//                 <div className="text-5xl mb-4 opacity-30">👥</div>
//                 <p className="text-neutral-500 text-sm tracking-widest uppercase">
//                   Waiting for players…
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <div
//                   className={`grid gap-4 ${
//                     activePlayers.length === 1
//                       ? "grid-cols-1 max-w-xs mx-auto"
//                       : activePlayers.length === 2
//                         ? "grid-cols-2"
//                         : activePlayers.length === 3
//                           ? "grid-cols-3"
//                           : "grid-cols-2"
//                   }`}
//                 >
//                   {activePlayers.map((player: Player, index: number) => (
//                     <PlayerCard
//                       key={player.id}
//                       player={player}
//                       index={index}
//                       onCall={(p, i) => setActiveCall({ player: p, index: i })}
//                       onEliminate={handleEliminate}
//                       isEliminating={eliminatingId === player.id}
//                       isCallDisabled={endedCallIds.has(player.id)}
//                     />
//                   ))}
//                 </div>
//                 <div className="flex justify-center items-center mt-5">
//                   <button
//                     onClick={handleDeclareNeither}
//                     disabled={isDeclaring}
//                     className={`
//               w-full py-3 rounded-xl text-xs font-black tracking-[0.2em] uppercase
//               transition-all duration-300 flex items-center justify-center gap-2
//               border
//               ${
//                 isDeclaring
//                   ? "bg-neutral-800/60 border-neutral-700/40 text-neutral-500 cursor-not-allowed opacity-60"
//                   : "bg-transparent border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400 hover:text-orange-300 hover:shadow-[0_0_16px_rgba(249,115,22,0.2)] cursor-pointer"
//               }
//             `}
//                   >
//                     {isDeclaring ? (
//                       <>
//                         <span className="w-3 h-3 rounded-full border-2 border-orange-400 border-t-transparent animate-spin inline-block" />{" "}
//                         Declaring…
//                       </>
//                     ) : (
//                       <>
//                         <span>🚫</span> Declare Neither
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>

//           <ParticipantPanel />
//         </div>
//       </div>

//       {/* Video Call Modal */}
//       {activeCall && (
//         <VideoCallModal
//           player={activeCall.player}
//           index={activeCall.index}
//           onClose={handleCloseCall}
//           sendEvent={sendEvent}
//           callAccepted={callAccepted}
//           callRejected={callRejected}
//           hostUserId={currentUser?.id ?? ""}
//           hostUserName={currentUser?.name ?? currentUser?.username ?? "Host"}
//         />
//       )}

//       {/* Declare Neither Screen */}
//       {showNeitherScreen && <DeclareNeitherScreen />}
//     </div>
//   );
// }
// +++++++++++++++++++++++====================================================================
// "use client";

// import ParticipantPanel from "@/components/roundOne/Participantpanel";
// import { useSocket } from "@/hooks/useSocket";
// import { useRouter } from "next/navigation";
// import { useState, useEffect, useRef, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";

// import Button from "@/components/share/ButtonPrimary";

// import { GameWinner, setGameOver } from "@/redux/features/winner/Gameoverslice";
// import { VideoCallModal } from "./HostVideoCall";

// // ─── Demo video source — replace with your real URL ──────────────────────────
// // const DEFAULT_VIDEO_SRC = "https://www.w3schools.com/html/mov_bbb.mp4";
// const DEFAULT_VIDEO_SRC = "/videos/IB_Finale.mp4";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface Player {
//   id: string;
//   name?: string;
//   avatar?: string;
//   socketId: string;
//   isEliminated: boolean;
//   isReady: boolean;
//   isConnected: boolean;
//   hasNetworkIssue: boolean;
//   hasSubmitted: boolean;
//   points: number;
// }

// const BG_COLORS = ["#1a6abf", "#2a2a2a", "#6b1a1a", "#1a5c2a"];
// const GAME_ID = "internet-bachelor-123";
// const ELIMINATE_POINTS = 100;

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

//   useEffect(() => {
//     videoRef.current?.play().catch(() => {});
//   }, []);

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
//         <span className="px-3 py-1 rounded-full border border-amber-400/40 bg-black/40 backdrop-blur-sm text-amber-400 text-[11px] font-bold uppercase tracking-widest">
//           🏆 Grand Finale
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
//         <div
//           className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-4 group"
//           onClick={handleProgressClick}
//         >
//           <div
//             className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500 relative pointer-events-none"
//             style={{ width: `${progress}%` }}
//           >
//             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-amber-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
//           </div>
//         </div>

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
//             style={{ animation: "rosePulse 1.2s ease-in-out infinite" }}
//           >
//             🌹
//           </span>
//           <p className="text-amber-400 font-extrabold text-xl uppercase tracking-widest">
//             Game Over!
//           </p>
//           <div className="relative w-16 h-16">
//             <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
//               <circle
//                 cx="28"
//                 cy="28"
//                 r="24"
//                 fill="none"
//                 stroke="rgba(245,158,11,0.2)"
//                 strokeWidth="4"
//               />
//               <circle
//                 cx="28"
//                 cy="28"
//                 r="24"
//                 fill="none"
//                 stroke="#f59e0b"
//                 strokeWidth="4"
//                 strokeDasharray={CIRCUMFERENCE}
//                 strokeDashoffset={strokeOffset}
//                 strokeLinecap="round"
//                 className="transition-all duration-1000"
//               />
//             </svg>
//             <span className="absolute inset-0 flex items-center justify-center text-amber-400 font-black text-xl">
//               {countdown}
//             </span>
//           </div>
//           <p className="text-white/50 text-sm tracking-widest">
//             Revealing the winner...
//           </p>
//           <button
//             onClick={advance}
//             className="mt-2 px-6 py-2.5 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-400 text-sm font-bold tracking-wider hover:bg-amber-400/30 transition-colors"
//           >
//             Continue Now →
//           </button>
//         </div>
//       )}

//       <style>{`
//         @keyframes rosePulse {
//           0%,100% { transform:scale(1);   filter:drop-shadow(0 0 14px rgba(245,158,11,.6)); }
//           50%     { transform:scale(1.2); filter:drop-shadow(0 0 32px rgba(245,158,11,1)); }
//         }
//       `}</style>
//     </div>
//   );
// }

// // ─── DeclareNeitherScreen ─────────────────────────────────────────────────────
// function DeclareNeitherScreen() {
//   const router = useRouter();
//   const [visible, setVisible] = useState(false);
//   const [showSubtitle, setShowSubtitle] = useState(false);
//   const [showBody, setShowBody] = useState(false);
//   const [showButton, setShowButton] = useState(false);

//   useEffect(() => {
//     const t1 = setTimeout(() => setVisible(true), 100);
//     const t2 = setTimeout(() => setShowSubtitle(true), 700);
//     const t3 = setTimeout(() => setShowBody(true), 1200);
//     const t4 = setTimeout(() => setShowButton(true), 1800);
//     return () => [t1, t2, t3, t4].forEach(clearTimeout);
//   }, []);

//   return (
//     <div
//       className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
//     >
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           backgroundImage: `
//             radial-gradient(circle at 50% 40%, rgba(220,38,38,0.06) 0%, transparent 65%),
//             linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
//           `,
//           backgroundSize: "100% 100%, 48px 48px, 48px 48px",
//         }}
//       />

//       <span className="absolute top-6 left-6 text-neutral-800 text-xs font-mono tracking-widest select-none">
//         ◻ SESSION END
//       </span>
//       <span className="absolute top-6 right-6 text-neutral-800 text-xs font-mono tracking-widest select-none">
//         NO WINNER ◻
//       </span>
//       <span className="absolute bottom-6 left-6 text-neutral-800 text-xs font-mono tracking-widest select-none">
//         ROUND CONCLUDED
//       </span>
//       <span className="absolute bottom-6 right-6 text-neutral-800 text-xs font-mono tracking-widest select-none">
//         HOST DECISION ◻
//       </span>

//       <div className="relative z-10 w-full max-w-lg mx-4 text-center flex flex-col items-center">
//         <div
//           className={`mb-8 transition-all duration-700 ${visible ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
//         >
//           <div
//             className="relative w-28 h-28 rounded-full flex items-center justify-center mx-auto"
//             style={{
//               border: "1px solid rgba(220,38,38,0.25)",
//               boxShadow:
//                 "0 0 48px rgba(220,38,38,0.08), inset 0 0 24px rgba(0,0,0,0.4)",
//             }}
//           >
//             <div
//               className="absolute inset-2 rounded-full"
//               style={{ border: "1px solid rgba(220,38,38,0.15)" }}
//             />
//             <span className="text-5xl relative z-10 select-none">🚫</span>
//           </div>
//         </div>

//         <h1
//           className={`text-4xl sm:text-5xl font-black tracking-[0.12em] uppercase text-white transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
//         >
//           No Winner
//         </h1>

//         <div
//           className={`flex items-center gap-3 my-5 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
//         >
//           <div className="h-px w-20 bg-gradient-to-r from-transparent to-red-700/60" />
//           <div className="w-1 h-1 rounded-full bg-red-600" />
//           <span className="text-red-500 text-[10px] font-black tracking-[0.4em] uppercase">
//             Declared
//           </span>
//           <div className="w-1 h-1 rounded-full bg-red-600" />
//           <div className="h-px w-20 bg-gradient-to-l from-transparent to-red-700/60" />
//         </div>

//         <p
//           className={`text-neutral-400 text-sm tracking-[0.25em] uppercase font-semibold mb-8 transition-all duration-700 ${showSubtitle ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
//         >
//           The Host has ended this round
//         </p>

//         <div
//           className={`w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 mb-8 transition-all duration-700 ${showBody ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
//         >
//           <p className="text-neutral-300 text-sm leading-relaxed mb-4">
//             After careful consideration, the host has decided that{" "}
//             <span className="text-white font-bold">no contestant</span> will be
//             declared the winner of this round.
//           </p>
//           <p className="text-neutral-500 text-xs leading-relaxed">
//             This decision is final. No points have been awarded, and no
//             elimination has taken place. The round has been closed without a
//             declared winner.
//           </p>
//           <div className="my-5 h-px bg-white/[0.08]" />
//           <div className="flex items-center justify-center gap-8 text-center">
//             <div>
//               <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono mb-1">
//                 Winner
//               </p>
//               <p className="text-sm font-black text-red-500 tracking-widest uppercase">
//                 None
//               </p>
//             </div>
//             <div className="w-px h-8 bg-white/10" />
//             <div>
//               <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono mb-1">
//                 Points Awarded
//               </p>
//               <p className="text-sm font-black text-neutral-400 tracking-widest">
//                 0
//               </p>
//             </div>
//             <div className="w-px h-8 bg-white/10" />
//             <div>
//               <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono mb-1">
//                 Status
//               </p>
//               <p className="text-sm font-black text-orange-500 tracking-widest uppercase">
//                 Closed
//               </p>
//             </div>
//           </div>
//         </div>

//         <div
//           className={`w-full transition-all duration-700 ${showButton ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
//         >
//           <button
//             onClick={() => router.push("/")}
//             className="w-full py-4 rounded-xl border border-white/15 text-xs font-black tracking-[0.3em] uppercase text-white/80 hover:bg-white/5 hover:border-white/25 hover:text-white transition-all duration-300 cursor-pointer"
//           >
//             Return to Dashboard
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── PlayerCard ───────────────────────────────────────────────────────────────
// function PlayerCard({
//   player,
//   index,
//   onCall,
//   onEliminate,
//   isEliminating,
//   isCallDisabled,
// }: {
//   player: Player;
//   index: number;
//   onCall: (p: Player, i: number) => void;
//   onEliminate: (p: Player) => void;
//   isEliminating: boolean;
//   isCallDisabled: boolean;
// }) {
//   const name = player.name ?? `Player ${index + 1}`;
//   const isEliminated = player.isEliminated;

//   return (
//     <div
//       className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-500 ${
//         isEliminated
//           ? "border-red-900/60 opacity-50 grayscale"
//           : "border-white/10 bg-gradient-to-b from-neutral-900/90 to-black/95 hover:border-orange-500/40 hover:shadow-[0_0_24px_rgba(249,115,22,0.15)]"
//       }`}
//     >
//       {/* Status badges */}
//       <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
//         <span
//           className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full ${
//             player.isConnected
//               ? "bg-green-500/20 text-green-400 border border-green-500/40"
//               : "bg-red-500/20 text-red-400 border border-red-500/40"
//           }`}
//         >
//           {player.isConnected ? "● ONLINE" : "● OFFLINE"}
//         </span>
//         {player.hasNetworkIssue && (
//           <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
//             ⚠ NET
//           </span>
//         )}
//       </div>

//       {/* Name + ID */}
//       <div className="text-center pt-4 pb-2 px-4">
//         <p className="text-white font-black text-sm tracking-widest uppercase truncate">
//           {name}
//         </p>
//         <p className="text-white/35 text-[9px] tracking-[0.3em] uppercase font-mono mt-1">
//           ID
//         </p>
//         <p className="text-white/50 font-mono text-[10px] break-all mt-0.5">
//           {player.id}
//         </p>
//       </div>

//       {/* Avatar */}
//       <div className="relative w-full aspect-square overflow-hidden px-4">
//         <img
//           src={player.avatar}
//           alt={name}
//           className="w-full h-full object-cover object-top rounded-xl transition-transform duration-700 hover:scale-105"
//           style={{ backgroundColor: BG_COLORS[index % BG_COLORS.length] }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none rounded-xl" />
//         <div className="absolute bottom-3 left-7 bg-black/70 border border-white/10 rounded-lg px-2 py-1">
//           <span className="text-yellow-400 text-xs font-black">
//             ⭐ {player.points}
//           </span>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="p-4 flex flex-col gap-2">
//         <button
//           onClick={() => onCall(player, index)}
//           disabled={isEliminated || isEliminating || isCallDisabled}
//           className={`w-full py-3 rounded-xl text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 text-white flex items-center justify-center gap-2
//             ${
//               isCallDisabled
//                 ? "bg-neutral-700/50 border border-neutral-600/40 cursor-not-allowed opacity-50"
//                 : "bg-green-700 hover:bg-green-800 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
//             }`}
//         >
//           {isCallDisabled ? (
//             <>
//               <span>🔇</span> Call Ended
//             </>
//           ) : (
//             <>
//               <span>🎥</span> Video Call
//             </>
//           )}
//         </button>

//         <Button
//           variant="game"
//           onClick={() => onEliminate(player)}
//           disabled={isEliminating || isEliminated}
//           className="w-full flex items-center justify-center gap-2"
//         >
//           {isEliminated ? (
//             <>
//               <span>💀</span> Eliminated
//             </>
//           ) : isEliminating ? (
//             <>
//               <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />{" "}
//               Eliminating…
//             </>
//           ) : (
//             <>
//               <span>⚡</span> Eliminate Player
//             </>
//           )}
//         </Button>
//       </div>
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function GrandFinale() {
//   const [activeCall, setActiveCall] = useState<{
//     player: Player;
//     index: number;
//   } | null>(null);
//   const [acceptedUserId, setAcceptedUserId] = useState<string | null>(null);
//   const [rejectedUserId, setRejectedUserId] = useState<string | null>(null);
//   const [endedCallIds, setEndedCallIds] = useState<Set<string>>(new Set());
//   const [eliminatingId, setEliminatingId] = useState<string | null>(null);

//   const [isDeclaring, setIsDeclaring] = useState(false);
//   const [showNeitherScreen, setShowNeitherScreen] = useState(false);
//   const [declareError, setDeclareError] = useState<string | null>(null);

//   // ← NEW: controls the transition video modal
//   const [showVideo, setShowVideo] = useState(false);

//   const router = useRouter();
//   const dispatch = useDispatch();

//   const currentUser = useSelector((state: any) => state.user.user);
//   const participants = useSelector((state: any) => state.participants.players);
//   const isGameOver = useSelector((state: any) => state.gameOver.isGameOver);

//   const activePlayers = participants.filter((p: Player) => !p.isEliminated);

//   // ── When GAME_ENDED fires, show video instead of navigating immediately ───
//   // (the old useEffect watched isGameOver and navigated — we replace that)
//   useEffect(() => {
//     if (isGameOver) {
//       setShowVideo(true); // open transition video
//     }
//   }, [isGameOver]);

//   // ── Video finished / skipped → navigate to winner page ───────────────────
//   const handleVideoFinish = useCallback(() => {
//     setShowVideo(false);
//     router.push("/round-two/round-two-six");
//   }, [router]);

//   // ── Socket events ─────────────────────────────────────────────────────────
//   const { isConnected, sendEvent } = useSocket({
//     GAME_EVENT: (payload: any) => {
//       console.log("🎮 GAME_EVENT received (host):", payload);

//       if (payload?.type === "CALL_ACCEPTED") {
//         setAcceptedUserId(payload?.payload?.userId);
//       }
//       if (payload?.type === "CALL_REJECTED") {
//         setRejectedUserId(payload?.payload?.userId);
//       }
//       if (payload?.type === "GAME_ENDED" && payload?.payload?.winner) {
//         const winner: GameWinner = payload.payload.winner;
//         dispatch(setGameOver(winner));
//         // isGameOver useEffect above will trigger the video
//       }
//     },
//   });

//   const callAccepted = !!activeCall && acceptedUserId === activeCall.player.id;
//   const callRejected =
//     !!activeCall && rejectedUserId === activeCall.player.id && !callAccepted;

//   const handleCloseCall = useCallback(() => {
//     if (activeCall) {
//       setEndedCallIds((prev) => new Set(prev).add(activeCall.player.id));
//     }
//     setActiveCall(null);
//     setAcceptedUserId(null);
//     setRejectedUserId(null);
//   }, [activeCall]);

//   const handleEliminate = useCallback(
//     (player: Player) => {
//       if (eliminatingId) return;
//       setEliminatingId(player.id);

//       sendEvent(
//         "GAME_EVENT",
//         {
//           gameId: GAME_ID,
//           type: "ELIMINATE",
//           payload: {
//             playerIds: [player.id],
//             points: ELIMINATE_POINTS,
//             winnerPoints: 400,
//           },
//         },
//         (response: any) => {
//           if (response?.success) {
//             if (response?.winner) {
//               dispatch(setGameOver(response.winner as GameWinner));
//               // isGameOver useEffect will trigger the video
//             } else {
//               setEliminatingId(null);
//             }
//           } else {
//             console.warn("❌ Eliminate failed:", response);
//             setEliminatingId(null);
//           }
//         },
//       );
//     },
//     [sendEvent, dispatch, eliminatingId],
//   );

//   const handleDeclareNeither = useCallback(() => {
//     if (isDeclaring) return;
//     setIsDeclaring(true);
//     setDeclareError(null);

//     sendEvent(
//       "GAME_EVENT",
//       {
//         gameId: GAME_ID,
//         type: "DECLARE_NEITHER",
//         payload: {},
//       },
//       (response: any) => {
//         console.log("🚫 DECLARE_NEITHER ACK:", response);
//         if (response?.success) {
//           router.push("/no-winner");
//         } else {
//           console.warn("❌ Declare Neither failed:", response);
//           setDeclareError("Failed to declare. Please try again.");
//           setIsDeclaring(false);
//         }
//       },
//     );
//   }, [sendEvent, isDeclaring, router]);

//   return (
//     <>
//       {/* Transition video — shown when GAME_ENDED fires */}
//       {showVideo && <VideoModal onFinish={handleVideoFinish} />}

//       <div className="w-full max-w-7xl mx-auto relative overflow-hidden font-sans">
//         {/* Top bar */}
//         <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-red-900/30">
//           <span className="text-white/80 text-sm font-semibold tracking-widest uppercase">
//             {isConnected() ? "🟢 Live" : "🔴 Offline"} Host Panel
//           </span>
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
//             <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
//               Live
//             </span>
//           </div>
//         </div>

//         <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
//           {/* Title */}
//           <div className="text-center mb-10 space-y-2">
//             <h1 className="text-3xl sm:text-4xl font-black tracking-[0.15em] uppercase text-white drop-shadow-[0_0_30px_rgba(220,38,38,0.4)]">
//               The Grand Finale
//             </h1>
//             <p className="text-red-500 text-sm font-black tracking-[0.4em] capitalize animate-pulse">
//               Pick Final Winner
//             </p>
//             <div className="flex items-center justify-center gap-4 pt-2">
//               <div className="h-px w-32 bg-gradient-to-r from-transparent to-red-700" />
//               <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
//               <div className="h-px w-32 bg-gradient-to-l from-transparent to-red-700" />
//             </div>
//           </div>

//           <div className="text-center mb-6">
//             <span className="text-neutral-400 text-xs tracking-widest uppercase">
//               Active Players:{" "}
//               <span className="text-white font-black">
//                 {activePlayers.length}
//               </span>
//             </span>
//           </div>

//           {declareError && (
//             <div className="mb-4 mx-auto max-w-sm text-center bg-red-900/30 border border-red-700/40 rounded-xl px-4 py-2">
//               <p className="text-red-400 text-xs font-bold tracking-widest uppercase">
//                 {declareError}
//               </p>
//             </div>
//           )}

//           <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] gap-4 lg:gap-6">
//             <div className="lg:col-span-2 space-y-4">
//               {activePlayers.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-24 text-center">
//                   <div className="text-5xl mb-4 opacity-30">👥</div>
//                   <p className="text-neutral-500 text-sm tracking-widest uppercase">
//                     Waiting for players…
//                   </p>
//                 </div>
//               ) : (
//                 <>
//                   <div
//                     className={`grid gap-4 ${
//                       activePlayers.length === 1
//                         ? "grid-cols-1 max-w-xs mx-auto"
//                         : activePlayers.length === 2
//                           ? "grid-cols-2"
//                           : activePlayers.length === 3
//                             ? "grid-cols-3"
//                             : "grid-cols-2"
//                     }`}
//                   >
//                     {activePlayers.map((player: Player, index: number) => (
//                       <PlayerCard
//                         key={player.id}
//                         player={player}
//                         index={index}
//                         onCall={(p, i) =>
//                           setActiveCall({ player: p, index: i })
//                         }
//                         onEliminate={handleEliminate}
//                         isEliminating={eliminatingId === player.id}
//                         isCallDisabled={endedCallIds.has(player.id)}
//                       />
//                     ))}
//                   </div>

//                   <div className="flex justify-center items-center mt-5">
//                     <button
//                       onClick={handleDeclareNeither}
//                       disabled={isDeclaring}
//                       className={`w-full py-3 rounded-xl text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 border ${
//                         isDeclaring
//                           ? "bg-neutral-800/60 border-neutral-700/40 text-neutral-500 cursor-not-allowed opacity-60"
//                           : "bg-transparent border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400 hover:text-orange-300 hover:shadow-[0_0_16px_rgba(249,115,22,0.2)] cursor-pointer"
//                       }`}
//                     >
//                       {isDeclaring ? (
//                         <>
//                           <span className="w-3 h-3 rounded-full border-2 border-orange-400 border-t-transparent animate-spin inline-block" />{" "}
//                           Declaring…
//                         </>
//                       ) : (
//                         <>
//                           <span>🚫</span> Declare Neither
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>

//             <ParticipantPanel />
//           </div>
//         </div>

//         {/* Video Call Modal */}
//         {activeCall && (
//           <VideoCallModal
//             player={activeCall.player}
//             index={activeCall.index}
//             onClose={handleCloseCall}
//             sendEvent={sendEvent}
//             callAccepted={callAccepted}
//             callRejected={callRejected}
//             hostUserId={currentUser?.id ?? ""}
//             hostUserName={currentUser?.name ?? currentUser?.username ?? "Host"}
//           />
//         )}

//         {/* Declare Neither Screen */}
//         {showNeitherScreen && <DeclareNeitherScreen />}
//       </div>
//     </>
//   );
// }
"use client";

import ParticipantPanel from "@/components/roundOne/Participantpanel";
import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import Button from "@/components/share/ButtonPrimary";

import { GameWinner, setGameOver } from "@/redux/features/winner/Gameoverslice";
import { VideoCallModal } from "./HostVideoCall";

// ─── Demo video source — replace with your real URL ──────────────────────────
const DEFAULT_VIDEO_SRC = "/videos/IB_Finale.mp4";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Player {
  id: string;
  name?: string;
  avatar?: string;
  socketId: string;
  isEliminated: boolean;
  isReady: boolean;
  isConnected: boolean;
  hasNetworkIssue: boolean;
  hasSubmitted: boolean;
  points: number;
}

const BG_COLORS = ["#1a6abf", "#2a2a2a", "#6b1a1a", "#1a5c2a"];
const GAME_ID = "internet-bachelor-123";
const ELIMINATE_POINTS = 100;

// ─── RouteLoadingOverlay ──────────────────────────────────────────────────────
// Shown immediately when navigation begins so there is never a blank flash.
function RouteLoadingOverlay() {
  const [dots, setDots] = useState(0);
  const [phase, setPhase] = useState(0);

  const phases = ["Revealing the winner", "Setting the stage", "Almost there"];

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
            stroke="url(#arcG)"
            strokeWidth="3"
            strokeDasharray="364"
            strokeDashoffset="274"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="arcG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>

        <svg
          className="absolute w-20 h-20"
          style={{ animation: "counterSpin 1.4s linear infinite" }}
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
          style={{ animation: "rosePulse 1.8s ease-in-out infinite" }}
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
            style={{ animation: "shimmerBar 1.6s ease-in-out infinite" }}
          />
        </div>
        <p className="text-white/25 text-[10px] tracking-[0.5em] uppercase mt-1">
          Please wait
        </p>
      </div>

      <style>{`
        @keyframes rosePulse {
          0%,100% { transform:scale(1);    filter:drop-shadow(0 0 10px rgba(239,68,68,.5)); }
          50%      { transform:scale(1.18); filter:drop-shadow(0 0 26px rgba(239,68,68,1)); }
        }
        @keyframes counterSpin { from{transform:rotate(90deg)} to{transform:rotate(-270deg)} }
        @keyframes shimmerBar  { 0%{transform:translateX(-200%)} 100%{transform:translateX(500%)} }
      `}</style>
    </div>
  );
}

// ─── VideoModal ───────────────────────────────────────────────────────────────
// onFinish is called when the user skips or the video ends + countdown finishes.
// The parent immediately mounts <RouteLoadingOverlay> so there is no blank flash.
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

  // advance() → called by Skip button OR after the 3-second countdown.
  // It simply calls onFinish(); the parent immediately shows RouteLoadingOverlay.
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

      {/* Loading spinner — shown while the video buffer hasn't arrived yet */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-5 z-20">
          {/* Spinning arc rings */}
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
                stroke="url(#videoArcG)"
                strokeWidth="3"
                strokeDasharray="364"
                strokeDashoffset="274"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="videoArcG" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
            <svg
              className="absolute w-20 h-20"
              style={{ animation: "counterSpin 1.4s linear infinite" }}
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
              style={{ animation: "rosePulse 1.8s ease-in-out infinite" }}
            >
              🌹
            </span>
          </div>

          {/* Text row */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-amber-400 font-extrabold text-sm uppercase tracking-[0.35em]">
              Loading video...
            </p>
            <div className="w-56 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full w-1/3 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400"
                style={{ animation: "shimmerBar 1.6s ease-in-out infinite" }}
              />
            </div>
            <p className="text-white/25 text-[10px] tracking-[0.5em] uppercase mt-1">
              Please wait
            </p>
          </div>

          <style>{`
            @keyframes rosePulse {
              0%,100% { transform:scale(1);    filter:drop-shadow(0 0 10px rgba(239,68,68,.5)); }
              50%      { transform:scale(1.18); filter:drop-shadow(0 0 26px rgba(239,68,68,1)); }
            }
            @keyframes counterSpin { from{transform:rotate(90deg)} to{transform:rotate(-270deg)} }
            @keyframes shimmerBar  { 0%{transform:translateX(-200%)} 100%{transform:translateX(500%)} }
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
        <span className="px-3 py-1 rounded-full border border-amber-400/40 bg-black/40 backdrop-blur-sm text-amber-400 text-[11px] font-bold uppercase tracking-widest">
          🏆 Grand Finale
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
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500 relative pointer-events-none"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-amber-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
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
            style={{ animation: "rosePulse 1.2s ease-in-out infinite" }}
          >
            🌹
          </span>
          <p className="text-amber-400 font-extrabold text-xl uppercase tracking-widest">
            Game Over!
          </p>
          <div className="relative w-16 h-16">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
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
            <span className="absolute inset-0 flex items-center justify-center text-amber-400 font-black text-xl">
              {countdown}
            </span>
          </div>
          <p className="text-white/50 text-sm tracking-widest">
            Revealing the winner...
          </p>
          <button
            onClick={advance}
            className="mt-2 px-6 py-2.5 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-400 text-sm font-bold tracking-wider hover:bg-amber-400/30 transition-colors"
          >
            Continue Now →
          </button>
        </div>
      )}

      <style>{`
        @keyframes rosePulse {
          0%,100% { transform:scale(1);   filter:drop-shadow(0 0 14px rgba(245,158,11,.6)); }
          50%     { transform:scale(1.2); filter:drop-shadow(0 0 32px rgba(245,158,11,1)); }
        }
      `}</style>
    </div>
  );
}

// ─── DeclareNeitherScreen ─────────────────────────────────────────────────────
function DeclareNeitherScreen() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showBody, setShowBody] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setShowSubtitle(true), 700);
    const t3 = setTimeout(() => setShowBody(true), 1200);
    const t4 = setTimeout(() => setShowButton(true), 1800);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 40%, rgba(220,38,38,0.06) 0%, transparent 65%),
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
        }}
      />

      <span className="absolute top-6 left-6 text-neutral-800 text-xs font-mono tracking-widest select-none">
        ◻ SESSION END
      </span>
      <span className="absolute top-6 right-6 text-neutral-800 text-xs font-mono tracking-widest select-none">
        NO WINNER ◻
      </span>
      <span className="absolute bottom-6 left-6 text-neutral-800 text-xs font-mono tracking-widest select-none">
        ROUND CONCLUDED
      </span>
      <span className="absolute bottom-6 right-6 text-neutral-800 text-xs font-mono tracking-widest select-none">
        HOST DECISION ◻
      </span>

      <div className="relative z-10 w-full max-w-lg mx-4 text-center flex flex-col items-center">
        <div
          className={`mb-8 transition-all duration-700 ${visible ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
        >
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center mx-auto"
            style={{
              border: "1px solid rgba(220,38,38,0.25)",
              boxShadow:
                "0 0 48px rgba(220,38,38,0.08), inset 0 0 24px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="absolute inset-2 rounded-full"
              style={{ border: "1px solid rgba(220,38,38,0.15)" }}
            />
            <span className="text-5xl relative z-10 select-none">🚫</span>
          </div>
        </div>

        <h1
          className={`text-4xl sm:text-5xl font-black tracking-[0.12em] uppercase text-white transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          No Winner
        </h1>

        <div
          className={`flex items-center gap-3 my-5 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-red-700/60" />
          <div className="w-1 h-1 rounded-full bg-red-600" />
          <span className="text-red-500 text-[10px] font-black tracking-[0.4em] uppercase">
            Declared
          </span>
          <div className="w-1 h-1 rounded-full bg-red-600" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-red-700/60" />
        </div>

        <p
          className={`text-neutral-400 text-sm tracking-[0.25em] uppercase font-semibold mb-8 transition-all duration-700 ${showSubtitle ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          The Host has ended this round
        </p>

        <div
          className={`w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 mb-8 transition-all duration-700 ${showBody ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          <p className="text-neutral-300 text-sm leading-relaxed mb-4">
            After careful consideration, the host has decided that{" "}
            <span className="text-white font-bold">no contestant</span> will be
            declared the winner of this round.
          </p>
          <p className="text-neutral-500 text-xs leading-relaxed">
            This decision is final. No points have been awarded, and no
            elimination has taken place. The round has been closed without a
            declared winner.
          </p>
          <div className="my-5 h-px bg-white/[0.08]" />
          <div className="flex items-center justify-center gap-8 text-center">
            <div>
              <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono mb-1">
                Winner
              </p>
              <p className="text-sm font-black text-red-500 tracking-widest uppercase">
                None
              </p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono mb-1">
                Points Awarded
              </p>
              <p className="text-sm font-black text-neutral-400 tracking-widest">
                0
              </p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono mb-1">
                Status
              </p>
              <p className="text-sm font-black text-orange-500 tracking-widest uppercase">
                Closed
              </p>
            </div>
          </div>
        </div>

        <div
          className={`w-full transition-all duration-700 ${showButton ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <button
            onClick={() => router.push("/")}
            className="w-full py-4 rounded-xl border border-white/15 text-xs font-black tracking-[0.3em] uppercase text-white/80 hover:bg-white/5 hover:border-white/25 hover:text-white transition-all duration-300 cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PlayerCard ───────────────────────────────────────────────────────────────
function PlayerCard({
  player,
  index,
  onCall,
  onEliminate,
  isEliminating,
  isCallDisabled,
}: {
  player: Player;
  index: number;
  onCall: (p: Player, i: number) => void;
  onEliminate: (p: Player) => void;
  isEliminating: boolean;
  isCallDisabled: boolean;
}) {
  const name = player.name ?? `Player ${index + 1}`;
  const isEliminated = player.isEliminated;

  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-500 ${
        isEliminated
          ? "border-red-900/60 opacity-50 grayscale"
          : "border-white/10 bg-gradient-to-b from-neutral-900/90 to-black/95 hover:border-orange-500/40 hover:shadow-[0_0_24px_rgba(249,115,22,0.15)]"
      }`}
    >
      {/* Status badges */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
        <span
          className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full ${
            player.isConnected
              ? "bg-green-500/20 text-green-400 border border-green-500/40"
              : "bg-red-500/20 text-red-400 border border-red-500/40"
          }`}
        >
          {player.isConnected ? "● ONLINE" : "● OFFLINE"}
        </span>
        {player.hasNetworkIssue && (
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
            ⚠ NET
          </span>
        )}
      </div>

      {/* Name + ID */}
      <div className="text-center pt-4 pb-2 px-4">
        <p className="text-white font-black text-sm tracking-widest uppercase truncate">
          {name}
        </p>
        <p className="text-white/35 text-[9px] tracking-[0.3em] uppercase font-mono mt-1">
          ID
        </p>
        <p className="text-white/50 font-mono text-[10px] break-all mt-0.5">
          {player.id}
        </p>
      </div>

      {/* Avatar */}
      <div className="relative w-full aspect-square overflow-hidden px-4">
        <img
          src={player.avatar}
          alt={name}
          className="w-full h-full object-cover object-top rounded-xl transition-transform duration-700 hover:scale-105"
          style={{ backgroundColor: BG_COLORS[index % BG_COLORS.length] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none rounded-xl" />
        <div className="absolute bottom-3 left-7 bg-black/70 border border-white/10 rounded-lg px-2 py-1">
          <span className="text-yellow-400 text-xs font-black">
            ⭐ {player.points}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="p-4 flex flex-col gap-2">
        <button
          onClick={() => onCall(player, index)}
          disabled={isEliminated || isEliminating || isCallDisabled}
          className={`w-full py-3 rounded-xl text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 text-white flex items-center justify-center gap-2
            ${
              isCallDisabled
                ? "bg-neutral-700/50 border border-neutral-600/40 cursor-not-allowed opacity-50"
                : "bg-green-700 hover:bg-green-800 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
        >
          {isCallDisabled ? (
            <>
              <span>🔇</span> Call Ended
            </>
          ) : (
            <>
              <span>🎥</span> Video Call
            </>
          )}
        </button>

        <Button
          variant="game"
          onClick={() => onEliminate(player)}
          disabled={isEliminating || isEliminated}
          className="w-full flex items-center justify-center gap-2"
        >
          {isEliminated ? (
            <>
              <span>💀</span> Eliminated
            </>
          ) : isEliminating ? (
            <>
              <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />{" "}
              Eliminating…
            </>
          ) : (
            <>
              <span>⚡</span> Eliminate Player
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GrandFinale() {
  const [activeCall, setActiveCall] = useState<{
    player: Player;
    index: number;
  } | null>(null);
  const [acceptedUserId, setAcceptedUserId] = useState<string | null>(null);
  const [rejectedUserId, setRejectedUserId] = useState<string | null>(null);
  const [endedCallIds, setEndedCallIds] = useState<Set<string>>(new Set());
  const [eliminatingId, setEliminatingId] = useState<string | null>(null);

  const [isDeclaring, setIsDeclaring] = useState(false);
  const [showNeitherScreen, setShowNeitherScreen] = useState(false);
  const [declareError, setDeclareError] = useState<string | null>(null);

  // showVideo   → the transition video is playing
  // isNavigating → video finished/skipped; show RouteLoadingOverlay while router.push() resolves
  const [showVideo, setShowVideo] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const currentUser = useSelector((state: any) => state.user.user);
  const participants = useSelector((state: any) => state.participants.players);
  const isGameOver = useSelector((state: any) => state.gameOver.isGameOver);

  const activePlayers = participants.filter((p: Player) => !p.isEliminated);

  // When GAME_ENDED fires → open the transition video
  useEffect(() => {
    if (isGameOver) {
      setShowVideo(true);
    }
  }, [isGameOver]);

  // Called by VideoModal when the user skips OR the post-video countdown finishes.
  // 1. Immediately show RouteLoadingOverlay (masks blank flash).
  // 2. Unmount the video.
  // 3. Navigate.
  const handleVideoFinish = useCallback(() => {
    setIsNavigating(true); // show overlay RIGHT NOW
    setShowVideo(false); // unmount video
    router.push("/round-two/round-two-six");
  }, [router]);

  // ── Socket events ─────────────────────────────────────────────────────────
  const { isConnected, sendEvent } = useSocket({
    GAME_EVENT: (payload: any) => {
      console.log("🎮 GAME_EVENT received (host):", payload);

      if (payload?.type === "CALL_ACCEPTED") {
        setAcceptedUserId(payload?.payload?.userId);
      }
      if (payload?.type === "CALL_REJECTED") {
        setRejectedUserId(payload?.payload?.userId);
      }
      if (payload?.type === "GAME_ENDED" && payload?.payload?.winner) {
        const winner: GameWinner = payload.payload.winner;
        dispatch(setGameOver(winner));
        // isGameOver useEffect above will trigger the video
      }
    },
  });

  const callAccepted = !!activeCall && acceptedUserId === activeCall.player.id;
  const callRejected =
    !!activeCall && rejectedUserId === activeCall.player.id && !callAccepted;

  const handleCloseCall = useCallback(() => {
    if (activeCall) {
      setEndedCallIds((prev) => new Set(prev).add(activeCall.player.id));
    }
    setActiveCall(null);
    setAcceptedUserId(null);
    setRejectedUserId(null);
  }, [activeCall]);

  const handleEliminate = useCallback(
    (player: Player) => {
      if (eliminatingId) return;
      setEliminatingId(player.id);

      sendEvent(
        "GAME_EVENT",
        {
          gameId: GAME_ID,
          type: "ELIMINATE",
          payload: {
            playerIds: [player.id],
            points: ELIMINATE_POINTS,
            winnerPoints: 400,
          },
        },
        (response: any) => {
          if (response?.success) {
            if (response?.winner) {
              dispatch(setGameOver(response.winner as GameWinner));
              // isGameOver useEffect will trigger the video
            } else {
              setEliminatingId(null);
            }
          } else {
            console.warn("❌ Eliminate failed:", response);
            setEliminatingId(null);
          }
        },
      );
    },
    [sendEvent, dispatch, eliminatingId],
  );

  const handleDeclareNeither = useCallback(() => {
    if (isDeclaring) return;
    setIsDeclaring(true);
    setDeclareError(null);

    sendEvent(
      "GAME_EVENT",
      {
        gameId: GAME_ID,
        type: "DECLARE_NEITHER",
        payload: {},
      },
      (response: any) => {
        console.log("🚫 DECLARE_NEITHER ACK:", response);
        if (response?.success) {
          router.push("/no-winner");
        } else {
          console.warn("❌ Declare Neither failed:", response);
          setDeclareError("Failed to declare. Please try again.");
          setIsDeclaring(false);
        }
      },
    );
  }, [sendEvent, isDeclaring, router]);

  return (
    <>
      {/*
        Priority render order (highest z-index wins):
          1. isNavigating  → RouteLoadingOverlay (z-[100])  — shown while router resolves
          2. showVideo     → VideoModal          (z-50)     — the transition video
          3. showNeitherScreen → DeclareNeitherScreen (z-50)
          4. activeCall    → VideoCallModal
          5. main game UI
      */}

      {isNavigating && <RouteLoadingOverlay />}

      {showVideo && !isNavigating && (
        <VideoModal onFinish={handleVideoFinish} />
      )}

      <div className="w-full max-w-7xl mx-auto relative overflow-hidden font-sans">
        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-red-900/30">
          <span className="text-white/80 text-sm font-semibold tracking-widest uppercase">
            {isConnected() ? "🟢 Live" : "🔴 Offline"} Host Panel
          </span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
              Live
            </span>
          </div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Title */}
          <div className="text-center mb-10 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-[0.15em] uppercase text-white drop-shadow-[0_0_30px_rgba(220,38,38,0.4)]">
              The Grand Finale
            </h1>
            <p className="text-red-500 text-sm font-black tracking-[0.4em] capitalize animate-pulse">
              Pick Final Winner
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="h-px w-32 bg-gradient-to-r from-transparent to-red-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              <div className="h-px w-32 bg-gradient-to-l from-transparent to-red-700" />
            </div>
          </div>

          <div className="text-center mb-6">
            <span className="text-neutral-400 text-xs tracking-widest uppercase">
              Active Players:{" "}
              <span className="text-white font-black">
                {activePlayers.length}
              </span>
            </span>
          </div>

          {declareError && (
            <div className="mb-4 mx-auto max-w-sm text-center bg-red-900/30 border border-red-700/40 rounded-xl px-4 py-2">
              <p className="text-red-400 text-xs font-bold tracking-widest uppercase">
                {declareError}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] gap-4 lg:gap-6">
            <div className="lg:col-span-2 space-y-4">
              {activePlayers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="text-5xl mb-4 opacity-30">👥</div>
                  <p className="text-neutral-500 text-sm tracking-widest uppercase">
                    Waiting for players…
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className={`grid gap-4 ${
                      activePlayers.length === 1
                        ? "grid-cols-1 max-w-xs mx-auto"
                        : activePlayers.length === 2
                          ? "grid-cols-2"
                          : activePlayers.length === 3
                            ? "grid-cols-3"
                            : "grid-cols-2"
                    }`}
                  >
                    {activePlayers.map((player: Player, index: number) => (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        index={index}
                        onCall={(p, i) =>
                          setActiveCall({ player: p, index: i })
                        }
                        onEliminate={handleEliminate}
                        isEliminating={eliminatingId === player.id}
                        isCallDisabled={endedCallIds.has(player.id)}
                      />
                    ))}
                  </div>

                  <div className="flex justify-center items-center mt-5">
                    <button
                      onClick={handleDeclareNeither}
                      disabled={isDeclaring}
                      className={`w-full py-3 rounded-xl text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 border ${
                        isDeclaring
                          ? "bg-neutral-800/60 border-neutral-700/40 text-neutral-500 cursor-not-allowed opacity-60"
                          : "bg-transparent border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400 hover:text-orange-300 hover:shadow-[0_0_16px_rgba(249,115,22,0.2)] cursor-pointer"
                      }`}
                    >
                      {isDeclaring ? (
                        <>
                          <span className="w-3 h-3 rounded-full border-2 border-orange-400 border-t-transparent animate-spin inline-block" />{" "}
                          Declaring…
                        </>
                      ) : (
                        <>
                          <span>🚫</span> Declare Neither
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            <ParticipantPanel />
          </div>
        </div>

        {/* Video Call Modal */}
        {activeCall && (
          <VideoCallModal
            player={activeCall.player}
            index={activeCall.index}
            onClose={handleCloseCall}
            sendEvent={sendEvent}
            callAccepted={callAccepted}
            callRejected={callRejected}
            hostUserId={currentUser?.id ?? ""}
            hostUserName={currentUser?.name ?? currentUser?.username ?? "Host"}
          />
        )}

        {/* Declare Neither Screen */}
        {showNeitherScreen && <DeclareNeitherScreen />}
      </div>
    </>
  );
}
