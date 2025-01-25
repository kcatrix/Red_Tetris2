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
import { configureStore } from '@reduxjs/toolkit';
import MultiGame from '../multigame';
import { BrowserRouter } from 'react-router-dom';
import reducers from '../reducers';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: reducers,
    preloadedState: initialState
  });
};

describe('MultiGame Component', () => {
  let store;

  beforeEach(() => {
    store = createTestStore({
      multi: false,
      players: [],
      playersOff: [],
      resultats: 'Game Over',
      leader: false,
      gameLaunched: false,
      createRoom: false,
      url: '',
      rows: [],
      piece: null,
      positions: [],
      score: 0,
      gameOver: false,
      malus: 0,
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
      addMalusGo: false
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

  test('displays player name when set', () => {
    store.dispatch({ type: 'tempName/changeTempName', payload: 'TestPlayer' });

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('TestPlayer')).toBeInTheDocument();
  });

  test('handles game state changes', () => {
    store.dispatch({ type: 'multi/setMulti', payload: true });
    store.dispatch({ type: 'gameLaunched/setGameLaunched', payload: true });
    
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    expect(store.getState().multi).toBe(true);
    expect(store.getState().gameLaunched).toBe(true);
  });
});
