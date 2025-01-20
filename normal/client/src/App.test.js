import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Create a mock store
const mockStore = configureStore({
  reducer: {
    catalogPieces: (state = [], action) => state,
    multi: (state = false, action) => state,
    url: (state = '', action) => state,
    back: (state = false, action) => state,
    piece: (state = null, action) => state,
    positions: (state = [], action) => state,
    rows: (state = 0, action) => state,
    score: (state = 0, action) => state,
    time: (state = 0, action) => state,
    gameOver: (state = false, action) => state,
    malus: (state = 0, action) => state,
    players: (state = [], action) => state,
    playersOff: (state = [], action) => state,
    resultats: (state = [], action) => state,
    leader: (state = false, action) => state,
    gameLaunched: (state = false, action) => state,
    music: (state = true, action) => state,
    noName: (state = false, action) => state,
    tempName: (state = '', action) => state,
    createRoom: (state = false, action) => state,
    changeOk: (state = false, action) => state,
    retrySignal: (state = false, action) => state,
    startPiece: (state = false, action) => state,
    pieceIndex: (state = 0, action) => state,
    lastMalus: (state = 0, action) => state,
    oldUrl: (state = '', action) => state,
    checkUrl: (state = false, action) => state,
    addMalusGo: (state = false, action) => state,
    keyDown: (state = false, action) => state,
    showHighScore: (state = false, action) => state,
    bestScore: (state = [], action) => state,
    scoreList: (state = [], action) => state
  },
  preloadedState: {
    tempName: 'TestPlayer'
  }
});

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
  });
});
