import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const leaderSlice = createSlice({
	name: 'leader',
	initialState,
	reducers:{
		leaderOn(state){
			return true;
		},
		leaderOff(state){
			return false;
		}
	}
})

export const { leaderOn, leaderOff } = leaderSlice.actions
export default leaderSlice.reducer 

export const selectLeader = (state) => state.leader