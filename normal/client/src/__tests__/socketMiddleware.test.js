import { configureStore } from '@reduxjs/toolkit';
import { equal, checkRowsEqual, resetGameOver, launchGame, Retry } from '../middleware/socketMiddleware';

// Mock socket.io-client
jest.mock('socket.io-client');

describe('Socket Middleware', () => {
  let store;
  let mockSocket;
  let next;

  beforeEach(() => {
    mockSocket = {
      emit: jest.fn(),
      on: jest.fn()
    };

    store = configureStore({
      reducer: {
        piece: (state = {}, action) => state,
        score: (state = 0, action) => state,
        gameOver: (state = false, action) => state,
        gameLaunched: (state = false, action) => state,
        leader: (state = false, action) => state,
        music: (state = false, action) => state,
        startPiece: (state = null, action) => state,
        malus: (state = 0, action) => state,
        players: (state = [], action) => state,
        resultats: (state = '', action) => state,
        positions: (state = [], action) => state,
        showHighScore: (state = false, action) => state,
        changeOk: (state = false, action) => state,
        noName: (state = false, action) => state,
        scoreList: (state = [], action) => state,
        url: (state = '', action) => state,
        tempName: (state = '', action) => state
      }
    });

    next = jest.fn();
  });

  describe('Utility Functions', () => {
    test('equal function correctly checks if all cells in a row are equal', () => {
      const row = [1, 1, 1];
      expect(equal(row, 1)).toBe(true);
      expect(equal(row, 0)).toBe(false);
    });

    test('checkRowsEqual function correctly checks rows in a range', () => {
      const rows = [
        [1, 1, 1],
        [1, 1, 1],
        [0, 0, 0]
      ];
      expect(checkRowsEqual(rows, 0, 1, 1)).toBe(true);
      expect(checkRowsEqual(rows, 0, 2, 1)).toBe(false);
    });
  });

  describe('Game Management Functions', () => {
    test('resetGameOver function resets game state correctly', () => {
      const state = {
        gameOver: true,
        score: 100
      };
      resetGameOver(state, store, mockSocket);
      expect(mockSocket.emit).toHaveBeenCalledWith('changestatusPlayer', 'room1', 'player1', false);
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'musicOn' });
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'gameLaunchedOff' });
    });

    test('launchGame function initializes game correctly', () => {
      const state = {
        gameLaunched: false
      };
      launchGame(state, store, mockSocket);
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'gameLaunchedOn' });
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'changeResultats', payload: "Game over" });
      expect(mockSocket.emit).toHaveBeenCalledWith('changestatusPlayer', 'room1', 'player1', true);
      expect(mockSocket.emit).toHaveBeenCalledWith('gameStarted', 'room1');
    });

    test('Retry function handles retry correctly', () => {
      const state = {
        gameOver: true,
        score: 100
      };
      Retry(state, store, mockSocket);
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'modifyLastMalus', payload: 0 });
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'changeKeyDown', payload: "null" });
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'gameOverOff' });
      expect(mockSocket.emit).toHaveBeenCalledWith('changestatusPlayer', 'room1', 'player1', true);
      expect(mockSocket.emit).toHaveBeenCalledWith('all_retry', 'room1', 'player1');
    });
  });
});
