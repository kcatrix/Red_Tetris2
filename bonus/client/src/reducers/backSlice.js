import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const backSlice = createSlice({
	name: 'back',
	initialState,
	reducers:{
		backOn(state){
			return true;
		},
		backOff(state){
			return false;
		}
	}
})

export const { backOn, backOff } = backSlice.actions
export default backSlice.reducer 

export const selectBack = (state) => state.back