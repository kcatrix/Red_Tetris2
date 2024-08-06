import { createSlice } from "@reduxjs/toolkit";

const initialState = '';

const oldUrlSlice = createSlice({
	name: 'oldUrl',
	initialState,
	reducers: {
		changeOldUrl(state, action) {
			state = action.payload
		}
	}
})

export const { changeOldUrl } = oldUrlSlice.actions
export default oldUrlSlice.reducer

export const selectOldUrl = (state) => state.oldUrl;