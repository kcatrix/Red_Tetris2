import { createSlice } from "@reduxjs/toolkit";

const initialState = true;

const startPieceSlice = createSlice({
	name: 'startPiece',
	initialState,
	reducers:{
		startPieceOn(state){
			return true;
		},
		startPieceOff(state){
			return false;
		}
	}
})

export const { startPieceOn, startPieceOff } = startPieceSlice.actions
export default startPieceSlice.reducer 

export const selectStartPiece = (state) => state.startPiece