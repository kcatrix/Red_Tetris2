import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import MultiGame from '../multigame';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      piece: (state = null, action) => 
        action.type === 'piece/setPiece' ? action.payload : state,
      positions: (state = [], action) => 
        action.type === 'positions/setPositions' ? action.payload : state,
      rows: (state = Array(20).fill().map(() => Array(10).fill(0)), action) => 
        action.type === 'rows/setRows' ? action.payload : state,
      score: (state = 0, action) => 
        action.type === 'score/setScore' ? action.payload : state,
      time: (state = 0, action) => 
        action.type === 'time/setTime' ? action.payload : state,
      gameOver: (state = false, action) => 
        action.type === 'gameOver/setGameOver' ? action.payload : state,
      malus: (state = 0, action) => 
        action.type === 'malus/setMalus' ? action.payload : state,
      keyDown: (state = false, action) => 
        action.type === 'keyDown/setKeyDown' ? action.payload : state,
      startPiece: (state = false, action) => 
        action.type === 'startPiece/setStartPiece' ? action.payload : state,
      pieceIndex: (state = 0, action) => 
        action.type === 'pieceIndex/setPieceIndex' ? action.payload : state,
      multi: (state = false, action) => 
        action.type === 'multi/setMulti' ? action.payload : state,
      players: (state = [], action) => 
        action.type === 'players/setPlayers' ? action.payload : state,
      leader: (state = false, action) => 
        action.type === 'leader/setLeader' ? action.payload : state,
      music: (state = true, action) => 
        action.type === 'music/setMusic' ? action.payload : state,
      url: (state = '', action) => 
        action.type === 'url/setUrl' ? action.payload : state,
      tempName: (state = '', action) => 
        action.type === 'tempName/setTempName' ? action.payload : state,
      gameLaunched: (state = true, action) => 
        action.type === 'gameLaunched/setGameLaunched' ? action.payload : state,
      catalogPieces: (state = [], action) => 
        action.type === 'catalogPieces/setCatalogPieces' ? action.payload : state,
      retrySignal: (state = false, action) => 
        action.type === 'retrySignal/setRetrySignal' ? action.payload : state,
      gameover: (state = false, action) =>
        action.type === 'gameover/setGameover' ? action.payload : state,
      name: (state = 'Player1', action) =>
        action.type === 'name/setName' ? action.payload : state,
      resultat: (state = '', action) =>
        action.type === 'resultat/setResultat' ? action.payload : state,
      Playersoff: (state = [], action) =>
        action.type === 'Playersoff/setPlayersoff' ? action.payload : state,
      pieces: (state = [[]], action) =>
        action.type === 'pieces/setPieces' ? action.payload : state,
      Players: (state = [], action) =>
        action.type === 'Players/setPlayers' ? action.payload : state
    },
    preloadedState: initialState
  });
};

describe('MultiGame Component', () => {
  let store;

  beforeEach(() => {
    store = createMockStore({
      rows: Array(20).fill().map(() => Array(10).fill(0)),
      piece: { type: 'T', rotation: 0 },
      positions: [{ x: 4, y: 0 }],
      gameLaunched: true,
      gameOver: false,
      pieceIndex: 0,
      catalogPieces: [
        [
          [
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
          ],
          [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0]
          ]
        ]
      ],
      pieces: [
        [
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ]
      ],
      name: 'Player1',
      gameover: false,
      score: 0,
      time: 0,
      Players: [],
      Playersoff: []
    });

    // Mock Audio
    window.HTMLMediaElement.prototype.play = () => {};
    window.HTMLMediaElement.prototype.pause = () => {};
  });

  test('renders game board with correct dimensions', () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    const rows = container.querySelectorAll('.board .row');
    expect(rows).toHaveLength(20);

    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll('.cell');
    expect(cells).toHaveLength(10);
  });

  test('handles keyboard events', () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    // Test left arrow key
    fireEvent.keyDown(container, { key: 'ArrowLeft', code: 'ArrowLeft' });
    expect(store.getState().keyDown).toBe(true);

    // Test right arrow key
    fireEvent.keyDown(container, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(store.getState().keyDown).toBe(true);

    // Test down arrow key
    fireEvent.keyDown(container, { key: 'ArrowDown', code: 'ArrowDown' });
    expect(store.getState().keyDown).toBe(true);

    // Test up arrow key (rotation)
    fireEvent.keyDown(container, { key: 'ArrowUp', code: 'ArrowUp' });
    expect(store.getState().keyDown).toBe(true);
  });

  test('displays score', () => {
    store = createMockStore({
      ...store.getState(),
      score: 1000,
      rows: Array(20).fill().map(() => Array(10).fill(0)),
      gameover: false,
      gameLaunched: true
    });

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    const scoreElement = container.querySelector('.score');
    expect(scoreElement).toBeInTheDocument();
  });

  test('displays time', () => {
    store = createMockStore({
      ...store.getState(),
      time: 60,
      rows: Array(20).fill().map(() => Array(10).fill(0)),
      gameover: false,
      gameLaunched: true
    });

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    const timeElement = container.querySelector('.score');
    expect(timeElement).toBeInTheDocument();
  });

  test('shows game over state', () => {
    store = createMockStore({
      ...store.getState(),
      gameover: true,
      resultat: 'Game Over'
    });

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    const gameOverElement = container.querySelector('h2');
    expect(gameOverElement).toBeInTheDocument();
    expect(gameOverElement.textContent).toBe('Game Over');
  });
});
