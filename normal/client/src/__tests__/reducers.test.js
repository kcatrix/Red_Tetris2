import { configureStore } from '@reduxjs/toolkit';
import addMalusGoReducer from '../reducers/addMalusGoSlice';
import backReducer from '../reducers/backSlice';
import bestScoreReducer from '../reducers/bestScoreSlice';
import catalogPiecesReducer from '../reducers/catalogPiecesSlice';
import changeOkReducer from '../reducers/changeOkSlice';
import checkUrlReducer from '../reducers/checkUrlSlice';
import createRoomReducer from '../reducers/createRoomSlice';
import gameLaunchedReducer from '../reducers/gameLaunchedSlice';
import gameOverReducer from '../reducers/gameOverSlice';
import keyDownReducer from '../reducers/keyDownSlice';
import lastMalusReducer from '../reducers/lastMalusSlice';
import leaderReducer from '../reducers/leaderSlice';
import malusReducer from '../reducers/malusSlice';
import multiReducer from '../reducers/multiSlice';
import musicReducer from '../reducers/musicSlice';
import noNameReducer from '../reducers/noNameSlice';
import oldUrlReducer from '../reducers/oldUrlSlice';
import pieceIndexReducer from '../reducers/pieceIndexSlice';
import pieceReducer from '../reducers/pieceSlice';
import playersOffReducer from '../reducers/playersOffSlice';
import playersReducer from '../reducers/playersSlice';
import positionsReducer from '../reducers/positionsSlice';
import resultatsReducer from '../reducers/resultatsSlice';
import retrySignalReducer from '../reducers/retrySignalSlice';
import rowsReducer from '../reducers/rowsSlice';
import scoreListReducer from '../reducers/scoreListSlice';
import scoreReducer from '../reducers/scoreSlice';
import showHighScoreReducer from '../reducers/showHighScoreSlice';
import startPieceReducer from '../reducers/startPieceSlice';
import tempNameReducer from '../reducers/tempNameSlice';
import timeReducer from '../reducers/timeSlice';
import urlReducer from '../reducers/urlSlice';

describe('Redux Reducers', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        addMalusGo: addMalusGoReducer,
        back: backReducer,
        bestScore: bestScoreReducer,
        catalogPieces: catalogPiecesReducer,
        changeOk: changeOkReducer,
        checkUrl: checkUrlReducer,
        createRoom: createRoomReducer,
        gameLaunched: gameLaunchedReducer,
        gameOver: gameOverReducer,
        keyDown: keyDownReducer,
        lastMalus: lastMalusReducer,
        leader: leaderReducer,
        malus: malusReducer,
        multi: multiReducer,
        music: musicReducer,
        noName: noNameReducer,
        oldUrl: oldUrlReducer,
        pieceIndex: pieceIndexReducer,
        piece: pieceReducer,
        playersOff: playersOffReducer,
        players: playersReducer,
        positions: positionsReducer,
        resultats: resultatsReducer,
        retrySignal: retrySignalReducer,
        rows: rowsReducer,
        scoreList: scoreListReducer,
        score: scoreReducer,
        showHighScore: showHighScoreReducer,
        startPiece: startPieceReducer,
        tempName: tempNameReducer,
        time: timeReducer,
        url: urlReducer
      }
    });
  });

  test('bestScore reducer', () => {
    const scores = [{ name: 'Player1', score: 1000 }];
    store.dispatch({ type: 'bestScore/setBestScore', payload: scores });
    expect(store.getState().bestScore).toEqual(scores);
  });

  test('catalogPieces reducer', () => {
    const pieces = [[[1]]];
    store.dispatch({ type: 'catalogPieces/modifyCatalogPieces', payload: pieces });
    expect(store.getState().catalogPieces).toEqual(pieces);
  });

  test('checkUrl reducer', () => {
    store.dispatch({ type: 'checkUrl/modifyCheckUrl', payload: true });
    expect(store.getState().checkUrl).toBe(true);
  });

  test('keyDown reducer', () => {
    store.dispatch({ type: 'keyDown/modifyKeyDown', payload: true });
    expect(store.getState().keyDown).toBe(true);
  });

  test('lastMalus reducer', () => {
    store.dispatch({ type: 'lastMalus/lastMalusOn' });
    expect(store.getState().lastMalus).toBe(true);
  });

  test('oldUrl reducer', () => {
    store.dispatch({ type: 'oldUrl/modifyOldUrl', payload: 'test' });
    expect(store.getState().oldUrl).toBe('test');
  });

  test('pieceIndex reducer', () => {
    store.dispatch({ type: 'pieceIndex/setPieceIndex', payload: 1 });
    expect(store.getState().pieceIndex).toBe(1);
  });

  test('piece reducer', () => {
    const piece = { type: 'T', rotation: 0 };
    store.dispatch({ type: 'piece/modifyPiece', payload: piece });
    expect(store.getState().piece).toEqual(piece);
  });

  test('playersOff reducer', () => {
    const players = ['Player1', 'Player2'];
    store.dispatch({ type: 'playersOff/modifyPlayersOff', payload: players });
    expect(store.getState().playersOff).toEqual(players);
  });

  test('players reducer', () => {
    const players = [{ name: 'Player1', score: 0 }];
    store.dispatch({ type: 'players/modifyPlayers', payload: players });
    expect(store.getState().players).toEqual(players);
  });

  test('positions reducer', () => {
    const positions = [{ x: 4, y: 0 }];
    store.dispatch({ type: 'positions/modifyPositions', payload: positions });
    expect(store.getState().positions).toEqual(positions);
  });

  test('resultats reducer', () => {
    store.dispatch({ type: 'resultats/modifyResultats', payload: 'Game Over' });
    expect(store.getState().resultats).toBe('Game Over');
  });

  test('retrySignal reducer', () => {
    store.dispatch({ type: 'retrySignal/modifyRetrySignal', payload: true });
    expect(store.getState().retrySignal).toBe(true);
  });

  test('scoreList reducer', () => {
    const scores = [{ name: 'Player1', score: 1000 }];
    store.dispatch({ type: 'scoreList/modifyScoreList', payload: scores });
    expect(store.getState().scoreList).toEqual(scores);
  });

  test('showHighScore reducer', () => {
    store.dispatch({ type: 'showHighScore/modifyShowHighScore', payload: true });
    expect(store.getState().showHighScore).toBe(true);
  });

  test('tempName reducer', () => {
    store.dispatch({ type: 'tempName/modifyTempName', payload: 'Player1' });
    expect(store.getState().tempName).toBe('Player1');
  });

  test('url reducer', () => {
    store.dispatch({ type: 'url/modifyUrl', payload: 'test' });
    expect(store.getState().url).toBe('test');
  });

  test('addMalusGo reducer', () => {
    store.dispatch({ type: 'addMalusGo/modifyAddMalusGo', payload: 1 });
    expect(store.getState().addMalusGo).toBe(1);
  });

  test('back reducer', () => {
    store.dispatch({ type: 'back/backOn' });
    expect(store.getState().back).toBe(true);
  });

  test('changeOk reducer', () => {
    store.dispatch({ type: 'changeOk/changeOkOn' });
    expect(store.getState().changeOk).toBe(true);
  });

  test('createRoom reducer', () => {
    store.dispatch({ type: 'createRoom/createRoomOn' });
    expect(store.getState().createRoom).toBe(true);
  });

  test('gameLaunched reducer', () => {
    store.dispatch({ type: 'gameLaunched/gameLaunchedOn' });
    expect(store.getState().gameLaunched).toBe(true);
  });

  test('gameOver reducer', () => {
    store.dispatch({ type: 'gameOver/gameOverOn' });
    expect(store.getState().gameOver).toBe(true);
  });

  test('leader reducer', () => {
    store.dispatch({ type: 'leader/leaderOn' });
    expect(store.getState().leader).toBe(true);
  });

  test('malus reducer', () => {
    store.dispatch({ type: 'malus/modifyMalus', payload: 2 });
    expect(store.getState().malus).toBe(2);
  });

  test('multi reducer', () => {
    store.dispatch({ type: 'multi/multiOn' });
    expect(store.getState().multi).toBe(true);
  });

  test('music reducer', () => {
    store.dispatch({ type: 'music/musicOn' });
    expect(store.getState().music).toBe(true);
  });

  test('noName reducer', () => {
    store.dispatch({ type: 'noName/noNameOn' });
    expect(store.getState().noName).toBe(true);
  });

  test('rows reducer', () => {
    const rows = Array(20).fill().map(() => Array(10).fill(0));
    store.dispatch({ type: 'rows/modifyRows', payload: rows });
    expect(store.getState().rows).toEqual(rows);
  });

  test('score reducer', () => {
    store.dispatch({ type: 'score/modifyScore', payload: 1000 });
    expect(store.getState().score).toBe(1000);
  });

  test('startPiece reducer', () => {
    store.dispatch({ type: 'startPiece/modifyStartPiece', payload: true });
    expect(store.getState().startPiece).toBe(true);
  });

  test('time reducer', () => {
    store.dispatch({ type: 'time/modifyTime', payload: 1000 });
    expect(store.getState().time).toBe(1000);
  });
});
