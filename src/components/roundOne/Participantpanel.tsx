// "use client";

// // ─── Types ────────────────────────────────────────────────────────────────────
// export interface Participant {
//   id: string;
//   name: string;
//   avatar: string;
//   ready: boolean;
//   isEliminated?: boolean;
//   isConnected?: boolean;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────
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

// // ─── AvatarBubble ─────────────────────────────────────────────────────────────
// function AvatarBubble({
//   initials,
//   index,
//   size = "sm",
//   dimmed = false,
// }: {
//   initials: string;
//   index: number;
//   size?: "sm" | "md" | "lg";
//   dimmed?: boolean;
// }) {
//   const sizeClasses = {
//     sm: "w-9 h-9 text-xs",
//     md: "w-11 h-11 text-sm",
//     lg: "w-14 h-14 text-base",
//   };

//   return (
//     <div
//       className={`
//         ${sizeClasses[size]} rounded-full bg-gradient-to-br
//         ${AVATAR_COLORS[index % AVATAR_COLORS.length]}
//         flex items-center justify-center font-bold text-white flex-shrink-0
//         ${dimmed ? "opacity-40 grayscale" : ""}
//         shadow-lg transition-all duration-300
//       `}
//     >
//       {initials}
//     </div>
//   );
// }

// // ─── ParticipantPanel ─────────────────────────────────────────────────────────
// export default function ParticipantPanel({
//   participants,
// }: {
//   participants: Participant[];
// }) {
//   return (
//     <div className="lg:w-72 rounded-2xl border border-amber-500/30 bg-black/60 backdrop-blur-sm p-5">
//       <h3 className="text-white/40 uppercase tracking-[0.25em] text-base font-bold mb-4">
//         Participants{" "}
//         <span className="text-amber-400/60 text-sm normal-case tracking-normal font-normal">
//           {participants.length}
//         </span>
//       </h3>

//       {participants.length === 0 ? (
//         <p className="text-white/30 text-sm italic">No participants yet</p>
//       ) : (
//         <ul className="space-y-2">
//           {participants.map((p, i) => (
//             <li key={p.id} className="flex items-center gap-3 group">
//               {/* Avatar with online dot */}
//               <div className="relative flex-shrink-0">
//                 <AvatarBubble
//                   initials={p.avatar}
//                   index={i}
//                   size="sm"
//                   dimmed={p.isEliminated}
//                 />
//                 {p.isConnected !== undefined && (
//                   <span
//                     className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-black ${
//                       p.isConnected ? "bg-emerald-400" : "bg-red-500"
//                     }`}
//                   />
//                 )}
//               </div>

//               {/* Name */}
//               <span
//                 className={`flex-1 text-sm font-medium truncate transition-colors ${
//                   p.isEliminated
//                     ? "text-white/30 line-through"
//                     : "text-white/80 group-hover:text-white"
//                 }`}
//               >
//                 {p.name}
//               </span>

//               {/* Status badge */}
//               {p.isEliminated ? (
//                 <span className="text-red-400/70 text-[12px] font-extrabold uppercase tracking-widest">
//                   Out
//                 </span>
//               ) : p.ready ? (
//                 <span className="text-green-400 text-[12px] font-extrabold uppercase tracking-widest">
//                   Ready
//                 </span>
//               ) : (
//                 <span className="text-white text-[12px] uppercase tracking-widest">
//                   join
//                 </span>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useSocket } from "@/hooks/useSocket";
// import { useState } from "react";

// // ─── Types ────────────────────────────────────────────────────────────────────
// export interface Participant {
//   id: string;
//   name: string;
//   avatar: string;
//   ready: boolean;
//   isEliminated?: boolean;
//   isConnected?: boolean;
// }

// interface ServerPlayer {
//   id: string;
//   socketId: string;
//   isEliminated: boolean;
//   isReady: boolean;
//   isConnected: boolean;
//   username?: string;
//   name?: string;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────
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

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function getInitials(name: string) {
//   return name
//     .split(" ")
//     .map((w) => w[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);
// }

// function mapServerPlayers(players: ServerPlayer[]): Participant[] {
//   return players.map((p) => {
//     const displayName = p.username ?? p.name ?? `Player ${p.id.slice(-4)}`;
//     return {
//       id: p.id,
//       name: displayName,
//       avatar: getInitials(displayName),
//       ready: p.isReady,
//       isEliminated: p.isEliminated,
//       isConnected: p.isConnected,
//     };
//   });
// }

// // ─── AvatarBubble ─────────────────────────────────────────────────────────────
// function AvatarBubble({
//   initials,
//   index,
//   size = "sm",
//   dimmed = false,
// }: {
//   initials: string;
//   index: number;
//   size?: "sm" | "md" | "lg";
//   dimmed?: boolean;
// }) {
//   const sizeClasses = {
//     sm: "w-9 h-9 text-xs",
//     md: "w-11 h-11 text-sm",
//     lg: "w-14 h-14 text-base",
//   };
//   return (
//     <div
//       className={`
//         ${sizeClasses[size]} rounded-full bg-gradient-to-br
//         ${AVATAR_COLORS[index % AVATAR_COLORS.length]}
//         flex items-center justify-center font-bold text-white flex-shrink-0
//         ${dimmed ? "opacity-40 grayscale" : ""}
//         shadow-lg transition-all duration-300
//       `}
//     >
//       {initials}
//     </div>
//   );
// }

// // ─── ParticipantPanel ─────────────────────────────────────────────────────────
// export default function ParticipantPanel() {
//   const [participants, setParticipants] = useState<Participant[]>([]);

//   useSocket({
//     GAME_EVENT: (payload) => {
//       if (payload.type === "PLAYERS_UPDATE" && Array.isArray(payload.payload)) {
//         setParticipants(mapServerPlayers(payload.payload as ServerPlayer[]));
//       }
//     },
//   });

//   const readyCount = participants.filter((p) => p.ready).length;

//   return (
//     <div className="lg:w-72 rounded-2xl border border-amber-500/30 bg-black/60 backdrop-blur-sm p-5">
//       <h3 className="text-white/40 uppercase tracking-[0.25em] text-base font-bold mb-4">
//         Participants{" "}
//         <span className="text-amber-400/60 text-sm normal-case tracking-normal font-normal">
//           {readyCount}/{participants.length} Ready
//         </span>
//       </h3>

//       {participants.length === 0 ? (
//         <p className="text-white/30 text-sm italic">Waiting for players…</p>
//       ) : (
//         <ul className="space-y-2">
//           {participants.map((p, i) => (
//             <li key={p.id} className="flex items-center gap-3 group">
//               <div className="relative flex-shrink-0">
//                 <AvatarBubble
//                   initials={p.avatar}
//                   index={i}
//                   size="sm"
//                   dimmed={p.isEliminated}
//                 />
//                 {p.isConnected !== undefined && (
//                   <span
//                     className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-black ${
//                       p.isConnected ? "bg-emerald-400" : "bg-red-500"
//                     }`}
//                   />
//                 )}
//               </div>

//               <span
//                 className={`flex-1 text-sm font-medium truncate transition-colors ${
//                   p.isEliminated
//                     ? "text-white/30 line-through"
//                     : "text-white/80 group-hover:text-white"
//                 }`}
//               >
//                 {p.name}
//               </span>

//               {p.isEliminated ? (
//                 <span className="text-red-400/70 text-[12px] font-extrabold uppercase tracking-widest">
//                   Out
//                 </span>
//               ) : p.ready ? (
//                 <span className="text-green-400 text-[12px] font-extrabold uppercase tracking-widest">
//                   Ready
//                 </span>
//               ) : (
//                 <span className="text-white/40 text-[12px] uppercase tracking-widest">
//                   Waiting
//                 </span>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

"use client";

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

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

// ... AvatarBubble, AVATAR_COLORS same as before ...
function AvatarBubble({
  initials,
  index,
  size = "sm",
  dimmed = false,
}: {
  initials: string;
  index: number;
  size?: "sm" | "md" | "lg";
  dimmed?: boolean;
}) {
  const sizeClasses = {
    sm: "w-9 h-9 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-base",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} rounded-full bg-gradient-to-br
        ${AVATAR_COLORS[index % AVATAR_COLORS.length]}
        flex items-center justify-center font-bold text-white flex-shrink-0
        ${dimmed ? "opacity-40 grayscale" : ""}
        shadow-lg transition-all duration-300
      `}
    >
      {initials}
    </div>
  );
}
export default function ParticipantPanel() {
  const participants = useSelector(
    (state: RootState) => state.participants.players,
  );
  const readyCount = participants.filter((p) => p.ready).length;

  return (
    <div className="lg:w-72 rounded-2xl border border-amber-500/30 bg-black/60 backdrop-blur-sm p-5">
      <h3 className="text-white/40 uppercase tracking-[0.25em] text-base font-bold mb-4">
        Participants{" "}
        <span className="text-amber-400/60 text-sm normal-case tracking-normal font-normal">
          {readyCount}/{participants.length} Ready
        </span>
      </h3>

      {participants.length === 0 ? (
        <p className="text-white/30 text-sm italic">Waiting for players…</p>
      ) : (
        <ul className="space-y-2">
          {participants.map((p, i) => (
            <li key={p.id} className="flex items-center gap-3 group">
              <div className="relative flex-shrink-0">
                <AvatarBubble
                  initials={p.avatar}
                  index={i}
                  size="sm"
                  dimmed={p.isEliminated}
                />
                {p.isConnected !== undefined && (
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-black ${p.isConnected ? "bg-emerald-400" : "bg-red-500"}`}
                  />
                )}
              </div>

              <span
                className={`flex-1 text-sm font-medium truncate transition-colors ${p.isEliminated ? "text-white/30 line-through" : "text-white/80 group-hover:text-white"}`}
              >
                {p.name}
              </span>

              {p.isEliminated ? (
                <span className="text-red-400/70 text-[12px] font-extrabold uppercase tracking-widest">
                  Out
                </span>
              ) : p.ready ? (
                <span className="text-green-400 text-[12px] font-extrabold uppercase tracking-widest">
                  Ready
                </span>
              ) : (
                <span className="text-white/40 text-[12px] uppercase tracking-widest">
                  Waiting
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
