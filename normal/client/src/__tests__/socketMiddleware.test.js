import socketMiddleware from '../middleware/socketMiddleware';
import configureStore from 'redux-mock-store';
import io from 'socket.io-client';

jest.mock('socket.io-client', () => {
  const emit = jest.fn();
  const on = jest.fn();
  const socket = { emit, on };
  return jest.fn(() => socket);
});

describe('Socket Middleware', () => {
  let mockStore;
  let store;
  let socket;

  beforeEach(() => {
    socket = io();
    mockStore = configureStore([socketMiddleware]);
    store = mockStore({
      url: 'test-room',
      tempName: 'Player1',
      piece: [],
      catalogPieces: [],
      multi: false,
      checkUrl: '',
      changeOk: false,
      createRoom: false,
      showHighScore: false,
      scoreList: [],
      noName: false,
      oldUrl: '',
      leader: false,
      bestScore: 0,
      rows: [],
      gameLaunched: false,
      score: 0,
      resultats: [],
      playersOff: [],
      retrySignal: false,
      lastMalus: 0,
      keyDown: '',
      gameOver: false,
      pieceIndex: 0,
      startPiece: false,
      positions: [],
      music: false,
      malus: 0,
      addMalusGo: false,
      time: 0,
      players: []
    });
  });

  test('middleware handles socket connection', () => {
    expect(io).toHaveBeenCalled();
    expect(socket.on).toHaveBeenCalledWith('connect', expect.any(Function));
  });

  test('middleware handles socket events', () => {
    const events = [
      'createGameRoom',
      'changestatusPlayer',
      'gameLaunched',
      'gameOver',
      'retry',
      'addMalus',
      'updateScore',
      'updateTime'
    ];

    events.forEach(event => {
      expect(socket.on).toHaveBeenCalledWith(event, expect.any(Function));
    });
  });

  test('middleware handles error events', () => {
    expect(socket.on).toHaveBeenCalledWith('connect_error', expect.any(Function));
    expect(socket.on).toHaveBeenCalledWith('connect_timeout', expect.any(Function));
  });

  test('middleware handles disconnect event', () => {
    expect(socket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
  });

  test('middleware handles reconnect event', () => {
    expect(socket.on).toHaveBeenCalledWith('reconnect', expect.any(Function));
  });
});
