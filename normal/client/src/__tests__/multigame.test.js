import { configureStore } from '@reduxjs/toolkit';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      multi: (state = false, action) => 
        action.type === 'multi/setMulti' ? action.payload : state,
      players: (state = [], action) => 
        action.type === 'players/setPlayers' ? action.payload : state,
      playersOff: (state = [], action) => 
        action.type === 'playersOff/setPlayersOff' ? action.payload : state,
      resultats: (state = 'Game Over', action) => 
        action.type === 'resultats/changeResultats' ? action.payload : state,
      leader: (state = false, action) => 
        action.type === 'leader/setLeader' ? action.payload : state,
      gameLaunched: (state = false, action) => 
        action.type === 'gameLaunched/setGameLaunched' ? action.payload : state,
      createRoom: (state = false, action) => 
        action.type === 'createRoom/setCreateRoom' ? action.payload : state,
      url: (state = '', action) => 
        action.type === 'url/setUrl' ? action.payload : state
    },
    preloadedState: initialState
  });
};

describe('Multigame Actions', () => {
  let store;

  beforeEach(() => {
    store = createMockStore({
      multi: false,
      players: [],
      playersOff: [],
      resultats: 'Game Over',
      leader: false,
      gameLaunched: false,
      createRoom: false,
      url: ''
    });
  });

  test('sets multi mode', () => {
    store.dispatch({ type: 'multi/setMulti', payload: true });
    expect(store.getState().multi).toBe(true);
  });

  test('updates players list', () => {
    const players = ['Player1', 'Player2'];
    store.dispatch({ type: 'players/setPlayers', payload: players });
    expect(store.getState().players).toEqual(players);
  });

  test('updates offline players list', () => {
    const playersOff = ['Player3', 'Player4'];
    store.dispatch({ type: 'playersOff/setPlayersOff', payload: playersOff });
    expect(store.getState().playersOff).toEqual(playersOff);
  });

  test('updates game results', () => {
    const resultats = [
      { player: 'Player1', score: 1000 },
      { player: 'Player2', score: 800 }
    ];
    store.dispatch({ type: 'resultats/changeResultats', payload: resultats });
    expect(store.getState().resultats).toEqual(resultats);
  });

  test('sets leader status', () => {
    store.dispatch({ type: 'leader/setLeader', payload: true });
    expect(store.getState().leader).toBe(true);
  });

  test('sets game launched status', () => {
    store.dispatch({ type: 'gameLaunched/setGameLaunched', payload: true });
    expect(store.getState().gameLaunched).toBe(true);
  });

  test('sets create room status', () => {
    store.dispatch({ type: 'createRoom/setCreateRoom', payload: true });
    expect(store.getState().createRoom).toBe(true);
  });

  test('sets game URL', () => {
    const url = 'test-room';
    store.dispatch({ type: 'url/setUrl', payload: url });
    expect(store.getState().url).toBe(url);
  });

  test('handles multiple state changes', () => {
    // Set multi mode and add players
    store.dispatch({ type: 'multi/setMulti', payload: true });
    store.dispatch({ type: 'players/setPlayers', payload: ['Player1', 'Player2'] });
    
    const state = store.getState();
    expect(state.multi).toBe(true);
    expect(state.players).toEqual(['Player1', 'Player2']);
  });

  test('resets game state', () => {
    // First set some state
    store.dispatch({ type: 'multi/setMulti', payload: true });
    store.dispatch({ type: 'players/setPlayers', payload: ['Player1', 'Player2'] });
    store.dispatch({ type: 'leader/setLeader', payload: true });
    
    // Reset state
    store.dispatch({ type: 'multi/setMulti', payload: false });
    store.dispatch({ type: 'players/setPlayers', payload: [] });
    store.dispatch({ type: 'leader/setLeader', payload: false });
    
    const state = store.getState();
    expect(state.multi).toBe(false);
    expect(state.players).toEqual([]);
    expect(state.leader).toBe(false);
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as reducers from '../reducers';
import MultiGame from '../multigame';

let store;

describe('MultiGame Component', () => {
  beforeEach(() => {
    store = configureStore({
      reducer: {
        rows: reducers.rowsReducer,
        piece: reducers.pieceReducer,
        positions: reducers.positionsReducer,
        score: reducers.scoreReducer,
        gameOver: reducers.gameOverReducer,
        malus: reducers.malusReducer,
        multi: reducers.multiReducer,
        players: reducers.playersReducer,
        url: reducers.urlReducer,
        noName: reducers.noNameReducer,
        tempName: reducers.tempNameReducer,
        oldUrl: reducers.oldUrlReducer,
        back: reducers.backReducer,
        changeOk: reducers.changeOkReducer,
        checkUrl: reducers.checkUrlReducer,
        time: reducers.timeReducer,
        gameLaunched: reducers.gameLaunchedReducer,
        leader: reducers.leaderReducer,
        music: reducers.musicReducer,
        keyDown: reducers.keyDownReducer,
        startPiece: reducers.startPieceReducer,
        pieceIndex: reducers.pieceIndexReducer,
        lastMalus: reducers.lastMalusReducer,
        addMalusGo: reducers.addMalusGoReducer,
        retrySignal: reducers.retrySignalReducer,
        bestScore: reducers.bestScoreReducer,
        showHighScore: reducers.showHighScoreReducer,
        scoreList: reducers.scoreListReducer,
        playersOff: reducers.playersOffReducer,
        catalogPieces: reducers.catalogPiecesReducer,
        resultats: reducers.resultatsReducer
      },
      preloadedState: {
        rows: Array(20).fill().map(() => Array(10).fill(0)),
        piece: { type: 'I', rotation: 0 },
        positions: [],
        score: 0,
        gameOver: false,
        malus: 0,
        multi: false,
        players: [],
        url: '',
        noName: false,
        tempName: '',
        oldUrl: '',
        back: false,
        changeOk: false,
        checkUrl: false,
        time: 1000,
        gameLaunched: false,
        leader: false,
        music: false,
        keyDown: '',
        startPiece: false,
        pieceIndex: 0,
        lastMalus: 0,
        addMalusGo: false,
        retrySignal: false,
        bestScore: 0,
        showHighScore: false,
        scoreList: [],
        playersOff: [],
        catalogPieces: [],
        resultats: 'Game Over'
      }
    });
  });

  test('renders game board', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MultiGame />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // Vérifier que le plateau de jeu est présent
    const gameBoard = screen.getByTestId('multi-game-board');
    expect(gameBoard).toBeInTheDocument();
  });

  test('displays game over message when game is over', () => {
    store.dispatch({ type: 'gameOver/gameOverOn' });
    store.dispatch({ type: 'resultats/changeResultats', payload: 'Game Over' });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MultiGame />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const gameOverMessage = screen.getByText('Game Over');
    expect(gameOverMessage).toBeInTheDocument();
  });

  test('displays player scores', () => {
    const players = [
      { name: 'Player 1', score: 100 },
      { name: 'Player 2', score: 200 }
    ];

    store.dispatch({ type: 'players/fillPlayers', payload: players });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MultiGame />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    // Vérifier que les noms et scores des joueurs sont affichés
    const player1Name = screen.getByText('Player 1');
    const player2Name = screen.getByText('Player 2');
    const player1Score = screen.getByText('Score: 100');
    const player2Score = screen.getByText('Score: 200');

    expect(player1Name).toBeInTheDocument();
    expect(player2Name).toBeInTheDocument();
    expect(player1Score).toBeInTheDocument();
    expect(player2Score).toBeInTheDocument();
  });
});
