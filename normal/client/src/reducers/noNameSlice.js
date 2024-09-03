import { createSlice } from "@reduxjs/toolkit";

const initialState = true;

const noName = createSlice({
	name: 'noName',
	initialState,
	reducers:{
		noNameOn(state){
			return true;
		},
		noNameOff(state){
			return false;
		}
	}
})

export const { noNameOn, noNameOff } = noName.actions
export default noName.reducer 

export const selectNoName = (state) => state.noName