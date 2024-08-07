import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const pieceSlice = createSlice({

	name: 'piece',
	initialState,
	reducers: {
		fillPiece(state, action) {
			return action.payload; // Remplacer l'état actuel par le tableau de pièces
		}
	}

})

export const { fillPiece } = pieceSlice.actions;
export default pieceSlice.reducer

export const selectPiece = (state) => state.piece