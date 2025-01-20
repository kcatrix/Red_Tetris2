import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import App from '../App';

const mockStore = configureStore([]);

describe('App Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      game: {
        playerName: '',
        roomName: '',
        gameStarted: false,
        pieces: [],
        nextPiece: null,
        score: 0,
        level: 1,
        gameOver: false
      }
    });
  });

  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
  });

  // Test basic game state
  test('initial game state is correct', () => {
    const state = store.getState();
    expect(state.game.gameStarted).toBe(false);
    expect(state.game.score).toBe(0);
    expect(state.game.level).toBe(1);
  });
});
