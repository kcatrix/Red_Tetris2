import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const gameLaunchedSlice = createSlice({
	name: 'gameLaunched',
	initialState,
	reducers:{
		gameLaunchedOn(state){
			return true;
		},
		gameLaunchedOff(state){
			return false;
		}
	}
})

export const { gameLaunchedOn, gameLaunchedOff } = gameLaunchedSlice.actions
export default gameLaunchedSlice.reducer 

export const selectGameLaunched = (state) => state.gameLaunched