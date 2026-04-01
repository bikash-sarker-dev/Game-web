"use client";

import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Player {
  id: number;
  label: string;
  image: string;
  bgColor: string;
}

interface Participant {
  id: number;
  name: string;
  avatar: string;
  status: "READY" | "OUT";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const players: Player[] = [
  {
    id: 1,
    label: "PLAYER 1",
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=480&fit=crop&crop=face",
    bgColor: "#1a6abf",
  },
  {
    id: 7,
    label: "PLAYER 7",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=480&fit=crop&crop=face",
    bgColor: "#2a2a2a",
  },
];

const participants: Participant[] = [
  {
    id: 1,
    name: "Savan Nguyen",
    avatar: "https://i.pravatar.cc/40?img=11",
    status: "READY",
  },
  {
    id: 2,
    name: "Darrell Steward",
    avatar: "https://i.pravatar.cc/40?img=12",
    status: "OUT",
  },
  {
    id: 3,
    name: "Esther Howard",
    avatar: "https://i.pravatar.cc/40?img=13",
    status: "READY",
  },
  {
    id: 4,
    name: "Jerome Bell",
    avatar: "https://i.pravatar.cc/40?img=14",
    status: "OUT",
  },
  {
    id: 5,
    name: "Annette Black",
    avatar: "https://i.pravatar.cc/40?img=15",
    status: "READY",
  },
  {
    id: 6,
    name: "Ronald Richards",
    avatar: "https://i.pravatar.cc/40?img=16",
    status: "OUT",
  },
  {
    id: 7,
    name: "Eleanor Pena",
    avatar: "https://i.pravatar.cc/40?img=17",
    status: "READY",
  },
];

// ─── PlayerCard ───────────────────────────────────────────────────────────────
function PlayerCard({
  player,
  selected,
  onCrown,
}: {
  player: Player;
  selected: boolean;
  onCrown: (id: number) => void;
}) {
  return (
    <div
      className={`
        relative flex flex-col rounded-2xl overflow-hidden border-2 transition-all duration-500
        ${
          selected
            ? "border-red-500 shadow-[0_0_40px_rgba(220,38,38,0.6)] scale-[1.02]"
            : "border-orange-800/60 hover:border-orange-500/80 hover:shadow-[0_0_20px_rgba(249,115,22,0.25)]"
        }
        bg-gradient-to-b from-neutral-900/80 to-black/90 backdrop-blur-sm
      `}
    >
      {/* Player label */}
      <div className="text-center py-3 px-4">
        <span className="text-white text-xs font-black tracking-[0.3em] uppercase">
          {player.label}
        </span>
      </div>

      {/* Photo */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <img
          src={player.image}
          alt={player.label}
          className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
          style={{ backgroundColor: player.bgColor }}
        />
        {/* Red scan line effect on selected */}
        {selected && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent animate-pulse pointer-events-none" />
        )}
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Crown button */}
      <div className="p-4 flex justify-center">
        <button
          onClick={() => onCrown(player.id)}
          className={`
            relative px-6 py-2.5 text-xs font-black tracking-[0.2em] uppercase rounded
            transition-all duration-300 overflow-hidden
            ${
              selected
                ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.8)] scale-105"
                : "bg-red-700 text-white hover:bg-red-600 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]"
            }
          `}
        >
          <span className="relative z-10">CROWN WINNER</span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-600 opacity-50" />
        </button>
      </div>
    </div>
  );
}

// ─── ParticipantRow ───────────────────────────────────────────────────────────
function ParticipantRow({ participant }: { participant: Participant }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-1 border-b border-white/5 last:border-0 group">
      <div className="relative flex-shrink-0">
        <img
          src={participant.avatar}
          alt={participant.name}
          className={`w-9 h-9 rounded-full object-cover ring-2 transition-all duration-300 ${
            participant.status === "READY"
              ? "ring-green-500/60 group-hover:ring-green-400"
              : "ring-red-700/40 grayscale opacity-60"
          }`}
        />
        {participant.status === "OUT" && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <span className="text-red-400 text-[8px] font-black">✕</span>
          </div>
        )}
      </div>
      <span
        className={`flex-1 text-sm font-semibold tracking-wide ${
          participant.status === "OUT"
            ? "text-neutral-500 line-through"
            : "text-white/90"
        }`}
      >
        {participant.name}
      </span>
      <span
        className={`text-[10px] font-black tracking-[0.2em] ${
          participant.status === "READY" ? "text-green-400" : "text-red-500"
        }`}
      >
        {participant.status}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GrandFinale() {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleCrown = (id: number) => {
    setSelected((prev) => (prev === id ? null : id));
    setConfirmed(false);
  };

  const handleNeither = () => {
    setSelected(null);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    if (selected !== null) setConfirmed(true);
  };

  const readyCount = participants.filter((p) => p.status === "READY").length;

  return (
    <div className="min-h-screen w-full max-w-7xl  mx-auto relative overflow-hidden font-sans ">
      {/* ── Cinematic background ── */}

      {/* ── Top bar ── */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-red-900/30">
        <span className="text-white/80 text-sm font-semibold tracking-widest uppercase">
          Contestant 2
        </span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
            Live
          </span>
        </div>
      </div>

      {/* ── Page content ── */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* ── Title ── */}
        <div className="text-center mb-8 lg:mb-12 space-y-2">
          <h1 className="text-3xl sm:text-4xl  font-black tracking-[0.15em] uppercase text-white drop-shadow-[0_0_30px_rgba(220,38,38,0.4)]">
            The Grand Finale
          </h1>
          <p className="text-red-500 text-xs sm:text-sm font-black tracking-[0.4em] uppercase animate-pulse">
            Eliminate Down to 2
          </p>
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="h-px w-16 sm:w-32 bg-gradient-to-r from-transparent to-red-700" />
            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <div className="h-px w-16 sm:w-32 bg-gradient-to-l from-transparent to-red-700" />
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] gap-4 lg:gap-6">
          {/* ── Player cards + Neither ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  selected={selected === player.id}
                  onCrown={handleCrown}
                />
              ))}
            </div>

            {/* Choose Neither + Confirm */}
            <div className="flex flex-col sm:flex-row gap-3 rounded-xl border border-orange-900/40 bg-black/40 backdrop-blur-sm p-4">
              <button
                onClick={handleNeither}
                className="flex-1 py-3 px-6 text-xs font-black tracking-[0.25em] uppercase rounded-lg
                  border border-red-700/60 bg-red-900/20 text-red-400
                  hover:bg-red-800/30 hover:border-red-500 hover:text-red-300
                  transition-all duration-300 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                Choose Neither
              </button>

              {selected !== null && (
                <button
                  onClick={handleConfirm}
                  className={`
                    flex-1 py-3 px-6 text-xs font-black tracking-[0.25em] uppercase rounded-lg
                    transition-all duration-300
                    ${
                      confirmed
                        ? "bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)] cursor-default"
                        : "bg-gradient-to-r from-red-700 to-red-600 text-white hover:from-red-600 hover:to-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                    }
                  `}
                >
                  {confirmed ? "✓ Vote Submitted!" : "Confirm Vote"}
                </button>
              )}
            </div>

            {/* Status bar */}
            {selected !== null && !confirmed && (
              <div className="text-center">
                <p className="text-orange-400/80 text-xs font-semibold tracking-widest uppercase animate-pulse">
                  You selected{" "}
                  <span className="text-white font-black">
                    Player {selected}
                  </span>{" "}
                  — confirm your vote above
                </p>
              </div>
            )}
          </div>

          {/* ── Participants sidebar ── */}
          <div className="rounded-2xl border border-orange-900/50 bg-black/60 backdrop-blur-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-white font-black text-sm tracking-[0.25em] uppercase">
                Participants
              </h2>
              <span className="text-[10px] text-white/50 font-bold tracking-wider">
                {readyCount}/{participants.length} Active
              </span>
            </div>

            <div className="px-4 py-2 divide-y divide-white/5">
              {participants.map((p) => (
                <ParticipantRow key={p.id} participant={p} />
              ))}
            </div>

            {/* Ready count progress */}
            <div className="px-4 py-4 border-t border-white/10">
              <div className="flex justify-between text-[10px] font-bold tracking-wider text-white/40 uppercase mb-2">
                <span>Votes cast</span>
                <span>{readyCount} ready</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-700"
                  style={{
                    width: `${(readyCount / participants.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirmed overlay ── */}
      {confirmed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setConfirmed(false)}
        >
          <div className="text-center space-y-4 p-8 rounded-2xl border border-red-500/50 bg-black/80 max-w-sm mx-4 shadow-[0_0_60px_rgba(220,38,38,0.4)]">
            <div className="text-5xl">👑</div>
            <h3 className="text-white text-2xl font-black tracking-widest uppercase">
              Vote Cast!
            </h3>
            <p className="text-white/60 text-sm">
              You crowned{" "}
              <span className="text-red-400 font-black">Player {selected}</span>{" "}
              as the winner.
            </p>
            <p className="text-white/30 text-xs tracking-widest uppercase">
              Tap anywhere to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
