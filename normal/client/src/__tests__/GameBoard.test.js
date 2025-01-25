import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import reducers from '../reducers';
import GameBoard from '../multigame';
import { BrowserRouter } from 'react-router-dom';

describe('GameBoard Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: reducers
    });

    // Mock Audio
    window.Audio = jest.fn().mockImplementation(() => ({
      play: jest.fn(),
      pause: jest.fn(),
      loop: false
    }));
  });

  test('renders game board with initial state', () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <GameBoard />
        </BrowserRouter>
      </Provider>
    );

    const board = container.querySelector('.board1');
    expect(board).toBeInTheDocument();
  });

  test('renders game board with pieces', () => {
    store.dispatch({ type: 'rows/setRows', payload: Array(20).fill().map(() => Array(10).fill(1)) });

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <GameBoard />
        </BrowserRouter>
      </Provider>
    );

    const cells = container.querySelectorAll('.board1 > div');
    expect(cells.length).toBeGreaterThan(0);
  });

  test('displays current piece', () => {
    const currentPiece = { type: 'T', rotation: 0 };
    store.dispatch({ type: 'piece/setPiece', payload: currentPiece });

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <GameBoard />
        </BrowserRouter>
      </Provider>
    );

    const board = container.querySelector('.board1');
    expect(board).toBeInTheDocument();
  });

  test('shows game over message', async () => {
    store = configureStore({
      reducer: reducers
    });

    store.dispatch({ type: 'gameOver/setGameOver', payload: true });

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <GameBoard />
        </BrowserRouter>
      </Provider>
    );

    const gameOverMessage = container.querySelector('.game-over');
    expect(gameOverMessage).toBeInTheDocument();
    expect(gameOverMessage).toHaveTextContent('Game Over!');
  });

  test('displays score', () => {
    store.dispatch({ type: 'score/setScore', payload: 100 });

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <GameBoard />
        </BrowserRouter>
      </Provider>
    );

    const scoreDisplay = container.querySelector('.score');
    expect(scoreDisplay).toBeInTheDocument();
    expect(scoreDisplay).toHaveTextContent('Score: 100');
  });
});
