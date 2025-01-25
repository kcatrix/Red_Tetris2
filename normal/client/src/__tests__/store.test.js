import { configureStore } from '@reduxjs/toolkit';

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
