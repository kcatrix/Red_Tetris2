import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const scoreListSlice = createSlice({

	name: 'scoreList',
	initialState,
	reducers: {
		changeScoreList(action) {
			return action.payload
		}
	}

})

export const { changeScoreList } = scoreListSlice.actions;
export default scoreListSlice.reducer

export const selectScoreList = (state) => state.scoreList.value