import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const createRoomSlice = createSlice({
	name: 'createRoom',
	initialState,
	reducers:{
		createRoomOn(state){
			return true;
		},
		createRoomOff(state){
			return false;
		}
	}
})

export const { createRoomOn, createRoomOff } = createRoomSlice.actions
export default createRoomSlice.reducer 

export const createRoomMulti = (state) => state.multi