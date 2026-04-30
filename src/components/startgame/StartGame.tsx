/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useEffect, useRef } from "react";
// import Cookies from "js-cookie";

// const StartGame: React.FC = () => {
//   const socketRef = useRef<WebSocket | null>(null);

//   const token = Cookies.get("token");
//   useEffect(() => {
//     const container = document.getElementById("particles");
//     if (!container) return;

//     for (let i = 0; i < 28; i++) {
//       const p = document.createElement("div");
//       const size = Math.random() * 4 + 2;

//       p.style.position = "absolute";
//       p.style.width = `${size}px`;
//       p.style.height = `${size}px`;
//       p.style.borderRadius = "50%";
//       p.style.left = `${Math.random() * 100}%`;
//       p.style.top = `${Math.random() * 100}%`;
//       p.style.background = "radial-gradient(circle,#FFE566,#FF8C00)";
//       p.style.boxShadow = `0 0 ${size * 2}px #FFD700`;
//       p.style.opacity = String(0.25 + Math.random() * 0.55);
//       p.style.animation = `floatParticle ${4 + Math.random() * 7}s ease-in-out infinite`;
//       p.style.animationDelay = `${Math.random() * 5}s`;

//       container.appendChild(p);
//     }
//   }, []);

//   useEffect(() => {
//     if (!token) return;

//     const socket = new WebSocket(`ws://206.162.244.134:5040?token=${token}`);

//     socketRef.current = socket;

//     socket.onopen = () => {
//       console.log("✅ Socket Connected");
//     };

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("📩 Server:", data);

//       // HANDLE EVENTS HERE
//       if (data.type === "GAME_STARTED") {
//         alert("Game Started!");
//       }

//       if (data.type === "PLAYERS_UPDATE") {
//         console.log("Players:", data.payload);
//       }
//     };

//     socket.onclose = () => {
//       console.log("❌ Socket Disconnected");
//     };

//     return () => {
//       socket.close();
//     };
//   }, []);

//   const sendEvent = (type: string, payload?: any) => {
//     if (!socketRef.current) return;

//     socketRef.current.send(
//       JSON.stringify({
//         type,
//         payload,
//       }),
//     );
//   };

//   return (
//     <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-serif">
//       {/* BACKGROUND */}
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#8B1A00,transparent_60%),radial-gradient(ellipse_at_bottom,#0A0000,#000)]" />

//       {/* CITY SVG */}
//       <div className="absolute bottom-0 w-full opacity-60">
//         <svg viewBox="0 0 1400 500" className="w-full h-[55vh]">
//           <rect width="100%" height="100%" fill="url(#g)" />
//           <defs>
//             <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#5C1A00" />
//               <stop offset="100%" stopColor="#1A0500" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </div>

//       {/* PARTICLES */}
//       <div id="particles" className="absolute inset-0 pointer-events-none" />

//       {/* CONTENT */}
//       <div className="relative z-10 flex flex-col items-center text-center px-6">
//         <p className="uppercase tracking-[0.4em] text-yellow-400 text-xs mb-4 italic">
//           Season One · Premium Edition
//         </p>

//         <div className="relative flex flex-col items-center mb-6">
//           {/* IMAGE */}
//           <img
//             src="./bachelor-bg-removebg-preview.png"
//             alt="premium edition"
//             className="w-xl opacity-90"
//           />

//           {/* BOLD TEXT UNDER IMAGE */}
//           <h2 className="mt-3 text-white font-extrabold text-lg md:text-2xl tracking-widest uppercase">
//             Legendary Experience
//           </h2>
//         </div>

//         {/* TITLE */}
//         <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-orange-700 text-4xl md:text-6xl font-black tracking-widest">
//           INTERNET BACHELOR
//         </h1>

//         <p className="text-red-300 italic mt-2 text-lg md:text-xl">
//           Connect. Find Love.
//         </p>

//         {/* BUTTONS */}
//         <div className="flex flex-wrap gap-6 mt-10 justify-center">
//           {/* BACHELOR BUTTON */}
//           <button
//             onClick={() =>
//               sendEvent("CREATE_GAME", {
//                 role: "BACHELOR",
//               })
//             }
//             className="relative px-8 py-4 font-bold uppercase tracking-widest text-black bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-600 clip-path-polygon shadow-[0_0_40px_rgba(255,180,0,0.6)] hover:scale-105 transition"
//           >
//             BE THE BACHELOR
//             <span className="block text-xs font-light italic">(1 Token)</span>
//           </button>

//           {/* CONTESTANT BUTTON */}
//           <button
//             onClick={() =>
//               sendEvent("JOIN_GAME", {
//                 role: "CONTESTANT",
//               })
//             }
//             className="relative px-8 py-4 font-bold uppercase tracking-widest text-teal-100 border border-teal-400 bg-gradient-to-br from-teal-500 to-teal-900 hover:scale-105 transition shadow-lg"
//           >
//             BE A CONTESTANT
//           </button>
//         </div>
//       </div>

//       {/* ANIMATIONS */}
//       <style>{`
//         @keyframes floatParticle {
//           0%,100% { transform: translateY(0); }
//           50% { transform: translateY(-30px); }
//         }

//         .animate-float {
//           animation: float 4s ease-in-out infinite;
//         }

//         @keyframes float {
//           0%,100% { transform: translateY(0); }
//           50% { transform: translateY(-12px); }
//         }

//         .clip-path-polygon {
//           clip-path: polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default StartGame;

// "use client";

// import React, { useEffect, useRef } from "react";
// import Cookies from "js-cookie";

// const StartGame: React.FC = () => {
//   const socketRef = useRef<WebSocket | null>(null);
//   const token = Cookies.get("token");

//   useEffect(() => {
//     const container = document.getElementById("particles");
//     if (!container) return;

//     for (let i = 0; i < 28; i++) {
//       const p = document.createElement("div");
//       const size = Math.random() * 4 + 2;

//       p.style.position = "absolute";
//       p.style.width = `${size}px`;
//       p.style.height = `${size}px`;
//       p.style.borderRadius = "50%";
//       p.style.left = `${Math.random() * 100}%`;
//       p.style.top = `${Math.random() * 100}%`;
//       p.style.background = "radial-gradient(circle,#FFE566,#FF8C00)";
//       p.style.boxShadow = `0 0 ${size * 2}px #FFD700`;
//       p.style.opacity = String(0.25 + Math.random() * 0.55);
//       p.style.animation = `floatParticle ${4 + Math.random() * 7}s ease-in-out infinite`;
//       p.style.animationDelay = `${Math.random() * 5}s`;

//       container.appendChild(p);
//     }
//   }, []);

//   useEffect(() => {
//     if (!token) return;

//     // If a socket already exists and is open/connecting, don't create another
//     if (
//       socketRef.current &&
//       (socketRef.current.readyState === WebSocket.OPEN ||
//         socketRef.current.readyState === WebSocket.CONNECTING)
//     ) {
//       return;
//     }

//     const socket = new WebSocket(`ws://206.162.244.134:5040?token=${token}`);
//     socketRef.current = socket;

//     socket.onopen = () => {
//       console.log(" Socket Connected");
//     };

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log(" Server:", data);

//       if (data.type === "GAME_STARTED") alert("Game Started!");
//       if (data.type === "PLAYERS_UPDATE") console.log("Players:", data.payload);
//     };

//     socket.onerror = (err) => {
//       console.error(" Socket Error:", err);
//     };

//     socket.onclose = () => {
//       console.log(" Socket Disconnected");
//       socketRef.current = null;
//     };

//     return () => {
//       // Only close if socket is still open/connecting
//       if (
//         socket.readyState === WebSocket.OPEN ||
//         socket.readyState === WebSocket.CONNECTING
//       ) {
//         socket.close();
//       }
//     };
//   }, [token]);

//   const sendEvent = (type: string, payload?: any) => {
//     if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
//       console.warn("Socket not ready");
//       return;
//     }

//     socketRef.current.send(JSON.stringify({ type, payload }));
//   };

//   // ... rest of your JSX unchanged

//   return (
//     <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-serif">
//       {/* BACKGROUND */}
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#8B1A00,transparent_60%),radial-gradient(ellipse_at_bottom,#0A0000,#000)]" />

//       {/* CITY SVG */}
//       <div className="absolute bottom-0 w-full opacity-60">
//         <svg viewBox="0 0 1400 500" className="w-full h-[55vh]">
//           <rect width="100%" height="100%" fill="url(#g)" />
//           <defs>
//             <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#5C1A00" />
//               <stop offset="100%" stopColor="#1A0500" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </div>

//       {/* PARTICLES */}
//       <div id="particles" className="absolute inset-0 pointer-events-none" />

//       {/* CONTENT */}
//       <div className="relative z-10 flex flex-col items-center text-center px-6">
//         <p className="uppercase tracking-[0.4em] text-yellow-400 text-xs mb-4 italic">
//           Season One · Premium Edition
//         </p>

//         <div className="relative flex flex-col items-center mb-6">
//           {/* IMAGE */}
//           <img
//             src="./bachelor-bg-removebg-preview.png"
//             alt="premium edition"
//             className="w-xl opacity-90"
//           />

//           {/* BOLD TEXT UNDER IMAGE */}
//           <h2 className="mt-3 text-white font-extrabold text-lg md:text-2xl tracking-widest uppercase">
//             Legendary Experience
//           </h2>
//         </div>

//         {/* TITLE */}
//         <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-orange-700 text-4xl md:text-6xl font-black tracking-widest">
//           INTERNET BACHELOR
//         </h1>

//         <p className="text-red-300 italic mt-2 text-lg md:text-xl">
//           Connect. Find Love.
//         </p>

//         {/* BUTTONS */}
//         <div className="flex flex-wrap gap-6 mt-10 justify-center">
//           {/* BACHELOR BUTTON */}
//           <button
//             onClick={() =>
//               sendEvent("CREATE_GAME", {
//                 role: "BACHELOR",
//               })
//             }
//             className="relative px-8 py-4 font-bold uppercase tracking-widest text-black bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-600 clip-path-polygon shadow-[0_0_40px_rgba(255,180,0,0.6)] hover:scale-105 transition"
//           >
//             BE THE BACHELOR
//             <span className="block text-xs font-light italic">(1 Token)</span>
//           </button>

//           {/* CONTESTANT BUTTON */}
//           <button
//             onClick={() =>
//               sendEvent("JOIN_GAME", {
//                 role: "CONTESTANT",
//               })
//             }
//             className="relative px-8 py-4 font-bold uppercase tracking-widest text-teal-100 border border-teal-400 bg-gradient-to-br from-teal-500 to-teal-900 hover:scale-105 transition shadow-lg"
//           >
//             BE A CONTESTANT
//           </button>
//         </div>
//       </div>

//       {/* ANIMATIONS */}
//       <style>{`
//         @keyframes floatParticle {
//           0%,100% { transform: translateY(0); }
//           50% { transform: translateY(-30px); }
//         }

//         .animate-float {
//           animation: float 4s ease-in-out infinite;
//         }

//         @keyframes float {
//           0%,100% { transform: translateY(0); }
//           50% { transform: translateY(-12px); }
//         }

//         .clip-path-polygon {
//           clip-path: polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default StartGame;

// "use client";

// import React, { useEffect, useRef } from "react";
// import Cookies from "js-cookie";
// import { io, Socket } from "socket.io-client";
// import { useRouter } from "next/navigation";

// const StartGame: React.FC = () => {
//   const socketRef = useRef<Socket | null>(null);
//   const token = Cookies.get("token");
//   const router = useRouter();

//   // Particles
//   useEffect(() => {
//     const container = document.getElementById("particles");
//     if (!container) return;

//     for (let i = 0; i < 28; i++) {
//       const p = document.createElement("div");
//       const size = Math.random() * 4 + 2;
//       p.style.position = "absolute";
//       p.style.width = `${size}px`;
//       p.style.height = `${size}px`;
//       p.style.borderRadius = "50%";
//       p.style.left = `${Math.random() * 100}%`;
//       p.style.top = `${Math.random() * 100}%`;
//       p.style.background = "radial-gradient(circle,#FFE566,#FF8C00)";
//       p.style.boxShadow = `0 0 ${size * 2}px #FFD700`;
//       p.style.opacity = String(0.25 + Math.random() * 0.55);
//       p.style.animation = `floatParticle ${4 + Math.random() * 7}s ease-in-out infinite`;
//       p.style.animationDelay = `${Math.random() * 5}s`;
//       container.appendChild(p);
//     }
//   }, []);

//   // Socket.io connection
//   useEffect(() => {
//     if (!token) return;

//     // Prevent Strict Mode double-connect
//     if (socketRef.current?.connected) return;

//     const socket = io("http://206.162.244.134:5040", {
//       auth: { token },
//       transports: ["websocket"],

//       // ✅ ADD THESE:
//       reconnection: true, // auto reconnect (default true, be explicit)
//       reconnectionAttempts: Infinity, // never stop trying
//       reconnectionDelay: 1000, // wait 1s before first retry
//       reconnectionDelayMax: 5000, // max wait 5s between retries
//       timeout: 20000, // connection timeout 20s
//     });

//     socketRef.current = socket;

//     socket.on("connect", () => {
//       console.log("✅ Socket.io Connected:", socket.id);
//     });

//     socket.on("connect_error", (err) => {
//       console.error("🔴 Connection Error:", err.message);
//     });

//     socket.on("GAME_STARTED", (payload) => {
//       console.log("🎮 Game Started:", payload);
//       alert("Game Started!");
//     });

//     socket.on("PLAYERS_UPDATE", (payload) => {
//       console.log("👥 Players:", payload);
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("❌ Disconnected:", reason);
//     });

//     return () => {
//       socket.disconnect();
//       socketRef.current = null;
//     };
//   }, [token]);

//   const sendEvent = (type: string, payload?: any) => {
//     if (!socketRef.current || !socketRef.current.connected) {
//       console.warn("⚠️ Socket not connected");
//       return;
//     }

//     console.log("📤 Sending:", type, payload);
//     console.log("📤 type:", type);

//     socketRef.current.emit(type, payload, (response: any) => {
//       console.log("✅ Server ACK:", response.success);
//       if (type === "CREATE_GAME") {
//         router.push("/host");
//       } else if (type === "JOIN_GAME") {
//         router.push("/ready-game");
//       }
//     });
//   };

//   return (
//     <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-serif">
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#8B1A00,transparent_60%),radial-gradient(ellipse_at_bottom,#0A0000,#000)]" />

//       <div className="absolute bottom-0 w-full opacity-60">
//         <svg viewBox="0 0 1400 500" className="w-full h-[55vh]">
//           <rect width="100%" height="100%" fill="url(#g)" />
//           <defs>
//             <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#5C1A00" />
//               <stop offset="100%" stopColor="#1A0500" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </div>

//       <div id="particles" className="absolute inset-0 pointer-events-none" />

//       <div className="relative z-10 flex flex-col items-center text-center px-6">
//         <p className="uppercase tracking-[0.4em] text-yellow-400 text-xs mb-4 italic">
//           Season One · Premium Edition
//         </p>

//         <div className="relative flex flex-col items-center mb-6">
//           <img
//             src="./bachelor-bg-removebg-preview.png"
//             alt="premium edition"
//             className="w-xl opacity-90"
//           />
//           <h2 className="mt-3 text-white font-extrabold text-lg md:text-2xl tracking-widest uppercase">
//             Legendary Experience
//           </h2>
//         </div>

//         <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-orange-700 text-4xl md:text-6xl font-black tracking-widest">
//           INTERNET BACHELOR
//         </h1>

//         <p className="text-red-300 italic mt-2 text-lg md:text-xl">
//           Connect. Find Love.
//         </p>

//         <div className="flex flex-wrap gap-6 mt-10 justify-center">
//           <button
//             onClick={() =>
//               sendEvent("CREATE_GAME", {
//                 gameType: "INTERNET_BACHELOR",
//               })
//             }
//             className="relative px-8 py-4 font-bold uppercase tracking-widest text-black bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-600 clip-path-polygon shadow-[0_0_40px_rgba(255,180,0,0.6)] hover:scale-105 transition"
//           >
//             BE THE BACHELOR
//             <span className="block text-xs font-light italic">(1 Token)</span>
//           </button>

//           <button
//             onClick={() =>
//               sendEvent("JOIN_GAME", {
//                 gameId: "internet-bachelor-123",
//               })
//             }
//             className="relative px-8 py-4 font-bold uppercase tracking-widest text-teal-100 border border-teal-400 bg-gradient-to-br from-teal-500 to-teal-900 hover:scale-105 transition shadow-lg"
//           >
//             BE A CONTESTANT
//           </button>
//         </div>
//       </div>

//       <style>{`
//         @keyframes floatParticle {
//           0%,100% { transform: translateY(0); }
//           50% { transform: translateY(-30px); }
//         }
//         .clip-path-polygon {
//           clip-path: polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default StartGame;

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";

const StartGame: React.FC = () => {
  const router = useRouter();

  const { sendEvent } = useSocket({
    GAME_STARTED: (payload) => {
      console.log("🎮 Game Started:", payload);
      alert("Game Started!");
    },

    PLAYERS_UPDATE: (payload) => {
      console.log("👥 Players:", payload);
    },
  });

  // Particles
  useEffect(() => {
    const container = document.getElementById("particles");
    if (!container) return;

    for (let i = 0; i < 28; i++) {
      const p = document.createElement("div");
      const size = Math.random() * 4 + 2;
      p.style.position = "absolute";
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.borderRadius = "50%";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.background = "radial-gradient(circle,#FFE566,#FF8C00)";
      p.style.boxShadow = `0 0 ${size * 2}px #FFD700`;
      p.style.opacity = String(0.25 + Math.random() * 0.55);
      p.style.animation = `floatParticle ${4 + Math.random() * 7}s ease-in-out infinite`;
      p.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(p);
    }
  }, []);

  const handleCreateGame = () => {
    sendEvent("CREATE_GAME", { gameType: "INTERNET_BACHELOR" }, (response) => {
      console.log("✅ Server ACK:", response);
      if (response.success) {
        router.push("/host");
      }
    });
  };

  const handleJoinGame = () => {
    sendEvent("JOIN_GAME", { gameId: "internet-bachelor-123" }, (response) => {
      console.log("✅ Server ACK:", response);
      if (response.success) {
        router.push("/ready-game");
      }
    });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-serif">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#8B1A00,transparent_60%),radial-gradient(ellipse_at_bottom,#0A0000,#000)]" />

      <div className="absolute bottom-0 w-full opacity-60">
        <svg viewBox="0 0 1400 500" className="w-full h-[55vh]">
          <rect width="100%" height="100%" fill="url(#g)" />
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5C1A00" />
              <stop offset="100%" stopColor="#1A0500" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div id="particles" className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <p className="uppercase tracking-[0.4em] text-yellow-400 text-xs mb-4 italic">
          Season One · Premium Edition
        </p>

        <div className="relative flex flex-col items-center mb-6">
          <img
            src="./bachelor-bg-removebg-preview.png"
            alt="premium edition"
            className="w-xl opacity-90"
          />
          <h2 className="mt-3 text-white font-extrabold text-lg md:text-2xl tracking-widest uppercase">
            Legendary Experience
          </h2>
        </div>

        <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-orange-700 text-4xl md:text-6xl font-black tracking-widest">
          INTERNET BACHELOR
        </h1>

        <p className="text-red-300 italic mt-2 text-lg md:text-xl">
          Connect. Find Love.
        </p>

        <div className="flex flex-wrap gap-6 mt-10 justify-center">
          <button
            onClick={handleCreateGame}
            className="relative px-8 py-4 font-bold uppercase tracking-widest text-black bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-600 clip-path-polygon shadow-[0_0_40px_rgba(255,180,0,0.6)] hover:scale-105 transition"
          >
            BE THE BACHELOR
            <span className="block text-xs font-light italic">(1 Token)</span>
          </button>

          <button
            onClick={handleJoinGame}
            className="relative px-8 py-4 font-bold uppercase tracking-widest text-teal-100 border border-teal-400 bg-gradient-to-br from-teal-500 to-teal-900 hover:scale-105 transition shadow-lg"
          >
            BE A CONTESTANT
          </button>
        </div>
      </div>

      <style>{`
        @keyframes floatParticle {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        .clip-path-polygon {
          clip-path: polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%);
        }
      `}</style>
    </div>
  );
};

export default StartGame;
