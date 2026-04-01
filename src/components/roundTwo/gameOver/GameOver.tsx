"use client";

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Player {
  id: number;
  name: string;
  avatar: string;
  isWinner: boolean;
}

interface GameOverScreenProps {
  players?: Player[];
  winnerName?: string;
  contestantLabel?: string;
  onPlayAgain?: () => void;
}

// ─── Default demo data ────────────────────────────────────────────────────────
const DEFAULT_PLAYERS: Player[] = [
  {
    id: 1,
    name: "Player 1",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=faces",
    isWinner: true,
  },
  {
    id: 7,
    name: "Player 7",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop&crop=faces",
    isWinner: false,
  },
];

// ─── Scoped style injection (runs once, uses unique ID) ───────────────────────
const STYLE_ID = "__game-over-screen-kf__";

function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  // ALL class names and keyframes are prefixed with "gos-" to avoid leaking
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@700&family=Rajdhani:wght@600;700&display=swap');

    @keyframes gos-crown-drop {
      0%   { opacity:0; transform:translateY(-55px) rotate(-8deg) scale(0.55); }
      65%  { transform:translateY(7px) rotate(3deg) scale(1.07); }
      85%  { transform:translateY(-3px) rotate(-1deg) scale(1.01); }
      100% { opacity:1; transform:translateY(0) rotate(0) scale(1); }
    }
    @keyframes gos-crown-float {
      0%,100% { transform:translateY(0) rotate(-1.5deg); }
      50%      { transform:translateY(-9px) rotate(1.5deg); }
    }
    @keyframes gos-fade-down {
      from { opacity:0; transform:translateY(-28px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes gos-fade-up {
      from { opacity:0; transform:translateY(22px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes gos-card-l {
      from { opacity:0; transform:translateX(-28px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes gos-card-r {
      from { opacity:0; transform:translateX(28px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes gos-winner-glow {
      0%,100% { box-shadow:0 0 28px rgba(255,160,0,0.18), inset 0 0 18px rgba(255,160,0,0.05); }
      50%      { box-shadow:0 0 55px rgba(255,160,0,0.38), inset 0 0 35px rgba(255,160,0,0.10); }
    }
    @keyframes gos-green-pulse {
      0%,100% { text-shadow:0 0 8px rgba(74,222,128,0.4); }
      50%      { text-shadow:0 0 24px rgba(74,222,128,0.9),0 0 48px rgba(74,222,128,0.3); }
    }
    @keyframes gos-conf {
      0%   { transform:translateY(-10px) rotate(0deg); opacity:1; }
      100% { transform:translateY(110vh) rotate(680deg); opacity:0; }
    }
    @keyframes gos-scan {
      0%   { top:-180px; }
      100% { top:100%; }
    }

    /* Scoped hover — never collide because of unique prefix */
    .gos-btn-replay:hover { background:rgba(255,255,255,0.09) !important; border-color:rgba(255,255,255,0.22) !important; }
    .gos-btn-stats:hover  { background:rgba(255,185,0,0.20) !important; box-shadow:0 5px 22px rgba(255,185,0,0.22) !important; }
    .gos-btn-crown:hover  { transform:translateY(-2px) !important; box-shadow:0 7px 26px rgba(185,40,40,0.5) !important; }
    .gos-card-winner      { animation:gos-winner-glow 3s ease-in-out infinite; }
  `;
  document.head.appendChild(s);
}

// ─── Crown SVG ────────────────────────────────────────────────────────────────
function CrownSVG() {
  return (
    <svg
      viewBox="0 0 100 72"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%",
        height: "100%",
        filter: "drop-shadow(0 0 14px rgba(255,200,0,0.55))",
      }}
    >
      <defs>
        <linearGradient id="gos-cg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE878" />
          <stop offset="45%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#A06800" />
        </linearGradient>
        <linearGradient id="gos-cg2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFBE0" stopOpacity="0.52" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M10 62 L16 24 L36 46 L50 8 L64 46 L84 24 L90 62Z"
        fill="url(#gos-cg1)"
        stroke="#8B6000"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M10 62 L16 24 L36 46 L50 8 L64 46 L84 24 L90 62Z"
        fill="url(#gos-cg2)"
      />
      <rect
        x="10"
        y="60"
        width="80"
        height="11"
        rx="3"
        fill="url(#gos-cg1)"
        stroke="#8B6000"
        strokeWidth="0.8"
      />
      <circle
        cx="50"
        cy="65"
        r="4"
        fill="#E84040"
        stroke="#AA0000"
        strokeWidth="0.6"
      />
      <circle
        cx="26"
        cy="65"
        r="3"
        fill="#4488FF"
        stroke="#0033CC"
        strokeWidth="0.6"
      />
      <circle
        cx="74"
        cy="65"
        r="3"
        fill="#44CC77"
        stroke="#007733"
        strokeWidth="0.6"
      />
      <circle
        cx="50"
        cy="9"
        r="3"
        fill="#E84040"
        stroke="#AA0000"
        strokeWidth="0.6"
      />
      <ellipse
        cx="37"
        cy="34"
        rx="6"
        ry="3.5"
        fill="white"
        fillOpacity="0.17"
        transform="rotate(-22 37 34)"
      />
    </svg>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti() {
  const colors = [
    "#FFD700",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FF9FF3",
    "#FFEAA7",
  ];
  const items = Array.from({ length: 22 }, (_, i) => ({
    left: `${(i * 4.55 + Math.sin(i * 1.3) * 10 + 50) % 100}%`,
    color: colors[i % colors.length],
    size: 5 + (i % 4),
    dur: `${3.5 + (i % 5) * 0.65}s`,
    delay: `${(i * 0.28) % 4.5}s`,
    isCircle: i % 3 !== 0,
  }));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 3,
      }}
    >
      {items.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: -12,
            left: c.left,
            width: c.size,
            height: c.size,
            borderRadius: c.isCircle ? "50%" : "2px",
            background: c.color,
            animation: `gos-conf ${c.dur} linear ${c.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Player Card ──────────────────────────────────────────────────────────────
function PlayerCard({ player, index }: { player: Player; index: number }) {
  const w = player.isWinner;

  return (
    <div
      className={w ? "gos-card-winner" : undefined}
      style={{
        flex: "1 1 300px",
        maxWidth: 400,
        borderRadius: 16,
        overflow: "hidden",
        padding: "16px 16px 18px",
        position: "relative",
        boxSizing: "border-box",
        border: w
          ? "1.5px solid rgba(255,165,0,0.48)"
          : "1px solid rgba(255,255,255,0.07)",
        background: w ? "rgba(255,150,0,0.06)" : "rgba(255,255,255,0.02)",
        filter: w ? "none" : "brightness(0.58) saturate(0.5)",
        animation:
          index === 0
            ? "gos-card-l 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.55s both"
            : "gos-card-r 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.72s both",
      }}
    >
      {/* Gold corner accents — winner card only */}
      {w &&
        [
          {
            top: 10,
            left: 10,
            borderWidth: "2px 0 0 2px",
            borderRadius: "3px 0 0 0",
          },
          {
            top: 10,
            right: 10,
            borderWidth: "2px 2px 0 0",
            borderRadius: "0 3px 0 0",
          },
          {
            bottom: 10,
            left: 10,
            borderWidth: "0 0 2px 2px",
            borderRadius: "0 0 0 3px",
          },
          {
            bottom: 10,
            right: 10,
            borderWidth: "0 2px 2px 0",
            borderRadius: "0 0 3px 0",
          },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 14,
              height: 14,
              zIndex: 5,
              border: `${c.borderWidth} solid rgba(255,185,0,0.72)`,
              //   borderRadius: c.borderRadius,
              ...c,
            }}
          />
        ))}

      {/* Label */}
      <p
        style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: 10,
          letterSpacing: "0.28em",
          color: "rgba(200,200,200,0.6)",
          textAlign: "center",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        {player.name}
      </p>

      {/* Photo */}
      <div
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          aspectRatio: "4/3",
          marginBottom: 14,
          background: "#1a1a28",
        }}
      >
        <img
          src={player.avatar}
          alt={player.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
            filter: w ? "none" : "grayscale(0.35) brightness(0.72)",
          }}
          onError={(e: any) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: w
              ? "linear-gradient(to top, rgba(90,50,0,0.28) 0%, transparent 55%)"
              : "rgba(0,0,0,0.38)",
          }}
        />
      </div>

      {/* Button */}
      <button
        className={w ? "gos-btn-crown" : undefined}
        disabled={!w}
        style={{
          display: "block",
          width: "100%",
          fontFamily: "'Bebas Neue', sans-serif",
          letterSpacing: "0.22em",
          fontSize: 13,
          color: "white",
          borderRadius: 8,
          padding: "9px 0",
          cursor: w ? "pointer" : "not-allowed",
          border: w
            ? "1px solid rgba(220,90,80,0.45)"
            : "1px solid rgba(100,70,0,0.35)",
          background: w
            ? "linear-gradient(135deg,#7A0000 0%,#B8292B 50%,#7A0000 100%)"
            : "linear-gradient(135deg,#2a1a00 0%,#3e2800 50%,#2a1a00 100%)",
          opacity: w ? 1 : 0.5,
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        ♛ &nbsp;Crown Winner
      </button>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function GameOverScreen({
  players = DEFAULT_PLAYERS,
  winnerName,
  contestantLabel = "Contestant 2",
  onPlayAgain,
}: GameOverScreenProps) {
  const [ready, setReady] = useState(false);
  const winner = players.find((p) => p.isWinner);
  const displayWinner = winnerName ?? winner?.name ?? "—";

  useEffect(() => {
    injectStyles();
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    // Wrapper: self-contained block, touches nothing outside itself
    <div
    //   style={{
    //     position: "relative",
    //     width: "100%",
    //     minHeight: "100vh",
    //     overflow: "hidden",
    //     display: "flex",
    //     flexDirection: "column",
    //     background: `
    //     radial-gradient(ellipse at 25% 15%, rgba(110,15,15,0.52) 0%, transparent 52%),
    //     radial-gradient(ellipse at 78% 82%, rgba(15,15,80,0.42) 0%, transparent 52%),
    //     linear-gradient(160deg, #090910 0%, #0E0E1C 50%, #0A0A13 100%)
    //   `,
    //     fontFamily: "'Rajdhani', sans-serif",
    //     boxSizing: "border-box",
    //   }}
    >
      {/* Scanline */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: "100%",
          height: 180,
          background:
            "linear-gradient(transparent,rgba(255,255,255,0.024) 50%,transparent)",
          pointerEvents: "none",
          zIndex: 2,
          animation: "gos-scan 7s linear infinite",
        }}
      />

      {/* Confetti */}
      {ready && <Confetti />}

      {/* ── Body ── */}
      <div
        style={{
          position: "relative",
          marginTop: "20px",
          zIndex: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px 40px",
          boxSizing: "border-box",
        }}
      >
        {/* Crown */}
        <div
          style={{
            width: 110,
            height: 78,
            position: "relative",
            marginBottom: -6,
            animation: ready
              ? "gos-crown-drop 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.08s both, gos-crown-float 3.5s ease-in-out 1s infinite"
              : "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -22,
              background:
                "radial-gradient(circle,rgba(255,200,0,0.22) 0%,transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
          <CrownSVG />
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(52px, 11vw, 76px)",
            letterSpacing: "0.12em",
            background: "linear-gradient(180deg,#FFFFFF 0%,#BBBBBB 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: "10px 0 4px",
            lineHeight: 1,
            animation: ready
              ? "gos-fade-down 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.22s both"
              : "none",
          }}
        >
          Game Over
        </h1>

        {/* Winner */}
        <p
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(11px,2.4vw,15px)",
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "#4ADE80",
            marginBottom: 28,
            animation: ready
              ? "gos-fade-up 0.6s ease 0.42s both, gos-green-pulse 2s ease-in-out 1s infinite"
              : "none",
          }}
        >
          ✦ &nbsp;Winner: {displayWinner}&nbsp; ✦
        </p>

        {/* Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
            width: "100%",
            maxWidth: 820,
            alignItems: "stretch",
            justifyContent: "center",
            position: "relative",
            flexWrap: "wrap",
            animation: ready ? "gos-fade-up 0.6s ease 0.6s both" : "none",
          }}
        >
          {/* VS badge */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              zIndex: 20,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#08080F",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 5px rgba(8,8,15,0.85)",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 13,
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              VS
            </span>
          </div>

          {players.map((p, i) => (
            <PlayerCard key={p.id} player={p} index={i} />
          ))}
        </div>

        {/* Actions */}
        {/* Actions */}
        <div
          className={`flex gap-3 mt-7 flex-wrap justify-center ${
            ready ? "animate-[gos-fade-up_0.6s_ease_1.1s_both]" : ""
          }`}
        >
          {/* Play Again */}
          <button
            onClick={onPlayAgain}
            className="font-[Rajdhani] font-bold tracking-[0.18em] text-[12px] uppercase px-7 py-2.5 rounded-[10px] 
               border border-white/10 bg-white/5 text-white/70 
               hover:bg-white/10 hover:border-white/20 
               transition-all duration-200 cursor-pointer"
          >
            ↺ &nbsp;Play Again
          </button>

          {/* View Stats */}
          <button
            className="font-[Rajdhani] font-bold tracking-[0.18em] text-[12px] uppercase px-7 py-2.5 rounded-[10px] 
               border border-yellow-400/30 bg-yellow-400/10 text-yellow-300 
               hover:bg-yellow-400/20 hover:shadow-[0_0_12px_rgba(255,185,0,0.4)] 
               transition-all duration-200 cursor-pointer"
          >
            ✦ &nbsp;View Stats
          </button>
        </div>
      </div>

      {/* Bottom accent */}
      <div
        style={{
          height: 1,
          width: "100%",
          position: "relative",
          zIndex: 10,
          background:
            "linear-gradient(90deg,transparent,rgba(180,40,40,0.4),transparent)",
        }}
      />
    </div>
  );
}
