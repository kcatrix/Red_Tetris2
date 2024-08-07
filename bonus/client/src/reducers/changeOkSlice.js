import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const changeOkSlice = createSlice({
	name: 'changeOk',
	initialState,
	reducers:{
		changeOkOn(state){
			return true;
		},
		changeOkOff(state){
			return false;
		}
	}
})

export const { changeOkOn, changeOkOff } = changeOkSlice.actions
export default changeOkSlice.reducer 

export const selectChangeOk = (state) => state.changeOk