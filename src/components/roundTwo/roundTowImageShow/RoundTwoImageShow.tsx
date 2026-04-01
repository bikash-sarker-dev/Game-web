"use client";

import { useRouter } from "next/navigation";
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
  const [loading, setLoading] = useState(false);
  const required = 2;
  const router = useRouter();

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

  const handleRedirect = () => {
    setLoading(true);

    setTimeout(() => {
      router.push("/round-two/round-two-three");

      setTimeout(() => {
        router.push("/round-two/round-two-four");
      }, 3000);
    }, 3000);
  };

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
                {/* <button
                  disabled={remaining > 0}
                  onClick={() => router.push("/round-two/round-two-three")}
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
                </button> */}
                <button
                  disabled={remaining > 0}
                  onClick={handleRedirect}
                  className={`
    relative px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-base tracking-[0.25em] uppercase transition-all duration-500
    ${
      remaining === 0
        ? "bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white shadow-xl shadow-red-900/60 hover:shadow-red-700/70 hover:scale-105 active:scale-95 cursor-pointer animate-pulse"
        : "bg-gray-900/60 text-gray-600 border border-gray-800/50 cursor-not-allowed"
    }
  `}
                >
                  {loading
                    ? "Processing..."
                    : remaining > 0
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
