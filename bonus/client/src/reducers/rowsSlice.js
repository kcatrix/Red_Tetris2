import { createSlice } from "@reduxjs/toolkit";

const initialState = Array.from({ length: 20 }, () => Array(10).fill(0))

const rowsSlice = createSlice ({

	name: 'rows',
	initialState,
	reducers: {
		modifyRows(state, action){
			return action.payload
		}
	}
})

export const { modifyRows } = rowsSlice.actions
export default rowsSlice.reducer

export const selectRows = (state) => state.rows