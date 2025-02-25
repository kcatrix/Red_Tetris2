import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const scoreSlice = createSlice({
	name: 'score',
	initialState,
	reducers: {
		modifyScore: (state, action) => {
			return action.payload;
		},
		addScore: (state, action) => {
			console.log("state ( ", state, " ) + actiom ( ", action.payload, " ) = ", state + action.payload)
			return state + action.payload
		}
	}
})

export const { modifyScore, addScore } = scoreSlice.actions;
export default scoreSlice.reducer

export const selectScore = (state) => state.score