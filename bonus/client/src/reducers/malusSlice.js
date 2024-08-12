import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const malusSlice = createSlice({
	name: 'malus',
	initialState,
	reducers: {
		modifyMalus: (state, action) => {
			return action.payload;
		}
	}
})

export const { modifyMalus } = malusSlice.actions;
export default malusSlice.reducer

export const selectMalus = (state) => state.malus