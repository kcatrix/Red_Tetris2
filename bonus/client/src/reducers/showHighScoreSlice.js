import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const showHighScoreSlice = createSlice({
	name: 'showHighScore',
	initialState,
	reducers:{
		showHighScoreOn(state){
			return true;
		},
		showHighScoreOff(state){
			return false;
		}
	}
})

export const { showHighScoreOn, showHighScoreOff } = showHighScoreSlice.actions
export default showHighScoreSlice.reducer 

export const selectShowHighScore = (state) => state.showHighScore