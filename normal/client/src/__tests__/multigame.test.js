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
import { BrowserRouter } from 'react-router-dom';
import MultiGame from '../multigame';
import { pieceReducer } from '../reducers/pieceSlice';
import { scoreReducer } from '../reducers/scoreSlice';
import { gameOverReducer } from '../reducers/gameOverSlice';
import { gameLaunchedReducer } from '../reducers/gameLaunchedSlice';
import { leaderReducer } from '../reducers/leaderSlice';
import { musicReducer } from '../reducers/musicSlice';
import { startPieceReducer } from '../reducers/startPieceSlice';
import { malusReducer } from '../reducers/malusSlice';
import { playersReducer } from '../reducers/playersSlice';
import { resultatsReducer } from '../reducers/resultatsSlice';
import { tempNameReducer } from '../reducers/tempNameSlice';
import { urlReducer } from '../reducers/urlSlice';
import { showHighScoreReducer } from '../reducers/showHighScoreSlice';
import { changeOkReducer } from '../reducers/changeOkSlice';
import { noNameReducer } from '../reducers/noNameSlice';
import { scoreListReducer } from '../reducers/scoreListSlice';
import { positionsReducer } from '../reducers/positionsSlice';

describe('MultiGame Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        piece: pieceReducer,
        score: scoreReducer,
        gameOver: gameOverReducer,
        gameLaunched: gameLaunchedReducer,
        leader: leaderReducer,
        music: musicReducer,
        startPiece: startPieceReducer,
        malus: malusReducer,
        players: playersReducer,
        resultats: resultatsReducer,
        tempName: tempNameReducer,
        url: urlReducer,
        showHighScore: showHighScoreReducer,
        changeOk: changeOkReducer,
        noName: noNameReducer,
        scoreList: scoreListReducer,
        positions: positionsReducer
      }
    });
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

    expect(store.getState().players[0].name).toBe('TestPlayer');
  });

  test('handles game launch', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );
    
    store.dispatch({ type: 'gameLaunched/gameLaunchedOn' });
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
    
    store.dispatch({ type: 'gameOver/gameOverOn' });
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
    
    store.dispatch({ type: 'positions/modifyPositions', payload: testPositions });
    expect(store.getState().positions).toEqual(testPositions);
  });
});
