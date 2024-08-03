import { configureStore } from '@reduxjs/toolkit'
import showHighScoreSlice from "./reducers/showHighScoreSlice"

export const store = configureStore({
  reducer: {
    showHighScore: showHighScoreSlice,
  },
})
