import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const randomPieceSlice = createSlice({

	name: 'randomPiece',
	initialState,
	reducers: {
		allPieceAdded(action) {
			return action.payload; // Remplacer l'état actuel par le tableau de pièces
		}
	}

})

export const { allPieceAdded } = randomPieceSlice.actions;
export default randomPieceSlice.reducer

export const selectRandomPiece = (state) => state.randomPiece.value