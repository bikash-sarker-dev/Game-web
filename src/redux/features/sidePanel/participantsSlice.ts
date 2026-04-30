import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  ready: boolean;
  isEliminated?: boolean;
  isConnected?: boolean;
}

interface ParticipantsState {
  players: Participant[];
}

const initialState: ParticipantsState = { players: [] };

const participantsSlice = createSlice({
  name: "participants",
  initialState,
  reducers: {
    setPlayers(state, action: PayloadAction<Participant[]>) {
      state.players = action.payload;
    },
  },
});

export const { setPlayers } = participantsSlice.actions;
export default participantsSlice.reducer;
