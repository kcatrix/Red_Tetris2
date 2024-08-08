import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const lastMalusSlice = createSlice({
	name: 'lastMalus',
	initialState,
	reducers: {
		modifyLastMalus: (state, action) => {
			return action.payload;
		}
	}
})

export const { modifyLastMalus } = lastMalusSlice.actions;
export default lastMalusSlice.reducer

export const selectLastMalus = (state) => state.lastMalus