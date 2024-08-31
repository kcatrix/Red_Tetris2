import { createSlice } from "@reduxjs/toolkit";

const initialState = 'Game Over';

const resultatsSlice = createSlice({
	name: 'resultats',
	initialState,
	reducers: {
		changeResultats(state, action) {
			return action.payload
		}
	}
})

export const { changeResultats } = resultatsSlice.actions
export default resultatsSlice.reducer

export const selectResultats = (state) => state.resultats;