"use client";
import Button from "@/components/share/ButtonPrimary";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";

interface ServerPlayer {
  id: string;
  socketId: string;
  isEliminated: boolean;
  isReady: boolean;
  isConnected: boolean;
  username?: string;
  name?: string;
}

function QuesationShowAndAns() {
  const lobbyText = '"CONNECTED TO LOBBY"';
  const [charIdx, setCharIdx] = useState(0);
  const router = useRouter();
  const [participants, setParticipants] = useState<ServerPlayer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { sendEvent, isConnected } = useSocket({
    GAME_EVENT: (payload) => {
      console.log("🎮 Game Event received:", payload);

      if (payload.type === "PLAYERS_UPDATE" && Array.isArray(payload.payload)) {
        setParticipants(payload.payload);
      }

      if (payload.type === "NEW_QUESTION") {
        setCurrentQuestion(payload.payload.question);
        setAnswer("");
        setSubmitted(false);
      }
    },

    ROSE_GIVEN: (payload) => console.log("🌹 Rose given to:", payload.player),
    PLAYER_ELIMINATED: (payload) =>
      console.log("💔 Eliminated:", payload.player),
    GAME_ENDED: (payload) => console.log("🏁 Game Over:", payload),
  });

  useEffect(() => {
    if (!currentQuestion && charIdx < lobbyText.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 40);
      return () => clearTimeout(t);
    }
  }, [charIdx, lobbyText.length, currentQuestion]);

  const handleReady = () => {
    sendEvent(
      "GAME_EVENT",
      { gameId: "internet-bachelor-123", type: "PLAYER_READY", payload: {} },
      (response) => console.log("✅ Server ACK:", response),
    );
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;
    setSubmitting(true);

    sendEvent(
      "GAME_EVENT",
      {
        gameId: "internet-bachelor-123",
        type: "SUBMIT_DATA",
        payload: {
          data: {
            answer: answer.trim(),
          },
        },
      },
      (response) => {
        console.log("✅ Answer ACK:", response);
        setSubmitting(false);
        setSubmitted(true);
      },
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 flex flex-col gap-6">
      <p>Status: {isConnected() ? "🟢 Connected" : "🔴 Disconnected"}</p>
      <p className="text-white/40 uppercase tracking-[0.25em] text-xs font-semibold">
        Contestant 1
      </p>

      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-black/90 to-rose-950/50 backdrop-blur-sm p-8 sm:p-14 flex flex-col items-center gap-8 min-h-[280px] justify-center">
        {/* ── Question display ── */}
        <div className="text-center w-full">
          <p className="text-white font-bold text-lg sm:text-2xl italic leading-relaxed min-h-[3.5rem]">
            {currentQuestion ?? (
              <>
                {lobbyText.slice(0, charIdx)}
                {charIdx < lobbyText.length && (
                  <span className="inline-block w-0.5 h-6 bg-amber-400 align-middle animate-pulse ml-0.5" />
                )}
              </>
            )}
          </p>
        </div>

        {/* ── No question yet: waiting state ── */}
        {!currentQuestion && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-white text-sm uppercase tracking-widest">
              Waiting for the host to start the tournament
            </p>
            <p className="text-[#52C41A] text-2xl font-extrabold uppercase mt-3 tracking-widest flex items-center">
              I AM READY <Check size={36} />
            </p>
            <Button variant="game" onClick={handleReady}>
              ready
            </Button>
          </div>
        )}

        {/* ── Question received: answer input ── */}
        {currentQuestion && !submitted && (
          <div className="w-full max-w-xl flex flex-col gap-4">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here…"
              rows={4}
              className="w-full bg-black/40 border border-amber-500/30 rounded-2xl
                         resize-none p-4 text-sm sm:text-base text-zinc-200
                         placeholder:text-zinc-600 focus:outline-none
                         focus:border-amber-400/60 leading-relaxed transition-colors"
              style={{ fontFamily: "'Georgia', serif" }}
            />
            <div className="flex justify-end">
              <span
                className={`text-xs font-mono mr-auto mt-1 ${answer.length > 280 ? "text-red-400" : "text-zinc-600"}`}
              >
                {answer.length} / 300
              </span>
              <Button
                variant="game"
                onClick={handleSubmitAnswer}
                disabled={submitting || !answer.trim()}
              >
                {submitting ? (
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
                    Submitting…
                  </span>
                ) : (
                  "Submit Answer"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ── Submitted state ── */}
        {currentQuestion && submitted && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-[#52C41A] text-2xl font-extrabold uppercase tracking-widest flex items-center gap-2">
              ANSWER SUBMITTED <Check size={36} />
            </p>
            <p className="text-white/40 text-sm">Waiting for next question…</p>
          </div>
        )}
      </div>

      {/* Active contestants strip */}
      <div className="text-center">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-3">
          Active Contestants
        </p>
        <div className="flex items-center justify-center flex-wrap gap-2">
          {participants.map((p, i) => (
            <div
              key={p.id}
              className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 text-xs font-bold"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuesationShowAndAns;
