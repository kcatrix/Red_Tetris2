import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const randomPieceSlice = createSlice({

	name: 'randomPiece',
	initialState,
	reducers: {
		allPieceAdded(state, action) {
			state.value = (action.payload)
		}
	}

})

export const { allPieceAdded } = randomPieceSlice.actions;
export default randomPieceSlice.reducer

export const selectRandomPiece = (state) => state.randomPiece.value