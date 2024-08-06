import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const multiSlice = createSlice({
	name: 'multi',
	initialState,
	reducers:{
		multiOn(state){
			state = true;
		},
		multiOff(state){
			state = false;
		}
	}
})

export const { multiOn, multiOff } = multiSlice.actions
export default multiSlice.reducer 

export const selectMulti = (state) => state.multi