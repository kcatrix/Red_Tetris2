import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const playersOffSlice = createSlice ({

	name: 'playersOff',
	initialState,
	reducers: {
		fillPlayersOff(state, action){
			return action.payload
		}
	}
})

export const { fillPlayersOff } = playersOffSlice.actions
export default playersOffSlice.reducer

export const selectPlayersOff = (state) => state.playersOff