import { createSocketMiddleware } from '../middleware/socketMiddleware';
import { configureStore } from '@reduxjs/toolkit';
import reducers from '../reducers';

describe('Socket Middleware', () => {
  let mockSocket;
  let store;
  let middleware;
  let mockState;

  beforeEach(() => {
    mockSocket = {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn()
    };

    middleware = createSocketMiddleware(mockSocket);

    store = configureStore({
      reducer: reducers,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware)
    });

    mockState = {
      url: 'test-room',
      tempName: 'Player1',
      multi: false,
      gameOver: false,
      score: 0,
      rows: Array(20).fill().map(() => Array(10).fill(0)),
      piece: null,
      malus: 0,
      players: [],
      time: 1000,
      gameLaunched: false,
      leader: false,
      music: false,
      startPiece: false,
      pieceIndex: 0,
      lastMalus: 0
    };
  });

  test('handles socket connection events', () => {
    // Simuler la connexion socket
    const connectCallback = mockSocket.on.mock.calls.find(call => call[0] === 'connect')[1];
    connectCallback();

    // Vérifier que les événements sont écoutés
    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('GAME_LAUNCHED', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('NEW_PIECES', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('PLAYERS', expect.any(Function));
  });

  test('emits player actions', () => {
    store.dispatch({ 
      type: 'socket/emit', 
      payload: { 
        event: 'joinRoom', 
        data: { room: 'test-room', player: 'Player1' } 
      } 
    });

    expect(mockSocket.emit).toHaveBeenCalledWith(
      'joinRoom',
      { room: 'test-room', player: 'Player1' }
    );
  });

  test('handles game state updates', () => {
    // Simuler la réception d'une mise à jour du jeu
    const gameUpdateCallback = mockSocket.on.mock.calls.find(
      call => call[0] === 'GAME_LAUNCHED'
    )[1];

    gameUpdateCallback({ started: true });

    expect(store.getState().gameLaunched).toBe(true);
  });

  test('handles player updates', () => {
    // Simuler la réception d'une mise à jour des joueurs
    const playersCallback = mockSocket.on.mock.calls.find(
      call => call[0] === 'PLAYERS'
    )[1];

    const players = ['Player1', 'Player2'];
    playersCallback(players);

    expect(store.getState().players).toEqual(players);
  });

  test('handles piece updates', () => {
    // Simuler la réception de nouvelles pièces
    const piecesCallback = mockSocket.on.mock.calls.find(
      call => call[0] === 'NEW_PIECES'
    )[1];

    const pieces = [
      { type: 'I', rotation: 0 },
      { type: 'T', rotation: 0 }
    ];
    piecesCallback(pieces);

    expect(store.getState().catalogPieces).toEqual(pieces);
  });

  test('handles game over state', () => {
    // Simuler la réception d'un game over
    const gameOverCallback = mockSocket.on.mock.calls.find(
      call => call[0] === 'GAME_OVER'
    )[1];

    gameOverCallback();

    expect(store.getState().gameOver).toBe(true);
  });

  test('handles malus updates', () => {
    // Simuler la réception d'un malus
    const malusCallback = mockSocket.on.mock.calls.find(
      call => call[0] === 'MALUS'
    )[1];

    malusCallback(2);

    expect(store.getState().malus).toBe(2);
  });

  test('handles score updates', () => {
    // Simuler la réception d'un nouveau score
    const scoreCallback = mockSocket.on.mock.calls.find(
      call => call[0] === 'NEW_SCORE'
    )[1];

    scoreCallback(1000);

    expect(store.getState().score).toBe(1000);
  });

  test('handles disconnection', () => {
    const disconnectCallback = mockSocket.on.mock.calls.find(
      call => call[0] === 'disconnect'
    )[1];

    disconnectCallback();

    expect(store.getState().gameLaunched).toBe(false);
    expect(store.getState().multi).toBe(false);
  });
});
