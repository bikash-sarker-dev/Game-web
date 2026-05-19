// "use client";

// import ParticipantPanel from "@/components/roundOne/Participantpanel";
// import { useSocket } from "@/hooks/useSocket";
// import { useRouter } from "next/navigation";
// import { useState, useEffect, useRef, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import Button from "@/components/share/ButtonPrimary";

// import { GameWinner, setGameOver } from "@/redux/features/winner/Gameoverslice";
// import { VideoCallModal } from "./HostVideoCall";

// // ─── ZegoCloud Credentials ────────────────────────────────────────────────────
// const ZEGO_APP_ID = 1697884864;
// const ZEGO_SERVER_SECRET = "9ad294853be97ac5458a620f1b2c85a1";

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

// const AVATAR_POOL = [
//   "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=900&fit=crop&crop=face",
//   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=900&fit=crop&crop=face",
//   "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=900&fit=crop&crop=face",
//   "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=900&fit=crop&crop=face",
// ];
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

"use client";

import Button from "@/components/share/ButtonPrimary";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Sparkles,
  Crown,
  Phone,
  Image as ImageIcon,
  Wifi,
  WifiOff,
  MessageSquare,
  Camera,
  Video,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "@/hooks/useSocket";
import VideoCallRound from "./Videocallround";
import { GameWinner, setGameOver } from "@/redux/features/winner/Gameoverslice";
import { useFileUploadingMutation } from "@/redux/api/getMe/getMeApi";
import SnapEditor from "@/components/snapEdit/Snapedit";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface ServerPlayer {
  id: string;
  socketId?: string;
  name?: string;
  username?: string;
  avatar?: string;
  ready?: boolean;
  isReady?: boolean;
  isEliminated?: boolean;
  isConnected?: boolean;
  isElement?: boolean;
}

type LocalPhase =
  | "LOBBY"
  | "READY_WAITING"
  | "QUESTION"
  | "ANSWER_WAITING"
  | "IMAGE_UPLOAD"
  | "IMAGE_WAITING"
  | "VIDEO"
  | "ELEMENT"
  | "ELIMINATED";

/* ─── Round Title Banner ─────────────────────────────────────────────────── */
function RoundTitle({
  roundNumber,
  roundName,
  icon,
  accentColor = "amber",
}: {
  roundNumber: string;
  roundName: string;
  icon: React.ReactNode;
  accentColor?: "amber" | "rose" | "emerald" | "sky" | "violet";
}) {
  const colors: Record<
    string,
    { label: string; name: string; border: string; glow: string; icon: string }
  > = {
    amber: {
      label: "text-amber-500/60",
      name: "text-amber-300",
      border: "border-amber-500/20",
      glow: "from-amber-500/10",
      icon: "text-amber-400",
    },
    sky: {
      label: "text-sky-500/60",
      name: "text-sky-300",
      border: "border-sky-500/20",
      glow: "from-sky-500/10",
      icon: "text-sky-400",
    },
    violet: {
      label: "text-violet-400/60",
      name: "text-violet-200",
      border: "border-violet-500/20",
      glow: "from-violet-500/10",
      icon: "text-violet-400",
    },
    rose: {
      label: "text-rose-500/60",
      name: "text-rose-300",
      border: "border-rose-500/20",
      glow: "from-rose-500/10",
      icon: "text-rose-400",
    },
    emerald: {
      label: "text-emerald-500/60",
      name: "text-emerald-300",
      border: "border-emerald-500/20",
      glow: "from-emerald-500/10",
      icon: "text-emerald-400",
    },
  };

  const c = colors[accentColor];

  return (
    <div
      className={`w-full flex items-center gap-4 pb-5 mb-2 border-b ${c.border}`}
    >
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${c.glow} to-transparent border ${c.border} ${c.icon} shrink-0`}
      >
        {icon}
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className={`text-[10px] font-mono uppercase tracking-[5px] ${c.label}`}
        >
          {roundNumber}
        </span>
        <span
          className={`text-xl sm:text-2xl font-black uppercase tracking-widest ${c.name}`}
        >
          {roundName}
        </span>
      </div>
    </div>
  );
}

/* ─── Animated dot row ───────────────────────────────────────────────────── */
function PulseDots({ count = 3 }: { count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

/* ─── Waiting card ───────────────────────────────────────────────────────── */
function WaitingCard({
  icon,
  title,
  subtitle,
  accentColor = "amber",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accentColor?: "amber" | "rose" | "emerald" | "sky";
}) {
  const ring: Record<string, string> = {
    amber: "ring-amber-500/30 text-amber-400",
    rose: "ring-rose-500/30 text-rose-400",
    emerald: "ring-emerald-500/30 text-emerald-400",
    sky: "ring-sky-500/30 text-sky-400",
  };
  const glow: Record<string, string> = {
    amber: "from-amber-500/10",
    rose: "from-rose-500/10",
    emerald: "from-emerald-500/10",
    sky: "from-sky-500/10",
  };
  return (
    <div className="flex flex-col items-center gap-6 py-4 w-full max-w-sm mx-auto">
      <div
        className={`relative w-20 h-20 rounded-full ring-2 ${ring[accentColor]} flex items-center justify-center bg-gradient-to-br ${glow[accentColor]} to-transparent`}
      >
        <span className={ring[accentColor]}>{icon}</span>
        <span
          className={`absolute w-2.5 h-2.5 rounded-full bg-current ${ring[accentColor].split(" ")[1]} animate-spin`}
          style={{
            top: "-5px",
            left: "calc(50% - 5px)",
            transformOrigin: "5px 45px",
            animationDuration: "2.4s",
          }}
        />
      </div>
      <div className="text-center space-y-2">
        <p className="text-white font-bold text-xl tracking-widest uppercase font-mono">
          {title}
        </p>
        <p className="text-white/40 text-sm tracking-wide">{subtitle}</p>
      </div>
      <PulseDots count={5} />
    </div>
  );
}

/* ─── Element spectator screen ───────────────────────────────────────────── */
function ElementSpectator({ username }: { username?: string }) {
  return (
    <div className="relative flex flex-col items-center gap-8 py-6 w-full overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-rose-500/5" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl animate-pulse"
          style={{ animationDuration: "3s" }}
        />
      </div>
      <div className="relative flex items-center justify-center">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <span
            key={deg}
            className="absolute text-amber-300/60"
            style={{
              fontSize: "10px",
              transform: `rotate(${deg}deg) translateY(-52px)`,
            }}
          >
            ✦
          </span>
        ))}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/20 to-rose-500/20 ring-2 ring-amber-400/40 flex items-center justify-center">
          <Crown className="w-12 h-12 text-amber-300" strokeWidth={1.5} />
        </div>
      </div>
      <div className="text-center space-y-3 z-10">
        <p className="text-[10px] text-amber-500/60 uppercase tracking-[6px] font-mono">
          Tournament Status
        </p>
        <h2
          className="text-4xl sm:text-5xl font-black uppercase tracking-widest leading-none"
          style={{
            background:
              "linear-gradient(135deg, #fbbf24 0%, #f9a8d4 50%, #fbbf24 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 4s linear infinite",
          }}
        >
          You Are an
          <br />
          Element
        </h2>
        <p className="text-white/50 text-sm tracking-widest uppercase">
          One of the Seven ✦ {username ? `@${username}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-3 px-6 py-3 rounded-full border border-amber-500/20 bg-amber-500/5 z-10">
        <Sparkles
          className="w-4 h-4 text-amber-400 animate-spin"
          style={{ animationDuration: "3s" }}
        />
        <span className="text-amber-300 text-sm font-medium tracking-widest uppercase font-mono">
          Watching the tournament
        </span>
        <Sparkles
          className="w-4 h-4 text-amber-400 animate-spin"
          style={{ animationDuration: "3s", animationDirection: "reverse" }}
        />
      </div>
      <div className="flex items-center gap-2 z-10">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: `hsl(${40 + i * 10}, 90%, 60%)`,
              animation: "ping 1.4s cubic-bezier(0,0,0.2,1) infinite",
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }
      `}</style>
    </div>
  );
}

/* ─── Eliminated screen ──────────────────────────────────────────────────── */
function EliminatedScreen() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center gap-6 py-8 w-full">
      <div className="w-20 h-20 rounded-full border-2 border-rose-500/40 flex items-center justify-center bg-rose-500/10">
        <span className="text-4xl">💔</span>
      </div>
      <div className="text-center space-y-2">
        <p className="text-rose-400 font-black text-3xl uppercase tracking-widest font-mono">
          Eliminated
        </p>
        <p className="text-white/30 text-sm tracking-wide">
          Your journey ends here. Thank you for playing.
        </p>
      </div>
      <button
        onClick={() => router.push("/")}
        className="mt-2 px-8 py-3 rounded-full border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 hover:border-rose-400/60 text-rose-300 hover:text-rose-200 text-sm font-semibold uppercase tracking-widest font-mono transition-all duration-300 active:scale-95"
      >
        Please Try Again
      </button>
    </div>
  );
}

/* ─── Lobby screen ───────────────────────────────────────────────────────── */
function LobbyScreen({
  charIdx,
  lobbyText,
  onReady,
}: {
  charIdx: number;
  lobbyText: string;
  onReady: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-8 w-full z-10">
      <div className="text-center">
        <p className="text-[10px] text-amber-500/50 uppercase tracking-[6px] font-mono mb-4">
          Tournament Hub
        </p>
        <p className="text-white font-bold text-lg sm:text-2xl italic leading-relaxed min-h-[3.5rem] font-mono">
          {lobbyText.slice(0, charIdx)}
          {charIdx < lobbyText.length && (
            <span className="inline-block w-0.5 h-6 bg-amber-400 align-middle animate-pulse ml-0.5" />
          )}
        </p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="text-white/30 text-xs uppercase tracking-widest">
          Waiting for the host to begin
        </p>
        <Button variant="game" onClick={onReady}>
          I&apos;m Ready
        </Button>
      </div>
    </div>
  );
}

/* ─── Waiting screens ────────────────────────────────────────────────────── */
function ReadyWaitingScreen() {
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <RoundTitle
        roundNumber="Round 1"
        roundName="Questions"
        icon={<MessageSquare className="w-5 h-5" />}
        accentColor="emerald"
      />
      <WaitingCard
        icon={<Check className="w-9 h-9" />}
        title="Ready!"
        subtitle="Waiting for the host to send the first question…"
        accentColor="emerald"
      />
    </div>
  );
}

function AnswerWaitingScreen() {
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <RoundTitle
        roundNumber="Round 1"
        roundName="Questions"
        icon={<MessageSquare className="w-5 h-5" />}
        accentColor="amber"
      />
      <WaitingCard
        icon={<ImageIcon className="w-9 h-9" />}
        title="Answer Submitted"
        subtitle="Preparing the image upload round…"
        accentColor="amber"
      />
    </div>
  );
}

function ImageWaitingScreen() {
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <RoundTitle
        roundNumber="Round 2"
        roundName="Pictures"
        icon={<Camera className="w-5 h-5" />}
        accentColor="sky"
      />
      <WaitingCard
        icon={<Phone className="w-9 h-9" />}
        title="Image Received"
        subtitle="Waiting for the host to call you…"
        accentColor="sky"
      />
    </div>
  );
}

/* ─── Player avatar ──────────────────────────────────────────────────────── */
function Avatar({ player, index }: { player: ServerPlayer; index: number }) {
  const isEl = player.isElement === true;
  const isElim = player.isEliminated;
  return (
    <div
      title={player.username ?? player.name ?? `Player ${index + 1}`}
      className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 ${
        isEl
          ? "bg-gradient-to-br from-amber-400 to-rose-500 border-amber-300 text-black scale-110 shadow-2xl shadow-amber-500/50"
          : isElim
            ? "bg-rose-950/40 border-rose-800/40 text-rose-800 opacity-40 scale-90"
            : player.isReady || player.ready
              ? "bg-emerald-900/40 border-emerald-500/50 text-emerald-300"
              : "bg-amber-500/10 border-amber-500/30 text-amber-400/60"
      }`}
    >
      {index + 1}
      {isEl && (
        <span
          className="absolute -top-1 -right-1 text-sm leading-none animate-spin"
          style={{ animationDuration: "6s" }}
        >
          ✦
        </span>
      )}
      {isElim && (
        <span className="absolute -bottom-1 -right-1 text-xs leading-none">
          💔
        </span>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Main Component
══════════════════════════════════════════════════════════════════════════════ */
const GAME_ID = "internet-bachelor-123";
const LOBBY_TEXT = '"CONNECTED TO LOBBY"';

function QuesationShowAndAns() {
  const router = useRouter();
  const dispatch = useDispatch();

  /* ── State ───────────────────────────────────────────────────────────── */
  const [charIdx, setCharIdx] = useState(0);
  const [localPhase, setLocalPhase] = useState<LocalPhase>("LOBBY");
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showElementAnimation, setShowElementAnimation] = useState(false);
  const [previousElementStatus, setPreviousElementStatus] = useState(false);
  const [incomingHostId, setIncomingHostId] = useState<string | null>(null);
  const [callKey, setCallKey] = useState(0);
  const [callEndedKey, setCallEndedKey] = useState(0);

  /* ── Redux ───────────────────────────────────────────────────────────── */
  const currentUser = useSelector((state: any) => state.user.user);
  const participants: ServerPlayer[] = useSelector(
    (state: any) => state.participants?.players ?? [],
  );

  const currentPlayer = participants.find((p) => p.id === currentUser?.id);
  const isElement = currentPlayer?.isElement === true;
  const isEliminated = currentPlayer?.isEliminated === true;

  /* ── Refs ────────────────────────────────────────────────────────────── */
  const isEliminatedRef = useRef(false);
  useEffect(() => {
    isEliminatedRef.current = isEliminated;
  }, [isEliminated]);

  /* ── File upload mutation ────────────────────────────────────────────── */
  const [
    uploadFile,
    {
      isLoading: isImageUploading,
      isError: isImageUploadError,
      error: imageUploadErrorData,
      data: imageUploadData,
    },
  ] = useFileUploadingMutation();

  /* ── Helpers ─────────────────────────────────────────────────────────── */
  const safeSetPhase = useCallback((phase: LocalPhase) => {
    if (isEliminatedRef.current && phase !== "ELIMINATED") return;
    setLocalPhase(phase);
  }, []);

  const handleGameEnded = useCallback(
    (winner: GameWinner | null, noWinner?: boolean) => {
      if (noWinner || !winner) {
        router.push("/no-winner");
        return;
      }
      dispatch(setGameOver(winner));
      router.push("/round-two/round-two-six");
    },
    [dispatch, router],
  );

  const extractImageUrl = (result: any): string => {
    if (typeof result?.data === "string" && result.data.startsWith("http")) {
      return result.data;
    }
    return (
      result?.url ?? result?.imageUrl ?? result?.data?.url ?? result?.path ?? ""
    );
  };

  /* ── Image submit ────────────────────────────────────────────────────── */
  const handleImageSubmit = useCallback(
    async (blob: Blob) => {
      try {
        const formData = new FormData();
        formData.append("file", blob, `snap-${Date.now()}.png`);

        const result = await uploadFile(formData).unwrap();
        const imageUrl = extractImageUrl(result);

        if (!imageUrl) throw new Error("No URL returned from upload API");

        sendEvent(
          "GAME_EVENT",
          {
            gameId: GAME_ID,
            type: "SUBMIT_DATA",
            payload: { data: { imageUrl } },
          },
          (response: any) => {
            if (response?.success === true) {
              safeSetPhase("IMAGE_WAITING");
            }
          },
        );
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadFile, safeSetPhase],
  );

  /* ── Socket ──────────────────────────────────────────────────────────── */
  const { sendEvent, isConnected } = useSocket({
    GAME_EVENT: (payload: any) => {
      console.log("🎮 Game Event received:", payload);

      if (payload.type === "GAME_ENDED") {
        const { winner, noWinner } = payload.payload ?? {};
        handleGameEnded(winner ?? null, noWinner === true);
        return;
      }

      if (isEliminatedRef.current && payload.type !== "PLAYERS_UPDATE") return;

      if (payload.type === "PLAYERS_UPDATE" && Array.isArray(payload.payload)) {
        const newParticipants = payload.payload as ServerPlayer[];

        const isNowElement = newParticipants.some(
          (p) => p.id === currentUser?.id && p.isElement === true,
        );
        if (isNowElement && !previousElementStatus) {
          setShowElementAnimation(true);
          safeSetPhase("ELEMENT");
          setTimeout(() => setShowElementAnimation(false), 4200);
        }
        setPreviousElementStatus(isNowElement);

        const nowEliminated = newParticipants.some(
          (p) => p.id === currentUser?.id && p.isEliminated === true,
        );
        if (nowEliminated) {
          isEliminatedRef.current = true;
          setLocalPhase("ELIMINATED");
        }
      }

      if (payload.type === "NEW_QUESTION") {
        setCurrentQuestion(payload.payload.question);
        setAnswer("");
        safeSetPhase("QUESTION");
      }

      if (payload.type === "ROUND_STARTED") {
        setIncomingHostId(null);
        setCallKey(0);
        setCallEndedKey(0);
        if (payload.payload.type === "IMAGE") safeSetPhase("IMAGE_UPLOAD");
        if (payload.payload.type === "VIDEO") safeSetPhase("VIDEO");
      }

      if (payload.type === "INCOMING_CALL") {
        setIncomingHostId(payload.payload.hostId);
        setCallKey((p) => p + 1);
        safeSetPhase("VIDEO");
      }

      if (payload.type === "CALL_ENDED") {
        setIncomingHostId(null);
        setCallEndedKey((p) => p + 1);
      }
    },

    ROSE_GIVEN: (payload: any) =>
      console.log("🌹 Rose given to:", payload.player),

    PLAYER_ELIMINATED: (payload: any) => {
      if (
        payload.player?.id === currentUser?.id ||
        payload.playerId === currentUser?.id
      ) {
        isEliminatedRef.current = true;
        setLocalPhase("ELIMINATED");
      }
    },

    GAME_ENDED: (payload: any) => {
      const winner: GameWinner | null =
        payload?.winner ?? payload?.payload?.winner ?? null;
      const noWinner: boolean =
        payload?.noWinner ?? payload?.payload?.noWinner ?? false;
      handleGameEnded(winner, noWinner);
    },
  });

  /* ── Effects ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (localPhase !== "LOBBY") return;
    if (charIdx >= LOBBY_TEXT.length) return;
    const t = setTimeout(() => setCharIdx((c) => c + 1), 40);
    return () => clearTimeout(t);
  }, [charIdx, localPhase]);

  useEffect(() => {
    if (isEliminated) {
      isEliminatedRef.current = true;
      setLocalPhase("ELIMINATED");
    } else if (
      isElement &&
      localPhase !== "ELEMENT" &&
      localPhase !== "VIDEO"
    ) {
      safeSetPhase("ELEMENT");
    }
  }, [isElement, isEliminated, localPhase, safeSetPhase]);

  /* ── Action handlers ─────────────────────────────────────────────────── */
  const handleReady = () => {
    sendEvent(
      "GAME_EVENT",
      { gameId: GAME_ID, type: "PLAYER_READY", payload: {} },
      (response: any) => {
        if (response?.ready === true || response?.success === true) {
          safeSetPhase("READY_WAITING");
        }
      },
    );
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim() || submitting) return;
    setSubmitting(true);
    sendEvent(
      "GAME_EVENT",
      {
        gameId: GAME_ID,
        type: "SUBMIT_DATA",
        payload: { data: { answer: answer.trim() } },
      },
      (response: any) => {
        setSubmitting(false);
        if (response?.success === true) {
          safeSetPhase("ANSWER_WAITING");
          setCurrentQuestion(null);
        }
      },
    );
  };

  /* ── Derive SnapEditor props ─────────────────────────────────────────── */
  const snapUploadErrorMsg: string | null = isImageUploadError
    ? ((imageUploadErrorData as any)?.data?.message ??
      (imageUploadErrorData as any)?.message ??
      "Upload failed")
    : null;

  const snapUploadedUrl: string | null = imageUploadData
    ? extractImageUrl(imageUploadData)
    : null;

  /* ── Phase renderer ──────────────────────────────────────────────────── */
  const renderCenter = () => {
    switch (localPhase) {
      case "ELIMINATED":
        return <EliminatedScreen />;

      case "ELEMENT":
        return (
          <ElementSpectator
            username={currentPlayer?.username ?? currentPlayer?.name}
          />
        );

      case "VIDEO":
        return (
          <div className="w-full flex flex-col gap-6">
            {/* ── Round 3 — The Grand Finale title ── */}
            <RoundTitle
              roundNumber="Round 3"
              roundName="The Grand Finale"
              icon={<Video className="w-5 h-5" />}
              accentColor="violet"
            />
            <VideoCallRound
              sendEvent={sendEvent}
              incomingHostId={incomingHostId}
              callKey={callKey}
              callEndedKey={callEndedKey}
              gameId={GAME_ID}
            />
          </div>
        );

      case "IMAGE_UPLOAD":
        return (
          <div className="w-full flex flex-col gap-6">
            {/* ── Round 2 — Pictures title ── */}
            <RoundTitle
              roundNumber="Round 2"
              roundName="Pictures"
              icon={<Camera className="w-5 h-5" />}
              accentColor="sky"
            />
            <SnapEditor
              onSubmit={handleImageSubmit}
              isUploading={isImageUploading}
              uploadError={snapUploadErrorMsg}
              uploadedUrl={snapUploadedUrl}
            />
          </div>
        );

      case "IMAGE_WAITING":
        return <ImageWaitingScreen />;

      case "ANSWER_WAITING":
        return <AnswerWaitingScreen />;

      case "READY_WAITING":
        return <ReadyWaitingScreen />;

      case "QUESTION":
        if (!currentQuestion) return null;
        return (
          <div className="w-full flex flex-col items-center gap-6 z-10">
            {/* ── Round 1 — Questions title ── */}
            <RoundTitle
              roundNumber="Round 1"
              roundName="Questions"
              icon={<MessageSquare className="w-5 h-5" />}
              accentColor="amber"
            />

            {/* Question card */}
            <div className="w-full max-w-2xl rounded-2xl border border-amber-500/20 bg-black/30 p-6">
              <p className="text-[10px] text-amber-500/50 uppercase tracking-[5px] font-mono mb-3">
                Question
              </p>
              <p className="text-white font-semibold text-lg sm:text-xl leading-relaxed">
                {currentQuestion}
              </p>
            </div>

            {/* Answer textarea */}
            <div className="w-full max-w-2xl flex flex-col gap-3">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value.slice(0, 300))}
                placeholder="Write your answer here…"
                rows={5}
                className="w-full bg-black/40 border border-amber-500/20 hover:border-amber-500/40 focus:border-amber-400/60 rounded-2xl resize-none p-4 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-colors leading-relaxed"
                style={{ fontFamily: "'Georgia', serif" }}
              />
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono ${
                    answer.length > 280 ? "text-rose-400" : "text-zinc-600"
                  }`}
                >
                  {answer.length} / 300
                </span>
                <Button
                  variant="game"
                  onClick={handleSubmitAnswer}
                  disabled={submitting || !answer.trim()}
                >
                  {submitting ? "Submitting…" : "Submit Answer"}
                </Button>
              </div>
            </div>
          </div>
        );

      case "LOBBY":
      default:
        return (
          <LobbyScreen
            charIdx={charIdx}
            lobbyText={LOBBY_TEXT}
            onReady={handleReady}
          />
        );
    }
  };

  /* ── Phase label map ─────────────────────────────────────────────────── */
  const phaseLabel: Record<LocalPhase, string> = {
    LOBBY: "Lobby",
    READY_WAITING: "Ready — awaiting question",
    QUESTION: "Round 1 · Questions",
    ANSWER_WAITING: "Answer sent — awaiting image round",
    IMAGE_UPLOAD: "Round 2 · Pictures",
    IMAGE_WAITING: "Image sent — awaiting call",
    VIDEO: "Round 3 · The Grand Finale",
    ELEMENT: "You are an Element",
    ELIMINATED: "Eliminated",
  };

  const connected = isConnected();
  const activeCount = participants.filter((p) => !p.isEliminated).length;

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="w-full max-w-7xl mx-auto px-4 flex flex-col gap-6">
      {/* ── Status bar ── */}
      <div className="flex items-center gap-3">
        <span
          className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest transition-colors ${
            connected ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {connected ? "Connected" : "Disconnected"}
        </span>
        <span className="text-white/10">·</span>
        <span className="text-white/30 text-xs font-mono uppercase tracking-widest">
          {phaseLabel[localPhase]}
        </span>
      </div>

      {/* ── Main card ── */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-black/90 via-zinc-950/80 to-rose-950/30 backdrop-blur-sm p-8 sm:p-10 flex flex-col items-center gap-8 min-h-[420px] justify-center relative overflow-hidden">
        {/* Decorative background radials */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #d97706 0%, transparent 50%), radial-gradient(circle at 80% 80%, #9f1239 0%, transparent 50%)",
          }}
        />

        {/* Element flash animation */}
        {showElementAnimation && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl">
            <ElementSpectator
              username={currentPlayer?.username ?? currentPlayer?.name}
            />
          </div>
        )}

        {renderCenter()}
      </div>

      {/* ── Player avatars ── */}
      <div className="text-center">
        <p className="text-white/20 text-[10px] uppercase tracking-widest mb-4 font-mono">
          Contestants — {activeCount} active
        </p>
        <div className="flex items-center justify-center flex-wrap gap-3">
          {participants.map((p, i) => (
            <Avatar key={p.id} player={p} index={i} />
          ))}
        </div>

        {isElement && (
          <p className="mt-5 text-amber-400/80 text-sm font-medium tracking-wide flex items-center justify-center gap-2">
            <Sparkles size={14} /> You are one of the Seven Elements{" "}
            <Sparkles size={14} />
          </p>
        )}
      </div>
    </div>
  );
}

export default QuesationShowAndAns;
