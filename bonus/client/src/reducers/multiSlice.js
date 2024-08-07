import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const multiSlice = createSlice({
	name: 'multi',
	initialState,
	reducers:{
		multiOn(state){
			return true;
		},
		multiOff(state){
			return false;
		}
	}
})

export const { multiOn, multiOff } = multiSlice.actions
export default multiSlice.reducer 

export const selectMulti = (state) => state.multi