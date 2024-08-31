import { createSlice } from "@reduxjs/toolkit";

const initialState = "null";

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