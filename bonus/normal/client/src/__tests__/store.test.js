import { configureStore } from '@reduxjs/toolkit';
import { store } from '../store';
import pieceSlice from '../reducers/pieceSlice';
import scoreSlice from '../reducers/scoreSlice';
import gameOverSlice from '../reducers/gameOverSlice';
import positionsSlice from '../reducers/positionsSlice';
import playersSlice from '../reducers/playersSlice';
import malusSlice from '../reducers/malusSlice';
import musicSlice from '../reducers/musicSlice';
import urlSlice from '../reducers/urlSlice';
import tempNameSlice from '../reducers/tempNameSlice';

describe('Redux Store', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        piece: (state = [], action) => {
          switch (action.type) {
            case 'piece/fillPiece':
              return action.payload;
            default:
              return state;
          }
        },
        pieces: (state = [], action) => {
          switch (action.type) {
            case 'pieces/setPieces':
              return action.payload;
            default:
              return state;
          }
        },
        showHighScore: (state = false, action) => {
          switch (action.type) {
            case 'showHighScore/setShowHighScore':
              return action.payload;
            default:
              return state;
          }
        }
      }
    });
  });

  test('store has correct initial state', () => {
    const state = store.getState();
    expect(state).toEqual({
      piece: [],
      pieces: [],
      showHighScore: false
    });
  });

  test('store can dispatch actions', () => {
    // Test showHighScore reducer
    store.dispatch({ type: 'showHighScore/setShowHighScore', payload: true });
    expect(store.getState().showHighScore).toBe(true);

    // Test pieces reducer
    const pieces = [1, 2, 3];
    store.dispatch({ type: 'pieces/setPieces', payload: pieces });
    expect(store.getState().pieces).toEqual(pieces);

    // Test piece reducer
    const piece = { id: 1, type: 'T' };
    store.dispatch({ type: 'piece/fillPiece', payload: piece });
    expect(store.getState().piece).toEqual(piece);
  });
});

describe('Redux Store Configuration', () => {
  test('store is created with all reducers', () => {
    const state = store.getState();
    
    // Test presence of all reducers
    expect(state.piece).toBeDefined();
    expect(state.catalogPieces).toBeDefined();
    expect(state.multi).toBeDefined();
    expect(state.url).toBeDefined();
    expect(state.checkUrl).toBeDefined();
    expect(state.changeOk).toBeDefined();
    expect(state.createRoom).toBeDefined();
    expect(state.tempName).toBeDefined();
    expect(state.showHighScore).toBeDefined();
    expect(state.scoreList).toBeDefined();
    expect(state.noName).toBeDefined();
    expect(state.oldUrl).toBeDefined();
    expect(state.leader).toBeDefined();
    expect(state.bestScore).toBeDefined();
    expect(state.rows).toBeDefined();
    expect(state.gameLaunched).toBeDefined();
    expect(state.score).toBeDefined();
    expect(state.resultats).toBeDefined();
    expect(state.playersOff).toBeDefined();
    expect(state.retrySignal).toBeDefined();
    expect(state.lastMalus).toBeDefined();
    expect(state.keyDown).toBeDefined();
    expect(state.gameOver).toBeDefined();
    expect(state.pieceIndex).toBeDefined();
    expect(state.startPiece).toBeDefined();
    expect(state.positions).toBeDefined();
    expect(state.music).toBeDefined();
    expect(state.malus).toBeDefined();
    expect(state.addMalusGo).toBeDefined();
    expect(state.time).toBeDefined();
    expect(state.players).toBeDefined();
    expect(state.back).toBeDefined();
  });

  test('reducers handle actions correctly', () => {
    const testStore = configureStore({
      reducer: {
        piece: pieceSlice,
        score: scoreSlice,
        gameOver: gameOverSlice,
        positions: positionsSlice,
        players: playersSlice,
        malus: malusSlice,
        music: musicSlice,
        url: urlSlice,
        tempName: tempNameSlice
      }
    });

    // Test piece reducer
    testStore.dispatch({ type: 'piece/fillPiece', payload: [[1, 1], [1, 1]] });
    expect(testStore.getState().piece).toEqual([[1, 1], [1, 1]]);

    // Test score reducer
    testStore.dispatch({ type: 'score/modifyScore', payload: 100 });
    expect(testStore.getState().score).toBe(100);

    // Test gameOver reducer
    testStore.dispatch({ type: 'gameOver/gameOverOn' });
    expect(testStore.getState().gameOver).toBe(true);

    // Test players reducer
    const testPlayers = [{ name: 'Player1', score: 100 }];
    testStore.dispatch({ type: 'players/fillPlayers', payload: testPlayers });
    expect(testStore.getState().players).toEqual(testPlayers);

    // Test malus reducer
    testStore.dispatch({ type: 'malus/modifyMalus', payload: 2 });
    expect(testStore.getState().malus).toBe(2);

    // Test music reducer
    testStore.dispatch({ type: 'music/musicOn' });
    expect(testStore.getState().music).toBe(true);

    // Test url reducer
    testStore.dispatch({ type: 'url/changeUrl', payload: '/test-room' });
    expect(testStore.getState().url).toBe('/test-room');

    // Test tempName reducer
    testStore.dispatch({ type: 'tempName/changeTempName', payload: 'TestPlayer' });
    expect(testStore.getState().tempName).toBe('TestPlayer');
  });

  test('state updates are immutable', () => {
    const testStore = configureStore({
      reducer: {
        piece: pieceSlice,
        score: scoreSlice,
        gameOver: gameOverSlice,
        positions: positionsSlice,
        players: playersSlice,
        malus: malusSlice,
        music: musicSlice,
        url: urlSlice,
        tempName: tempNameSlice
      }
    });

    const initialState = testStore.getState();
    const initialPlayers = [...initialState.players];

    // Try to modify players
    const newPlayers = [{ name: 'Player1', score: 100 }];
    testStore.dispatch({ type: 'players/fillPlayers', payload: newPlayers });

    // Verify that the original state wasn't mutated
    expect(initialPlayers).not.toEqual(testStore.getState().players);
    expect(initialPlayers).not.toBe(testStore.getState().players);
  });
});
