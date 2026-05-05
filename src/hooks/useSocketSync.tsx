// "use client";

// import { useSocket } from "@/hooks/useSocket";
// import {
//   Participant,
//   setPlayers,
// } from "@/redux/features/sidePanel/participantsSlice";
// import { useDispatch } from "react-redux";
// // import { useAppDispatch } from "@/store/hooks";
// // import { setPlayers } from "@/store/participantsSlice";
// // import type { Participant } from "@/store/participantsSlice";

// interface ServerPlayer {
//   id: string;
//   socketId: string;
//   isEliminated: boolean;
//   isReady: boolean;
//   isConnected: boolean;
//   username?: string;
//   name?: string;
// }

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

// export function useSocketSync() {
//   const dispatch = useDispatch();

//   useSocket({
//     GAME_EVENT: (payload) => {
//       console.log("🎮 Game Event received:", payload);
//       if (payload.type === "PLAYERS_UPDATE" && Array.isArray(payload.payload)) {
//         dispatch(
//           setPlayers(mapServerPlayers(payload.payload as ServerPlayer[])),
//         );
//       }
//     },
//   });
// }

"use client";

import { useSocket } from "@/hooks/useSocket";
import {
  Participant,
  setPlayers,
} from "@/redux/features/sidePanel/participantsSlice";
import { useDispatch } from "react-redux";

interface ServerPlayer {
  id: string;
  socketId: string;
  name: string;
  avatar: string;
  points: number;
  isEliminated: boolean;
  ready: boolean;
  isConnected: boolean;
  hasNetworkIssue: boolean;
  hasSubmitted: boolean;
}

// function mapServerPlayers(players: ServerPlayer[]): Participant[] {
//   return players.map((p) => ({
//     id: p.id,
//     name: p.name ?? `Player ${p.id.slice(-4)}`,
//     avatar: p.avatar ?? "", // URL from server, empty string = show initials
//     isReady: p.ready,
//     isEliminated: p.isEliminated,
//     isConnected: p.isConnected,
//     points: p.points,
//     hasNetworkIssue: p.hasNetworkIssue,
//     hasSubmitted: p.hasSubmitted,
//   }));
// }

function mapServerPlayers(players: ServerPlayer[]): Participant[] {
  return players.map((p) => ({
    id: p.id,
    name: p.name ?? `Player ${p.id.slice(-4)}`,
    avatar: p.avatar ?? "",

    ready: p.ready, // ✅ FIXED
    isEliminated: p.isEliminated,
    isConnected: p.isConnected,
    hasSubmitted: p.hasSubmitted,
    hasNetworkIssue: p.hasNetworkIssue,
    points: p.points,
  }));
}

export function useSocketSync() {
  const dispatch = useDispatch();

  useSocket({
    GAME_EVENT: (payload) => {
      console.log("🎮 Game Event received:", payload);
      if (payload.type === "PLAYERS_UPDATE" && Array.isArray(payload.payload)) {
        dispatch(
          setPlayers(mapServerPlayers(payload.payload as ServerPlayer[])),
        );
      }
    },
  });
}
