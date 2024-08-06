import { configureStore } from '@reduxjs/toolkit'
import socketMiddleware from './middleware/socketMiddleware'
import randomPieceSlice from './reducers/randomPieceSlice'
import catalogPiecesSlice from './reducers/catalogPiecesSlice'
import multiSlice from './reducers/multiSlice'
import urlSlice, { changeUrl } from './reducers/urlSlice'
import checkUrlSlice from './reducers/checkUrlSlice'
import changeOkSlice from './reducers/changeOkSlice'
import createRoomSlice from './reducers/createRoomSlice'
import tempNameSlice from './reducers/tempNameSlice'
import showHighScoreSlice from './reducers/showHighScoreSlice'
import scoreListSlice from './reducers/scoreListSlice'
import noNameSlice from './reducers/noNameSlice'
import oldUrlSlice from './reducers/oldUrlSlice'

export const store = configureStore({
	reducer: {
		randomPiece: randomPieceSlice,
		catalogPieces: catalogPiecesSlice,
		multi: multiSlice,
		url: urlSlice,
		checkUrl: checkUrlSlice,
		changeOk: changeOkSlice,
		createRoom: createRoomSlice,
		tempName: tempNameSlice,
		showHighScore: showHighScoreSlice,
		scoreList: scoreListSlice,
		noName: noNameSlice,
		checkUrl: checkUrlSlice,
		oldUrl: oldUrlSlice,
		
	},
	middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat([socketMiddleware]);
	} 
})
