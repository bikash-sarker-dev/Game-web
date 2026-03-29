// "use client";

// import Button from "@/components/share/ButtonPrimary";
// import Image from "next/image";
// import RingImg from "@/assets/rings.png";
// import { useState, useEffect, useRef } from "react";

// // ─── Types ───────────────────────────────────────────────────────────────────
// type Screen = "lobby" | "waiting" | "spectating";

// interface Participant {
//   id: number;
//   name: string;
//   avatar: string;
//   ready: boolean;
// }

// // ─── Mock Data ────────────────────────────────────────────────────────────────
// const PARTICIPANTS: Participant[] = [
//   { id: 1, name: "Savan Nguyen", avatar: "SN", ready: true },
//   { id: 2, name: "Darrell Steward", avatar: "DS", ready: true },
//   { id: 3, name: "Jane Cooper", avatar: "JC", ready: true },
//   { id: 4, name: "Esther Howard", avatar: "EH", ready: true },
//   { id: 5, name: "Jerome Bell", avatar: "JB", ready: true },
//   { id: 6, name: "Annette Black", avatar: "AB", ready: true },
//   { id: 7, name: "Ronald Richards", avatar: "RR", ready: true },
//   { id: 8, name: "Eleanor Pena", avatar: "EP", ready: true },
// ];

// const AVATAR_COLORS = [
//   "from-rose-500 to-pink-600",
//   "from-amber-500 to-orange-600",
//   "from-emerald-500 to-teal-600",
//   "from-violet-500 to-purple-600",
//   "from-sky-500 to-blue-600",
//   "from-fuchsia-500 to-pink-600",
//   "from-lime-500 to-green-600",
//   "from-cyan-500 to-blue-600",
// ];

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function AvatarBubble({
//   initials,
//   index,
//   size = "md",
//   ring = false,
// }: {
//   initials: string;
//   index: number;
//   size?: "sm" | "md" | "lg";
//   ring?: boolean;
// }) {
//   const sizeClasses = {
//     sm: "w-9 h-9 text-xs",
//     md: "w-11 h-11 text-sm",
//     lg: "w-14 h-14 text-base",
//   };
//   return (
//     <div
//       className={`
//         ${sizeClasses[size]} rounded-full bg-gradient-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]}
//         flex items-center justify-center font-bold text-white flex-shrink-0
//         ${ring ? "ring-2 ring-amber-400/60 ring-offset-1 ring-offset-black" : ""}
//         shadow-lg
//       `}
//     >
//       {initials}
//     </div>
//   );
// }

// function RoseIcon({ className = "" }: { className?: string }) {
//   return (
//     <svg
//       viewBox="0 0 64 64"
//       className={className}
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <ellipse cx="32" cy="28" rx="14" ry="16" fill="#e11d48" opacity="0.9" />
//       <ellipse cx="22" cy="22" rx="9" ry="11" fill="#fb7185" opacity="0.7" />
//       <ellipse cx="42" cy="22" rx="9" ry="11" fill="#fb7185" opacity="0.7" />
//       <ellipse cx="32" cy="18" rx="8" ry="10" fill="#fda4af" opacity="0.6" />
//       <rect x="30" y="40" width="4" height="18" fill="#15803d" rx="2" />
//       <ellipse
//         cx="26"
//         cy="50"
//         rx="8"
//         ry="4"
//         fill="#15803d"
//         opacity="0.6"
//         transform="rotate(-20 26 50)"
//       />
//     </svg>
//   );
// }

// function SpinnerIcon() {
//   return (
//     <div className="relative w-10 h-10">
//       <div className="absolute inset-0 rounded-full border-2 border-white/10" />
//       <div className="absolute inset-0 rounded-full border-2 border-t-rose-500 border-r-amber-400 border-b-transparent border-l-transparent animate-spin" />
//     </div>
//   );
// }

// // ─── Screen 1: Host Lobby ─────────────────────────────────────────────────────
// function LobbyScreen({ onStart }: { onStart: () => void }) {
//   const [pulse, setPulse] = useState(false);

//   useEffect(() => {
//     const t = setInterval(() => setPulse((p) => !p), 1500);
//     return () => clearInterval(t);
//   }, []);

//   return (
//     <div className="flex flex-col lg:flex-row gap-5 w-full max-w-7xl mx-auto px-4">
//       {/* Main card */}
//       <div className="flex-1 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-black/80 to-rose-950/40 backdrop-blur-sm p-6 sm:p-10 flex flex-col items-center justify-center gap-6 min-h-[340px]">
//         <div className="text-center">
//           <p className="text-white/50 uppercase tracking-[0.3em] text-xs font-semibold mb-1">
//             Status
//           </p>
//           <h2 className="text-white font-extrabold text-lg sm:text-xl tracking-widest uppercase mb-4">
//             Waiting for Contestants{" "}
//             <span className="text-amber-400">
//               ({PARTICIPANTS.filter((p) => p.ready).length}/
//               {PARTICIPANTS.length})
//             </span>
//           </h2>
//         </div>
//         <Button variant="game" onClick={() => onStart}>
//           ▶ START GAME
//         </Button>
//         <p className="text-white/70 text-xs text-center max-w-xs mt-4">
//           Minimum 2 players required for testing &nbsp;·&nbsp; 8 players
//           required for the full game
//         </p>
//         {/* <div
//           className={`transition-opacity duration-700 ${pulse ? "opacity-100" : "opacity-70"}`}
//         >
//           <RingsIcon />
//         </div> */}

//         <div>
//           <Image
//             src={RingImg}
//             alt="rings"
//             width={200}
//             height={200}
//             unoptimized
//           />
//         </div>
//       </div>

//       {/* Participants panel */}
//       <div className="lg:w-72 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-sm p-5">
//         <h3 className="text-white/40 uppercase tracking-[0.25em] text-xs font-bold mb-4">
//           Participants
//         </h3>
//         <ul className="space-y-2">
//           {PARTICIPANTS.map((p, i) => (
//             <li key={p.id} className="flex items-center gap-3 group">
//               <AvatarBubble initials={p.avatar} index={i} size="sm" />
//               <span className="flex-1 text-white/80 text-sm font-medium truncate group-hover:text-white transition-colors">
//                 {p.name}
//               </span>
//               {p.ready && (
//                 <span className="text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest">
//                   Ready
//                 </span>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// // ─── Screen 2: Contestant Waiting ─────────────────────────────────────────────
// function WaitingScreen({ onNext }: { onNext: () => void }) {
//   const [dots, setDots] = useState(".");

//   useEffect(() => {
//     const t = setInterval(
//       () => setDots((d) => (d.length >= 4 ? "." : d + ".")),
//       500,
//     );
//     return () => clearInterval(t);
//   }, []);

//   return (
//     <div className="w-full max-w-3xl mx-auto px-4 flex flex-col gap-6">
//       <p className="text-white/40 uppercase tracking-[0.25em] text-xs font-semibold">
//         Contestant 1
//       </p>
//       <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-black/90 to-rose-950/50 backdrop-blur-sm p-8 sm:p-14 flex flex-col items-center gap-6 min-h-[300px] justify-center">
//         {/* Stacked avatars */}
//         <div className="flex items-center -space-x-3">
//           {PARTICIPANTS.slice(0, 5).map((p, i) => (
//             <div
//               key={p.id}
//               className="ring-2 ring-black rounded-full"
//               style={{ zIndex: 10 - i }}
//             >
//               <AvatarBubble initials={p.avatar} index={i} size="sm" />
//             </div>
//           ))}
//           <div className="w-9 h-9 rounded-full bg-white/10 ring-2 ring-black flex items-center justify-center text-white/50 text-xs font-bold">
//             +{PARTICIPANTS.length - 5}
//           </div>
//         </div>

//         <div className="text-center">
//           <h2 className="text-white font-extrabold uppercase tracking-[0.2em] text-xl mb-1">
//             Connected to Lobby
//           </h2>
//           <p className="text-white/40 text-sm">
//             Waiting for the host to start the tournament{dots}
//           </p>
//         </div>

//         <button
//           onClick={onNext}
//           className="group relative bg-gradient-to-r from-rose-800 via-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-extrabold uppercase tracking-widest text-sm px-10 py-3.5 rounded-full shadow-xl shadow-rose-900/70 transition-all duration-300 hover:scale-105 active:scale-95"
//         >
//           Let's Go{dots}
//         </button>
//       </div>

//       {/* Active contestants strip */}
//       <div className="text-center">
//         <p className="text-white/30 text-xs uppercase tracking-widest mb-3">
//           Active Contestants
//         </p>
//         <div className="flex items-center justify-center flex-wrap gap-2">
//           {PARTICIPANTS.map((p, i) => (
//             <div key={p.id} className="relative">
//               <AvatarBubble initials={p.avatar} index={i} size="sm" ring />
//               <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Screen 3: Spectating Duel ────────────────────────────────────────────────
// function SpectatingScreen({ onReset }: { onReset: () => void }) {
//   const question = '"What is your deal-breaker?"';
//   const [charIdx, setCharIdx] = useState(0);

//   useEffect(() => {
//     if (charIdx < question.length) {
//       const t = setTimeout(() => setCharIdx((c) => c + 1), 40);
//       return () => clearTimeout(t);
//     }
//   }, [charIdx, question.length]);

//   return (
//     <div className="w-full max-w-3xl mx-auto px-4 flex flex-col gap-6">
//       <p className="text-white/40 uppercase tracking-[0.25em] text-xs font-semibold">
//         Contestant 1
//       </p>

//       <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-black/90 to-rose-950/50 backdrop-blur-sm p-8 sm:p-14 flex flex-col items-center gap-8 min-h-[280px] justify-center">
//         {/* Animated question */}
//         <div className="text-center">
//           <p className="text-white font-bold text-lg sm:text-2xl italic leading-relaxed min-h-[2.5rem]">
//             {question.slice(0, charIdx)}
//             {charIdx < question.length && (
//               <span className="inline-block w-0.5 h-6 bg-amber-400 align-middle animate-pulse ml-0.5" />
//             )}
//           </p>
//         </div>

//         <div className="flex flex-col items-center gap-2">
//           <SpinnerIcon />
//           <p className="text-white/35 text-sm uppercase tracking-widest">
//             Spectating the current duel…
//           </p>
//         </div>

//         <button
//           onClick={onReset}
//           className="text-white/20 hover:text-white/50 text-xs uppercase tracking-widest transition-colors underline underline-offset-4"
//         >
//           ← Back to lobby
//         </button>
//       </div>

//       {/* Active contestants strip */}
//       <div className="text-center">
//         <p className="text-white/30 text-xs uppercase tracking-widest mb-3">
//           Active Contestants
//         </p>
//         <div className="flex items-center justify-center flex-wrap gap-2">
//           {PARTICIPANTS.map((p, i) => (
//             <div key={p.id} className="relative">
//               <AvatarBubble initials={p.avatar} index={i} size="sm" ring />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Navigation Tabs ──────────────────────────────────────────────────────────
// function NavTabs({
//   current,
//   onChange,
// }: {
//   current: Screen;
//   onChange: (s: Screen) => void;
// }) {
//   const tabs: { id: Screen; label: string }[] = [
//     { id: "lobby", label: "Host Lobby" },
//     { id: "waiting", label: "Waiting Room" },
//     { id: "spectating", label: "Spectating" },
//   ];
//   return (
//     <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
//       {tabs.map((t) => (
//         <button
//           key={t.id}
//           onClick={() => onChange(t.id)}
//           className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
//             current === t.id
//               ? "bg-rose-600 text-white shadow-lg shadow-rose-900/60"
//               : "text-white/40 hover:text-white/70"
//           }`}
//         >
//           {t.label}
//         </button>
//       ))}
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function InternetBachelor() {
//   const [screen, setScreen] = useState<Screen>("lobby");

//   return (
//     <div className="">
//       {/* Ambient background */}

//       {/* Vignette */}
//       <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-transparent to-black/70 pointer-events-none" />

//       {/* ── Header ── */}

//       {/* Title on mobile */}
//       <div className=" text-center pt-18 relative ">
//         <h1 className="text-amber-400 font-extrabold text-2xl lg:text-4xl tracking-tight">
//           Internet Bachelor
//         </h1>
//         <p className="text-white uppercase text-2xl mt-2   font-semibold">
//           {screen === "lobby"
//             ? "Lobby"
//             : screen === "waiting"
//               ? "Waiting Room"
//               : "Live Duel"}
//         </p>
//       </div>

//       {/* ── Screen Nav ── */}
//       <div className="relative z-10 flex justify-center pt-5 pb-2 px-4">
//         <NavTabs current={screen} onChange={setScreen} />
//       </div>

//       {/* ── Main Content ── */}
//       <div className="relative z-10 flex flex-col items-center justify-center py-10 px-2 ">
//         <div className="w-full">
//           {screen === "lobby" && (
//             <LobbyScreen onStart={() => setScreen("waiting")} />
//           )}
//           {screen === "waiting" && (
//             <WaitingScreen onNext={() => setScreen("spectating")} />
//           )}
//           {screen === "spectating" && (
//             <SpectatingScreen onReset={() => setScreen("lobby")} />
//           )}
//         </div>
//       </div>

//       {/* Decorative rose petals */}
//       <div
//         className="fixed bottom-8 left-8 opacity-10 pointer-events-none hidden lg:block"
//         aria-hidden
//       >
//         <RoseIcon className="w-24 h-24" />
//       </div>
//       <div
//         className="fixed top-24 right-12 opacity-8 pointer-events-none hidden lg:block rotate-12"
//         aria-hidden
//       >
//         <RoseIcon className="w-16 h-16" />
//       </div>
//     </div>
//   );
// }

"use client";

import Button from "@/components/share/ButtonPrimary";
import Image from "next/image";
import RingImg from "@/assets/rings.png";
import { useState, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Screen = "lobby" | "waiting" | "spectating";

interface Participant {
  id: number;
  name: string;
  avatar: string;
  ready: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PARTICIPANTS: Participant[] = [
  { id: 1, name: "Savan Nguyen", avatar: "SN", ready: true },
  { id: 2, name: "Darrell Steward", avatar: "DS", ready: true },
  { id: 3, name: "Jane Cooper", avatar: "JC", ready: true },
  { id: 4, name: "Esther Howard", avatar: "EH", ready: true },
  { id: 5, name: "Jerome Bell", avatar: "JB", ready: true },
  { id: 6, name: "Annette Black", avatar: "AB", ready: true },
  { id: 7, name: "Ronald Richards", avatar: "RR", ready: true },
  { id: 8, name: "Eleanor Pena", avatar: "EP", ready: true },
];

const AVATAR_COLORS = [
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-sky-500 to-blue-600",
  "from-fuchsia-500 to-pink-600",
  "from-lime-500 to-green-600",
  "from-cyan-500 to-blue-600",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AvatarBubble({
  initials,
  index,
  size = "md",
  ring = false,
}: {
  initials: string;
  index: number;
  size?: "sm" | "md" | "lg";
  ring?: boolean;
}) {
  const sizeClasses = {
    sm: "w-9 h-9 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-base",
  };
  return (
    <div
      className={`
        ${sizeClasses[size]} rounded-full bg-gradient-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]}
        flex items-center justify-center font-bold text-white flex-shrink-0
        ${ring ? "ring-2 ring-amber-400/60 ring-offset-1 ring-offset-black" : ""}
        shadow-lg
      `}
    >
      {initials}
    </div>
  );
}

function RoseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="32" cy="28" rx="14" ry="16" fill="#e11d48" opacity="0.9" />
      <ellipse cx="22" cy="22" rx="9" ry="11" fill="#fb7185" opacity="0.7" />
      <ellipse cx="42" cy="22" rx="9" ry="11" fill="#fb7185" opacity="0.7" />
      <ellipse cx="32" cy="18" rx="8" ry="10" fill="#fda4af" opacity="0.6" />
      <rect x="30" y="40" width="4" height="18" fill="#15803d" rx="2" />
      <ellipse
        cx="26"
        cy="50"
        rx="8"
        ry="4"
        fill="#15803d"
        opacity="0.6"
        transform="rotate(-20 26 50)"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border-2 border-white/10" />
      <div className="absolute inset-0 rounded-full border-2 border-t-rose-500 border-r-amber-400 border-b-transparent border-l-transparent animate-spin" />
    </div>
  );
}

// ─── Screen 1: Host Lobby ─────────────────────────────────────────────────────
function LobbyScreen({ onStart }: { onStart: () => void }) {
  const readyCount = PARTICIPANTS.filter((p) => p.ready).length;

  return (
    <div className="flex flex-col lg:flex-row gap-5 w-full max-w-7xl mx-auto px-4">
      {/* Main card */}
      <div className="flex-1 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-black/80 to-rose-950/40 backdrop-blur-sm p-6 sm:p-10 flex flex-col items-center justify-center gap-6 min-h-[340px]">
        <div className="text-center">
          <p className="text-white/50 uppercase tracking-[0.3em] text-xs font-semibold mb-1">
            Status
          </p>
          <h2 className="text-white font-extrabold text-lg sm:text-xl tracking-widest uppercase mb-4">
            Waiting for Contestants{" "}
            <span className="text-amber-400">
              ({readyCount}/{PARTICIPANTS.length})
            </span>
          </h2>
        </div>

        {/* FIX: onClick={onStart} — was incorrectly written as onClick={() => onStart} */}
        <Button variant="game" onClick={onStart}>
          ▶ START GAME
        </Button>

        <p className="text-white/70 text-xs text-center max-w-xs mt-4">
          Minimum 2 players required for testing &nbsp;·&nbsp; 8 players
          required for the full game
        </p>

        <div>
          <Image
            src={RingImg}
            alt="rings"
            width={200}
            height={200}
            unoptimized
          />
        </div>
      </div>

      {/* Participants panel */}
      <div className="lg:w-72 rounded-2xl border border-amber-500/30 bg-black/60 backdrop-blur-sm p-5">
        <h3 className="text-white/40 uppercase tracking-[0.25em] text-base font-bold mb-4">
          Participants
        </h3>
        <ul className="space-y-2">
          {PARTICIPANTS.map((p, i) => (
            <li key={p.id} className="flex items-center gap-3 group">
              <AvatarBubble initials={p.avatar} index={i} size="sm" />
              <span className="flex-1 text-white/80 text-sm font-medium truncate group-hover:text-white transition-colors">
                {p.name}
              </span>
              {p.ready && (
                <span className="text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest">
                  Ready
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Screen 2: Contestant Waiting ─────────────────────────────────────────────
function WaitingScreen({ onNext }: { onNext: () => void }) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const t = setInterval(
      () => setDots((d) => (d.length >= 4 ? "." : d + ".")),
      500,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 flex flex-col gap-6">
      <p className="text-white/40 uppercase tracking-[0.25em] text-xs font-semibold">
        Contestant 1
      </p>

      <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-black/90 to-rose-950/50 backdrop-blur-sm p-8 sm:p-14 flex flex-col items-center gap-6 min-h-[300px] justify-center">
        {/* Stacked avatars */}
        <div className="flex items-center -space-x-3">
          {PARTICIPANTS.slice(0, 5).map((p, i) => (
            <div
              key={p.id}
              className="ring-2 ring-black rounded-full"
              style={{ zIndex: 10 - i }}
            >
              <AvatarBubble initials={p.avatar} index={i} size="sm" />
            </div>
          ))}
          <div className="w-9 h-9 rounded-full bg-white/10 ring-2 ring-black flex items-center justify-center text-white/50 text-xs font-bold">
            +{PARTICIPANTS.length - 5}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-white font-extrabold uppercase tracking-[0.2em] text-xl mb-1">
            Connected to Lobby
          </h2>
          <p className="text-white/40 text-sm">
            Waiting for the host to start the tournament{dots}
          </p>
        </div>

        {/* FIX: was using a plain <button> — replaced with Button component; onClick={onNext} correctly passed */}
        <Button onClick={onNext}>Let&apos;s Go{dots}</Button>
      </div>

      {/* Active contestants strip */}
      <div className="text-center">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-3">
          Active Contestants
        </p>
        <div className="flex items-center justify-center flex-wrap gap-2">
          {PARTICIPANTS.map((p, i) => (
            <div key={p.id} className="relative">
              <AvatarBubble initials={p.avatar} index={i} size="sm" ring />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen 3: Spectating Duel ────────────────────────────────────────────────
function SpectatingScreen({ onReset }: { onReset: () => void }) {
  const question = '"What is your deal-breaker?"';
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (charIdx < question.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 40);
      return () => clearTimeout(t);
    }
  }, [charIdx, question.length]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 flex flex-col gap-6">
      <p className="text-white/40 uppercase tracking-[0.25em] text-xs font-semibold">
        Contestant 1
      </p>

      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-black/90 to-rose-950/50 backdrop-blur-sm p-8 sm:p-14 flex flex-col items-center gap-8 min-h-[280px] justify-center">
        {/* Animated question */}
        <div className="text-center">
          <p className="text-white font-bold text-lg sm:text-2xl italic leading-relaxed min-h-[2.5rem]">
            {question.slice(0, charIdx)}
            {charIdx < question.length && (
              <span className="inline-block w-0.5 h-6 bg-amber-400 align-middle animate-pulse ml-0.5" />
            )}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <SpinnerIcon />
          <p className="text-white/35 text-sm uppercase tracking-widest">
            Spectating the current duel…
          </p>
        </div>

        {/* FIX: was using a plain <button> — replaced with Button component; onClick={onReset} correctly passed */}
        <Button onClick={onReset}>← Back to lobby</Button>
      </div>

      {/* Active contestants strip */}
      <div className="text-center">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-3">
          Active Contestants
        </p>
        <div className="flex items-center justify-center flex-wrap gap-2">
          {PARTICIPANTS.map((p, i) => (
            <div key={p.id} className="relative">
              <AvatarBubble initials={p.avatar} index={i} size="sm" ring />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Navigation Tabs ──────────────────────────────────────────────────────────
function NavTabs({
  current,
  onChange,
}: {
  current: Screen;
  onChange: (s: Screen) => void;
}) {
  const tabs: { id: Screen; label: string }[] = [
    { id: "lobby", label: "Host Lobby" },
    { id: "waiting", label: "Waiting Room" },
    { id: "spectating", label: "Spectating" },
  ];
  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
            current === t.id
              ? "bg-rose-600 text-white shadow-lg shadow-rose-900/60"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InternetBachelor() {
  const [screen, setScreen] = useState<Screen>("lobby");

  return (
    <div className="">
      {/* Vignette */}
      <div className=" bg-radial-[ellipse_at_center] from-transparent via-transparent to-black/70 pointer-events-none" />

      {/* ── Header ── */}
      <div className="text-center pt-18 relative">
        <h1 className="text-amber-400 font-extrabold text-2xl lg:text-4xl tracking-tight">
          Internet Bachelor
        </h1>
        <p className="text-white uppercase text-2xl mt-2 font-semibold">
          {screen === "lobby"
            ? "Lobby"
            : screen === "waiting"
              ? "Waiting Room"
              : "Live Duel"}
        </p>
      </div>

      {/* ── Screen Nav ── */}
      <div className="relative z-10 flex justify-center pt-5 pb-2 px-4">
        <NavTabs current={screen} onChange={setScreen} />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center py-10 px-2">
        <div className="w-full">
          {screen === "lobby" && (
            <LobbyScreen onStart={() => setScreen("waiting")} />
          )}
          {screen === "waiting" && (
            <WaitingScreen onNext={() => setScreen("spectating")} />
          )}
          {screen === "spectating" && (
            <SpectatingScreen onReset={() => setScreen("lobby")} />
          )}
        </div>
      </div>

      {/* Decorative rose petals */}
      <div
        className="fixed bottom-8 left-8 opacity-10 pointer-events-none hidden lg:block"
        aria-hidden
      >
        <RoseIcon className="w-24 h-24" />
      </div>
      <div
        className="fixed top-24 right-12 opacity-8 pointer-events-none hidden lg:block rotate-12"
        aria-hidden
      >
        <RoseIcon className="w-16 h-16" />
      </div>
    </div>
  );
}
