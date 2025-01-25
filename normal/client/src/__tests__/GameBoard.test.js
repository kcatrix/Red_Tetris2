import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import reducers from '../reducers';
import MultiGame from '../multigame';
import { BrowserRouter } from 'react-router-dom';

describe('GameBoard Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: reducers,
      preloadedState: {
        rows: Array(20).fill().map(() => Array(10).fill(0)),
        piece: null,
        positions: [],
        score: 0,
        gameOver: false,
        malus: 0,
        multi: false,
        players: [],
        url: '',
        noName: true,
        tempName: '',
        oldUrl: '',
        time: 0,
        catalogPieces: [],
        pieceIndex: 0,
        back: false,
        showHighScore: false,
        scoreList: [],
        music: false,
        retrySignal: false,
        changeOk: false,
        lastMalus: 0,
        startPiece: false,
        bestScore: 0,
        addMalusGo: false,
        gameLaunched: false,
        leader: false,
        resultats: ''
      }
    });

    // Mock Audio
    window.Audio = jest.fn().mockImplementation(() => ({
      play: jest.fn(),
      pause: jest.fn(),
      loop: false
    }));
  });

  test('renders game component', () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    const appContainer = container.querySelector('.App');
    expect(appContainer).toBeInTheDocument();
  });

  test('displays game state elements', () => {
    store.dispatch({ type: 'score/setScore', payload: 100 });
    store.dispatch({ type: 'tempName/changeTempName', payload: 'Player1' });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    // Vérifier que le nom du joueur est affiché
    expect(screen.getByText('Player1')).toBeInTheDocument();
  });

  test('handles game over state', () => {
    store.dispatch({ type: 'gameOver/setGameOver', payload: true });
    store.dispatch({ type: 'resultats/changeResultats', payload: 'Game Over!' });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Game Over!')).toBeInTheDocument();
  });

  test('handles multiplayer state', () => {
    store.dispatch({ type: 'multi/setMulti', payload: true });
    store.dispatch({ type: 'players/setPlayers', payload: ['Player1', 'Player2'] });

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
