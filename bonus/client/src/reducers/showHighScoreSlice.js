import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	value: false,
	status: "off"
}

export const showHighScoreSlice = createSlice ({

	name: "showHighScore",
  initialState,

	reducers: {
		on: state => {
      state.value = true,
			state.status = "on"
    },
		
    off: state => {
      state.value = false,
			state.status = "off"
    },
	}
})

export const { on, off } = showHighScoreSlice.actions

// Export the slice reducer for use in the store configuration
export default showHighScoreSlice.reducer

// Selector functions allows us to select a value from the Redux root state.
// Selectors can also be defined inline in the `useSelector` call
// in a component, or inside the `createSlice.selectors` field.
export const selectShowHighScore = (state) => state.showHighScore.value
