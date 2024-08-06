import { createSlice } from "@reduxjs/toolkit";

const initialState = '';

const urlSlice = createSlice({
	name: 'url',
	initialState,
	reducers: {
		changeUrl(state, action) {
			state = action.payload
		}
	}
})

export const { changeUrl } = urlSlice.actions
export default urlSlice.reducer

export const selectUrl = (state) => state.url;