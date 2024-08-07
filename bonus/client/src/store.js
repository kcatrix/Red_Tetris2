import { configureStore } from '@reduxjs/toolkit'
import socketMiddleware from './middleware/socketMiddleware'
import pieceSlice from './reducers/pieceSlice'
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
import leaderSlice from './reducers/leaderSlice'
import bestScoreSlice from './reducers/bestScoreSlice'
import rowsSlice from './reducers/rowsSlice'
import gameLaunchedSlice from './reducers/gameLaunchedSlice'
import scoreSlice from './reducers/scoreSlice'
import resultatsSlice from './reducers/resultatsSlice'
import playersOffSlice from './reducers/playersOffSlice'
import retrySignalSlice from './reducers/retrySignalSlice'

export const store = configureStore({
	reducer: {
		piece: pieceSlice,
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
		leader: leaderSlice,
		bestScore: bestScoreSlice,
		rows: rowsSlice,
		gameLaunched: gameLaunchedSlice,
		score: scoreSlice,
		resultats: resultatsSlice,
		playersOff: playersOffSlice,
		retrySignal: retrySignalSlice,
		
	},
	middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat([socketMiddleware]);
	} 
})
