import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const lastMalusSlice = createSlice({
	name: 'lastMalus',
	initialState,
	reducers: {
		modifyLastMalus: (state, action) => {
			return action.payload;
		},
		addLastMalus: (state, action) => {
			return state + action.payload;
		}
	}
})

export const { modifyLastMalus, addLastMalus } = lastMalusSlice.actions;
export default lastMalusSlice.reducer

export const selectLastMalus = (state) => state.lastMalus