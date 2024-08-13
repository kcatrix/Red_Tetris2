import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const timeSlice = createSlice({
	name: 'time',
	initialState,
	reducers: {
		modifyTime: (state, action) => {
			return action.payload;
		},
		addTime: (state, action) => {
			return state + action.payload;
		}
	}
})

export const { modifyTime, addTime } = timeSlice.actions;
export default timeSlice.reducer

export const selectTime = (state) => state.time