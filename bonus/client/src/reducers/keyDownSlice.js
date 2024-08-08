import { createSlice } from "@reduxjs/toolkit";

const initialState = '';

const keyDownSlice = createSlice({
	name: 'keyDown',
	initialState,
	reducers: {
		changeKeyDown(state, action) {
			return action.payload
		}
	}
})

export const { changeKeyDown } = keyDownSlice.actions
export default keyDownSlice.reducer

export const selectKeyDown = (state) => state.keyDown;