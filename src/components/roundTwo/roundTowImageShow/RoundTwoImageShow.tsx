// "use client";

// import { useState, useRef, useCallback } from "react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Player {
//   id: string;
//   name: string;
//   imageUrl: string; // base64 | remote URL | ""
// }

// interface Participant {
//   id: string;
//   name: string;
//   avatarUrl: string; // base64 | remote URL | ""
//   status: "READY" | "OUT";
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// /** Convert a File to a base64 data-URL */
// function fileToDataUrl(file: File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });
// }

// /** Placeholder avatar — renders initials on a dark circle */
// function InitialsAvatar({
//   name,
//   size = 32,
//   className = "",
// }: {
//   name: string;
//   size?: number;
//   className?: string;
// }) {
//   const initials = name
//     .split(" ")
//     .map((w) => w[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();
//   return (
//     <div
//       className={`flex items-center justify-center rounded-full bg-gray-800 text-gray-300 font-bold select-none ${className}`}
//       style={{ width: size, height: size, fontSize: size * 0.35 }}
//     >
//       {initials}
//     </div>
//   );
// }

// // ─── Default Data ─────────────────────────────────────────────────────────────

// const DEFAULT_PLAYERS: Player[] = [
//   { id: "P1", name: "Player 1", imageUrl: "" },
//   { id: "P7", name: "Player 7", imageUrl: "" },
//   { id: "P6", name: "Player 6", imageUrl: "" },
//   { id: "P2", name: "Player 2", imageUrl: "" },
// ];

// const DEFAULT_PARTICIPANTS: Participant[] = [
//   { id: "1", name: "Savan Nguyen", avatarUrl: "", status: "READY" },
//   { id: "2", name: "Darrell Steward", avatarUrl: "", status: "OUT" },
//   { id: "3", name: "Esther Howard", avatarUrl: "", status: "READY" },
//   { id: "4", name: "Jerome Bell", avatarUrl: "", status: "OUT" },
//   { id: "5", name: "Annette Black", avatarUrl: "", status: "READY" },
//   { id: "6", name: "Ronald Richards", avatarUrl: "", status: "OUT" },
//   { id: "7", name: "Eleanor Pena", avatarUrl: "", status: "READY" },
// ];

// const MAX_ELIMINATIONS = 2;

// // ─── ImageUploadZone ──────────────────────────────────────────────────────────
// /**
//  * A click-to-upload zone that accepts a single image.
//  * Shows a preview once an image is chosen; shows a placeholder icon otherwise.
//  */
// function ImageUploadZone({
//   value,
//   onChange,
//   className = "",
//   placeholderLabel,
//   aspectRatio = "4/3",
// }: {
//   value: string;
//   onChange: (dataUrl: string) => void;
//   className?: string;
//   placeholderLabel?: string;
//   aspectRatio?: string;
// }) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [dragging, setDragging] = useState(false);

//   const handleFile = useCallback(
//     async (file: File | null | undefined) => {
//       if (!file || !file.type.startsWith("image/")) return;
//       const dataUrl = await fileToDataUrl(file);
//       onChange(dataUrl);
//     },
//     [onChange],
//   );

//   return (
//     <div
//       className={`relative overflow-hidden rounded-lg cursor-pointer group transition-all duration-200
//         ${dragging ? "ring-2 ring-amber-400 scale-[1.01]" : "ring-1 ring-white/10 hover:ring-amber-500/50"}
//         ${className}`}
//       style={{ aspectRatio }}
//       onClick={() => inputRef.current?.click()}
//       onDragOver={(e) => {
//         e.preventDefault();
//         setDragging(true);
//       }}
//       onDragLeave={() => setDragging(false)}
//       onDrop={(e) => {
//         e.preventDefault();
//         setDragging(false);
//         handleFile(e.dataTransfer.files[0]);
//       }}
//     >
//       <input
//         ref={inputRef}
//         type="file"
//         accept="image/*"
//         className="sr-only"
//         onChange={(e) => handleFile(e.target.files?.[0])}
//       />

//       {value ? (
//         <>
//           <img
//             src={value}
//             alt="uploaded"
//             className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
//           />
//           {/* Change overlay */}
//           <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
//             <svg
//               className="w-6 h-6 text-white mb-1"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//               />
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//               />
//             </svg>
//             <span className="text-white text-[10px] font-bold tracking-widest uppercase">
//               Change
//             </span>
//           </div>
//         </>
//       ) : (
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 gap-2">
//           <div
//             className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors
//             ${dragging ? "border-amber-400 bg-amber-950/40" : "border-white/20 bg-white/5 group-hover:border-amber-500/60"}`}
//           >
//             <svg
//               className="w-5 h-5 text-white/40 group-hover:text-amber-400 transition-colors"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M12 4v16m8-8H4"
//               />
//             </svg>
//           </div>
//           {placeholderLabel && (
//             <span className="text-white/25 text-[10px] font-bold tracking-widest uppercase group-hover:text-amber-500/60 transition-colors">
//               {placeholderLabel}
//             </span>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── PlayerCard ───────────────────────────────────────────────────────────────

// function PlayerCard({
//   player,
//   isSelected,
//   isEliminated,
//   onToggle,
//   onImageChange,
//   selectionIndex,
// }: {
//   player: Player;
//   isSelected: boolean;
//   isEliminated: boolean;
//   onToggle: (id: string) => void;
//   onImageChange: (id: string, dataUrl: string) => void;
//   selectionIndex: number | null;
// }) {
//   if (isEliminated) {
//     return (
//       <div className="rounded-xl ring-1 ring-red-900/20 bg-black/20 flex flex-col items-center justify-center min-h-[220px] opacity-30">
//         <div className="w-12 h-12 rounded-full border-2 border-red-900 flex items-center justify-center mb-2">
//           <svg
//             className="w-6 h-6 text-red-900"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </div>
//         <span className="text-red-900 text-xs font-bold tracking-widest uppercase">
//           {player.id} Eliminated
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`relative rounded-xl overflow-hidden transition-all duration-300
//         ${
//           isSelected
//             ? "ring-2 ring-red-500 shadow-[0_0_28px_rgba(239,68,68,0.55)] scale-[1.02]"
//             : "ring-1 ring-amber-500/30 hover:ring-amber-400/60 hover:shadow-[0_0_18px_rgba(251,191,36,0.15)]"
//         }`}
//       style={{
//         background: isSelected
//           ? "linear-gradient(160deg,#1f0808 0%,#2e0e0e 100%)"
//           : "linear-gradient(160deg,#111111 0%,#1a1308 100%)",
//       }}
//     >
//       {/* Selection badge */}
//       {isSelected && selectionIndex !== null && (
//         <div className="absolute top-2.5 right-2.5 z-20 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-black ring-2 ring-red-400 shadow-lg">
//           {selectionIndex}
//         </div>
//       )}

//       {/* Player name */}
//       <div className="pt-3 pb-2 px-3 text-center">
//         <span className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase">
//           {player.name}
//         </span>
//       </div>

//       {/* Photo / upload zone */}
//       <div className="mx-3 relative">
//         <ImageUploadZone
//           value={player.imageUrl}
//           onChange={(url) => onImageChange(player.id, url)}
//           placeholderLabel="Upload Photo"
//           aspectRatio="4/3"
//         />

//         {/* Eliminate overlay on selected */}
//         {isSelected && player.imageUrl && (
//           <div className="absolute inset-0 rounded-lg bg-red-900/50 flex items-center justify-center pointer-events-none">
//             <div className="w-14 h-14 rounded-full border-2 border-red-400 flex items-center justify-center bg-red-950/60">
//               <svg
//                 className="w-7 h-7 text-red-300"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2.5}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Eliminate button */}
//       <div className="p-3">
//         <button
//           onClick={() => onToggle(player.id)}
//           className={`w-full py-2 rounded text-[11px] font-black tracking-[0.18em] uppercase transition-all duration-200
//             ${
//               isSelected
//                 ? "bg-red-700 text-white shadow-[0_0_14px_rgba(239,68,68,0.45)]"
//                 : "bg-red-800/70 text-red-200 hover:bg-red-700 hover:text-white"
//             }`}
//         >
//           {isSelected ? "✓ Selected" : `Eliminate ${player.id}`}
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── ParticipantRow ───────────────────────────────────────────────────────────

// function ParticipantRow({
//   participant,
//   onAvatarChange,
// }: {
//   participant: Participant;
//   onAvatarChange: (id: string, dataUrl: string) => void;
// }) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const isOut = participant.status === "OUT";

//   const handleFile = useCallback(
//     async (file: File | null | undefined) => {
//       if (!file || !file.type.startsWith("image/")) return;
//       const url = await fileToDataUrl(file);
//       onAvatarChange(participant.id, url);
//     },
//     [participant.id, onAvatarChange],
//   );

//   return (
//     <div
//       className={`flex items-center gap-3 py-1.5 px-2 rounded-lg transition-colors ${isOut ? "opacity-45" : "hover:bg-white/[0.04]"}`}
//     >
//       {/* Clickable avatar */}
//       <div
//         className="relative flex-shrink-0 cursor-pointer group/av"
//         onClick={() => !isOut && inputRef.current?.click()}
//         title={isOut ? undefined : "Change avatar"}
//       >
//         <input
//           ref={inputRef}
//           type="file"
//           accept="image/*"
//           className="sr-only"
//           onChange={(e) => handleFile(e.target.files?.[0])}
//         />
//         {participant.avatarUrl ? (
//           <img
//             src={participant.avatarUrl}
//             alt={participant.name}
//             className={`w-8 h-8 rounded-full object-cover ring-2 transition-all
//               ${isOut ? "ring-gray-700 grayscale" : "ring-amber-500/50 group-hover/av:ring-amber-400"}`}
//           />
//         ) : (
//           <InitialsAvatar
//             name={participant.name}
//             size={32}
//             className={`ring-2 ${isOut ? "ring-gray-700 grayscale" : "ring-amber-500/50 group-hover/av:ring-amber-400"}`}
//           />
//         )}
//         {/* camera icon on hover */}
//         {!isOut && (
//           <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover/av:opacity-100 transition-opacity">
//             <svg
//               className="w-3.5 h-3.5 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//               />
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//               />
//             </svg>
//           </div>
//         )}
//         {isOut && (
//           <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
//             <span className="text-red-500 text-[9px] font-black">✕</span>
//           </div>
//         )}
//       </div>

//       <span
//         className={`flex-1 text-sm font-medium truncate ${isOut ? "text-gray-600 line-through" : "text-gray-200"}`}
//       >
//         {participant.name}
//       </span>
//       <span
//         className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded ${isOut ? "text-red-500 bg-red-950/60" : "text-green-400 bg-green-950/60"}`}
//       >
//         {participant.status}
//       </span>
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function EliminationRound() {
//   const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
//   const [participants, setParticipants] =
//     useState<Participant[]>(DEFAULT_PARTICIPANTS);
//   const [selected, setSelected] = useState<string[]>([]);
//   const [eliminated, setEliminated] = useState<string[]>([]);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const remaining = MAX_ELIMINATIONS - selected.length;

//   // ── image handlers ──────────────────────────────────────────────────────────
//   const handlePlayerImage = useCallback((id: string, dataUrl: string) => {
//     setPlayers((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, imageUrl: dataUrl } : p)),
//     );
//   }, []);

//   const handleParticipantAvatar = useCallback((id: string, dataUrl: string) => {
//     setParticipants((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, avatarUrl: dataUrl } : p)),
//     );
//   }, []);

//   // ── selection ───────────────────────────────────────────────────────────────
//   const togglePlayer = (id: string) => {
//     if (eliminated.includes(id)) return;
//     setSelected((prev) => {
//       if (prev.includes(id)) return prev.filter((x) => x !== id);
//       if (prev.length >= MAX_ELIMINATIONS) return prev;
//       return [...prev, id];
//     });
//   };

//   const handleConfirm = () => {
//     if (selected.length === MAX_ELIMINATIONS) setShowConfirm(true);
//   };

//   const doEliminate = () => {
//     setEliminated((prev) => [...prev, ...selected]);
//     setSelected([]);
//     setShowConfirm(false);
//   };

//   return (
//     <div className="min-h-screen w-full max-w-7xl mx-auto flex-col px-6">
//       {/* Noise overlay */}
//       <div
//         className="fixed inset-0 pointer-events-none opacity-[0.025]"
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
//         }}
//       />

//       {/* Top bar */}
//       <div className="relative z-10 flex mt-5 items-center justify-between px-4 sm:px-8 py-3 border-b border-white/[0.05]">
//         <span className="text-white/50 text-xs font-bold tracking-[0.25em] uppercase">
//           Contestant 1
//         </span>
//         <div className="flex items-center gap-2">
//           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
//           <span className="text-red-500/50 text-[10px] font-bold tracking-widest uppercase">
//             Live
//           </span>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-4 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
//         {/* Center */}
//         <div className="flex-1 flex flex-col gap-5">
//           {/* Heading */}
//           <div className="text-center pt-1">
//             <p className="text-white/20 text-[10px] font-bold tracking-[0.35em] uppercase mb-1">
//               Season 3
//             </p>
//             <h1
//               className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.18em] text-white uppercase"
//               style={{ textShadow: "0 0 50px rgba(239,68,68,0.25)" }}
//             >
//               Round 2 — Pictures
//             </h1>
//             <p className="mt-1.5 text-red-400 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase">
//               Eliminate {MAX_ELIMINATIONS} Contestants
//             </p>

//             {/* Progress pills */}
//             <div className="mt-3 flex items-center justify-center gap-2">
//               {Array.from({ length: MAX_ELIMINATIONS }).map((_, i) => (
//                 <div
//                   key={i}
//                   className={`h-1.5 rounded-full transition-all duration-500 ${i < selected.length ? "w-10 bg-red-500" : "w-6 bg-white/10"}`}
//                 />
//               ))}
//               <span className="text-[11px] text-gray-600 ml-1">
//                 {selected.length}/{MAX_ELIMINATIONS}
//               </span>
//             </div>

//             {/* Hint */}
//             <p className="mt-2 text-white/20 text-[10px] tracking-wider">
//               Click <span className="text-amber-500/60">+</span> on any card to
//               upload a photo
//             </p>
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
//             {/* LEFT SIDE */}
//             <div className="flex flex-col gap-4">
//               {/* Player grid */}
//               <div className="grid grid-cols-2 gap-3 sm:gap-4">
//                 {players.map((player) => (
//                   <PlayerCard
//                     key={player.id}
//                     player={player}
//                     isSelected={selected.includes(player.id)}
//                     isEliminated={eliminated.includes(player.id)}
//                     selectionIndex={
//                       selected.includes(player.id)
//                         ? selected.indexOf(player.id) + 1
//                         : null
//                     }
//                     onToggle={togglePlayer}
//                     onImageChange={handlePlayerImage}
//                   />
//                 ))}
//               </div>

//               {/* CTA */}
//               <div className="flex justify-center pb-2">
//                 <button
//                   disabled={selected.length < MAX_ELIMINATIONS}
//                   onClick={handleConfirm}
//                   className={`relative px-8 sm:px-14 py-3 sm:py-4 rounded-lg text-xs sm:text-sm font-black tracking-[0.22em] uppercase
//         transition-all duration-300 overflow-hidden
//         ${
//           selected.length === MAX_ELIMINATIONS
//             ? "bg-gradient-to-r from-red-900 to-red-600 text-white shadow-[0_0_35px_rgba(239,68,68,0.5)] hover:shadow-[0_0_55px_rgba(239,68,68,0.7)] hover:scale-105 cursor-pointer"
//             : "bg-gray-900/60 text-gray-700 border border-white/5 cursor-not-allowed"
//         }`}
//                 >
//                   {selected.length === MAX_ELIMINATIONS ? (
//                     <>
//                       <span className="relative z-10">
//                         ⚡ Confirm Elimination
//                       </span>
//                       <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-400/20 to-red-600/0 animate-pulse" />
//                     </>
//                   ) : (
//                     `Eliminate ${remaining} More`
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* RIGHT SIDEBAR */}
//             <aside
//               className="w-full rounded-xl p-4 border border-white/[0.06] self-start sticky top-4 h-fit"
//               style={{ background: "rgba(10,8,5,0.85)" }}
//             >
//               <h2 className="text-white font-black tracking-[0.2em] text-xs uppercase mb-3 pb-2.5 border-b border-white/[0.08] flex items-center gap-2">
//                 <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
//                 Participants
//               </h2>

//               <div className="flex flex-col gap-0.5">
//                 {participants.map((p) => (
//                   <ParticipantRow
//                     key={p.id}
//                     participant={p}
//                     onAvatarChange={handleParticipantAvatar}
//                   />
//                 ))}
//               </div>

//               <div className="mt-4 pt-3 border-t border-white/[0.08] grid grid-cols-2 gap-2 text-center">
//                 <div className="bg-green-950/40 rounded-lg py-2.5">
//                   <div className="text-green-400 text-xl font-black">
//                     {participants.filter((p) => p.status === "READY").length}
//                   </div>
//                   <div className="text-green-700 text-[9px] font-bold tracking-widest uppercase">
//                     Active
//                   </div>
//                 </div>
//                 <div className="bg-red-950/40 rounded-lg py-2.5">
//                   <div className="text-red-500 text-xl font-black">
//                     {participants.filter((p) => p.status === "OUT").length}
//                   </div>
//                   <div className="text-red-800 text-[9px] font-bold tracking-widest uppercase">
//                     Out
//                   </div>
//                 </div>
//               </div>
//             </aside>
//           </div>
//         </div>
//       </div>

//       {/* Confirm modal */}
//       {showConfirm && (
//         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-black/75 backdrop-blur-sm"
//             onClick={() => setShowConfirm(false)}
//           />
//           <div
//             className="relative z-10 rounded-2xl p-6 sm:p-8 max-w-sm w-full border border-red-900/40 shadow-2xl"
//             style={{
//               background: "linear-gradient(145deg,#1e0808 0%,#0f0a0a 100%)",
//             }}
//           >
//             {/* Thumbnails of selected players */}
//             <div className="flex justify-center gap-3 mb-5">
//               {selected.map((id) => {
//                 const p = players.find((pl) => pl.id === id);
//                 return p ? (
//                   <div key={id} className="text-center">
//                     <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-red-600 mx-auto mb-1">
//                       {p.imageUrl ? (
//                         <img
//                           src={p.imageUrl}
//                           alt={p.name}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <InitialsAvatar name={p.name} size={64} />
//                       )}
//                     </div>
//                     <span className="text-red-400 text-[10px] font-bold tracking-widest">
//                       {p.id}
//                     </span>
//                   </div>
//                 ) : null;
//               })}
//             </div>

//             <div className="text-center mb-5">
//               <h3 className="text-white font-black text-lg tracking-widest uppercase mb-1">
//                 Confirm
//               </h3>
//               <p className="text-gray-400 text-sm leading-relaxed">
//                 Eliminate{" "}
//                 <span className="text-red-400 font-bold">
//                   {selected.join(" & ")}
//                 </span>{" "}
//                 from the competition?
//               </p>
//               <p className="text-gray-700 text-xs mt-1">
//                 This action cannot be undone.
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowConfirm(false)}
//                 className="flex-1 py-3 rounded-lg border border-white/10 text-gray-400 text-xs font-bold tracking-widest uppercase hover:bg-white/5 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={doEliminate}
//                 className="flex-1 py-3 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]"
//               >
//                 Eliminate
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";

const participants = [
  {
    id: 1,
    name: "Savan Nguyen",
    avatar: "https://i.pravatar.cc/150?img=11",
    status: "ready",
  },
  {
    id: 2,
    name: "Darrell Steward",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "out",
  },
  {
    id: 3,
    name: "Esther Howard",
    avatar: "https://i.pravatar.cc/150?img=13",
    status: "ready",
  },
  {
    id: 4,
    name: "Jerome Bell",
    avatar: "https://i.pravatar.cc/150?img=14",
    status: "out",
  },
  {
    id: 5,
    name: "Annette Black",
    avatar: "https://i.pravatar.cc/150?img=15",
    status: "ready",
  },
  {
    id: 6,
    name: "Ronald Richards",
    avatar: "https://i.pravatar.cc/150?img=16",
    status: "out",
  },
  {
    id: 7,
    name: "Eleanor Pena",
    avatar: "https://i.pravatar.cc/150?img=17",
    status: "ready",
  },
];

const players = [
  {
    id: 1,
    label: "PLAYER 1",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    bg: "from-blue-900/60 to-blue-950/80",
  },
  {
    id: 7,
    label: "PLAYER 7",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    bg: "from-amber-900/60 to-amber-950/80",
  },
  {
    id: 6,
    label: "PLAYER 6",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    bg: "from-orange-900/60 to-orange-950/80",
  },
  {
    id: 2,
    label: "PLAYER 2",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    bg: "from-green-900/60 to-green-950/80",
  },
];

export default function EliminationGame() {
  const [eliminated, setEliminated] = useState<number[]>([]);
  const [confirmModal, setConfirmModal] = useState<number | null>(null);
  const [eliminating, setEliminating] = useState<number | null>(null);
  const required = 2;

  const toggleEliminate = (id: number) => {
    if (eliminated.includes(id)) {
      setEliminated((prev) => prev.filter((e) => e !== id));
    } else if (eliminated.length < required) {
      setConfirmModal(id);
    }
  };

  const confirmEliminate = () => {
    if (confirmModal !== null) {
      setEliminating(confirmModal);
      setTimeout(() => {
        setEliminated((prev) => [...prev, confirmModal]);
        setEliminating(null);
        setConfirmModal(null);
      }, 700);
    }
  };

  const remaining = required - eliminated.length;

  return (
    <div className=" max-w-7xl mx-auto ">
      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-red-900/40 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-red-400 uppercase">
            Contestant 1
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 tracking-widest uppercase">
            Live
          </span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Round header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-3 mb-2">
              <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-red-600" />
              <span className="text-[10px] sm:text-xs text-red-500 tracking-[0.3em] uppercase font-bold">
                Round 2
              </span>
              <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-red-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl  font-black tracking-tight text-white uppercase">
              Round 2 –{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                Pictures
              </span>
            </h1>
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: required }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
                      i < eliminated.length
                        ? "bg-red-500 border-red-500 scale-110"
                        : "bg-transparent border-red-700"
                    }`}
                  />
                ))}
              </div>
              <p className="text-red-400 text-xs sm:text-sm font-bold tracking-widest uppercase">
                {remaining > 0
                  ? `Eliminate ${remaining} more contestant${remaining > 1 ? "s" : ""}`
                  : "✓ Done"}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Player grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {players.map((player) => {
                  const isEliminated = eliminated.includes(player.id);
                  const isEliminating = eliminating === player.id;
                  const canEliminate =
                    !isEliminated && eliminated.length < required;

                  return (
                    <div
                      key={player.id}
                      className={`
                    relative rounded-xl overflow-hidden border transition-all duration-500 group
                    ${
                      isEliminated
                        ? "border-red-600/80 opacity-60 scale-[0.98]"
                        : "border-white/10 hover:border-red-500/50"
                    }
                    ${isEliminating ? "scale-95 opacity-50" : ""}
                    bg-gradient-to-b from-white/5 to-black/60
                  `}
                    >
                      {/* Glow on hover */}
                      {!isEliminated && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl ring-1 ring-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]" />
                      )}

                      {/* Player label */}
                      <div className="relative px-4 pt-3 pb-2 flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-black tracking-[0.15em] text-gray-300 uppercase">
                          {player.label}
                        </span>
                        {isEliminated && (
                          <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase bg-red-950/50 px-2 py-0.5 rounded-full border border-red-800/50">
                            Eliminated
                          </span>
                        )}
                      </div>

                      {/* Image */}
                      <div className="relative mx-3 rounded-lg overflow-hidden aspect-[4/3]">
                        <img
                          src={player.image}
                          alt={player.label}
                          className={`w-full h-full object-cover object-top transition-all duration-500 ${
                            isEliminated
                              ? "grayscale brightness-50"
                              : "group-hover:scale-105"
                          }`}
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-b ${player.bg}`}
                        />
                        {isEliminated && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-4xl sm:text-6xl font-black text-red-500/80 rotate-[-15deg] tracking-tighter uppercase border-4 border-red-500/50 px-4 py-2 rounded-lg">
                              OUT
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Eliminate button */}
                      <div className="p-3">
                        <button
                          onClick={() => toggleEliminate(player.id)}
                          disabled={!canEliminate && !isEliminated}
                          className={`
                        w-full py-2.5 sm:py-3 rounded-lg font-black text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 relative overflow-hidden
                        ${
                          isEliminated
                            ? "bg-red-950/60 text-red-400 border border-red-800/50 cursor-pointer hover:bg-red-900/60"
                            : canEliminate
                              ? "bg-gradient-to-r from-red-900 to-red-800 hover:from-red-600 hover:to-red-500 text-white shadow-lg shadow-red-900/50 hover:shadow-red-800/60 active:scale-95"
                              : "bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-700/30"
                        }
                      `}
                        >
                          {isEliminated ? (
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
                              Undo Eliminate P{player.id}
                            </span>
                          ) : (
                            `Eliminate P${player.id}`
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Final CTA */}
              <div className="mt-6 sm:mt-8 flex justify-center">
                <button
                  disabled={remaining > 0}
                  className={`
                relative px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-base tracking-[0.25em] uppercase transition-all duration-500
                ${
                  remaining === 0
                    ? "bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white shadow-xl shadow-red-900/60 hover:shadow-red-700/70 hover:scale-105 active:scale-95 cursor-pointer animate-pulse"
                    : "bg-gray-900/60 text-gray-600 border border-gray-800/50 cursor-not-allowed"
                }
              `}
                >
                  {remaining > 0
                    ? `Eliminate ${remaining} More`
                    : "Confirm Eliminations →"}
                </button>
              </div>
            </div>
            {/* Sidebar */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0">
              <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden sticky top-4">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-black tracking-[0.2em] uppercase text-white">
                    Participants
                  </h2>
                  <span className="text-xs text-gray-500">
                    {participants.filter((p) => p.status === "ready").length}{" "}
                    active
                  </span>
                </div>
                <div className="divide-y divide-white/5">
                  {participants.map((p, i) => (
                    <div
                      key={p.id}
                      className={`flex items-center gap-3 px-4 sm:px-5 py-3 transition-colors ${
                        p.status === "out" ? "opacity-50" : "hover:bg-white/5"
                      }`}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 ${
                            p.status === "ready"
                              ? "border-green-500/50"
                              : "border-red-900/50 grayscale"
                          }`}
                        />
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-black ${
                            p.status === "ready" ? "bg-green-500" : "bg-red-600"
                          }`}
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-200 truncate flex-1">
                        {p.name}
                      </span>
                      <span
                        className={`text-[10px] sm:text-xs font-black tracking-[0.15em] uppercase shrink-0 ${
                          p.status === "ready"
                            ? "text-green-400"
                            : "text-red-500"
                        }`}
                      >
                        {p.status === "ready" ? "READY" : "OUT"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-white/10">
                  <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-2">
                    <span>Elimination Progress</span>
                    <span>
                      {eliminated.length}/{required}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-700"
                      style={{
                        width: `${(eliminated.length / required) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setConfirmModal(null)}
          />
          <div className="relative bg-[#100a0b] border border-red-900/60 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl shadow-red-950/60">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent" />
            <div className="text-center mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-950/60 border border-red-800/50 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide text-white mb-2">
                Confirm Elimination
              </h3>
              <p className="text-gray-400 text-sm">
                Are you sure you want to eliminate{" "}
                <span className="text-red-400 font-bold">
                  Player {confirmModal}
                </span>
                ? This action will count towards Round 2.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 sm:py-3 rounded-lg border border-white/10 text-gray-400 text-sm font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmEliminate}
                className="flex-1 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-red-700 to-red-600 text-white text-sm font-black uppercase tracking-widest hover:from-red-600 hover:to-red-500 transition-all shadow-lg shadow-red-900/50 active:scale-95"
              >
                Eliminate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
