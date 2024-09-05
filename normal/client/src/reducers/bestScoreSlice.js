import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const bestScoreSlice = createSlice({
	name: 'bestScore',
	initialState,
	reducers: {
		modifyBestScore: (state, action) => {
			return action.payload;
		}
	}
})

export const { modifyBestScore } = bestScoreSlice.actions;
export default bestScoreSlice.reducer

export const selectBestScore = (state) => state.bestScore