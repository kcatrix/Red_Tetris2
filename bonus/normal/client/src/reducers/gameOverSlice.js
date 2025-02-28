import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const gameOverSlice = createSlice({
	name: 'gameOver',
	initialState,
	reducers:{
		gameOverOn(state){
			return true;
		},
		gameOverOff(state){
			return false;
		}
	}
})

export const { gameOverOn, gameOverOff } = gameOverSlice.actions
export default gameOverSlice.reducer 

export const selectGameOver = (state) => state.gameOver