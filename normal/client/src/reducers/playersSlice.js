import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const playersSlice = createSlice({

	name: 'players',
	initialState,
	reducers: {
		fillPlayers(state, action) {
			return action.payload; // Remplacer l'état actuel par le tableau de pièces
		}
	}

})

export const { fillPlayers } = playersSlice.actions;
export default playersSlice.reducer

export const selectPlayers = (state) => state.players