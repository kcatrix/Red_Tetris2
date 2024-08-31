import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const addMalusGoSlice = createSlice({
	name: 'addMalusGo',
	initialState,
	reducers: {
		modifyAddMalusGo: (state, action) => {
			return action.payload;
		}
	}
})

export const { modifyAddMalusGo } = addMalusGoSlice.actions;
export default addMalusGoSlice.reducer

export const selectAddMalusGo = (state) => state.addMalusGo