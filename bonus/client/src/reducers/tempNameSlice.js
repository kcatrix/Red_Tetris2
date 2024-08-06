import { createSlice } from "@reduxjs/toolkit";

const initialState = '';

const tempNameSlice = createSlice({
	name: 'tempName',
	initialState,
	reducers: {
		changeTempName(state, action) {
			state = action.payload
		}
	}
})

export const { changeTempName } = tempNameSlice.actions
export default tempNameSlice.reducer

export const selectTempName = (state) => state.tempName;