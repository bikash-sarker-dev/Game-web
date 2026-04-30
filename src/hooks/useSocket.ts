/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/refs */
// import { useEffect, useRef, useCallback } from "react";
// import { io, Socket } from "socket.io-client";
// import Cookies from "js-cookie";

// const SOCKET_URL = "http://206.162.244.134:5040";

// let globalSocket: Socket | null = null; // singleton — one socket for whole app

// export const useSocket = (events?: Record<string, (payload: any) => void>) => {
//   const token = Cookies.get("token");
//   const eventsRef = useRef(events);
//   eventsRef.current = events; // always latest handlers without re-running effect

//   useEffect(() => {
//     if (!token) return;

//     // Reuse existing socket if already connected
//     if (!globalSocket || !globalSocket.connected) {
//       globalSocket = io(SOCKET_URL, {
//         auth: { token },
//         transports: ["websocket"],
//         reconnection: true,
//         reconnectionAttempts: Infinity,
//         reconnectionDelay: 1000,
//         reconnectionDelayMax: 5000,
//         timeout: 20000,
//       });

//       globalSocket.on("connect", () => {
//         console.log("✅ Socket Connected:", globalSocket?.id);
//       });

//       globalSocket.on("disconnect", (reason) => {
//         console.log("❌ Disconnected:", reason);
//         if (reason === "io server disconnect") {
//           globalSocket?.connect();
//         }
//       });

//       globalSocket.on("reconnect_attempt", (attempt) => {
//         console.log(`🔄 Reconnecting... attempt ${attempt}`);
//       });

//       globalSocket.on("reconnect", () => {
//         console.log("✅ Reconnected!");
//       });
//     }

//     // Register this component's event listeners
//     const currentEvents = eventsRef.current;
//     if (currentEvents) {
//       Object.entries(currentEvents).forEach(([event, handler]) => {
//         globalSocket?.on(event, handler);
//       });
//     }

//     // Cleanup only removes THIS component's listeners
//     return () => {
//       const currentEvents = eventsRef.current;
//       if (currentEvents) {
//         Object.entries(currentEvents).forEach(([event, handler]) => {
//           globalSocket?.off(event, handler);
//         });
//       }
//     };
//   }, [token]);

//   const sendEvent = useCallback((type: string, payload?: any) => {
//     if (!globalSocket?.connected) {
//       console.warn("⚠️ Socket not connected");
//       return;
//     }
//     globalSocket.emit(type, payload);
//   }, []);

//   const isConnected = useCallback(() => {
//     return globalSocket?.connected ?? false;
//   }, []);

//   return { sendEvent, isConnected, socket: globalSocket };
// };

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

const SOCKET_URL = "http://206.162.244.134:5040";

let globalSocket: Socket | null = null;

export const useSocket = (events?: Record<string, (payload: any) => void>) => {
  const token = Cookies.get("token");
  const eventsRef = useRef(events);
  eventsRef.current = events;

  useEffect(() => {
    if (!token) return;

    if (!globalSocket || !globalSocket.connected) {
      globalSocket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      globalSocket.on("connect", () => {
        console.log("✅ Socket Connected:", globalSocket?.id);
      });

      globalSocket.on("disconnect", (reason) => {
        console.log("❌ Disconnected:", reason);
        if (reason === "io server disconnect") {
          globalSocket?.connect();
        }
      });

      globalSocket.on("connect_error", (err) => {
        console.error("🔴 Connection Error:", err.message);
      });

      globalSocket.on("reconnect_attempt", (attempt) => {
        console.log(`🔄 Reconnecting... attempt ${attempt}`);
      });

      globalSocket.on("reconnect", () => {
        console.log("✅ Reconnected!");
      });
    }

    const currentEvents = eventsRef.current;
    if (currentEvents) {
      Object.entries(currentEvents).forEach(([event, handler]) => {
        globalSocket?.on(event, handler);
      });
    }

    return () => {
      const currentEvents = eventsRef.current;
      if (currentEvents) {
        Object.entries(currentEvents).forEach(([event, handler]) => {
          globalSocket?.off(event, handler);
        });
      }
    };
  }, [token]);

  const sendEvent = useCallback(
    (type: string, payload?: any, ack?: (res: any) => void) => {
      if (!globalSocket?.connected) {
        console.warn("⚠️ Socket not connected");
        return;
      }
      console.log("📤 Sending:", type, payload);
      if (ack) {
        globalSocket.emit(type, payload, ack);
      } else {
        globalSocket.emit(type, payload);
      }
    },
    [],
  );

  const isConnected = useCallback(() => {
    return globalSocket?.connected ?? false;
  }, []);

  return { sendEvent, isConnected, socket: globalSocket };
};
