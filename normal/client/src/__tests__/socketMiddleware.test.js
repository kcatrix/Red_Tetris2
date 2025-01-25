import { createSocketMiddleware } from '../middleware/socketMiddleware';
import { configureStore } from '@reduxjs/toolkit';
import reducers from '../reducers';

describe('Socket Middleware', () => {
  let mockSocket;
  let store;
  let middleware;

  beforeEach(() => {
    mockSocket = {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn()
    };

    middleware = createSocketMiddleware(mockSocket);

    store = configureStore({
      reducer: reducers,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware)
    });
  });

  test('passes through non-socket actions', () => {
    const action = { type: 'TEST_ACTION' };
    store.dispatch(action);
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });

  test('emits socket events for socket actions', () => {
    const action = { type: 'socket/emit', payload: { event: 'test', data: 'data' } };
    store.dispatch(action);
    expect(mockSocket.emit).toHaveBeenCalledWith('test', 'data');
  });

  test('sets up socket event listeners', () => {
    const expectedEvents = [
      'GAME_LAUNCHED',
      'GAME_OVER',
      'MALUS',
      'NEW_PIECES',
      'NEW_PLAYER',
      'NEW_SCORE',
      'PLAYERS',
      'RESULTATS',
      'ROWS',
      'START_PIECE'
    ];

    expectedEvents.forEach(event => {
      expect(mockSocket.on).toHaveBeenCalledWith(event, expect.any(Function));
    });
  });
});
