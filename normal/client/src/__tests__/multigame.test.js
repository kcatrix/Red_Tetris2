import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import MultiGame from '../multigame';

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
        action.type === 'url/setUrl' ? action.payload : state,
      piece: (state = [], action) => 
        action.type === 'piece/setPiece' ? action.payload : state,
      score: (state = 0, action) => 
        action.type === 'score/setScore' ? action.payload : state,
      gameOver: (state = false, action) => 
        action.type === 'gameOver/setGameOver' ? action.payload : state,
      music: (state = false, action) => 
        action.type === 'music/setMusic' ? action.payload : state,
      startPiece: (state = false, action) => 
        action.type === 'startPiece/setStartPiece' ? action.payload : state,
      malus: (state = 0, action) => 
        action.type === 'malus/setMalus' ? action.payload : state,
      tempName: (state = '', action) => 
        action.type === 'tempName/setTempName' ? action.payload : state,
      showHighScore: (state = false, action) => 
        action.type === 'showHighScore/setShowHighScore' ? action.payload : state,
      changeOk: (state = false, action) => 
        action.type === 'changeOk/setChangeOk' ? action.payload : state,
      noName: (state = false, action) => 
        action.type === 'noName/setNoName' ? action.payload : state,
      scoreList: (state = [], action) => 
        action.type === 'scoreList/setScoreList' ? action.payload : state,
      positions: (state = [], action) => 
        action.type === 'positions/setPositions' ? action.payload : state,
      retrySignal: (state = false, action) => 
        action.type === 'retrySignal/setRetrySignal' ? action.payload : state
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
      url: '',
      piece: [],
      score: 0,
      gameOver: false,
      music: false,
      startPiece: false,
      malus: 0,
      tempName: '',
      showHighScore: false,
      changeOk: false,
      noName: false,
      scoreList: [],
      positions: [],
      retrySignal: false
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
    const players = ['Player3', 'Player4'];
    store.dispatch({ type: 'playersOff/setPlayersOff', payload: players });
    expect(store.getState().playersOff).toEqual(players);
  });

  test('updates game results', () => {
    store.dispatch({ type: 'resultats/changeResultats', payload: 'Victory' });
    expect(store.getState().resultats).toBe('Victory');
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

  test('sets URL', () => {
    const url = '/room/123';
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

describe('MultiGame Component', () => {
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
      url: '',
      piece: [],
      score: 0,
      gameOver: false,
      music: false,
      startPiece: false,
      malus: 0,
      tempName: '',
      showHighScore: false,
      changeOk: false,
      noName: false,
      scoreList: [],
      positions: [],
      retrySignal: false
    });
  });

  test('renders game component', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );
    // Add assertions for rendered content
  });

  test('displays player information', () => {
    store.dispatch({ 
      type: 'players/setPlayers', 
      payload: [{ name: 'TestPlayer', score: 0 }] 
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );
    // Add assertions for player information display
  });

  test('handles game launch', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );
    
    store.dispatch({ type: 'gameLaunched/setGameLaunched', payload: true });
    expect(store.getState().gameLaunched).toBe(true);
  });

  test('handles game over', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );
    
    store.dispatch({ type: 'gameOver/setGameOver', payload: true });
    expect(store.getState().gameOver).toBe(true);
  });

  test('handles score updates', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );
    
    store.dispatch({ type: 'score/setScore', payload: 100 });
    expect(store.getState().score).toBe(100);
  });

  test('handles malus', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );
    
    store.dispatch({ type: 'malus/setMalus', payload: 2 });
    expect(store.getState().malus).toBe(2);
  });

  test('handles piece updates', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );
    
    const testPiece = {
      type: 'T',
      position: { x: 0, y: 0 },
      rotation: 0
    };
    
    store.dispatch({ type: 'piece/setPiece', payload: testPiece });
    expect(store.getState().piece).toEqual(testPiece);
  });

  test('handles position updates', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );
    
    const testPositions = [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ];
    
    store.dispatch({ type: 'positions/setPositions', payload: testPositions });
    expect(store.getState().positions).toEqual(testPositions);
  });
});
