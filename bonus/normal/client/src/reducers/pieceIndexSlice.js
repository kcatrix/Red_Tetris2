import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const pieceIndexSlice = createSlice({
	name: 'pieceIndex',
	initialState,
	reducers: {
		modifyPieceIndex: (state, action) => {
			return action.payload;
		}
	}
})

export const { modifyPieceIndex } = pieceIndexSlice.actions;
export default pieceIndexSlice.reducer

export const selectPieceIndex = (state) => state.pieceIndex