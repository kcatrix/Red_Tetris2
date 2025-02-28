import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const musicSlice = createSlice({
	name: 'music',
	initialState,
	reducers:{
		musicOn(state){
			return true;
		},
		musicOff(state){
			return false;
		}
	}
})

export const { musicOn, musicOff } = musicSlice.actions
export default musicSlice.reducer 

export const selectMusic = (state) => state.music