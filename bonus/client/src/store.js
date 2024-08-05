import { configureStore } from '@reduxjs/toolkit'
import { socketMiddleware } from './middleware/socketMiddleware'
import randomPieceSlice from './reducers/randomPieceSlice'

export const store = configureStore({
	reducer: {
		randomPiece: randomPieceSlice,
	},
	middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat([socketMiddleware]);
	} 
})
