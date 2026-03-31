"use client";

import Button from "@/components/share/ButtonPrimary";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Participant {
  id: number;
  name: string;
  avatar: string;
  status: "READY" | "WAITING" | "OFFLINE";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PARTICIPANTS: Participant[] = [
  { id: 1, name: "Savan Nguyen", avatar: "SN", status: "READY" },
  { id: 2, name: "Darrell Steward", avatar: "DS", status: "READY" },
  { id: 3, name: "Jane Cooper", avatar: "JC", status: "READY" },
  { id: 4, name: "Esther Howard", avatar: "EH", status: "READY" },
  { id: 5, name: "Jerome Bell", avatar: "JB", status: "READY" },
  { id: 6, name: "Annette Black", avatar: "AB", status: "READY" },
  { id: 7, name: "Ronald Richards", avatar: "RR", status: "READY" },
  { id: 8, name: "Eleanor Pena", avatar: "EP", status: "READY" },
];

const AVATAR_COLORS: Record<number, string> = {
  1: "from-orange-400 to-rose-500",
  2: "from-sky-400 to-indigo-500",
  3: "from-emerald-400 to-teal-500",
  4: "from-violet-400 to-purple-500",
  5: "from-amber-400 to-orange-500",
  6: "from-pink-400 to-rose-500",
  7: "from-cyan-400 to-blue-500",
  8: "from-lime-400 to-green-500",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Participant["status"] }) {
  const colors = {
    READY: "text-emerald-400 bg-emerald-400/10 border border-emerald-400/30",
    WAITING: "text-amber-400  bg-amber-400/10  border border-amber-400/30",
    OFFLINE: "text-zinc-500   bg-zinc-500/10   border border-zinc-500/30",
  };
  return (
    <span
      className={`text-[10px] sm:text-xs font-bold tracking-widest px-2 py-0.5 rounded-full ${colors[status]}`}
    >
      {status}
    </span>
  );
}

function ParticipantRow({ p, index }: { p: Participant; index: number }) {
  return (
    <div
      className="flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-200
                 hover:bg-white/5 group cursor-default"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Avatar */}
      <div
        className={`relative flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full
                    bg-gradient-to-br ${AVATAR_COLORS[p.id]}
                    flex items-center justify-center text-white text-xs font-bold
                    ring-2 ring-white/10 group-hover:ring-white/20 transition-all`}
      >
        {p.avatar}
        {/* Online dot */}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#1a0a0a]" />
      </div>

      {/* Name */}
      <span className="flex-1 text-sm sm:text-[15px] font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
        {p.name}
      </span>

      {/* Status */}
      <StatusBadge status={p.status} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Questions() {
  const [question, setQuestion] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    if (!question.trim()) return;

    setSending(true);

    try {
      // 👉 simulate API call
      await new Promise((res) => setTimeout(res, 1000));

      setSending(false);
      setSent(true);

      // 👉 show success message for 1.5s
      setTimeout(() => {
        router.push("/round/two");
      }, 1500);
    } catch (error) {
      console.error(error);
      setSending(false);
    }
  };

  const readyCount = PARTICIPANTS.filter((p) => p.status === "READY").length;

  return (
    /* ── Page shell ── */
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start
                 overflow-hidden"
      //   style={{
      //     backgroundImage: `
      //       radial-gradient(ellipse 80% 50% at 20% 30%, rgba(180,20,20,0.18) 0%, transparent 70%),
      //       radial-gradient(ellipse 60% 40% at 80% 70%, rgba(120,10,10,0.15) 0%, transparent 70%),
      //       radial-gradient(ellipse 40% 60% at 50% 10%, rgba(200,30,30,0.08) 0%, transparent 60%)
      //     `,
      //   }}
    >
      {/* ── Top bar ── */}
      <header className="w-full max-w-7xl px-4 sm:px-6 pt-5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400/80 text-xs font-semibold tracking-widest uppercase">
            Live
          </span>
        </div>
        <div className="text-zinc-600 text-xs">
          {readyCount}/{PARTICIPANTS.length} Ready
        </div>
      </header>

      {/* ── Hero title ── */}
      <div className="w-full max-w-6xl px-4 sm:px-6 pt-6 pb-8 text-center">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.15em] uppercase
                     text-white drop-shadow-[0_0_30px_rgba(220,38,38,0.4)]"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.12em" }}
        >
          Round 1 — Questions
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 tracking-widest uppercase font-medium">
          Next Match-Up: <span className="text-red-400 font-bold">P1</span>
          <span className="text-zinc-500 mx-1">vs</span>
          <span className="text-red-400 font-bold">P2</span>
        </p>

        {/* Decorative divider */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="h-px w-16 sm:w-32 bg-gradient-to-r from-transparent to-red-700/60" />
          <div className="w-1.5 h-1.5 rotate-45 bg-red-600" />
          <div className="h-px w-16 sm:w-32 bg-gradient-to-l from-transparent to-red-700/60" />
        </div>
      </div>

      {/* ── Main content grid ── */}
      <main
        className="w-full max-w-7xl px-4 sm:px-6 pb-12
                   grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]
                   gap-5 sm:gap-6"
      >
        {/* ── Left: Question panel ── */}
        <section className="flex flex-col gap-5">
          {/* Textarea card */}
          <div
            className="relative rounded-2xl overflow-hidden
                       border border-red-800/50 bg-black/30 backdrop-blur-sm
                       shadow-[0_0_40px_rgba(180,20,20,0.12)]"
          >
            {/* Glowing top edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Write your question here…"
              rows={6}
              className="w-full bg-transparent resize-none p-5 sm:p-6 text-sm sm:text-base
                         text-zinc-200 placeholder:text-zinc-600
                         focus:outline-none leading-relaxed"
              style={{ fontFamily: "'Georgia', serif" }}
            />

            {/* Character count */}
            <div className="px-5 sm:px-6 pb-3 flex justify-end">
              <span
                className={`text-xs font-mono transition-colors ${
                  question.length > 280 ? "text-red-400" : "text-zinc-600"
                }`}
              >
                {question.length} / 300
              </span>
            </div>
          </div>

          {/* Send button */}
          <div className="flex justify-center">
            <Button
              variant="game"
              onClick={handleSend}
              disabled={sending || !question.trim()}
            >
              {sending ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="20 40"
                    />
                  </svg>
                  Sending…
                </span>
              ) : sent ? (
                "✓ Sent to Contestants!"
              ) : (
                "Send to Contestants"
              )}
            </Button>
          </div>

          {/* Info cards row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
            {[
              { label: "Round", value: "1 of 5" },
              { label: "Time", value: "02:00" },
              { label: "Points", value: "100 pts" },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-white/5 bg-white/3 backdrop-blur-sm
                           p-3 sm:p-4 flex flex-col gap-1 text-center"
              >
                <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest">
                  {card.label}
                </span>
                <span className="text-base sm:text-lg font-bold text-zinc-200">
                  {card.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Right: Participants panel ── */}
        <aside
          className="rounded-2xl border border-orange-900/40
                     bg-gradient-to-b from-[#1c0c06]/80 to-[#130806]/80
                     backdrop-blur-sm overflow-hidden
                     shadow-[0_0_40px_rgba(180,60,20,0.1)]"
        >
          {/* Glowing top edge */}
          <div className="h-px bg-gradient-to-r from-transparent via-orange-700/50 to-transparent" />

          {/* Header */}
          <div className="px-4 sm:px-5 pt-5 pb-3 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black tracking-[0.18em] uppercase text-zinc-100">
              Participants
            </h2>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
              {readyCount} Ready
            </span>
          </div>

          {/* Divider */}
          <div className="mx-4 sm:mx-5 h-px bg-white/5 mb-2" />

          {/* List */}
          <div className="px-2 sm:px-3 pb-4 flex flex-col">
            {PARTICIPANTS.map((p, i) => (
              <ParticipantRow key={p.id} p={p} index={i} />
            ))}
          </div>

          {/* Bottom glow */}
          <div className="h-px bg-gradient-to-r from-transparent via-orange-800/40 to-transparent" />
        </aside>
      </main>

      {/* ── Bottom bar ── */}
      <footer className="w-full max-w-6xl px-4 sm:px-6 pb-6 flex items-center justify-center">
        <p className="text-zinc-700 text-xs tracking-widest">
          QUIZ SHOW — HOST CONTROL PANEL
        </p>
      </footer>
    </div>
  );
}
