import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const retrySignalSlice = createSlice({
	name: 'retrySignal',
	initialState,
	reducers:{
		retrySignalOn(state){
			return true;
		},
		retrySignalOff(state){
			return false;
		}
	}
})

export const { retrySignalOn, retrySignalOff } = retrySignalSlice.actions
export default retrySignalSlice.reducer 

export const selectRetrySignal = (state) => state.retrySignal