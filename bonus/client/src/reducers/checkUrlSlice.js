import { createSlice } from "@reduxjs/toolkit";

const initialState = '';

const checkUrlSlice = createSlice({
	name: 'checkUrl',
	initialState,
	reducers: {
		changeCheckUrl(state, action) {
			return action.payload
		}
	}
})

export const { changeCheckUrl } = checkUrlSlice.actions
export default checkUrlSlice.reducer

export const selectCheckUrl = (state) => state.checkUrl;