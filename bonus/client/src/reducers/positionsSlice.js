import { createSlice } from "@reduxjs/toolkit";

const initialState = [{ x: 4, y: 0}];

const positionsSlice = createSlice({
		name: 'positions',
		initialState,
		reducers: {
			resetPositions(state, action) {
				 // New Position a penser -> Probablement créer reducer a 3 actions 
				const newPosition = [...state];
				const pieceIndex = action.payload;
				newPosition[pieceIndex] = { x: 4, y: 0 };
				return newPosition;
			}
		}
});

export const { resetPositions } = positionsSlice.actions;
export default positionsSlice.reducer;

export const selectPositions = (state) => state.positions

