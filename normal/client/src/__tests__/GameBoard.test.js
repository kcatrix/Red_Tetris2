import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import MultiGame from '../multigame';

describe('GameBoard Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        rows: (state = Array(20).fill().map(() => Array(10).fill(0)), action) =>
          action.type === 'rows/modifyRows' ? action.payload : state,
        piece: (state = { type: 'T', rotation: 0 }, action) =>
          action.type === 'piece/modifyPiece' ? action.payload : state,
        positions: (state = [{ x: 4, y: 0 }], action) =>
          action.type === 'positions/modifyPositions' ? action.payload : state,
        gameOver: (state = false, action) =>
          action.type === 'gameOver/gameOverOn' ? true : state,
        score: (state = 0, action) =>
          action.type === 'score/modifyScore' ? action.payload : state,
        players: (state = [], action) =>
          action.type === 'players/modifyPlayers' ? action.payload : state,
        playersOff: (state = [], action) =>
          action.type === 'playersOff/modifyPlayersOff' ? action.payload : state,
        resultats: (state = '', action) =>
          action.type === 'resultats/modifyResultats' ? action.payload : state
      }
    });
  });

  test('renders game board with correct dimensions', () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    const rows = container.querySelectorAll('.row');
    expect(rows).toHaveLength(20);

    const cells = container.querySelectorAll('.cell');
    expect(cells).toHaveLength(200); // 20 rows * 10 columns
  });

  test('displays game over message when game is over', () => {
    store.dispatch({ type: 'gameOver/gameOverOn' });
    store.dispatch({ type: 'resultats/modifyResultats', payload: 'Game Over' });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Game Over')).toBeInTheDocument();
  });

  test('displays current score', () => {
    store.dispatch({ type: 'score/modifyScore', payload: 1000 });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Score: 1000')).toBeInTheDocument();
  });

  test('displays player list', () => {
    const players = [
      { name: 'Player1', score: 100 },
      { name: 'Player2', score: 200 }
    ];
    store.dispatch({ type: 'players/modifyPlayers', payload: players });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Player1')).toBeInTheDocument();
    expect(screen.getByText('Player2')).toBeInTheDocument();
  });
});
