import { configureStore } from '@reduxjs/toolkit'
import { socketMiddleware } from './middleware/socketMiddleware'

export const store = configureStore({
	middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat([socketMiddleware]);
	} 
})
