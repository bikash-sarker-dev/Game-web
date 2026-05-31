/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import Button from "@/components/share/ButtonPrimary";
// import { useState, useEffect, useRef, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Check,
//   Sparkles,
//   Crown,
//   Phone,
//   Image as ImageIcon,
//   Wifi,
//   WifiOff,
//   MessageSquare,
//   Camera,
//   Video,
// } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { useSocket } from "@/hooks/useSocket";
// import VideoCallRound from "./Videocallround";
// import { GameWinner, setGameOver } from "@/redux/features/winner/Gameoverslice";
// import { useFileUploadingMutation } from "@/redux/api/getMe/getMeApi";
// import SnapEditor from "@/components/snapEdit/Snapedit";

// /* ─── Types ──────────────────────────────────────────────────────────────── */
// interface ServerPlayer {
//   id: string;
//   socketId?: string;
//   name?: string;
//   username?: string;
//   avatar?: string;
//   ready?: boolean;
//   isReady?: boolean;
//   isEliminated?: boolean;
//   isConnected?: boolean;
//   isElement?: boolean;
// }

// type LocalPhase =
//   | "LOBBY"
//   | "READY_WAITING"
//   | "QUESTION"
//   | "ANSWER_WAITING"
//   | "IMAGE_UPLOAD"
//   | "IMAGE_WAITING"
//   | "VIDEO"
//   | "ELEMENT"
//   | "ELIMINATED";

// /* ─── Round Title Banner ─────────────────────────────────────────────────── */
// function RoundTitle({
//   roundNumber,
//   roundName,
//   icon,
//   accentColor = "amber",
// }: {
//   roundNumber: string;
//   roundName: string;
//   icon: React.ReactNode;
//   accentColor?: "amber" | "rose" | "emerald" | "sky" | "violet";
// }) {
//   const colors: Record<
//     string,
//     { label: string; name: string; border: string; glow: string; icon: string }
//   > = {
//     amber: {
//       label: "text-amber-500/80",
//       name: "text-amber-300",
//       border: "border-amber-500/20",
//       glow: "from-amber-500/10",
//       icon: "text-amber-400",
//     },
//     sky: {
//       label: "text-sky-500/80",
//       name: "text-sky-300",
//       border: "border-sky-500/20",
//       glow: "from-sky-500/10",
//       icon: "text-sky-400",
//     },
//     violet: {
//       label: "text-violet-400/80",
//       name: "text-violet-200",
//       border: "border-violet-500/20",
//       glow: "from-violet-500/10",
//       icon: "text-violet-400",
//     },
//     rose: {
//       label: "text-rose-500/80",
//       name: "text-rose-300",
//       border: "border-rose-500/20",
//       glow: "from-rose-500/10",
//       icon: "text-rose-400",
//     },
//     emerald: {
//       label: "text-emerald-500/80",
//       name: "text-emerald-300",
//       border: "border-emerald-500/20",
//       glow: "from-emerald-500/10",
//       icon: "text-emerald-400",
//     },
//   };

//   const c = colors[accentColor];

//   return (
//     <div
//       className={`w-full flex items-center gap-4 pb-3  mb-2 border-b ${c.border}`}
//     >
//       <div
//         className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${c.glow} to-transparent border ${c.border} ${c.icon} shrink-0`}
//       >
//         {icon}
//       </div>
//       <div className="flex flex-col leading-tight">
//         <span
//           className={`text-[13px]  font-mono uppercase tracking-[5px] ${c.label}`}
//         >
//           {roundNumber}
//         </span>
//         <span
//           className={`text-xl sm:text-2xl font-black uppercase tracking-widest ${c.name}`}
//         >
//           {roundName}
//         </span>
//       </div>
//     </div>
//   );
// }

// /* ─── Animated dot row ───────────────────────────────────────────────────── */
// function PulseDots({ count = 3 }: { count?: number }) {
//   return (
//     <div className="flex items-center gap-1.5">
//       {Array.from({ length: count }).map((_, i) => (
//         <span
//           key={i}
//           className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"
//           style={{ animationDelay: `${i * 150}ms` }}
//         />
//       ))}
//     </div>
//   );
// }

// /* ─── Waiting card ───────────────────────────────────────────────────────── */
// function WaitingCard({
//   icon,
//   title,
//   subtitle,
//   accentColor = "amber",
// }: {
//   icon: React.ReactNode;
//   title: string;
//   subtitle: string;
//   accentColor?: "amber" | "rose" | "emerald" | "sky";
// }) {
//   const ring: Record<string, string> = {
//     amber: "ring-amber-500/30 text-amber-400",
//     rose: "ring-rose-500/30 text-rose-400",
//     emerald: "ring-emerald-500/30 text-emerald-400",
//     sky: "ring-sky-500/30 text-sky-400",
//   };
//   const glow: Record<string, string> = {
//     amber: "from-amber-500/10",
//     rose: "from-rose-500/10",
//     emerald: "from-emerald-500/10",
//     sky: "from-sky-500/10",
//   };
//   return (
//     <div className="flex flex-col items-center gap-6 py-4 w-full max-w-sm mx-auto">
//       <div
//         className={`relative w-20 h-20 rounded-full ring-2 ${ring[accentColor]} flex items-center justify-center bg-gradient-to-br ${glow[accentColor]} to-transparent`}
//       >
//         <span className={ring[accentColor]}>{icon}</span>
//         <span
//           className={`absolute w-2.5 h-2.5 rounded-full bg-current ${ring[accentColor].split(" ")[1]} animate-spin`}
//           style={{
//             top: "-5px",
//             left: "calc(50% - 5px)",
//             transformOrigin: "5px 45px",
//             animationDuration: "2.4s",
//           }}
//         />
//       </div>
//       <div className="text-center space-y-2">
//         <p className="text-white font-bold text-xl tracking-widest uppercase font-mono">
//           {title}
//         </p>
//         <p className="text-white/40 text-sm tracking-wide">{subtitle}</p>
//       </div>
//       <PulseDots count={5} />
//     </div>
//   );
// }

// /* ─── Element spectator screen ───────────────────────────────────────────── */
// function ElementSpectator({ username }: { username?: string }) {
//   return (
//     <div className="relative flex flex-col items-center gap-8 py-6 w-full overflow-hidden">
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-rose-500/5" />
//         <div
//           className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl animate-pulse"
//           style={{ animationDuration: "3s" }}
//         />
//       </div>
//       <div className="relative flex items-center justify-center">
//         {[0, 60, 120, 180, 240, 300].map((deg) => (
//           <span
//             key={deg}
//             className="absolute text-amber-300/60"
//             style={{
//               fontSize: "10px",
//               transform: `rotate(${deg}deg) translateY(-52px)`,
//             }}
//           >
//             ✦
//           </span>
//         ))}
//         <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/20 to-rose-500/20 ring-2 ring-amber-400/40 flex items-center justify-center">
//           <Crown className="w-12 h-12 text-amber-300" strokeWidth={1.5} />
//         </div>
//       </div>
//       <div className="text-center space-y-3 z-10">
//         <p className="text-[10px] text-amber-500/60 uppercase tracking-[6px] font-mono">
//           Tournament Status
//         </p>
//         <h2
//           className="text-4xl sm:text-5xl font-black uppercase tracking-widest leading-none"
//           style={{
//             background:
//               "linear-gradient(135deg, #fbbf24 0%, #f9a8d4 50%, #fbbf24 100%)",
//             backgroundSize: "200% 200%",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             animation: "shimmer 4s linear infinite",
//           }}
//         >
//           You Are an
//           <br />
//           Element
//         </h2>
//         <p className="text-white/50 text-sm tracking-widest uppercase">
//           One of the Seven ✦ {username ? `@${username}` : ""}
//         </p>
//       </div>
//       <div className="flex items-center gap-3 px-6 py-3 rounded-full border border-amber-500/20 bg-amber-500/5 z-10">
//         <Sparkles
//           className="w-4 h-4 text-amber-400 animate-spin"
//           style={{ animationDuration: "3s" }}
//         />
//         <span className="text-amber-300 text-sm font-medium tracking-widest uppercase font-mono">
//           Watching the tournament
//         </span>
//         <Sparkles
//           className="w-4 h-4 text-amber-400 animate-spin"
//           style={{ animationDuration: "3s", animationDirection: "reverse" }}
//         />
//       </div>
//       <div className="flex items-center gap-2 z-10">
//         {Array.from({ length: 7 }).map((_, i) => (
//           <div
//             key={i}
//             className="w-2 h-2 rounded-full"
//             style={{
//               background: `hsl(${40 + i * 10}, 90%, 60%)`,
//               animation: "ping 1.4s cubic-bezier(0,0,0.2,1) infinite",
//               animationDelay: `${i * 100}ms`,
//             }}
//           />
//         ))}
//       </div>
//       <style>{`
//         @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
//         @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }
//       `}</style>
//     </div>
//   );
// }

// /* ─── Eliminated screen ──────────────────────────────────────────────────── */
// function EliminatedScreen() {
//   const router = useRouter();
//   return (
//     <div className="flex flex-col items-center gap-6 py-8 w-full">
//       <div className="w-20 h-20 rounded-full border-2 border-rose-500/40 flex items-center justify-center bg-rose-500/10">
//         <span className="text-4xl">💔</span>
//       </div>
//       <div className="text-center space-y-2">
//         <p className="text-rose-400 font-black text-3xl uppercase tracking-widest font-mono">
//           Eliminated
//         </p>
//         <p className="text-white/30 text-sm tracking-wide">
//           Your journey ends here. Thank you for playing.
//         </p>
//       </div>
//       <button
//         onClick={() => router.push("/")}
//         className="mt-2 px-8 py-3 rounded-full border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 hover:border-rose-400/60 text-rose-300 hover:text-rose-200 text-sm font-semibold uppercase tracking-widest font-mono transition-all duration-300 active:scale-95"
//       >
//         Please Try Again
//       </button>
//     </div>
//   );
// }

// /* ─── Lobby screen ───────────────────────────────────────────────────────── */
// function LobbyScreen({
//   charIdx,
//   lobbyText,
//   onReady,
// }: {
//   charIdx: number;
//   lobbyText: string;
//   onReady: () => void;
// }) {
//   return (
//     <div className="flex flex-col items-center gap-8 w-full z-10">
//       <div className="text-center">
//         <p className="text-[10px] text-amber-500/50 uppercase tracking-[6px] font-mono mb-4">
//           Tournament Hub
//         </p>
//         <p className="text-white font-bold text-lg sm:text-2xl italic leading-relaxed min-h-[3.5rem] font-mono">
//           {lobbyText.slice(0, charIdx)}
//           {charIdx < lobbyText.length && (
//             <span className="inline-block w-0.5 h-6 bg-amber-400 align-middle animate-pulse ml-0.5" />
//           )}
//         </p>
//       </div>
//       <div className="flex flex-col items-center gap-3">
//         <p className="text-white/30 text-xs uppercase tracking-widest">
//           Waiting for the host to begin
//         </p>
//         <Button variant="game" onClick={onReady}>
//           I&apos;m Ready
//         </Button>
//       </div>
//     </div>
//   );
// }

// /* ─── Waiting screens ────────────────────────────────────────────────────── */
// function ReadyWaitingScreen() {
//   return (
//     <div className="w-full flex flex-col items-center gap-6">
//       <RoundTitle
//         roundNumber="Round 1"
//         roundName="Questions"
//         icon={<MessageSquare className="w-5 h-5" />}
//         accentColor="emerald"
//       />
//       <WaitingCard
//         icon={<Check className="w-9 h-9" />}
//         title="Ready!"
//         subtitle="Waiting for the host to send the first question…"
//         accentColor="emerald"
//       />
//     </div>
//   );
// }

// function AnswerWaitingScreen() {
//   return (
//     <div className="w-full flex flex-col items-center gap-6">
//       <RoundTitle
//         roundNumber="Round 1"
//         roundName="Questions"
//         icon={<MessageSquare className="w-5 h-5" />}
//         accentColor="amber"
//       />
//       <WaitingCard
//         icon={<ImageIcon className="w-9 h-9" />}
//         title="Answer Submitted"
//         subtitle="Preparing the image upload round…"
//         accentColor="amber"
//       />
//     </div>
//   );
// }

// function ImageWaitingScreen() {
//   return (
//     <div className="w-full flex flex-col items-center gap-6">
//       <RoundTitle
//         roundNumber="Round 2"
//         roundName="Pictures"
//         icon={<Camera className="w-5 h-5" />}
//         accentColor="sky"
//       />
//       <WaitingCard
//         icon={<Phone className="w-9 h-9" />}
//         title="Image Received"
//         subtitle="Waiting for the host to call you…"
//         accentColor="sky"
//       />
//     </div>
//   );
// }

// /* ─── Player avatar ──────────────────────────────────────────────────────── */
// function Avatar({ player, index }: { player: ServerPlayer; index: number }) {
//   const isEl = player.isElement === true;
//   const isElim = player.isEliminated;
//   return (
//     <div
//       title={player.username ?? player.name ?? `Player ${index + 1}`}
//       className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 ${
//         isEl
//           ? "bg-gradient-to-br from-amber-400 to-rose-500 border-amber-300 text-black scale-110 shadow-2xl shadow-amber-500/50"
//           : isElim
//             ? "bg-rose-950/40 border-rose-800/40 text-rose-800 opacity-40 scale-90"
//             : player.isReady || player.ready
//               ? "bg-emerald-900/40 border-emerald-500/50 text-emerald-300"
//               : "bg-amber-500/10 border-amber-500/30 text-amber-400/60"
//       }`}
//     >
//       {index + 1}
//       {isEl && (
//         <span
//           className="absolute -top-1 -right-1 text-sm leading-none animate-spin"
//           style={{ animationDuration: "6s" }}
//         >
//           ✦
//         </span>
//       )}
//       {isElim && (
//         <span className="absolute -bottom-1 -right-1 text-xs leading-none">
//           💔
//         </span>
//       )}
//     </div>
//   );
// }

// /* ════════════════════════════════════════════════════════════════════════════
//    Main Component
// ══════════════════════════════════════════════════════════════════════════════ */
// const GAME_ID = "internet-bachelor-123";
// const LOBBY_TEXT = '"CONNECTED TO LOBBY"';

// function QuesationShowAndAns() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   /* ── State ───────────────────────────────────────────────────────────── */
//   const [charIdx, setCharIdx] = useState(0);
//   const [localPhase, setLocalPhase] = useState<LocalPhase>("LOBBY");
//   const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
//   const [answer, setAnswer] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [showElementAnimation, setShowElementAnimation] = useState(false);
//   const [previousElementStatus, setPreviousElementStatus] = useState(false);
//   const [incomingHostId, setIncomingHostId] = useState<string | null>(null);
//   const [callKey, setCallKey] = useState(0);
//   const [callEndedKey, setCallEndedKey] = useState(0);

//   /* ── Redux ───────────────────────────────────────────────────────────── */
//   const currentUser = useSelector((state: any) => state.user.user);
//   const participants: ServerPlayer[] = useSelector(
//     (state: any) => state.participants?.players ?? [],
//   );

//   const currentPlayer = participants.find((p) => p.id === currentUser?.id);
//   const isElement = currentPlayer?.isElement === true;
//   const isEliminated = currentPlayer?.isEliminated === true;

//   /* ── Refs ────────────────────────────────────────────────────────────── */
//   const isEliminatedRef = useRef(false);
//   useEffect(() => {
//     isEliminatedRef.current = isEliminated;
//   }, [isEliminated]);

//   /* ── File upload mutation ────────────────────────────────────────────── */
//   const [
//     uploadFile,
//     {
//       isLoading: isImageUploading,
//       isError: isImageUploadError,
//       error: imageUploadErrorData,
//       data: imageUploadData,
//     },
//   ] = useFileUploadingMutation();

//   /* ── Helpers ─────────────────────────────────────────────────────────── */
//   const safeSetPhase = useCallback((phase: LocalPhase) => {
//     if (isEliminatedRef.current && phase !== "ELIMINATED") return;
//     setLocalPhase(phase);
//   }, []);

//   const handleGameEnded = useCallback(
//     (winner: GameWinner | null, noWinner?: boolean) => {
//       if (noWinner || !winner) {
//         router.push("/no-winner");
//         return;
//       }
//       dispatch(setGameOver(winner));
//       router.push("/round-two/round-two-six");
//     },
//     [dispatch, router],
//   );

//   const extractImageUrl = (result: any): string => {
//     if (typeof result?.data === "string" && result.data.startsWith("http")) {
//       return result.data;
//     }
//     return (
//       result?.url ?? result?.imageUrl ?? result?.data?.url ?? result?.path ?? ""
//     );
//   };

//   /* ── Image submit ────────────────────────────────────────────────────── */
//   const handleImageSubmit = useCallback(
//     async (blob: Blob) => {
//       try {
//         const formData = new FormData();
//         formData.append("file", blob, `snap-${Date.now()}.png`);

//         const result = await uploadFile(formData).unwrap();
//         const imageUrl = extractImageUrl(result);

//         if (!imageUrl) throw new Error("No URL returned from upload API");

//         sendEvent(
//           "GAME_EVENT",
//           {
//             gameId: GAME_ID,
//             type: "SUBMIT_DATA",
//             payload: { data: { imageUrl } },
//           },
//           (response: any) => {
//             if (response?.success === true) {
//               safeSetPhase("IMAGE_WAITING");
//             }
//           },
//         );
//       } catch (err) {
//         console.error("Image upload failed:", err);
//       }
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [uploadFile, safeSetPhase],
//   );

//   /* ── Socket ──────────────────────────────────────────────────────────── */
//   const { sendEvent, isConnected } = useSocket({
//     GAME_EVENT: (payload: any) => {
//       console.log("🎮 Game Event received:", payload);

//       if (payload.type === "GAME_ENDED") {
//         const { winner, noWinner } = payload.payload ?? {};
//         handleGameEnded(winner ?? null, noWinner === true);
//         return;
//       }

//       if (isEliminatedRef.current && payload.type !== "PLAYERS_UPDATE") return;

//       if (payload.type === "PLAYERS_UPDATE" && Array.isArray(payload.payload)) {
//         const newParticipants = payload.payload as ServerPlayer[];

//         const isNowElement = newParticipants.some(
//           (p) => p.id === currentUser?.id && p.isElement === true,
//         );
//         if (isNowElement && !previousElementStatus) {
//           setShowElementAnimation(true);
//           safeSetPhase("ELEMENT");
//           setTimeout(() => setShowElementAnimation(false), 4200);
//         }
//         setPreviousElementStatus(isNowElement);

//         const nowEliminated = newParticipants.some(
//           (p) => p.id === currentUser?.id && p.isEliminated === true,
//         );
//         if (nowEliminated) {
//           isEliminatedRef.current = true;
//           setLocalPhase("ELIMINATED");
//         }
//       }

//       if (payload.type === "NEW_QUESTION") {
//         setCurrentQuestion(payload.payload.question);
//         setAnswer("");
//         safeSetPhase("QUESTION");
//       }

//       if (payload.type === "ROUND_STARTED") {
//         setIncomingHostId(null);
//         setCallKey(0);
//         setCallEndedKey(0);
//         if (payload.payload.type === "IMAGE") safeSetPhase("IMAGE_UPLOAD");
//         if (payload.payload.type === "VIDEO") safeSetPhase("VIDEO");
//       }

//       if (payload.type === "INCOMING_CALL") {
//         setIncomingHostId(payload.payload.hostId);
//         setCallKey((p) => p + 1);
//         safeSetPhase("VIDEO");
//       }

//       if (payload.type === "CALL_ENDED") {
//         setIncomingHostId(null);
//         setCallEndedKey((p) => p + 1);
//       }
//     },

//     ROSE_GIVEN: (payload: any) =>
//       console.log("🌹 Rose given to:", payload.player),

//     PLAYER_ELIMINATED: (payload: any) => {
//       if (
//         payload.player?.id === currentUser?.id ||
//         payload.playerId === currentUser?.id
//       ) {
//         isEliminatedRef.current = true;
//         setLocalPhase("ELIMINATED");
//       }
//     },

//     GAME_ENDED: (payload: any) => {
//       const winner: GameWinner | null =
//         payload?.winner ?? payload?.payload?.winner ?? null;
//       const noWinner: boolean =
//         payload?.noWinner ?? payload?.payload?.noWinner ?? false;
//       handleGameEnded(winner, noWinner);
//     },
//   });

//   /* ── Effects ─────────────────────────────────────────────────────────── */
//   useEffect(() => {
//     if (localPhase !== "LOBBY") return;
//     if (charIdx >= LOBBY_TEXT.length) return;
//     const t = setTimeout(() => setCharIdx((c) => c + 1), 40);
//     return () => clearTimeout(t);
//   }, [charIdx, localPhase]);

//   useEffect(() => {
//     if (isEliminated) {
//       isEliminatedRef.current = true;
//       setLocalPhase("ELIMINATED");
//     } else if (
//       isElement &&
//       localPhase !== "ELEMENT" &&
//       localPhase !== "VIDEO"
//     ) {
//       safeSetPhase("ELEMENT");
//     }
//   }, [isElement, isEliminated, localPhase, safeSetPhase]);

//   /* ── Action handlers ─────────────────────────────────────────────────── */
//   const handleReady = () => {
//     sendEvent(
//       "GAME_EVENT",
//       { gameId: GAME_ID, type: "PLAYER_READY", payload: {} },
//       (response: any) => {
//         if (response?.ready === true || response?.success === true) {
//           safeSetPhase("READY_WAITING");
//         }
//       },
//     );
//   };

//   const handleSubmitAnswer = () => {
//     if (!answer.trim() || submitting) return;
//     setSubmitting(true);
//     sendEvent(
//       "GAME_EVENT",
//       {
//         gameId: GAME_ID,
//         type: "SUBMIT_DATA",
//         payload: { data: { answer: answer.trim() } },
//       },
//       (response: any) => {
//         setSubmitting(false);
//         if (response?.success === true) {
//           safeSetPhase("ANSWER_WAITING");
//           setCurrentQuestion(null);
//         }
//       },
//     );
//   };

//   /* ── Derive SnapEditor props ─────────────────────────────────────────── */
//   const snapUploadErrorMsg: string | null = isImageUploadError
//     ? ((imageUploadErrorData as any)?.data?.message ??
//       (imageUploadErrorData as any)?.message ??
//       "Upload failed")
//     : null;

//   const snapUploadedUrl: string | null = imageUploadData
//     ? extractImageUrl(imageUploadData)
//     : null;

//   /* ── Phase renderer ──────────────────────────────────────────────────── */
//   const renderCenter = () => {
//     switch (localPhase) {
//       case "ELIMINATED":
//         return <EliminatedScreen />;

//       case "ELEMENT":
//         return (
//           <ElementSpectator
//             username={currentPlayer?.username ?? currentPlayer?.name}
//           />
//         );

//       case "VIDEO":
//         return (
//           <div className="w-full flex flex-col gap-6">
//             {/* ── Round 3 — The Grand Finale title ── */}
//             <RoundTitle
//               roundNumber="Round 3"
//               roundName="The Grand Finale"
//               icon={<Video className="w-5 h-5" />}
//               accentColor="violet"
//             />
//             <VideoCallRound
//               sendEvent={sendEvent}
//               incomingHostId={incomingHostId}
//               callKey={callKey}
//               callEndedKey={callEndedKey}
//               gameId={GAME_ID}
//             />
//           </div>
//         );

//       case "IMAGE_UPLOAD":
//         return (
//           <div className="w-full flex flex-col gap-6">
//             {/* ── Round 2 — Pictures title ── */}
//             <RoundTitle
//               roundNumber="Round 2"
//               roundName="Pictures"
//               icon={<Camera className="w-5 h-5" />}
//               accentColor="sky"
//             />
//             <SnapEditor
//               onSubmit={handleImageSubmit}
//               isUploading={isImageUploading}
//               uploadError={snapUploadErrorMsg}
//               uploadedUrl={snapUploadedUrl}
//             />
//           </div>
//         );

//       case "IMAGE_WAITING":
//         return <ImageWaitingScreen />;

//       case "ANSWER_WAITING":
//         return <AnswerWaitingScreen />;

//       case "READY_WAITING":
//         return <ReadyWaitingScreen />;

//       case "QUESTION":
//         if (!currentQuestion) return null;
//         return (
//           <div className="w-full flex flex-col items-center gap-6 z-10">
//             {/* ── Round 1 — Questions title ── */}
//             <RoundTitle
//               roundNumber="Round 1"
//               roundName="Questions"
//               icon={<MessageSquare className="w-5 h-5" />}
//               accentColor="amber"
//             />

//             {/* Question card */}
//             <div className="w-full max-w-2xl rounded-2xl border border-amber-500/20 bg-black/30 p-6">
//               <p className="text-[10px] text-amber-500/50 uppercase tracking-[5px] font-mono mb-3">
//                 Question
//               </p>
//               <p className="text-white font-semibold text-lg sm:text-xl leading-relaxed">
//                 {currentQuestion}
//               </p>
//             </div>

//             {/* Answer textarea */}
//             <div className="w-full max-w-2xl flex flex-col gap-3">
//               <textarea
//                 value={answer}
//                 onChange={(e) => setAnswer(e.target.value.slice(0, 300))}
//                 placeholder="Write your answer here…"
//                 rows={5}
//                 className="w-full bg-black/40 border border-amber-500/20 hover:border-amber-500/40 focus:border-amber-400/60 rounded-2xl resize-none p-4 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-colors leading-relaxed"
//                 style={{ fontFamily: "'Georgia', serif" }}
//               />
//               <div className="flex items-center justify-between">
//                 <span
//                   className={`text-xs font-mono ${
//                     answer.length > 280 ? "text-rose-400" : "text-zinc-600"
//                   }`}
//                 >
//                   {answer.length} / 300
//                 </span>
//                 <Button
//                   variant="game"
//                   onClick={handleSubmitAnswer}
//                   disabled={submitting || !answer.trim()}
//                 >
//                   {submitting ? "Submitting…" : "Submit Answer"}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         );

//       case "LOBBY":
//       default:
//         return (
//           <LobbyScreen
//             charIdx={charIdx}
//             lobbyText={LOBBY_TEXT}
//             onReady={handleReady}
//           />
//         );
//     }
//   };

//   /* ── Phase label map ─────────────────────────────────────────────────── */
//   const phaseLabel: Record<LocalPhase, string> = {
//     LOBBY: "Lobby",
//     READY_WAITING: "Ready — awaiting question",
//     QUESTION: "Round 1 · Questions",
//     ANSWER_WAITING: "Answer sent — awaiting image round",
//     IMAGE_UPLOAD: "Round 2 · Pictures",
//     IMAGE_WAITING: "Image sent — awaiting call",
//     VIDEO: "Round 3 · The Grand Finale",
//     ELEMENT: "You are an Element",
//     ELIMINATED: "Eliminated",
//   };

//   const connected = isConnected();
//   const activeCount = participants.filter((p) => !p.isEliminated).length;

//   /* ── Render ──────────────────────────────────────────────────────────── */
//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 flex flex-col gap-6">
//       {/* ── Status bar ── */}
//       <div className="flex items-center gap-3">
//         <span
//           className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest transition-colors ${
//             connected ? "text-emerald-400" : "text-rose-400"
//           }`}
//         >
//           {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
//           {connected ? "Connected" : "Disconnected"}
//         </span>
//         <span className="text-white/10">·</span>
//         <span className="text-white/30 text-xs font-mono uppercase tracking-widest">
//           {phaseLabel[localPhase]}
//         </span>
//       </div>

//       {/* ── Main card ── */}
//       <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-black/90 via-zinc-950/80 to-rose-950/30 backdrop-blur-sm p-8 sm:p-10 flex flex-col items-center gap-8 min-h-[420px] justify-center relative overflow-hidden">
//         {/* Decorative background radials */}
//         <div
//           className="absolute inset-0 pointer-events-none opacity-20"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 20% 20%, #d97706 0%, transparent 50%), radial-gradient(circle at 80% 80%, #9f1239 0%, transparent 50%)",
//           }}
//         />

//         {/* Element flash animation */}
//         {showElementAnimation && (
//           <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl">
//             <ElementSpectator
//               username={currentPlayer?.username ?? currentPlayer?.name}
//             />
//           </div>
//         )}

//         {renderCenter()}
//       </div>

//       {/* ── Player avatars ── */}
//       <div className="text-center">
//         <p className="text-white/20 text-[10px] uppercase tracking-widest mb-4 font-mono">
//           Contestants — {activeCount} active
//         </p>
//         <div className="flex items-center justify-center flex-wrap gap-3">
//           {participants.map((p, i) => (
//             <Avatar key={p.id} player={p} index={i} />
//           ))}
//         </div>

//         {isElement && (
//           <p className="mt-5 text-amber-400/80 text-sm font-medium tracking-wide flex items-center justify-center gap-2">
//             <Sparkles size={14} /> You are one of the Seven Elements{" "}
//             <Sparkles size={14} />
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default QuesationShowAndAns;

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

// Which transition video is currently playing (null = none)
type ActiveVideo = "round2" | "round3" | "finale" | null;

// Video sources — swap these paths for your real files
const VIDEO_SRCS: Record<Exclude<ActiveVideo, null>, string> = {
  round2: "/videos/IB_Round_2.mp4",
  round3: "/videos/IB_Round_3.mp4",
  finale: "/videos/IB_Finale.mp4",
};

/* ─── RouteLoadingOverlay ─────────────────────────────────────────────────── */
// Shown after the finale video finishes, while router.push resolves.
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
            stroke="url(#qsaArcG)"
            strokeWidth="3"
            strokeDasharray="364"
            strokeDashoffset="274"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="qsaArcG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="absolute w-20 h-20"
          style={{ animation: "qsaCounterSpin 1.4s linear infinite" }}
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
          style={{ animation: "qsaRosePulse 1.8s ease-in-out infinite" }}
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
            style={{ animation: "qsaShimmerBar 1.6s ease-in-out infinite" }}
          />
        </div>
        <p className="text-white/25 text-[10px] tracking-[0.5em] uppercase mt-1">
          Please wait
        </p>
      </div>
      <style>{`
        @keyframes qsaRosePulse   { 0%,100%{transform:scale(1);filter:drop-shadow(0 0 10px rgba(239,68,68,.5))} 50%{transform:scale(1.18);filter:drop-shadow(0 0 26px rgba(239,68,68,1))} }
        @keyframes qsaCounterSpin { from{transform:rotate(90deg)} to{transform:rotate(-270deg)} }
        @keyframes qsaShimmerBar  { 0%{transform:translateX(-200%)} 100%{transform:translateX(500%)} }
      `}</style>
    </div>
  );
}

/* ─── TransitionVideoModal ────────────────────────────────────────────────── */
// Self-contained video player. Calls onFinish() when user skips or the
// post-video countdown hits zero. The parent decides what to do next.
function TransitionVideoModal({
  videoKey,
  onFinish,
  label,
  accentColor = "amber",
}: {
  videoKey: Exclude<ActiveVideo, null>;
  onFinish: () => void;
  label: string;
  accentColor?: "amber" | "red" | "green" | "violet";
}) {
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

  // Accent palette
  const accent: Record<
    string,
    { badge: string; bar: string; ended: string; circle: string }
  > = {
    amber: {
      badge: "border-amber-400/40 text-amber-400",
      bar: "from-amber-400 to-rose-500",
      ended: "text-amber-400",
      circle: "#f59e0b",
    },
    red: {
      badge: "border-red-400/40 text-red-400",
      bar: "from-red-500 to-rose-400",
      ended: "text-red-400",
      circle: "#ef4444",
    },
    green: {
      badge: "border-green-400/40 text-green-400",
      bar: "from-green-500 to-emerald-400",
      ended: "text-green-400",
      circle: "#22c55e",
    },
    violet: {
      badge: "border-violet-400/40 text-violet-400",
      bar: "from-violet-500 to-fuchsia-400",
      ended: "text-violet-400",
      circle: "#8b5cf6",
    },
  };
  const a = accent[accentColor];

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

  // advance() → parent handles showing overlay / changing phase
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
        src={VIDEO_SRCS[videoKey]}
        className="absolute inset-0 w-full h-full object-cover"
        onCanPlay={handleCanPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        playsInline
        onClick={handlePlayPause}
      />

      {/* Video buffer loading spinner — full rose/arc design */}
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
                stroke="url(#qsaVidArcG)"
                strokeWidth="3"
                strokeDasharray="364"
                strokeDashoffset="274"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="qsaVidArcG" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
            <svg
              className="absolute w-20 h-20"
              style={{ animation: "qsaCounterSpin 1.4s linear infinite" }}
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
              style={{ animation: "qsaRosePulse 1.8s ease-in-out infinite" }}
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
                style={{ animation: "qsaShimmerBar 1.6s ease-in-out infinite" }}
              />
            </div>
            <p className="text-white/25 text-[10px] tracking-[0.5em] uppercase mt-1">
              Please wait
            </p>
          </div>
        </div>
      )}

      {/* Top bar — badge + skip */}
      <div
        className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 pt-6 pb-16 transition-opacity duration-500"
        style={{
          opacity: showControls ? 1 : 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)",
        }}
      >
        <span
          className={`px-3 py-1 rounded-full border bg-black/40 backdrop-blur-sm text-[11px] font-bold uppercase tracking-widest ${a.badge}`}
        >
          🎬 {label}
        </span>
        <button
          onClick={advance}
          className="px-4 py-2 rounded-xl border border-white/20 bg-black/40 backdrop-blur-sm text-white/80 text-xs font-bold tracking-wider hover:bg-white/10 transition-colors"
        >
          ⏭ Skip
        </button>
      </div>

      {/* Bottom controls */}
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
            className={`h-full rounded-full bg-gradient-to-r ${a.bar} relative pointer-events-none`}
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
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

      {/* Video-ended overlay */}
      {showEnded && (
        <div className="absolute inset-0 z-40 bg-black/70 flex flex-col items-center justify-center gap-5">
          <span
            className="text-6xl"
            style={{ animation: "qsaRosePulseEnd 1.2s ease-in-out infinite" }}
          >
            🌹
          </span>
          <p
            className={`font-extrabold text-xl uppercase tracking-widest ${a.ended}`}
          >
            {videoKey === "finale" ? "Game Over!" : "Video Complete!"}
          </p>
          <div className="relative w-16 h-16">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke={`${a.circle}33`}
                strokeWidth="4"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke={a.circle}
                strokeWidth="4"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <span
              className={`absolute inset-0 flex items-center justify-center font-black text-xl ${a.ended}`}
            >
              {countdown}
            </span>
          </div>
          <p className="text-white/50 text-sm tracking-widest">
            {videoKey === "finale"
              ? "Revealing the winner..."
              : "Starting next round..."}
          </p>
          <button
            onClick={advance}
            className={`mt-2 px-6 py-2.5 rounded-xl border text-sm font-bold tracking-wider transition-colors ${a.ended} border-current bg-current/10 hover:bg-current/20`}
          >
            Continue Now →
          </button>
        </div>
      )}

      <style>{`
        @keyframes qsaRosePulse    { 0%,100%{transform:scale(1);filter:drop-shadow(0 0 10px rgba(239,68,68,.5))} 50%{transform:scale(1.18);filter:drop-shadow(0 0 26px rgba(239,68,68,1))} }
        @keyframes qsaCounterSpin  { from{transform:rotate(90deg)} to{transform:rotate(-270deg)} }
        @keyframes qsaShimmerBar   { 0%{transform:translateX(-200%)} 100%{transform:translateX(500%)} }
        @keyframes qsaRosePulseEnd { 0%,100%{transform:scale(1);filter:drop-shadow(0 0 14px rgba(245,158,11,.6))} 50%{transform:scale(1.2);filter:drop-shadow(0 0 32px rgba(245,158,11,1))} }
      `}</style>
    </div>
  );
}

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
      label: "text-amber-500/80",
      name: "text-amber-300",
      border: "border-amber-500/20",
      glow: "from-amber-500/10",
      icon: "text-amber-400",
    },
    sky: {
      label: "text-sky-500/80",
      name: "text-sky-300",
      border: "border-sky-500/20",
      glow: "from-sky-500/10",
      icon: "text-sky-400",
    },
    violet: {
      label: "text-violet-400/80",
      name: "text-violet-200",
      border: "border-violet-500/20",
      glow: "from-violet-500/10",
      icon: "text-violet-400",
    },
    rose: {
      label: "text-rose-500/80",
      name: "text-rose-300",
      border: "border-rose-500/20",
      glow: "from-rose-500/10",
      icon: "text-rose-400",
    },
    emerald: {
      label: "text-emerald-500/80",
      name: "text-emerald-300",
      border: "border-emerald-500/20",
      glow: "from-emerald-500/10",
      icon: "text-emerald-400",
    },
  };
  const c = colors[accentColor];
  return (
    <div
      className={`w-full flex items-center gap-4 pb-3 mb-2 border-b ${c.border}`}
    >
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${c.glow} to-transparent border ${c.border} ${c.icon} shrink-0`}
      >
        {icon}
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className={`text-[13px] font-mono uppercase tracking-[5px] ${c.label}`}
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

  // Video transition state
  // activeVideo: which video is playing right now (null = none)
  // pendingPhase: the LocalPhase to switch to once the video finishes
  // isNavigating: finale video done → showing RouteLoadingOverlay while router resolves
  // pendingWinner: stored while the finale video plays
  const [activeVideo, setActiveVideo] = useState<ActiveVideo>(null);
  const [pendingPhase, setPendingPhase] = useState<LocalPhase | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const pendingWinnerRef = useRef<{
    winner: GameWinner | null;
    noWinner: boolean;
  }>({ winner: null, noWinner: false });

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

  /* ── File upload ─────────────────────────────────────────────────────── */
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

  // Play a transition video. After it finishes, switch to nextPhase.
  // If nextPhase is null it means it's the finale (navigate instead of phase switch).
  const playVideo = useCallback(
    (video: Exclude<ActiveVideo, null>, nextPhase: LocalPhase | null) => {
      setPendingPhase(nextPhase);
      setActiveVideo(video);
    },
    [],
  );

  // Called by TransitionVideoModal when skip/countdown fires.
  const handleVideoFinish = useCallback(() => {
    const next = pendingPhase;
    setActiveVideo(null);
    setPendingPhase(null);

    if (next === null) {
      // Finale video — navigate to winner page
      setIsNavigating(true);
      const { winner, noWinner } = pendingWinnerRef.current;
      if (noWinner || !winner) {
        router.push("/no-winner");
      } else {
        dispatch(setGameOver(winner));
        router.push("/round-two/round-two-six");
      }
    } else {
      safeSetPhase(next);
    }
  }, [pendingPhase, router, dispatch, safeSetPhase]);

  const handleGameEnded = useCallback(
    (winner: GameWinner | null, noWinner?: boolean) => {
      // Store winner for after the video
      pendingWinnerRef.current = { winner, noWinner: noWinner ?? false };
      // Play finale video; null pendingPhase = navigate when done
      playVideo("finale", null);
    },
    [playVideo],
  );

  const extractImageUrl = (result: any): string => {
    if (typeof result?.data === "string" && result.data.startsWith("http"))
      return result.data;
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
            if (response?.success === true) safeSetPhase("IMAGE_WAITING");
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

        if (payload.payload.type === "IMAGE") {
          // Play Video 2, then switch to IMAGE_UPLOAD phase
          playVideo("round2", "IMAGE_UPLOAD");
        }
        if (payload.payload.type === "VIDEO") {
          // Play Video 3, then switch to VIDEO phase
          playVideo("round3", "VIDEO");
        }
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
        if (response?.ready === true || response?.success === true)
          safeSetPhase("READY_WAITING");
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

  /* ── SnapEditor props ────────────────────────────────────────────────── */
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
            <RoundTitle
              roundNumber="Round 1"
              roundName="Questions"
              icon={<MessageSquare className="w-5 h-5" />}
              accentColor="amber"
            />
            <div className="w-full max-w-2xl rounded-2xl border border-amber-500/20 bg-black/30 p-6">
              <p className="text-[10px] text-amber-500/50 uppercase tracking-[5px] font-mono mb-3">
                Question
              </p>
              <p className="text-white font-semibold text-lg sm:text-xl leading-relaxed">
                {currentQuestion}
              </p>
            </div>
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
                  className={`text-xs font-mono ${answer.length > 280 ? "text-rose-400" : "text-zinc-600"}`}
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

  // Video accent colors per video key
  const videoAccent: Record<
    Exclude<ActiveVideo, null>,
    "amber" | "red" | "green" | "violet"
  > = {
    round2: "red",
    round3: "green",
    finale: "amber",
  };
  const videoLabel: Record<Exclude<ActiveVideo, null>, string> = {
    round2: "Round 2 — Pictures",
    round3: "Round 3 — Grand Finale",
    finale: "Grand Finale",
  };

  const connected = isConnected();
  const activeCount = participants.filter((p) => !p.isEliminated).length;

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <>
      {/*
        Render priority (highest z wins):
          1. isNavigating        → RouteLoadingOverlay (z-[100])
          2. activeVideo != null → TransitionVideoModal (z-50)
          3. main page content
      */}

      {isNavigating && <RouteLoadingOverlay />}

      {activeVideo && !isNavigating && (
        <TransitionVideoModal
          key={activeVideo} // remount fresh if video key changes
          videoKey={activeVideo}
          onFinish={handleVideoFinish}
          label={videoLabel[activeVideo]}
          accentColor={videoAccent[activeVideo]}
        />
      )}

      <div className="w-full max-w-7xl mx-auto px-4 flex flex-col gap-6">
        {/* Status bar */}
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest transition-colors ${connected ? "text-emerald-400" : "text-rose-400"}`}
          >
            {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
            {connected ? "Connected" : "Disconnected"}
          </span>
          <span className="text-white/10">·</span>
          <span className="text-white/30 text-xs font-mono uppercase tracking-widest">
            {phaseLabel[localPhase]}
          </span>
        </div>

        {/* Main card */}
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-black/90 via-zinc-950/80 to-rose-950/30 backdrop-blur-sm p-8 sm:p-10 flex flex-col items-center gap-8 min-h-[420px] justify-center relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, #d97706 0%, transparent 50%), radial-gradient(circle at 80% 80%, #9f1239 0%, transparent 50%)",
            }}
          />
          {showElementAnimation && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl">
              <ElementSpectator
                username={currentPlayer?.username ?? currentPlayer?.name}
              />
            </div>
          )}
          {renderCenter()}
        </div>

        {/* Player avatars */}
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
    </>
  );
}

export default QuesationShowAndAns;
