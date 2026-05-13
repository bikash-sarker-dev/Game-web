/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import ParticipantPanel from "@/components/roundOne/Participantpanel";
// import { useSocket } from "@/hooks/useSocket";
// import { useRouter } from "next/navigation";
// import { useState, useEffect, useRef, useCallback } from "react";
// import { useSelector } from "react-redux";

// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import { useZegoCloudQuery } from "@/redux/api/getMe/getMeApi";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface Player {
//   id: string;
//   name?: string;
//   socketId: string;
//   isEliminated: boolean;
//   isReady: boolean;
//   isConnected: boolean;
//   hasNetworkIssue: boolean;
//   hasSubmitted: boolean;
//   points: number;
// }

// type CallStatus =
//   | "calling"
//   | "accepted"
//   | "connected"
//   | "rejected"
//   | "cancelled"
//   | "ended";

// const AVATAR_POOL = [
//   "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=900&fit=crop&crop=face",
//   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=900&fit=crop&crop=face",
//   "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=900&fit=crop&crop=face",
//   "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=900&fit=crop&crop=face",
// ];
// const BG_COLORS = ["#1a6abf", "#2a2a2a", "#6b1a1a", "#1a5c2a"];
// const GAME_ID = "internet-bachelor-123";

// // ─── ZegoCloud Room ───────────────────────────────────────────────────────────
// // All 4 values come directly from the API response — no re-derivation.
// // Flow: API returns { token, appId, roomId, userId }
// //       → generateKitTokenForProduction wraps them into a Kit token
// //       → ZegoUIKitPrebuilt.create(kitToken) → joinRoom
// function ZegoRoom({
//   token,
//   appId,
//   roomId,
//   userId,
//   userName,
//   onLeave,
// }: {
//   token: string;
//   appId: number;
//   roomId: string;
//   userId: string;
//   userName: string;
//   onLeave: () => void;
// }) {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     console.log("USER:", userId);
//     console.log("ROOM:", roomId);
//     console.log("TOKEN:", token);
//     console.log("userName:", userName);
//     console.log("appId:", appId);

//     // generateKitTokenForProduction(appId, serverToken, roomId, userId, userName)
//     // Every argument comes from the API — changing any one will cause error 20014.
//     const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
//       appId,
//       token,
//       roomId,
//       userId,
//       userName,
//     );

//     const zp = ZegoUIKitPrebuilt.create(kitToken);

//     zp.joinRoom({
//       container: containerRef.current,
//       scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
//       showPreJoinView: false,
//       showLeavingView: false,
//       turnOnMicrophoneWhenJoining: true,
//       turnOnCameraWhenJoining: true,
//       showMyCameraToggleButton: true,
//       showMyMicrophoneToggleButton: true,
//       showAudioVideoSettingsButton: false,
//       showScreenSharingButton: false,
//       showTextChat: false,
//       showUserList: false,
//       maxUsers: 2,
//       layout: "Auto",
//       onLeaveRoom: onLeave,
//       onUserLeave: onLeave,
//     });

//     return () => {
//       try {
//         zp.destroy();
//       } catch (_) {}
//     };
//   }, []); // intentionally empty — values are stable at mount time

//   return (
//     <div
//       ref={containerRef}
//       style={{ width: "100%", height: "100%", minHeight: 520 }}
//     />
//   );
// }

// // ─── Video Call Modal ─────────────────────────────────────────────────────────
// function VideoCallModal({
//   player,
//   index,
//   onClose,
//   sendEvent,
//   callAccepted,
//   callRejected,
//   hostUserId,
//   hostUserName,
// }: {
//   player: Player;
//   index: number;
//   onClose: () => void;
//   sendEvent: (event: string, payload: unknown) => void;
//   callAccepted: boolean;
//   callRejected: boolean;
//   hostUserId: string;
//   hostUserName: string;
// }) {
//   const [status, setStatus] = useState<CallStatus>("calling");
//   const [showBanner, setShowBanner] = useState(false);
//   const statusRef = useRef<CallStatus>("calling");

//   const set = (s: CallStatus) => {
//     statusRef.current = s;
//     setStatus(s);
//   };

//   // roomId we send to the API — must match what participant sends
//   const callRoomId = `${player.id}${GAME_ID}`;

//   // ── Fetch Zego token from your API ────────────────────────────────────────
//   // Only fetch after participant accepts — we don't want to waste tokens.
//   // Query sends: { userId: hostUserId, roomId: callRoomId }
//   // API responds: { success, data: { token, appId, roomId, userId, expiredAt } }
//   const {
//     data: apiResp,
//     isLoading,
//     isError,
//   } = useZegoCloudQuery(
//     { userId: hostUserId, roomId: callRoomId },
//     { skip: !callAccepted },
//   );

//   const zego = apiResp?.data; // { token, appId, roomId, userId, expiredAt }

//   const displayName = player.name ?? `Player ${index + 1}`;
//   const avatar = AVATAR_POOL[index % AVATAR_POOL.length];
//   const bgColor = BG_COLORS[index % BG_COLORS.length];

//   // ── Fire CALL_PLAYER on mount ─────────────────────────────────────────────
//   useEffect(() => {
//     sendEvent("GAME_EVENT", {
//       gameId: GAME_ID,
//       type: "CALL_PLAYER",
//       payload: { userId: player.id },
//     });
//   }, []);

//   // ── Participant accepted ──────────────────────────────────────────────────
//   useEffect(() => {
//     if (!callAccepted) return;
//     if (statusRef.current !== "calling" && statusRef.current !== "accepted")
//       return;
//     set("accepted");
//     setShowBanner(true);
//     const t = setTimeout(() => {
//       if (statusRef.current === "accepted") {
//         setShowBanner(false);
//         set("connected");
//       }
//     }, 2200);
//     return () => clearTimeout(t);
//   }, [callAccepted]);

//   // ── Participant rejected ──────────────────────────────────────────────────
//   useEffect(() => {
//     if (!callRejected) return;
//     if (statusRef.current !== "calling") return;
//     sendEvent("GAME_EVENT", {
//       gameId: GAME_ID,
//       type: "CALL_ENDED",
//       payload: { userId: player.id, reason: "rejected" },
//     });
//     set("rejected");
//     const t = setTimeout(onClose, 2500);
//     return () => clearTimeout(t);
//   }, [callRejected]);

//   const handleCancel = () => {
//     if (statusRef.current !== "calling") return;
//     sendEvent("GAME_EVENT", {
//       gameId: GAME_ID,
//       type: "CALL_ENDED",
//       payload: { userId: player.id, reason: "cancelled" },
//     });
//     set("cancelled");
//     setTimeout(onClose, 1400);
//   };

//   const handleZegoLeave = useCallback(() => {
//     sendEvent("GAME_EVENT", {
//       gameId: GAME_ID,
//       type: "CALL_ENDED",
//       payload: { userId: player.id, reason: "completed" },
//     });
//     set("ended");
//     setTimeout(onClose, 800);
//   }, [player.id]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
//       <div
//         className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(0,0,0,0.95)] bg-neutral-950 flex flex-col"
//         style={{ minHeight: 520 }}
//       >
//         {/* ══ CALLING ══════════════════════════════════════════════════════════ */}
//         {status === "calling" && (
//           <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5">
//             <div
//               className="absolute inset-0 opacity-20"
//               style={{
//                 background: `radial-gradient(ellipse at 50% 40%, ${bgColor}cc, transparent 65%)`,
//               }}
//             />
//             <div className="relative z-10 flex items-center justify-center">
//               {[140, 185, 230].map((s, i) => (
//                 <span
//                   key={s}
//                   className="absolute rounded-full border border-white/10 animate-ping"
//                   style={{
//                     width: s,
//                     height: s,
//                     animationDuration: `${1.4 + i * 0.6}s`,
//                     animationDelay: `${i * 0.18}s`,
//                   }}
//                 />
//               ))}
//               <img
//                 src={avatar}
//                 alt="Calling"
//                 className="w-28 h-28 rounded-full object-cover object-top border-2 border-white/20 relative z-10 shadow-2xl"
//                 style={{ backgroundColor: bgColor }}
//               />
//             </div>
//             <div className="z-10 text-center space-y-1.5">
//               <p className="text-white/35 text-[10px] tracking-[0.45em] uppercase font-mono">
//                 Ringing…
//               </p>
//               <p className="text-white font-black text-xl tracking-widest uppercase">
//                 {displayName}
//               </p>
//               <p className="text-white/25 font-mono text-[10px] break-all max-w-[260px] mx-auto">
//                 {player.id}
//               </p>
//               <div className="flex items-center justify-center gap-1.5 pt-1">
//                 {[0, 180, 360].map((d) => (
//                   <span
//                     key={d}
//                     className="w-1.5 h-1.5 bg-white/35 rounded-full animate-bounce"
//                     style={{ animationDelay: `${d}ms` }}
//                   />
//                 ))}
//               </div>
//             </div>
//             <button
//               onClick={handleCancel}
//               className="z-10 w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 active:scale-90 transition-all flex items-center justify-center text-2xl shadow-[0_0_40px_rgba(220,38,38,0.5)] cursor-pointer select-none"
//             >
//               📵
//             </button>
//             <p className="z-10 -mt-3 text-white/25 text-[10px] tracking-widest uppercase font-mono">
//               Cancel
//             </p>
//           </div>
//         )}

//         {/* ══ CANCELLED ════════════════════════════════════════════════════════ */}
//         {status === "cancelled" && (
//           <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-black/95">
//             <div className="text-6xl">🚫</div>
//             <p className="text-white font-black text-xl tracking-widest uppercase">
//               Call Cancelled
//             </p>
//             <p className="text-white/40 text-xs font-mono">
//               You hung up before they answered
//             </p>
//           </div>
//         )}

//         {/* ══ REJECTED ═════════════════════════════════════════════════════════ */}
//         {status === "rejected" && (
//           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-black/90 backdrop-blur-sm">
//             <div className="relative flex items-center justify-center">
//               {[140, 185].map((s, i) => (
//                 <span
//                   key={s}
//                   className="absolute rounded-full border border-red-500/20 animate-ping"
//                   style={{
//                     width: s,
//                     height: s,
//                     animationDuration: `${1.2 + i * 0.6}s`,
//                   }}
//                 />
//               ))}
//               <img
//                 src={avatar}
//                 alt={displayName}
//                 className="w-24 h-24 rounded-full object-cover object-top border-4 border-red-500/40 relative z-10 opacity-40 grayscale"
//                 style={{ backgroundColor: bgColor }}
//               />
//               <span className="absolute -bottom-1 -right-1 z-20 w-8 h-8 rounded-full bg-red-600 border-2 border-black flex items-center justify-center text-sm">
//                 ✕
//               </span>
//             </div>
//             <div className="text-center space-y-1">
//               <p className="text-red-400 font-black text-sm tracking-[0.4em] uppercase animate-pulse">
//                 Call Declined
//               </p>
//               <p className="text-white font-black text-lg tracking-widest uppercase">
//                 {displayName}
//               </p>
//               <p className="text-white/35 text-sm font-mono">
//                 is not available right now
//               </p>
//             </div>
//             <div className="flex items-center gap-1.5">
//               {[0, 180, 360].map((d) => (
//                 <span
//                   key={d}
//                   className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce"
//                   style={{ animationDelay: `${d}ms` }}
//                 />
//               ))}
//               <span className="text-white/25 text-[10px] font-mono ml-1 tracking-widest">
//                 closing…
//               </span>
//             </div>
//           </div>
//         )}

//         {/* ══ ACCEPTED BANNER ══════════════════════════════════════════════════ */}
//         {status === "accepted" && showBanner && (
//           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-black/55 backdrop-blur-sm">
//             <div className="relative flex items-center justify-center">
//               {[140, 185].map((s, i) => (
//                 <span
//                   key={s}
//                   className="absolute rounded-full border border-green-400/30 animate-ping"
//                   style={{
//                     width: s,
//                     height: s,
//                     animationDuration: `${1 + i * 0.5}s`,
//                   }}
//                 />
//               ))}
//               <img
//                 src={avatar}
//                 alt={displayName}
//                 className="w-28 h-28 rounded-full object-cover object-top border-4 border-green-400/60 relative z-10 shadow-[0_0_50px_rgba(74,222,128,0.45)]"
//                 style={{ backgroundColor: bgColor }}
//               />
//               <span className="absolute -bottom-1 -right-1 z-20 w-9 h-9 rounded-full bg-green-500 border-2 border-black flex items-center justify-center shadow-lg">
//                 ✓
//               </span>
//             </div>
//             <div className="text-center space-y-1">
//               <p className="text-green-400 font-black text-sm tracking-[0.4em] uppercase animate-pulse">
//                 Call Accepted
//               </p>
//               <p className="text-white font-black text-lg tracking-widest uppercase">
//                 {displayName}
//               </p>
//               <p className="text-white/35 font-mono text-xs">
//                 {isLoading ? "Fetching secure token…" : "Connecting video…"}
//               </p>
//             </div>
//             <div className="w-56 h-1 bg-white/10 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-gradient-to-r from-green-500 to-green-300 rounded-full"
//                 style={{ animation: "grow 2.2s ease-out forwards" }}
//               />
//             </div>
//           </div>
//         )}

//         {/* ══ CONNECTED ════════════════════════════════════════════════════════ */}
//         {status === "connected" && (
//           <div className="w-full h-full" style={{ minHeight: 520 }}>
//             {/* Loading token */}
//             {isLoading && (
//               <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
//                 <div className="w-10 h-10 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
//                 <p className="text-white/40 text-sm font-mono tracking-widest">
//                   Fetching secure token…
//                 </p>
//               </div>
//             )}
//             {/* Token error */}
//             {isError && !isLoading && (
//               <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
//                 <div className="text-4xl">⚠️</div>
//                 <p className="text-red-400 font-black text-sm tracking-widest uppercase">
//                   Token Error
//                 </p>
//                 <p className="text-white/35 text-xs font-mono">
//                   Could not get Zego token. Please try again.
//                 </p>
//                 <button
//                   onClick={onClose}
//                   className="mt-2 px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase transition-all cursor-pointer"
//                 >
//                   Close
//                 </button>
//               </div>
//             )}
//             {/* ZegoCloud room — mount only when ALL 4 API fields are present */}
//             {!isLoading &&
//               !isError &&
//               zego?.token &&
//               zego?.appId &&
//               zego?.roomId &&
//               zego?.userId && (
//                 <ZegoRoom
//                   token={zego.token} // API → data.token
//                   appId={zego.appId} // API → data.appId
//                   roomId={zego.roomId} // API → data.roomId
//                   userId={zego.userId} // API → data.userId
//                   userName={hostUserName}
//                   onLeave={handleZegoLeave}
//                 />
//               )}
//           </div>
//         )}

//         {/* ══ ENDED ════════════════════════════════════════════════════════════ */}
//         {status === "ended" && (
//           <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-black/95">
//             <div className="text-6xl">📵</div>
//             <p className="text-white font-black text-xl tracking-widest uppercase">
//               Call Ended
//             </p>
//           </div>
//         )}

//         <style>{`@keyframes grow { from{width:0%} to{width:100%} }`}</style>
//       </div>
//     </div>
//   );
// }

// // ─── PlayerCard ───────────────────────────────────────────────────────────────
// function PlayerCard({
//   player,
//   index,
//   onCall,
// }: {
//   player: Player;
//   index: number;
//   onCall: (p: Player, i: number) => void;
// }) {
//   const name = player.name ?? `Player ${index + 1}`;
//   return (
//     <div className="relative flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-neutral-900/90 to-black/95 hover:border-orange-500/40 hover:shadow-[0_0_24px_rgba(249,115,22,0.15)] transition-all duration-500">
//       <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
//         <span
//           className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full ${player.isConnected ? "bg-green-500/20 text-green-400 border border-green-500/40" : "bg-red-500/20 text-red-400 border border-red-500/40"}`}
//         >
//           {player.isConnected ? "● ONLINE" : "● OFFLINE"}
//         </span>
//         {player.hasNetworkIssue && (
//           <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
//             ⚠ NET
//           </span>
//         )}
//       </div>
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
//       <div className="relative w-full aspect-square overflow-hidden px-4">
//         <img
//           src={AVATAR_POOL[index % AVATAR_POOL.length]}
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
//       <div className="p-4">
//         <button
//           onClick={() => onCall(player, index)}
//           className="w-full py-3 rounded-xl text-xs font-black tracking-[0.2em] uppercase bg-gradient-to-r from-violet-700 to-blue-600 hover:from-violet-600 hover:to-blue-500 hover:shadow-[0_0_24px_rgba(124,58,237,0.5)] active:scale-95 transition-all duration-300 text-white flex items-center justify-center gap-2 cursor-pointer"
//         >
//           <span className="text-base">🎥</span> Video Call
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function GrandFinale() {
//   const [selected, setSelected] = useState<string | null>(null);
//   const [confirmed, setConfirmed] = useState(false);
//   const [activeCall, setActiveCall] = useState<{
//     player: Player;
//     index: number;
//   } | null>(null);
//   const [acceptedUserId, setAcceptedUserId] = useState<string | null>(null);
//   const [rejectedUserId, setRejectedUserId] = useState<string | null>(null);

//   const router = useRouter();
//   const currentUser = useSelector((state: any) => state.user.user);
//   const participants = useSelector((state: any) => state.participants.players);
//   const activePlayers = participants.filter((p: Player) => !p.isEliminated);

//   const { isConnected, sendEvent } = useSocket({
//     GAME_EVENT: (payload: any) => {
//       if (payload?.type === "CALL_ACCEPTED")
//         setAcceptedUserId(payload?.payload?.userId);
//       if (payload?.type === "CALL_REJECTED")
//         setRejectedUserId(payload?.payload?.userId);
//     },
//   });

//   const callAccepted = !!activeCall && acceptedUserId === activeCall.player.id;
//   const callRejected =
//     !!activeCall && rejectedUserId === activeCall.player.id && !callAccepted;

//   const handleCloseCall = useCallback(() => {
//     setActiveCall(null);
//     setAcceptedUserId(null);
//     setRejectedUserId(null);
//   }, []);

//   return (
//     <div className="w-full max-w-7xl mx-auto relative overflow-hidden font-sans">
//       {/* Top bar */}
//       <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-red-900/30">
//         <span className="text-white/80 text-sm font-semibold tracking-widest uppercase">
//           {isConnected() ? "🟢 Live" : "🔴 Offline"} Contestant 2
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
//           <p className="text-red-500 text-xs font-black tracking-[0.4em] uppercase animate-pulse">
//             Eliminate Down to 2
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
//                   className={`grid gap-4 ${activePlayers.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : activePlayers.length === 2 ? "grid-cols-2" : activePlayers.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}
//                 >
//                   {activePlayers.map((player: Player, index: number) => (
//                     <PlayerCard
//                       key={player.id}
//                       player={player}
//                       index={index}
//                       onCall={(p, i) => setActiveCall({ player: p, index: i })}
//                     />
//                   ))}
//                 </div>
//                 {selected && (
//                   <div className="flex gap-3 rounded-xl border border-orange-900/40 bg-black/40 p-4">
//                     <button
//                       onClick={() => {
//                         setConfirmed(true);
//                         router.push("/round-two/round-two-five");
//                       }}
//                       className={`flex-1 py-3 px-6 text-xs font-black tracking-[0.25em] uppercase rounded-lg transition-all duration-300 ${confirmed ? "bg-green-600 text-white cursor-default" : "bg-gradient-to-r from-red-700 to-red-600 text-white hover:from-red-600 hover:to-red-500"}`}
//                     >
//                       {confirmed ? "✓ Vote Submitted!" : "Confirm Vote"}
//                     </button>
//                   </div>
//                 )}
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
//     </div>
//   );
// }

// "use client";

// import ParticipantPanel from "@/components/roundOne/Participantpanel";
// import { useSocket } from "@/hooks/useSocket";
// import { useRouter } from "next/navigation";
// import { useState, useEffect, useRef, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import Button from "@/components/share/ButtonPrimary";

// // ─── ZegoCloud Credentials ────────────────────────────────────────────────────
// const ZEGO_APP_ID = 1697884864;
// const ZEGO_SERVER_SECRET = "9ad294853be97ac5458a620f1b2c85a1";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface Player {
//   id: string;
//   name?: string;
//   socketId: string;
//   isEliminated: boolean;
//   isReady: boolean;
//   isConnected: boolean;
//   hasNetworkIssue: boolean;
//   hasSubmitted: boolean;
//   points: number;
// }

// type CallStatus =
//   | "calling"
//   | "accepted"
//   | "connected"
//   | "rejected"
//   | "cancelled"
//   | "ended";

// const AVATAR_POOL = [
//   "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=900&fit=crop&crop=face",
//   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=900&fit=crop&crop=face",
//   "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=900&fit=crop&crop=face",
//   "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=900&fit=crop&crop=face",
// ];
// const BG_COLORS = ["#1a6abf", "#2a2a2a", "#6b1a1a", "#1a5c2a"];
// const GAME_ID = "internet-bachelor-123";

// // ─── ZegoCloud Room (host side) ───────────────────────────────────────────────
// // Uses generateKitTokenForTest — 100% frontend, no backend required.
// // roomId: player.id + GAME_ID  (must match what participant uses)
// // userId: hostUserId
// function ZegoRoom({
//   roomId,
//   userId,
//   userName,
//   onLeave,
// }: {
//   roomId: string;
//   userId: string;
//   userName: string;
//   onLeave: () => void;
// }) {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     console.log("[HOST] Joining ZegoRoom");
//     console.log("  roomId  :", roomId);
//     console.log("  userId  :", userId);
//     console.log("  userName:", userName);

//     // generateKitTokenForTest(appId, serverSecret, roomId, userId, userName)
//     // Runs entirely on the client — no API call needed.
//     const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//       ZEGO_APP_ID,
//       ZEGO_SERVER_SECRET,
//       roomId,
//       userId,
//       userName,
//     );

//     const zp = ZegoUIKitPrebuilt.create(kitToken);

//     zp.joinRoom({
//       container: containerRef.current,
//       scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
//       showPreJoinView: false,
//       showLeavingView: false,
//       turnOnMicrophoneWhenJoining: true,
//       turnOnCameraWhenJoining: true,
//       showMyCameraToggleButton: true,
//       showMyMicrophoneToggleButton: true,
//       showAudioVideoSettingsButton: false,
//       showScreenSharingButton: false,
//       showTextChat: false,
//       showUserList: false,
//       maxUsers: 2,
//       layout: "Auto",
//       onLeaveRoom: onLeave,
//       onUserLeave: onLeave,
//     });

//     return () => {
//       try {
//         zp.destroy();
//       } catch (_) {}
//     };
//   }, []); // intentionally empty — values are stable at mount time

//   return (
//     <div
//       ref={containerRef}
//       style={{ width: "100%", height: "100%", minHeight: 520 }}
//     />
//   );
// }

// // ─── Video Call Modal ─────────────────────────────────────────────────────────
// function VideoCallModal({
//   player,
//   index,
//   onClose,
//   sendEvent,
//   callAccepted,
//   callRejected,
//   hostUserId,
//   hostUserName,
// }: {
//   player: Player;
//   index: number;
//   onClose: () => void;
//   sendEvent: (event: string, payload: unknown) => void;
//   callAccepted: boolean;
//   callRejected: boolean;
//   hostUserId: string;
//   hostUserName: string;
// }) {
//   const [status, setStatus] = useState<CallStatus>("calling");
//   const [showBanner, setShowBanner] = useState(false);
//   const statusRef = useRef<CallStatus>("calling");

//   const set = (s: CallStatus) => {
//     statusRef.current = s;
//     setStatus(s);
//   };

//   // roomId must EXACTLY match participant's roomId:
//   // Participant: `${currentUser.id}${GAME_ID}` where currentUser.id === player.id ✓
//   const callRoomId = `${player.id}${GAME_ID}`;

//   const displayName = player.name ?? `Player ${index + 1}`;
//   const avatar = AVATAR_POOL[index % AVATAR_POOL.length];
//   const bgColor = BG_COLORS[index % BG_COLORS.length];

//   // ── Fire CALL_PLAYER on mount ─────────────────────────────────────────────
//   useEffect(() => {
//     sendEvent("GAME_EVENT", {
//       gameId: GAME_ID,
//       type: "CALL_PLAYER",
//       payload: { userId: player.id },
//     });
//   }, []);

//   // ── Participant accepted ──────────────────────────────────────────────────
//   useEffect(() => {
//     if (!callAccepted) return;
//     if (statusRef.current !== "calling" && statusRef.current !== "accepted")
//       return;
//     set("accepted");
//     setShowBanner(true);
//     const t = setTimeout(() => {
//       if (statusRef.current === "accepted") {
//         setShowBanner(false);
//         set("connected");
//       }
//     }, 2200);
//     return () => clearTimeout(t);
//   }, [callAccepted]);

//   // ── Participant rejected ──────────────────────────────────────────────────
//   useEffect(() => {
//     if (!callRejected) return;
//     if (statusRef.current !== "calling") return;
//     sendEvent("GAME_EVENT", {
//       gameId: GAME_ID,
//       type: "END_CALL",
//       payload: { userId: player.id, reason: "rejected" },
//     });
//     set("rejected");
//     const t = setTimeout(onClose, 2500);
//     return () => clearTimeout(t);
//   }, [callRejected]);

//   const handleCancel = () => {
//     if (statusRef.current !== "calling") return;
//     sendEvent("GAME_EVENT", {
//       gameId: GAME_ID,
//       type: "END_CALL",
//       payload: { userId: player.id, reason: "cancelled" },
//     });
//     set("cancelled");
//     setTimeout(onClose, 1400);
//   };

//   const handleZegoLeave = useCallback(() => {
//     sendEvent("GAME_EVENT", {
//       gameId: GAME_ID,
//       type: "END_CALL",
//       payload: { userId: player.id, reason: "completed" },
//     });
//     set("ended");
//     setTimeout(onClose, 800);
//   }, [player.id]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
//       <div
//         className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(0,0,0,0.95)] bg-neutral-950 flex flex-col"
//         style={{ minHeight: 520 }}
//       >
//         {/* ══ CALLING ══════════════════════════════════════════════════════════ */}
//         {status === "calling" && (
//           <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5">
//             <div
//               className="absolute inset-0 opacity-20"
//               style={{
//                 background: `radial-gradient(ellipse at 50% 40%, ${bgColor}cc, transparent 65%)`,
//               }}
//             />
//             <div className="relative z-10 flex items-center justify-center">
//               {[140, 185, 230].map((s, i) => (
//                 <span
//                   key={s}
//                   className="absolute rounded-full border border-white/10 animate-ping"
//                   style={{
//                     width: s,
//                     height: s,
//                     animationDuration: `${1.4 + i * 0.6}s`,
//                     animationDelay: `${i * 0.18}s`,
//                   }}
//                 />
//               ))}
//               <img
//                 src={avatar}
//                 alt="Calling"
//                 className="w-28 h-28 rounded-full object-cover object-top border-2 border-white/20 relative z-10 shadow-2xl"
//                 style={{ backgroundColor: bgColor }}
//               />
//             </div>
//             <div className="z-10 text-center space-y-1.5">
//               <p className="text-white/35 text-[10px] tracking-[0.45em] uppercase font-mono">
//                 Ringing…
//               </p>
//               <p className="text-white font-black text-xl tracking-widest uppercase">
//                 {displayName}
//               </p>
//               <p className="text-white/25 font-mono text-[10px] break-all max-w-[260px] mx-auto">
//                 {player.id}
//               </p>
//               <div className="flex items-center justify-center gap-1.5 pt-1">
//                 {[0, 180, 360].map((d) => (
//                   <span
//                     key={d}
//                     className="w-1.5 h-1.5 bg-white/35 rounded-full animate-bounce"
//                     style={{ animationDelay: `${d}ms` }}
//                   />
//                 ))}
//               </div>
//             </div>
//             <button
//               onClick={handleCancel}
//               className="z-10 w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 active:scale-90 transition-all flex items-center justify-center text-2xl shadow-[0_0_40px_rgba(220,38,38,0.5)] cursor-pointer select-none"
//             >
//               📵
//             </button>
//             <p className="z-10 -mt-3 text-white/25 text-[10px] tracking-widest uppercase font-mono">
//               Cancel
//             </p>
//           </div>
//         )}

//         {/* ══ CANCELLED ════════════════════════════════════════════════════════ */}
//         {status === "cancelled" && (
//           <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-black/95">
//             <div className="text-6xl">🚫</div>
//             <p className="text-white font-black text-xl tracking-widest uppercase">
//               Call Cancelled
//             </p>
//             <p className="text-white/40 text-xs font-mono">
//               You hung up before they answered
//             </p>
//           </div>
//         )}

//         {/* ══ REJECTED ═════════════════════════════════════════════════════════ */}
//         {status === "rejected" && (
//           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-black/90 backdrop-blur-sm">
//             <div className="relative flex items-center justify-center">
//               {[140, 185].map((s, i) => (
//                 <span
//                   key={s}
//                   className="absolute rounded-full border border-red-500/20 animate-ping"
//                   style={{
//                     width: s,
//                     height: s,
//                     animationDuration: `${1.2 + i * 0.6}s`,
//                   }}
//                 />
//               ))}
//               <img
//                 src={avatar}
//                 alt={displayName}
//                 className="w-24 h-24 rounded-full object-cover object-top border-4 border-red-500/40 relative z-10 opacity-40 grayscale"
//                 style={{ backgroundColor: bgColor }}
//               />
//               <span className="absolute -bottom-1 -right-1 z-20 w-8 h-8 rounded-full bg-red-600 border-2 border-black flex items-center justify-center text-sm">
//                 ✕
//               </span>
//             </div>
//             <div className="text-center space-y-1">
//               <p className="text-red-400 font-black text-sm tracking-[0.4em] uppercase animate-pulse">
//                 Call Declined
//               </p>
//               <p className="text-white font-black text-lg tracking-widest uppercase">
//                 {displayName}
//               </p>
//               <p className="text-white/35 text-sm font-mono">
//                 is not available right now
//               </p>
//             </div>
//             <div className="flex items-center gap-1.5">
//               {[0, 180, 360].map((d) => (
//                 <span
//                   key={d}
//                   className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce"
//                   style={{ animationDelay: `${d}ms` }}
//                 />
//               ))}
//               <span className="text-white/25 text-[10px] font-mono ml-1 tracking-widest">
//                 closing…
//               </span>
//             </div>
//           </div>
//         )}

//         {/* ══ ACCEPTED BANNER ══════════════════════════════════════════════════ */}
//         {status === "accepted" && showBanner && (
//           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-black/55 backdrop-blur-sm">
//             <div className="relative flex items-center justify-center">
//               {[140, 185].map((s, i) => (
//                 <span
//                   key={s}
//                   className="absolute rounded-full border border-green-400/30 animate-ping"
//                   style={{
//                     width: s,
//                     height: s,
//                     animationDuration: `${1 + i * 0.5}s`,
//                   }}
//                 />
//               ))}
//               <img
//                 src={avatar}
//                 alt={displayName}
//                 className="w-28 h-28 rounded-full object-cover object-top border-4 border-green-400/60 relative z-10 shadow-[0_0_50px_rgba(74,222,128,0.45)]"
//                 style={{ backgroundColor: bgColor }}
//               />
//               <span className="absolute -bottom-1 -right-1 z-20 w-9 h-9 rounded-full bg-green-500 border-2 border-black flex items-center justify-center shadow-lg">
//                 ✓
//               </span>
//             </div>
//             <div className="text-center space-y-1">
//               <p className="text-green-400 font-black text-sm tracking-[0.4em] uppercase animate-pulse">
//                 Call Accepted
//               </p>
//               <p className="text-white font-black text-lg tracking-widest uppercase">
//                 {displayName}
//               </p>
//               <p className="text-white/35 font-mono text-xs">
//                 Connecting video…
//               </p>
//             </div>
//             <div className="w-56 h-1 bg-white/10 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-gradient-to-r from-green-500 to-green-300 rounded-full"
//                 style={{ animation: "grow 2.2s ease-out forwards" }}
//               />
//             </div>
//           </div>
//         )}

//         {/* ══ CONNECTED: ZegoCloud room ════════════════════════════════════════ */}
//         {status === "connected" && (
//           <div className="w-full h-full" style={{ minHeight: 520 }}>
//             <ZegoRoom
//               roomId={callRoomId}
//               userId={hostUserId}
//               userName={hostUserName}
//               onLeave={handleZegoLeave}
//             />
//           </div>
//         )}

//         {/* ══ ENDED ════════════════════════════════════════════════════════════ */}
//         {status === "ended" && (
//           <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-black/95">
//             <div className="text-6xl">📵</div>
//             <p className="text-white font-black text-xl tracking-widest uppercase">
//               Call Ended
//             </p>
//           </div>
//         )}

//         <style>{`@keyframes grow { from{width:0%} to{width:100%} }`}</style>
//       </div>
//     </div>
//   );
// }

// // ─── PlayerCard ───────────────────────────────────────────────────────────────
// function PlayerCard({
//   player,
//   index,
//   onCall,
// }: {
//   player: Player;
//   index: number;
//   onCall: (p: Player, i: number) => void;
// }) {
//   const name = player.name ?? `Player ${index + 1}`;
//   return (
//     <div className="relative flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-neutral-900/90 to-black/95 hover:border-orange-500/40 hover:shadow-[0_0_24px_rgba(249,115,22,0.15)] transition-all duration-500">
//       <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
//         <span
//           className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full ${player.isConnected ? "bg-green-500/20 text-green-400 border border-green-500/40" : "bg-red-500/20 text-red-400 border border-red-500/40"}`}
//         >
//           {player.isConnected ? "● ONLINE" : "● OFFLINE"}
//         </span>
//         {player.hasNetworkIssue && (
//           <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
//             ⚠ NET
//           </span>
//         )}
//       </div>
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
//       <div className="relative w-full aspect-square overflow-hidden px-4">
//         <img
//           src={AVATAR_POOL[index % AVATAR_POOL.length]}
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
//       <div className="p-4">
//         <button
//           onClick={() => onCall(player, index)}
//           className="w-full py-3 rounded-xl text-xs font-black tracking-[0.2em] uppercase bg-green-700 hover:bg-green-800 transition-all duration-300 text-white flex items-center justify-center gap-2 cursor-pointer"
//         >
//           <span className="text-base">🎥</span> Video Call
//         </button>
//         <Button className="w-full mt-2" variant="game">
//           Element Payler
//         </Button>
//       </div>
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function GrandFinale() {
//   const [selected, setSelected] = useState<string | null>(null);
//   const [confirmed, setConfirmed] = useState(false);
//   const [activeCall, setActiveCall] = useState<{
//     player: Player;
//     index: number;
//   } | null>(null);
//   const [acceptedUserId, setAcceptedUserId] = useState<string | null>(null);
//   const [rejectedUserId, setRejectedUserId] = useState<string | null>(null);

//   const router = useRouter();
//   const currentUser = useSelector((state: any) => state.user.user);
//   const participants = useSelector((state: any) => state.participants.players);
//   const activePlayers = participants.filter((p: Player) => !p.isEliminated);

//   const { isConnected, sendEvent } = useSocket({
//     GAME_EVENT: (payload: any) => {
//       if (payload?.type === "CALL_ACCEPTED")
//         setAcceptedUserId(payload?.payload?.userId);
//       if (payload?.type === "CALL_REJECTED")
//         setRejectedUserId(payload?.payload?.userId);
//     },
//   });

//   const callAccepted = !!activeCall && acceptedUserId === activeCall.player.id;
//   const callRejected =
//     !!activeCall && rejectedUserId === activeCall.player.id && !callAccepted;

//   const handleCloseCall = useCallback(() => {
//     setActiveCall(null);
//     setAcceptedUserId(null);
//     setRejectedUserId(null);
//   }, []);

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
//           <p className="text-red-500 text-xs font-black tracking-[0.4em] uppercase animate-pulse">
//             Eliminate Down to 2
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
//                   className={`grid gap-4 ${activePlayers.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : activePlayers.length === 2 ? "grid-cols-2" : activePlayers.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}
//                 >
//                   {activePlayers.map((player: Player, index: number) => (
//                     <PlayerCard
//                       key={player.id}
//                       player={player}
//                       index={index}
//                       onCall={(p, i) => setActiveCall({ player: p, index: i })}
//                     />
//                   ))}
//                 </div>
//                 {selected && (
//                   <div className="flex gap-3 rounded-xl border border-orange-900/40 bg-black/40 p-4">
//                     <button
//                       onClick={() => {
//                         setConfirmed(true);
//                         router.push("/round-two/round-two-five");
//                       }}
//                       className={`flex-1 py-3 px-6 text-xs font-black tracking-[0.25em] uppercase rounded-lg transition-all duration-300 ${confirmed ? "bg-green-600 text-white cursor-default" : "bg-gradient-to-r from-red-700 to-red-600 text-white hover:from-red-600 hover:to-red-500"}`}
//                     >
//                       {confirmed ? "✓ Vote Submitted!" : "Confirm Vote"}
//                     </button>
//                   </div>
//                 )}
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
//     </div>
//   );
// }

// "use client";

// import ParticipantPanel from "@/components/roundOne/Participantpanel";
// import { useSocket } from "@/hooks/useSocket";
// import { useRouter } from "next/navigation";
// import { useState, useEffect, useRef, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

// // ─── ZegoCloud Credentials ────────────────────────────────────────────────────
// const ZEGO_APP_ID = 1697884864;
// const ZEGO_SERVER_SECRET = "9ad294853be97ac5458a620f1b2c85a1";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface Player {
//   id: string;
//   name?: string;
//   socketId: string;
//   isEliminated: boolean;
//   isReady: boolean;
//   isConnected: boolean;
//   hasNetworkIssue: boolean;
//   hasSubmitted: boolean;
//   points: number;
// }

// type CallStatus =
//   | "calling"
//   | "accepted"
//   | "connected"
//   | "rejected"
//   | "cancelled"
//   | "ended";

// const AVATAR_POOL = [
//   "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=900&fit=crop&crop=face",
//   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=900&fit=crop&crop=face",
//   "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=900&fit=crop&crop=face",
//   "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=900&fit=crop&crop=face",
// ];
// const BG_COLORS = ["#1a6abf", "#2a2a2a", "#6b1a1a", "#1a5c2a"];
// const GAME_ID = "internet-bachelor-123";
// const ELIMINATE_POINTS = 100;

// // ─── ZegoCloud Room (host side) ───────────────────────────────────────────────
// function ZegoRoom({
//   roomId,
//   userId,
//   userName,
//   onLeave,
// }: {
//   roomId: string;
//   userId: string;
//   userName: string;
//   onLeave: () => void;
// }) {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//       ZEGO_APP_ID,
//       ZEGO_SERVER_SECRET,
//       roomId,
//       userId,
//       userName,
//     );

//     const zp = ZegoUIKitPrebuilt.create(kitToken);

//     zp.joinRoom({
//       container: containerRef.current,
//       scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
//       showPreJoinView: false,
//       showLeavingView: false,
//       turnOnMicrophoneWhenJoining: true,
//       turnOnCameraWhenJoining: true,
//       showMyCameraToggleButton: true,
//       showMyMicrophoneToggleButton: true,
//       showAudioVideoSettingsButton: false,
//       showScreenSharingButton: false,
//       showTextChat: false,
//       showUserList: false,
//       maxUsers: 2,
//       layout: "Auto",
//       onLeaveRoom: onLeave,
//       onUserLeave: onLeave,
//     });

//     return () => {
//       try {
//         zp.destroy();
//       } catch (_) {}
//     };
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       style={{ width: "100%", height: "100%", minHeight: 520 }}
//     />
//   );
// }

// // ─── Video Call Modal ─────────────────────────────────────────────────────────
// function VideoCallModal({
//   player,
//   index,
//   onClose,
//   sendEvent,
//   callAccepted,
//   callRejected,
//   hostUserId,
//   hostUserName,
// }: {
//   player: Player;
//   index: number;
//   onClose: () => void;
//   sendEvent: (event: string, payload: unknown) => void;
//   callAccepted: boolean;
//   callRejected: boolean;
//   hostUserId: string;
//   hostUserName: string;
// }) {
//   const [status, setStatus] = useState<CallStatus>("calling");
//   const [showBanner, setShowBanner] = useState(false);
//   const statusRef = useRef<CallStatus>("calling");

//   const set = (s: CallStatus) => {
//     statusRef.current = s;
//     setStatus(s);
//   };

//   const callRoomId = `${player.id}${GAME_ID}`;
//   const displayName = player.name ?? `Player ${index + 1}`;
//   const avatar = AVATAR_POOL[index % AVATAR_POOL.length];
//   const bgColor = BG_COLORS[index % BG_COLORS.length];

//   useEffect(() => {
//     sendEvent("GAME_EVENT", {
//       gameId: GAME_ID,
//       type: "CALL_PLAYER",
//       payload: { userId: player.id },
//     });
//   }, []);

//   useEffect(() => {
//     if (!callAccepted) return;
//     if (statusRef.current !== "calling" && statusRef.current !== "accepted")
//       return;
//     set("accepted");
//     setShowBanner(true);
//     const t = setTimeout(() => {
//       if (statusRef.current === "accepted") {
//         setShowBanner(false);
//         set("connected");
//       }
//     }, 2200);
//     return () => clearTimeout(t);
//   }, [callAccepted]);

//   useEffect(() => {
//     if (!callRejected) return;
//     if (statusRef.current !== "calling") return;
//     sendEvent("GAME_EVENT", {
//       gameId: GAME_ID,
//       type: "END_CALL",
//       payload: { userId: player.id, reason: "rejected" },
//     });
//     set("rejected");
//     const t = setTimeout(onClose, 2500);
//     return () => clearTimeout(t);
//   }, [callRejected]);

//   const handleCancel = () => {
//     if (statusRef.current !== "calling") return;
//     sendEvent("GAME_EVENT", {
//       gameId: GAME_ID,
//       type: "END_CALL",
//       payload: { userId: player.id, reason: "cancelled" },
//     });
//     set("cancelled");
//     setTimeout(onClose, 1400);
//   };

//   const handleZegoLeave = useCallback(() => {
//     sendEvent("GAME_EVENT", {
//       gameId: GAME_ID,
//       type: "END_CALL",
//       payload: { userId: player.id, reason: "completed" },
//     });
//     set("ended");
//     setTimeout(onClose, 800);
//   }, [player.id]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
//       <div
//         className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(0,0,0,0.95)] bg-neutral-950 flex flex-col"
//         style={{ minHeight: 520 }}
//       >
//         {status === "calling" && (
//           <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5">
//             <div
//               className="absolute inset-0 opacity-20"
//               style={{
//                 background: `radial-gradient(ellipse at 50% 40%, ${bgColor}cc, transparent 65%)`,
//               }}
//             />
//             <div className="relative z-10 flex items-center justify-center">
//               {[140, 185, 230].map((s, i) => (
//                 <span
//                   key={s}
//                   className="absolute rounded-full border border-white/10 animate-ping"
//                   style={{
//                     width: s,
//                     height: s,
//                     animationDuration: `${1.4 + i * 0.6}s`,
//                     animationDelay: `${i * 0.18}s`,
//                   }}
//                 />
//               ))}
//               <img
//                 src={avatar}
//                 alt="Calling"
//                 className="w-28 h-28 rounded-full object-cover object-top border-2 border-white/20 relative z-10 shadow-2xl"
//                 style={{ backgroundColor: bgColor }}
//               />
//             </div>
//             <div className="z-10 text-center space-y-1.5">
//               <p className="text-white/35 text-[10px] tracking-[0.45em] uppercase font-mono">
//                 Ringing…
//               </p>
//               <p className="text-white font-black text-xl tracking-widest uppercase">
//                 {displayName}
//               </p>
//               <p className="text-white/25 font-mono text-[10px] break-all max-w-[260px] mx-auto">
//                 {player.id}
//               </p>
//               <div className="flex items-center justify-center gap-1.5 pt-1">
//                 {[0, 180, 360].map((d) => (
//                   <span
//                     key={d}
//                     className="w-1.5 h-1.5 bg-white/35 rounded-full animate-bounce"
//                     style={{ animationDelay: `${d}ms` }}
//                   />
//                 ))}
//               </div>
//             </div>
//             <button
//               onClick={handleCancel}
//               className="z-10 w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 active:scale-90 transition-all flex items-center justify-center text-2xl shadow-[0_0_40px_rgba(220,38,38,0.5)] cursor-pointer select-none"
//             >
//               📵
//             </button>
//             <p className="z-10 -mt-3 text-white/25 text-[10px] tracking-widest uppercase font-mono">
//               Cancel
//             </p>
//           </div>
//         )}

//         {status === "cancelled" && (
//           <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-black/95">
//             <div className="text-6xl">🚫</div>
//             <p className="text-white font-black text-xl tracking-widest uppercase">
//               Call Cancelled
//             </p>
//             <p className="text-white/40 text-xs font-mono">
//               You hung up before they answered
//             </p>
//           </div>
//         )}

//         {status === "rejected" && (
//           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-black/90 backdrop-blur-sm">
//             <div className="relative flex items-center justify-center">
//               {[140, 185].map((s, i) => (
//                 <span
//                   key={s}
//                   className="absolute rounded-full border border-red-500/20 animate-ping"
//                   style={{
//                     width: s,
//                     height: s,
//                     animationDuration: `${1.2 + i * 0.6}s`,
//                   }}
//                 />
//               ))}
//               <img
//                 src={avatar}
//                 alt={displayName}
//                 className="w-24 h-24 rounded-full object-cover object-top border-4 border-red-500/40 relative z-10 opacity-40 grayscale"
//                 style={{ backgroundColor: bgColor }}
//               />
//               <span className="absolute -bottom-1 -right-1 z-20 w-8 h-8 rounded-full bg-red-600 border-2 border-black flex items-center justify-center text-sm">
//                 ✕
//               </span>
//             </div>
//             <div className="text-center space-y-1">
//               <p className="text-red-400 font-black text-sm tracking-[0.4em] uppercase animate-pulse">
//                 Call Declined
//               </p>
//               <p className="text-white font-black text-lg tracking-widest uppercase">
//                 {displayName}
//               </p>
//               <p className="text-white/35 text-sm font-mono">
//                 is not available right now
//               </p>
//             </div>
//             <div className="flex items-center gap-1.5">
//               {[0, 180, 360].map((d) => (
//                 <span
//                   key={d}
//                   className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce"
//                   style={{ animationDelay: `${d}ms` }}
//                 />
//               ))}
//               <span className="text-white/25 text-[10px] font-mono ml-1 tracking-widest">
//                 closing…
//               </span>
//             </div>
//           </div>
//         )}

//         {status === "accepted" && showBanner && (
//           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-black/55 backdrop-blur-sm">
//             <div className="relative flex items-center justify-center">
//               {[140, 185].map((s, i) => (
//                 <span
//                   key={s}
//                   className="absolute rounded-full border border-green-400/30 animate-ping"
//                   style={{
//                     width: s,
//                     height: s,
//                     animationDuration: `${1 + i * 0.5}s`,
//                   }}
//                 />
//               ))}
//               <img
//                 src={avatar}
//                 alt={displayName}
//                 className="w-28 h-28 rounded-full object-cover object-top border-4 border-green-400/60 relative z-10 shadow-[0_0_50px_rgba(74,222,128,0.45)]"
//                 style={{ backgroundColor: bgColor }}
//               />
//               <span className="absolute -bottom-1 -right-1 z-20 w-9 h-9 rounded-full bg-green-500 border-2 border-black flex items-center justify-center shadow-lg">
//                 ✓
//               </span>
//             </div>
//             <div className="text-center space-y-1">
//               <p className="text-green-400 font-black text-sm tracking-[0.4em] uppercase animate-pulse">
//                 Call Accepted
//               </p>
//               <p className="text-white font-black text-lg tracking-widest uppercase">
//                 {displayName}
//               </p>
//               <p className="text-white/35 font-mono text-xs">
//                 Connecting video…
//               </p>
//             </div>
//             <div className="w-56 h-1 bg-white/10 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-gradient-to-r from-green-500 to-green-300 rounded-full"
//                 style={{ animation: "grow 2.2s ease-out forwards" }}
//               />
//             </div>
//           </div>
//         )}

//         {status === "connected" && (
//           <div className="w-full h-full" style={{ minHeight: 520 }}>
//             <ZegoRoom
//               roomId={callRoomId}
//               userId={hostUserId}
//               userName={hostUserName}
//               onLeave={handleZegoLeave}
//             />
//           </div>
//         )}

//         {status === "ended" && (
//           <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-black/95">
//             <div className="text-6xl">📵</div>
//             <p className="text-white font-black text-xl tracking-widest uppercase">
//               Call Ended
//             </p>
//           </div>
//         )}

//         <style>{`@keyframes grow { from{width:0%} to{width:100%} }`}</style>
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
// }: {
//   player: Player;
//   index: number;
//   onCall: (p: Player, i: number) => void;
//   onEliminate: (p: Player) => void;
// }) {
//   const [eliminating, setEliminating] = useState(false);
//   const [eliminated, setEliminated] = useState(false);

//   const name = player.name ?? `Player ${index + 1}`;

//   const handleEliminate = () => {
//     if (eliminating || eliminated) return;
//     setEliminating(true);
//     onEliminate(player);
//     // Optimistic UI — server will confirm via PLAYERS_UPDATE
//     setTimeout(() => {
//       setEliminating(false);
//       setEliminated(true);
//     }, 1200);
//   };

//   return (
//     <div
//       className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-500 ${
//         eliminated
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
//           src={AVATAR_POOL[index % AVATAR_POOL.length]}
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
//         {/* Video Call */}
//         <button
//           onClick={() => onCall(player, index)}
//           disabled={eliminated}
//           className="w-full py-3 rounded-xl text-xs font-black tracking-[0.2em] uppercase bg-green-700 hover:bg-green-800 transition-all duration-300 text-white flex items-center justify-center gap-2 cursor-pointer"
//         >
//           <span>🎥</span> Video Call
//         </button>

//         {/* Element Player → ELIMINATE */}
//         <Button
//           variant="game"
//           onClick={handleEliminate}
//           disabled={eliminating || eliminated}
//           className="w-full flex items-center justify-center gap-2"
//         >
//           {eliminated ? (
//             <>
//               <span>💀</span> Eliminated
//             </>
//           ) : eliminating ? (
//             <>
//               <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />{" "}
//               Eliminating…
//             </>
//           ) : (
//             <>
//               <span>⚡</span> Element Player
//             </>
//           )}
//         </Button>
//       </div>
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function GrandFinale() {
//   const [selected, setSelected] = useState<string | null>(null);
//   const [confirmed, setConfirmed] = useState(false);
//   const [activeCall, setActiveCall] = useState<{
//     player: Player;
//     index: number;
//   } | null>(null);
//   const [acceptedUserId, setAcceptedUserId] = useState<string | null>(null);
//   const [rejectedUserId, setRejectedUserId] = useState<string | null>(null);
//   const [gameOver, setGameOver] = useState<{ winner: Player } | null>(null);

//   const router = useRouter();
//   const currentUser = useSelector((state: any) => state.user.user);
//   const participants = useSelector((state: any) => state.participants.players);
//   const activePlayers = participants.filter((p: Player) => !p.isEliminated);

//   // const { isConnected, sendEvent } = useSocket({
//   //   GAME_EVENT: (payload: any) => {
//   //     if (payload?.type === "CALL_ACCEPTED")
//   //       setAcceptedUserId(payload?.payload?.userId);
//   //     if (payload?.type === "CALL_REJECTED")
//   //       setRejectedUserId(payload?.payload?.userId);
//   //     // ── GAME_ENDED → show GameOverScreen with winner data ──
//   //     if (payload?.type === "GAME_ENDED" && payload?.payload?.winner) {
//   //       setGameOver({ winner: payload.payload.winner });
//   //     }
//   //   },
//   // });

//   const { isConnected, sendEvent } = useSocket({
//     GAME_EVENT: (payload: any) => {
//       if (payload?.type === "CALL_ACCEPTED")
//         setAcceptedUserId(payload?.payload?.userId);
//       if (payload?.type === "CALL_REJECTED")
//         setRejectedUserId(payload?.payload?.userId);
//       if (payload?.type === "GAME_ENDED" && payload?.payload?.winner) {
//         setGameOver({ winner: payload.payload.winner });
//       }

//       // ✅ ADD THIS: players navigate when host triggers it
//       if (payload?.type === "NAVIGATE" && payload?.payload?.route) {
//         router.push(payload.payload.route);
//       }
//     },
//   });

//   const callAccepted = !!activeCall && acceptedUserId === activeCall.player.id;
//   const callRejected =
//     !!activeCall && rejectedUserId === activeCall.player.id && !callAccepted;

//   const handleCloseCall = useCallback(() => {
//     setActiveCall(null);
//     setAcceptedUserId(null);
//     setRejectedUserId(null);
//   }, []);

//   // ── ELIMINATE handler ─────────────────────────────────────────────────────
//   // const handleEliminate = useCallback(
//   //   (player: Player) => {
//   //     console.log("⚡ Eliminating player:", player.id);
//   //     sendEvent("GAME_EVENT", {
//   //       gameId: GAME_ID,
//   //       type: "ELIMINATE",
//   //       payload: {
//   //         playerIds: [player.id],
//   //         points: ELIMINATE_POINTS,
//   //       },
//   //     });
//   //   },
//   //   [sendEvent],
//   // );

//   // const handleEliminate = useCallback(
//   //   (player: Player) => {
//   //     console.log("⚡ Eliminating player:", player.id);

//   //     sendEvent(
//   //       "GAME_EVENT",
//   //       {
//   //         gameId: GAME_ID,
//   //         type: "ELIMINATE",
//   //         payload: {
//   //           playerIds: [player.id],
//   //           points: ELIMINATE_POINTS,
//   //         },
//   //       },
//   //       (response: any) => {
//   //         console.log("✅ ELIMINATE ACK:", response);

//   //         if (response?.success) {
//   //           router.push("/round-two/round-two-six");
//   //           router.refresh();
//   //         } else {
//   //           console.warn("❌ Eliminate failed:", response);
//   //         }
//   //       },
//   //     );
//   //   },
//   //   [sendEvent, router],
//   // );

//   const handleEliminate = useCallback(
//     (player: Player) => {
//       sendEvent(
//         "GAME_EVENT",
//         {
//           gameId: GAME_ID,
//           type: "ELIMINATE",
//           payload: {
//             playerIds: [player.id],
//             points: ELIMINATE_POINTS,
//           },
//         },
//         (response: any) => {
//           if (response?.success) {
//             // Tell ALL players (including host) to navigate
//             sendEvent("GAME_EVENT", {
//               gameId: GAME_ID,
//               type: "NAVIGATE",
//               payload: { route: "/round-two/round-two-six" },
//             });
//             router.push("/round-two/round-two-six");
//             router.refresh();
//           }
//         },
//       );
//     },
//     [sendEvent, router],
//   );

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
//           <p className="text-red-500 text-xs font-black tracking-[0.4em] uppercase animate-pulse">
//             Eliminate Down to 2
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
//                     />
//                   ))}
//                 </div>
//                 {selected && (
//                   <div className="flex gap-3 rounded-xl border border-orange-900/40 bg-black/40 p-4">
//                     <button
//                       onClick={() => {
//                         setConfirmed(true);
//                         router.push("/round-two/round-two-five");
//                       }}
//                       className={`flex-1 py-3 px-6 text-xs font-black tracking-[0.25em] uppercase rounded-lg transition-all duration-300 ${
//                         confirmed
//                           ? "bg-green-600 text-white cursor-default"
//                           : "bg-gradient-to-r from-red-700 to-red-600 text-white hover:from-red-600 hover:to-red-500"
//                       }`}
//                     >
//                       {confirmed ? "✓ Vote Submitted!" : "Confirm Vote"}
//                     </button>
//                   </div>
//                 )}
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
//     </div>
//   );
// }

"use client";

import ParticipantPanel from "@/components/roundOne/Participantpanel";
import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import Button from "@/components/share/ButtonPrimary";
import { RootState } from "@/redux/store";
import { GameWinner, setGameOver } from "@/redux/features/winner/Gameoverslice";

// ─── ZegoCloud Credentials ────────────────────────────────────────────────────
const ZEGO_APP_ID = 1697884864;
const ZEGO_SERVER_SECRET = "9ad294853be97ac5458a620f1b2c85a1";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Player {
  id: string;
  name?: string;
  socketId: string;
  isEliminated: boolean;
  isReady: boolean;
  isConnected: boolean;
  hasNetworkIssue: boolean;
  hasSubmitted: boolean;
  points: number;
}

type CallStatus =
  | "calling"
  | "accepted"
  | "connected"
  | "rejected"
  | "cancelled"
  | "ended";

const AVATAR_POOL = [
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=900&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=900&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=900&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=900&fit=crop&crop=face",
];
const BG_COLORS = ["#1a6abf", "#2a2a2a", "#6b1a1a", "#1a5c2a"];
const GAME_ID = "internet-bachelor-123";
const ELIMINATE_POINTS = 100;

// ─── ZegoCloud Room ───────────────────────────────────────────────────────────
function ZegoRoom({
  roomId,
  userId,
  userName,
  onLeave,
}: {
  roomId: string;
  userId: string;
  userName: string;
  onLeave: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      ZEGO_APP_ID,
      ZEGO_SERVER_SECRET,
      roomId,
      userId,
      userName,
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: containerRef.current,
      scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
      showPreJoinView: false,
      showLeavingView: false,
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: false,
      showScreenSharingButton: false,
      showTextChat: false,
      showUserList: false,
      maxUsers: 2,
      layout: "Auto",
      onLeaveRoom: onLeave,
      onUserLeave: onLeave,
    });

    return () => {
      try {
        zp.destroy();
      } catch (_) {}
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", minHeight: 520 }}
    />
  );
}

// ─── Video Call Modal ─────────────────────────────────────────────────────────
function VideoCallModal({
  player,
  index,
  onClose,
  sendEvent,
  callAccepted,
  callRejected,
  hostUserId,
  hostUserName,
}: {
  player: Player;
  index: number;
  onClose: () => void;
  sendEvent: (event: string, payload: unknown) => void;
  callAccepted: boolean;
  callRejected: boolean;
  hostUserId: string;
  hostUserName: string;
}) {
  const [status, setStatus] = useState<CallStatus>("calling");
  const [showBanner, setShowBanner] = useState(false);
  const statusRef = useRef<CallStatus>("calling");

  const set = (s: CallStatus) => {
    statusRef.current = s;
    setStatus(s);
  };

  const callRoomId = `${player.id}${GAME_ID}`;
  const displayName = player.name ?? `Player ${index + 1}`;
  const avatar = AVATAR_POOL[index % AVATAR_POOL.length];
  const bgColor = BG_COLORS[index % BG_COLORS.length];

  useEffect(() => {
    sendEvent("GAME_EVENT", {
      gameId: GAME_ID,
      type: "CALL_PLAYER",
      payload: { userId: player.id },
    });
  }, []);

  useEffect(() => {
    if (!callAccepted) return;
    if (statusRef.current !== "calling" && statusRef.current !== "accepted")
      return;
    set("accepted");
    setShowBanner(true);
    const t = setTimeout(() => {
      if (statusRef.current === "accepted") {
        setShowBanner(false);
        set("connected");
      }
    }, 2200);
    return () => clearTimeout(t);
  }, [callAccepted]);

  useEffect(() => {
    if (!callRejected) return;
    if (statusRef.current !== "calling") return;
    sendEvent("GAME_EVENT", {
      gameId: GAME_ID,
      type: "END_CALL",
      payload: { userId: player.id, reason: "rejected" },
    });
    set("rejected");
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [callRejected]);

  const handleCancel = () => {
    if (statusRef.current !== "calling") return;
    sendEvent("GAME_EVENT", {
      gameId: GAME_ID,
      type: "END_CALL",
      payload: { userId: player.id, reason: "cancelled" },
    });
    set("cancelled");
    setTimeout(onClose, 1400);
  };

  const handleZegoLeave = useCallback(() => {
    sendEvent("GAME_EVENT", {
      gameId: GAME_ID,
      type: "END_CALL",
      payload: { userId: player.id, reason: "completed" },
    });
    set("ended");
    setTimeout(onClose, 800);
  }, [player.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div
        className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(0,0,0,0.95)] bg-neutral-950 flex flex-col"
        style={{ minHeight: 520 }}
      >
        {status === "calling" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(ellipse at 50% 40%, ${bgColor}cc, transparent 65%)`,
              }}
            />
            <div className="relative z-10 flex items-center justify-center">
              {[140, 185, 230].map((s, i) => (
                <span
                  key={s}
                  className="absolute rounded-full border border-white/10 animate-ping"
                  style={{
                    width: s,
                    height: s,
                    animationDuration: `${1.4 + i * 0.6}s`,
                    animationDelay: `${i * 0.18}s`,
                  }}
                />
              ))}
              <img
                src={avatar}
                alt="Calling"
                className="w-28 h-28 rounded-full object-cover object-top border-2 border-white/20 relative z-10 shadow-2xl"
                style={{ backgroundColor: bgColor }}
              />
            </div>
            <div className="z-10 text-center space-y-1.5">
              <p className="text-white/35 text-[10px] tracking-[0.45em] uppercase font-mono">
                Ringing…
              </p>
              <p className="text-white font-black text-xl tracking-widest uppercase">
                {displayName}
              </p>
              <p className="text-white/25 font-mono text-[10px] break-all max-w-[260px] mx-auto">
                {player.id}
              </p>
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {[0, 180, 360].map((d) => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 bg-white/35 rounded-full animate-bounce"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="z-10 w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 active:scale-90 transition-all flex items-center justify-center text-2xl shadow-[0_0_40px_rgba(220,38,38,0.5)] cursor-pointer select-none"
            >
              📵
            </button>
            <p className="z-10 -mt-3 text-white/25 text-[10px] tracking-widest uppercase font-mono">
              Cancel
            </p>
          </div>
        )}

        {status === "cancelled" && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-black/95">
            <div className="text-6xl">🚫</div>
            <p className="text-white font-black text-xl tracking-widest uppercase">
              Call Cancelled
            </p>
            <p className="text-white/40 text-xs font-mono">
              You hung up before they answered
            </p>
          </div>
        )}

        {status === "rejected" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-black/90 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
              {[140, 185].map((s, i) => (
                <span
                  key={s}
                  className="absolute rounded-full border border-red-500/20 animate-ping"
                  style={{
                    width: s,
                    height: s,
                    animationDuration: `${1.2 + i * 0.6}s`,
                  }}
                />
              ))}
              <img
                src={avatar}
                alt={displayName}
                className="w-24 h-24 rounded-full object-cover object-top border-4 border-red-500/40 relative z-10 opacity-40 grayscale"
                style={{ backgroundColor: bgColor }}
              />
              <span className="absolute -bottom-1 -right-1 z-20 w-8 h-8 rounded-full bg-red-600 border-2 border-black flex items-center justify-center text-sm">
                ✕
              </span>
            </div>
            <div className="text-center space-y-1">
              <p className="text-red-400 font-black text-sm tracking-[0.4em] uppercase animate-pulse">
                Call Declined
              </p>
              <p className="text-white font-black text-lg tracking-widest uppercase">
                {displayName}
              </p>
              <p className="text-white/35 text-sm font-mono">
                is not available right now
              </p>
            </div>
          </div>
        )}

        {status === "accepted" && showBanner && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-black/55 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
              {[140, 185].map((s, i) => (
                <span
                  key={s}
                  className="absolute rounded-full border border-green-400/30 animate-ping"
                  style={{
                    width: s,
                    height: s,
                    animationDuration: `${1 + i * 0.5}s`,
                  }}
                />
              ))}
              <img
                src={avatar}
                alt={displayName}
                className="w-28 h-28 rounded-full object-cover object-top border-4 border-green-400/60 relative z-10 shadow-[0_0_50px_rgba(74,222,128,0.45)]"
                style={{ backgroundColor: bgColor }}
              />
              <span className="absolute -bottom-1 -right-1 z-20 w-9 h-9 rounded-full bg-green-500 border-2 border-black flex items-center justify-center shadow-lg">
                ✓
              </span>
            </div>
            <div className="text-center space-y-1">
              <p className="text-green-400 font-black text-sm tracking-[0.4em] uppercase animate-pulse">
                Call Accepted
              </p>
              <p className="text-white font-black text-lg tracking-widest uppercase">
                {displayName}
              </p>
              <p className="text-white/35 font-mono text-xs">
                Connecting video…
              </p>
            </div>
            <div className="w-56 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-300 rounded-full"
                style={{ animation: "grow 2.2s ease-out forwards" }}
              />
            </div>
          </div>
        )}

        {status === "connected" && (
          <div className="w-full h-full" style={{ minHeight: 520 }}>
            <ZegoRoom
              roomId={callRoomId}
              userId={hostUserId}
              userName={hostUserName}
              onLeave={handleZegoLeave}
            />
          </div>
        )}

        {status === "ended" && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-black/95">
            <div className="text-6xl">📵</div>
            <p className="text-white font-black text-xl tracking-widest uppercase">
              Call Ended
            </p>
          </div>
        )}

        <style>{`@keyframes grow { from{width:0%} to{width:100%} }`}</style>
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
}: {
  player: Player;
  index: number;
  onCall: (p: Player, i: number) => void;
  onEliminate: (p: Player) => void;
  isEliminating: boolean;
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
          src={AVATAR_POOL[index % AVATAR_POOL.length]}
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
          disabled={isEliminated || isEliminating}
          className="w-full py-3 rounded-xl text-xs font-black tracking-[0.2em] uppercase bg-green-700 hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 text-white flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>🎥</span> Video Call
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

  // Track which player is currently being eliminated (prevents double clicks)
  const [eliminatingId, setEliminatingId] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useDispatch();

  const currentUser = useSelector((state: any) => state.user.user);
  const participants = useSelector((state: any) => state.participants.players);
  const isGameOver = useSelector((state: any) => state.gameOver.isGameOver);

  const activePlayers = participants.filter((p: Player) => !p.isEliminated);

  // ── Navigate when Redux confirms gameOver is set ──────────────────────────
  useEffect(() => {
    if (isGameOver) {
      router.push("/round-two/round-two-six");
    }
  }, [isGameOver]);

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

      // ── GAME_ENDED received via socket broadcast ──
      // (fallback: if server also broadcasts to host)
      if (payload?.type === "GAME_ENDED" && payload?.payload?.winner) {
        const winner: GameWinner = payload.payload.winner;
        dispatch(setGameOver(winner)); // → triggers useEffect → router.push
      }
    },
  });

  const callAccepted = !!activeCall && acceptedUserId === activeCall.player.id;
  const callRejected =
    !!activeCall && rejectedUserId === activeCall.player.id && !callAccepted;

  const handleCloseCall = useCallback(() => {
    setActiveCall(null);
    setAcceptedUserId(null);
    setRejectedUserId(null);
  }, []);

  // ── Eliminate handler ─────────────────────────────────────────────────────
  const handleEliminate = useCallback(
    (player: Player) => {
      if (eliminatingId) return; // already eliminating someone
      console.log("⚡ Eliminating player:", player.id);
      setEliminatingId(player.id);

      sendEvent(
        "GAME_EVENT",
        {
          gameId: GAME_ID,
          type: "ELIMINATE",
          payload: {
            playerIds: [player.id],
            points: ELIMINATE_POINTS,
          },
        },
        (response: any) => {
          console.log("✅ ELIMINATE ACK:", response);

          if (response?.success) {
            // ── Winner came back in the ACK ──
            if (response?.winner) {
              const winner: GameWinner = response.winner;
              dispatch(setGameOver(winner)); // → triggers useEffect → router.push
            } else {
              // ── No winner yet, more players remain ──
              // Server will send GAME_ENDED when the game is truly over.
              // Just clear the eliminating state so host can eliminate again.
              setEliminatingId(null);
            }
          } else {
            console.warn("❌ Eliminate failed:", response);
            setEliminatingId(null); // reset so host can retry
          }
        },
      );
    },
    [sendEvent, dispatch, eliminatingId],
  );

  return (
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
          <p className="text-red-500 text-xs font-black tracking-[0.4em] uppercase animate-pulse">
            Eliminate Down to 2
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
                    onCall={(p, i) => setActiveCall({ player: p, index: i })}
                    onEliminate={handleEliminate}
                    isEliminating={eliminatingId === player.id}
                  />
                ))}
              </div>
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
    </div>
  );
}
