import { createSlice } from "@reduxjs/toolkit";

const initialState = Array.from({ length: 20 }, () => Array(10).fill(0))

const rowsSlice = createSlice ({

	name: 'rowsPieces',
	initialState,
	reducers: {
		modifyRows(state, action){
			return action.payload
		}
	}
})

export const { modifyRows } = rowsPiecesSlice.actions
export default rowsSlice.reducer

export const selectRows = (state) => state.rows