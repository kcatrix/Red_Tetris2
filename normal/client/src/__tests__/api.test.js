import io from 'socket.io-client';
import { createSocketMiddleware } from '../middleware/socketMiddleware';
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
import { showHighScoreReducer } from '../reducers/showHighScoreSlice';
import { changeOkReducer } from '../reducers/changeOkSlice';
import { noNameReducer } from '../reducers/noNameSlice';
import { scoreListReducer } from '../reducers/scoreListSlice';
import { positionsReducer } from '../reducers/positionsSlice';

jest.mock('socket.io-client');

describe('API Tests', () => {
  let mockSocket;
  let store;

  beforeEach(() => {
    // Mock socket.io
    mockSocket = {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn()
    };

    io.mockReturnValue(mockSocket);

    // Create store with middleware
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
        showHighScore: showHighScoreReducer,
        changeOk: changeOkReducer,
        noName: noNameReducer,
        scoreList: scoreListReducer,
        positions: positionsReducer
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(createSocketMiddleware(mockSocket))
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Socket Connection', () => {
    test('connects to socket server', () => {
      expect(mockSocket.connect).toHaveBeenCalled();
    });

    test('disconnects from socket server', () => {
      store.dispatch({ type: 'socket/disconnect' });
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });

  describe('Game Events', () => {
    test('emits player action', () => {
      const action = { type: 'move', direction: 'left' };
      store.dispatch({ type: 'socket/playerAction', payload: action });
      expect(mockSocket.emit).toHaveBeenCalledWith('playerAction', action);
    });

    test('handles game start', () => {
      const gameData = { roomId: 'room1', players: ['player1', 'player2'] };
      mockSocket.on.mockImplementation((event, callback) => {
        if (event === 'gameStarted') {
          callback(gameData);
        }
      });

      store.dispatch({ type: 'socket/startGame', payload: gameData });
      expect(store.getState().gameLaunched).toBe(true);
    });

    test('handles piece updates', () => {
      const pieceData = { type: 'T', position: { x: 0, y: 0 }, rotation: 0 };
      mockSocket.on.mockImplementation((event, callback) => {
        if (event === 'updatePiece') {
          callback(pieceData);
        }
      });

      store.dispatch({ type: 'socket/updatePiece', payload: pieceData });
      expect(store.getState().piece).toEqual(pieceData);
    });

    test('handles score updates', () => {
      const scoreData = { score: 100, lines: 4 };
      mockSocket.on.mockImplementation((event, callback) => {
        if (event === 'updateScore') {
          callback(scoreData);
        }
      });

      store.dispatch({ type: 'socket/updateScore', payload: scoreData });
      expect(store.getState().score).toBe(scoreData.score);
    });
  });

  describe('Room Management', () => {
    test('creates room', () => {
      const roomData = { name: 'room1', maxPlayers: 4 };
      store.dispatch({ type: 'socket/createRoom', payload: roomData });
      expect(mockSocket.emit).toHaveBeenCalledWith('createRoom', roomData);
    });

    test('joins room', () => {
      const joinData = { roomId: 'room1', playerName: 'player1' };
      store.dispatch({ type: 'socket/joinRoom', payload: joinData });
      expect(mockSocket.emit).toHaveBeenCalledWith('joinRoom', joinData);
    });

    test('leaves room', () => {
      const leaveData = { roomId: 'room1', playerName: 'player1' };
      store.dispatch({ type: 'socket/leaveRoom', payload: leaveData });
      expect(mockSocket.emit).toHaveBeenCalledWith('leaveRoom', leaveData);
    });
  });

  describe('Player Management', () => {
    test('updates player list', () => {
      const players = [
        { id: '1', name: 'player1', score: 0 },
        { id: '2', name: 'player2', score: 0 }
      ];
      mockSocket.on.mockImplementation((event, callback) => {
        if (event === 'updatePlayers') {
          callback(players);
        }
      });

      store.dispatch({ type: 'socket/updatePlayers', payload: players });
      expect(store.getState().players).toEqual(players);
    });

    test('handles player disconnect', () => {
      const disconnectData = { playerId: '1', roomId: 'room1' };
      mockSocket.on.mockImplementation((event, callback) => {
        if (event === 'playerDisconnected') {
          callback(disconnectData);
        }
      });

      store.dispatch({ type: 'socket/playerDisconnected', payload: disconnectData });
      expect(store.getState().players).not.toContainEqual(expect.objectContaining({ id: '1' }));
    });
  });

  describe('Error Handling', () => {
    test('handles connection error', () => {
      const error = new Error('Connection failed');
      mockSocket.on.mockImplementation((event, callback) => {
        if (event === 'connect_error') {
          callback(error);
        }
      });

      store.dispatch({ type: 'socket/error', payload: error });
      expect(store.getState().resultats).toBe('Connection failed');
    });

    test('handles room error', () => {
      const error = 'Room is full';
      mockSocket.on.mockImplementation((event, callback) => {
        if (event === 'roomError') {
          callback(error);
        }
      });

      store.dispatch({ type: 'socket/roomError', payload: error });
      expect(store.getState().resultats).toBe('Room is full');
    });
  });
});
