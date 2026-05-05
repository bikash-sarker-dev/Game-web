/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { Video, PhoneOff } from "lucide-react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";

const ZEGO_APP_ID = 1697884864;
const ZEGO_SERVER_SECRET = "9ad294853be97ac5458a620f1b2c85a1";

type CallPhase =
  | "waiting"
  | "incoming"
  | "connecting"
  | "active"
  | "ended_by_host";

const GAME_ID = "internet-bachelor-123";

interface VideoCallRoundProps {
  sendEvent: (event: string, data: any, cb?: (res: any) => void) => void;
  incomingHostId: string | null;
  callKey: number; // increments on every INCOMING_CALL → show incoming screen
  callEndedKey: number; // increments on every CALL_ENDED   → reset to waiting
  gameId?: string;
}

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

    console.log("[PARTICIPANT] Joining ZegoRoom");
    console.log("  roomId  :", roomId);
    console.log("  userId  :", userId);
    console.log("  userName:", userName);

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
      style={{ width: "100%", height: "100%", minHeight: 400 }}
    />
  );
}

export default function VideoCallRound({
  sendEvent,
  incomingHostId,
  callKey,
  callEndedKey,
  gameId = GAME_ID,
}: VideoCallRoundProps) {
  const [callPhase, setCallPhase] = useState<CallPhase>("waiting");
  const [toast, setToast] = useState<string | null>(null);
  const toastRef = useRef<NodeJS.Timeout | null>(null);

  const currentUser = useSelector((state: any) => state.user.user);

  const roomId = `${currentUser?.id ?? ""}${gameId}`;
  const userId = currentUser?.id ?? `participant-${Date.now()}`;
  const userName = currentUser?.name ?? currentUser?.username ?? "Contestant";

  // ── New incoming call from host ───────────────────────────────────────────
  // callKey changes on every INCOMING_CALL, even same hostId
  useEffect(() => {
    if (!incomingHostId) return;
    setCallPhase("incoming");
  }, [callKey]);

  // ── Host ended the call ───────────────────────────────────────────────────
  // callEndedKey changes on every CALL_ENDED event from the server
  useEffect(() => {
    if (callEndedKey === 0) return; // ignore initial mount (value = 0)
    showToast("Host ended the call.");
    // Brief "ended" screen then back to waiting
    setCallPhase("ended_by_host");
    setTimeout(() => setCallPhase("waiting"), 2000);
  }, [callEndedKey]);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 3000);
  };

  const handleJoin = () => {
    showToast("Connecting to call…");
    sendEvent(
      "GAME_EVENT",
      { gameId, type: "ACCEPT_CALL", payload: {} },
      (res: any) => console.log("✅ ACCEPT_CALL ACK:", res),
    );
    setCallPhase("connecting");
    setTimeout(() => setCallPhase("active"), 800);
  };

  const handleDecline = () => {
    showToast("Call declined.");
    sendEvent(
      "GAME_EVENT",
      { gameId, type: "REJECT_CALL", payload: {} },
      (res: any) => console.log("✅ REJECT_CALL ACK:", res),
    );
    setTimeout(() => setCallPhase("waiting"), 1000);
  };

  const handleLeave = () => {
    showToast("Call ended. Returning to lobby…");
    setTimeout(() => setCallPhase("waiting"), 1500);
  };

  return (
    <div className="w-full flex flex-col rounded-2xl overflow-hidden border border-amber-500/20 bg-black/80 backdrop-blur-sm">
      {/* Status bar */}
      <div className="flex items-center px-5 py-3 border-b border-white/5 bg-white/[.025] gap-2.5">
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            callPhase === "waiting"
              ? "bg-amber-400 animate-pulse"
              : callPhase === "incoming"
                ? "bg-emerald-400 animate-ping"
                : callPhase === "connecting"
                  ? "bg-yellow-300 animate-pulse"
                  : callPhase === "ended_by_host"
                    ? "bg-red-500 animate-pulse"
                    : "bg-red-500"
          }`}
        />
        <span className="text-[11px] uppercase tracking-[.12em] text-white/40 font-medium">
          {callPhase === "waiting" && "Video Round · Awaiting call"}
          {callPhase === "incoming" && "Incoming call · Answer now"}
          {callPhase === "connecting" && "Connecting · Please wait…"}
          {callPhase === "active" && "Video call · In progress"}
          {callPhase === "ended_by_host" && "Call ended by host"}
        </span>
      </div>

      {/* Main area */}
      <div
        className="relative flex items-center justify-center overflow-hidden bg-[#080808]"
        style={{ minHeight: callPhase === "active" ? 420 : 360 }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[.035]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* WAITING */}
        {callPhase === "waiting" && (
          <div
            className="flex flex-col items-center gap-6 z-10 py-10"
            style={{ animation: "fadeUp .5s ease both" }}
          >
            <div className="relative w-24 h-24">
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className="absolute inset-0 rounded-full border border-amber-400/25"
                  style={{
                    animation: `zping 2.4s ease-out ${i * 0.7}s infinite`,
                  }}
                />
              ))}
              <div className="w-24 h-24 rounded-full bg-white/[.035] border border-amber-400/20 flex items-center justify-center">
                <Video size={32} className="text-amber-400/60" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-white/75 font-medium text-base mb-1">
                Waiting for your turn
              </p>
              <p className="text-white/20 text-xs uppercase tracking-widest">
                The host will call you when ready
              </p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-amber-400/50"
                  style={{
                    animation: `bounce 1.4s ease-in-out ${i * 0.25}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* INCOMING */}
        {callPhase === "incoming" && (
          <div
            className="flex flex-col items-center gap-8 z-10 py-10"
            style={{ animation: "fadeUp .4s ease both" }}
          >
            <div className="relative flex items-center justify-center w-28 h-28">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute rounded-full border border-emerald-400/20"
                  style={{
                    inset: `-${(i + 1) * 14}px`,
                    animation: `zping 1.8s ease-out ${i * 0.45}s infinite`,
                  }}
                />
              ))}
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-4xl font-bold text-white border-2 border-amber-300/40 relative z-10">
                H
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[.14em] text-white/25 mb-1.5">
                Incoming video call
              </p>
              <p className="text-white text-2xl font-semibold mb-0.5">
                The Host
              </p>
              <p className="text-white/25 text-xs">
                Internet Bachelor · Round 2
              </p>
            </div>
            <div className="flex items-end gap-14">
              <div className="flex flex-col items-center gap-2.5">
                <button
                  onClick={handleDecline}
                  className="w-14 h-14 rounded-full bg-red-500/90 hover:bg-red-500 active:scale-95 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] cursor-pointer"
                >
                  <PhoneOff size={20} className="text-white" />
                </button>
                <span className="text-[11px] text-white/25">Decline</span>
              </div>
              <div className="flex flex-col items-center gap-2.5">
                <button
                  onClick={handleJoin}
                  className="w-20 h-20 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.5)] cursor-pointer"
                  style={{ animation: "joinPulse 2s ease-in-out infinite" }}
                >
                  <Video size={28} className="text-white" />
                </button>
                <span className="text-[12px] text-white/45 font-medium">
                  Join call
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CONNECTING */}
        {callPhase === "connecting" && (
          <div
            className="flex flex-col items-center gap-5 z-10 py-10"
            style={{ animation: "fadeUp .3s ease both" }}
          >
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            <div className="text-center">
              <p className="text-white/65 text-sm font-medium mb-1">
                Connecting you to the host…
              </p>
              <p className="text-white/20 text-xs font-mono tracking-widest">
                Setting up video room…
              </p>
            </div>
          </div>
        )}

        {/* ACTIVE */}
        {callPhase === "active" && (
          <div
            className="absolute inset-0"
            style={{ animation: "fadeUp .4s ease both" }}
          >
            <ZegoRoom
              roomId={roomId}
              userId={userId}
              userName={userName}
              onLeave={handleLeave}
            />
          </div>
        )}

        {/* ENDED BY HOST */}
        {callPhase === "ended_by_host" && (
          <div
            className="flex flex-col items-center gap-5 z-10 py-10"
            style={{ animation: "fadeUp .3s ease both" }}
          >
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <PhoneOff size={32} className="text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-red-400 font-semibold text-base mb-1">
                Host ended the call
              </p>
              <p className="text-white/20 text-xs uppercase tracking-widest">
                Returning to lobby…
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="px-5 py-2.5 border-t border-amber-500/10 bg-amber-500/5"
          style={{ animation: "fadeUp .2s ease both" }}
        >
          <p className="text-amber-300/65 text-xs text-center">{toast}</p>
        </div>
      )}

      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes zping     { 0%{transform:scale(1);opacity:.55} 100%{transform:scale(1.9);opacity:0} }
        @keyframes joinPulse { 0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,.45)} 50%{box-shadow:0 0 0 16px rgba(52,211,153,0)} }
      `}</style>
    </div>
  );
}
