import { configureStore } from '@reduxjs/toolkit';
import reducers from '../reducers';
import { fillPiece } from '../reducers/pieceSlice';
import { changeTempName } from '../reducers/tempNameSlice';
import { changeUrl } from '../reducers/urlSlice';
import { showHighScoreOn } from '../reducers/showHighScoreSlice';
import { multiOn, multiOff } from '../reducers/multiSlice';
import { setRows } from '../reducers/rowsSlice';
import { setScore } from '../reducers/scoreSlice';
import { gameOverOn, gameOverOff } from '../reducers/gameOverSlice';
import { setMalus } from '../reducers/malusSlice';
import { setPlayers } from '../reducers/playersSlice';
import { gameLaunchedOn, gameLaunchedOff } from '../reducers/gameLaunchedSlice';
import { leaderOn, leaderOff } from '../reducers/leaderSlice';
import { musicOn, musicOff } from '../reducers/musicSlice';
import { startPieceOn, startPieceOff } from '../reducers/startPieceSlice';

describe('Redux Store Configuration', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: reducers
    });
  });

  test('initial state is set correctly', () => {
    const state = store.getState();
    expect(state).toEqual({
      catalogPieces: [],
      multi: false,
      url: '',
      back: false,
      showHighScore: false,
      pieces: [],
      tempName: '',
      rows: [],
      piece: null,
      positions: [],
      score: 0,
      gameOver: false,
      malus: 0,
      players: [],
      noName: true,
      oldUrl: '',
      changeOk: false,
      checkUrl: '',
      time: 0,
      gameLaunched: false,
      leader: false,
      music: false,
      keyDown: false,
      startPiece: false,
      pieceIndex: 0,
      lastMalus: 0,
      addMalusGo: 0,
      retrySignal: false,
      resultats: '',
      scoreList: [],
      playersOff: [],
      bestScore: 0,
      createRoom: false
    });
  });

  describe('Game State Reducers', () => {
    test('handles piece updates', () => {
      const piece = { type: 'T', rotation: 0 };
      store.dispatch(fillPiece(piece));
      expect(store.getState().piece).toEqual(piece);
    });

    test('handles player name updates', () => {
      const name = 'TestPlayer';
      store.dispatch(changeTempName(name));
      expect(store.getState().tempName).toBe(name);
    });

    test('handles URL updates', () => {
      const url = 'test-room';
      store.dispatch(changeUrl(url));
      expect(store.getState().url).toBe(url);
    });

    test('handles high score visibility', () => {
      store.dispatch(showHighScoreOn());
      expect(store.getState().showHighScore).toBe(true);
    });

    test('handles multiplayer mode toggle', () => {
      store.dispatch(multiOn());
      expect(store.getState().multi).toBe(true);
      store.dispatch(multiOff());
      expect(store.getState().multi).toBe(false);
    });

    test('handles game board updates', () => {
      const rows = Array(20).fill().map(() => Array(10).fill(0));
      store.dispatch(setRows(rows));
      expect(store.getState().rows).toEqual(rows);
    });

    test('handles score updates', () => {
      store.dispatch(setScore(100));
      expect(store.getState().score).toBe(100);
    });

    test('handles game over state', () => {
      store.dispatch(gameOverOn());
      expect(store.getState().gameOver).toBe(true);
      store.dispatch(gameOverOff());
      expect(store.getState().gameOver).toBe(false);
    });

    test('handles malus updates', () => {
      store.dispatch(setMalus(2));
      expect(store.getState().malus).toBe(2);
    });

    test('handles players list updates', () => {
      const players = ['Player1', 'Player2'];
      store.dispatch(setPlayers(players));
      expect(store.getState().players).toEqual(players);
    });
  });

  describe('Game Control Reducers', () => {
    test('handles game launch state', () => {
      store.dispatch(gameLaunchedOn());
      expect(store.getState().gameLaunched).toBe(true);
      store.dispatch(gameLaunchedOff());
      expect(store.getState().gameLaunched).toBe(false);
    });

    test('handles leader state', () => {
      store.dispatch(leaderOn());
      expect(store.getState().leader).toBe(true);
      store.dispatch(leaderOff());
      expect(store.getState().leader).toBe(false);
    });

    test('handles music state', () => {
      store.dispatch(musicOn());
      expect(store.getState().music).toBe(true);
      store.dispatch(musicOff());
      expect(store.getState().music).toBe(false);
    });

    test('handles start piece state', () => {
      store.dispatch(startPieceOn());
      expect(store.getState().startPiece).toBe(true);
      store.dispatch(startPieceOff());
      expect(store.getState().startPiece).toBe(false);
    });
  });

  describe('Complex State Changes', () => {
    test('handles game initialization', () => {
      store.dispatch(changeTempName('Player1'));
      store.dispatch(changeUrl('room1'));
      store.dispatch(multiOn());
      store.dispatch(gameLaunchedOn());
      
      const state = store.getState();
      expect(state.tempName).toBe('Player1');
      expect(state.url).toBe('room1');
      expect(state.multi).toBe(true);
      expect(state.gameLaunched).toBe(true);
    });

    test('handles game reset', () => {
      // Set up game state
      store.dispatch(setScore(100));
      store.dispatch(gameOverOn());
      store.dispatch(setMalus(2));
      
      // Reset game
      store.dispatch(gameOverOff());
      store.dispatch(setScore(0));
      store.dispatch(setMalus(0));
      
      const state = store.getState();
      expect(state.score).toBe(0);
      expect(state.gameOver).toBe(false);
      expect(state.malus).toBe(0);
    });

    test('handles multiplayer game setup', () => {
      const players = ['Player1', 'Player2'];
      store.dispatch(multiOn());
      store.dispatch(setPlayers(players));
      store.dispatch(leaderOn());
      store.dispatch(gameLaunchedOn());
      
      const state = store.getState();
      expect(state.multi).toBe(true);
      expect(state.players).toEqual(players);
      expect(state.leader).toBe(true);
      expect(state.gameLaunched).toBe(true);
    });
  });
});
