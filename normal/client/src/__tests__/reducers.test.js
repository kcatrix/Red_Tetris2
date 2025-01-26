import { configureStore } from '@reduxjs/toolkit';
import { pieceReducer } from '../reducers/pieceSlice';
import { scoreReducer } from '../reducers/scoreSlice';
import { gameOverReducer } from '../reducers/gameOverSlice';
import { gameLaunchedReducer } from '../reducers/gameLaunchedSlice';
import { leaderReducer } from '../reducers/leaderSlice';
import { musicReducer } from '../reducers/musicSlice';
import { startPieceReducer } from '../reducers/startPieceSlice';
import { malusReducer } from '../reducers/malusSlice';
import { playersReducer } from '../reducers/playersSlice';
import { resultatsReducer } from '../reducers/resultatsSlice';
import { tempNameReducer } from '../reducers/tempNameSlice';
import { urlReducer } from '../reducers/urlSlice';
import positionsReducer, { resetPositions, modifyPositions, newPositions } from '../reducers/positionsSlice';
import { showHighScoreReducer } from '../reducers/showHighScoreSlice';
import { changeOkReducer } from '../reducers/changeOkSlice';
import { noNameReducer } from '../reducers/noNameSlice';
import { scoreListReducer } from '../reducers/scoreListSlice';

describe('Reducers', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        piece: pieceReducer,
        score: scoreReducer,
        gameOver: gameOverReducer,
        gameLaunched: gameLaunchedReducer,
        leader: leaderReducer,
        music: musicReducer,
        startPiece: startPieceReducer,
        malus: malusReducer,
        players: playersReducer,
        resultats: resultatsReducer,
        tempName: tempNameReducer,
        url: urlReducer,
        positions: positionsReducer,
        showHighScore: showHighScoreReducer,
        changeOk: changeOkReducer,
        noName: noNameReducer,
        scoreList: scoreListReducer
      }
    });
  });

  test('initial state', () => {
    const state = store.getState();
    expect(state.piece).toBeDefined();
    expect(state.score).toBeDefined();
    expect(state.gameOver).toBeDefined();
    expect(state.gameLaunched).toBeDefined();
    expect(state.leader).toBeDefined();
    expect(state.music).toBeDefined();
    expect(state.startPiece).toBeDefined();
    expect(state.malus).toBeDefined();
    expect(state.players).toBeDefined();
    expect(state.resultats).toBeDefined();
    expect(state.tempName).toBeDefined();
    expect(state.url).toBeDefined();
    expect(state.positions).toBeDefined();
    expect(state.showHighScore).toBeDefined();
    expect(state.changeOk).toBeDefined();
    expect(state.noName).toBeDefined();
    expect(state.scoreList).toBeDefined();
  });

  test('piece reducer', () => {
    store.dispatch({ type: 'piece/setPiece', payload: 'T' });
    expect(store.getState().piece).toBe('T');
  });

  test('score reducer', () => {
    store.dispatch({ type: 'score/setScore', payload: 100 });
    expect(store.getState().score).toBe(100);
  });

  test('gameOver reducer', () => {
    store.dispatch({ type: 'gameOver/gameOverOn' });
    expect(store.getState().gameOver).toBe(true);
  });

  test('gameLaunched reducer', () => {
    store.dispatch({ type: 'gameLaunched/gameLaunchedOn' });
    expect(store.getState().gameLaunched).toBe(true);
  });

  test('malus reducer', () => {
    store.dispatch({ type: 'malus/setMalus', payload: 2 });
    expect(store.getState().malus).toBe(2);
  });

  test('positions reducer', () => {
    const positions = [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    store.dispatch({ type: 'positions/setPositions', payload: positions });
    expect(store.getState().positions).toEqual(positions);
  });
});

describe('positionsSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        positions: positionsReducer
      }
    });
  });

  test('initial state', () => {
    expect(store.getState().positions).toEqual([{ x: 4, y: 0 }]);
  });

  test('resetPositions action', () => {
    // Setup initial state with multiple positions
    store.dispatch(newPositions());
    store.dispatch(modifyPositions({ pieceIndex: 0, newPosition: { x: 2, y: 3 } }));
    
    // Reset position for piece index 0
    store.dispatch(resetPositions(0));
    
    expect(store.getState().positions[0]).toEqual({ x: 4, y: 0 });
  });

  test('modifyPositions action', () => {
    const newPosition = { x: 2, y: 3 };
    store.dispatch(modifyPositions({ pieceIndex: 0, newPosition }));
    
    expect(store.getState().positions[0]).toEqual(newPosition);
  });

  test('newPositions action', () => {
    store.dispatch(newPositions());
    
    expect(store.getState().positions).toEqual([
      { x: 4, y: 0 },
      { x: 4, y: 0 }
    ]);
  });

  test('newPositions action', () => {
    store.dispatch(newPositions());
    expect(store.getState().positions).toEqual([{ x: 4, y: 0 }, { x: 0, y: 0 }]);
  });

  test('modifyPositions action', () => {
    store.dispatch(newPositions());
    store.dispatch(modifyPositions({ pieceIndex: 0, newPosition: { x: 2, y: 3 } }));
    expect(store.getState().positions[0]).toEqual({ x: 2, y: 3 });
  });

  test('newPositions action', () => {
    store.dispatch(newPositions());
    expect(store.getState().positions).toEqual([{ x: 4, y: 0 }, { x: 0, y: 0 }]); // Exemple de nouvelle position
  });

  test('modifyPositions action', () => {
    store.dispatch(newPositions());
    store.dispatch(modifyPositions({ pieceIndex: 0, newPosition: { x: 2, y: 3 } }));
    expect(store.getState().positions[0]).toEqual({ x: 2, y: 3 });
  });
});
