import { configureStore } from '@reduxjs/toolkit';
import reducers from '../reducers';
import { fillPiece } from '../reducers/pieceSlice';
import { changeTempName } from '../reducers/tempNameSlice';
import { changeUrl } from '../reducers/urlSlice';
import { showHighScoreOn } from '../reducers/showHighScoreSlice';

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

  test('reducers handle actions correctly', () => {
    // Test tempName reducer
    store.dispatch(changeTempName('test-player'));
    expect(store.getState().tempName).toBe('test-player');

    // Test url reducer
    store.dispatch(changeUrl('/test-room'));
    expect(store.getState().url).toBe('/test-room');

    // Test showHighScore reducer
    store.dispatch(showHighScoreOn());
    expect(store.getState().showHighScore).toBe(true);

    // Test piece reducer
    const piece = { type: 'T', rotation: 0 };
    store.dispatch(fillPiece(piece));
    expect(store.getState().piece).toEqual(piece);
  });
});

describe('Reducers', () => {
  describe('catalogPieces reducer', () => {
    it('should handle initial state', () => {
      expect(reducers.catalogPieces(undefined, {})).toEqual([]);
    });

    it('should handle setCatalogPieces', () => {
      const pieces = [1, 2, 3];
      expect(reducers.catalogPieces([], setCatalogPieces(pieces))).toEqual(pieces);
    });
  });

  describe('multi reducer', () => {
    it('should handle initial state', () => {
      expect(reducers.multi(undefined, {})).toBe(false);
    });

    it('should handle setMulti', () => {
      expect(reducers.multi(false, setMulti(true))).toBe(true);
    });
  });

  describe('url reducer', () => {
    it('should handle initial state', () => {
      expect(reducers.url(undefined, {})).toBe('');
    });

    it('should handle setUrl', () => {
      const url = 'http://example.com';
      expect(reducers.url('', setUrl(url))).toBe(url);
    });
  });

  describe('back reducer', () => {
    it('should handle initial state', () => {
      expect(reducers.back(undefined, {})).toBe(false);
    });

    it('should handle setBack', () => {
      expect(reducers.back(false, setBack(true))).toBe(true);
    });
  });

  describe('showHighScore reducer', () => {
    it('should handle initial state', () => {
      expect(reducers.showHighScore(undefined, {})).toBe(false);
    });

    it('should handle setShowHighScore', () => {
      expect(reducers.showHighScore(false, setShowHighScore(true))).toBe(true);
    });
  });

  describe('pieces reducer', () => {
    it('should handle initial state', () => {
      expect(reducers.pieces(undefined, {})).toEqual([]);
    });

    it('should handle setPieces', () => {
      const pieces = [1, 2, 3];
      expect(reducers.pieces([], setPieces(pieces))).toEqual(pieces);
    });
  });

  describe('tempName reducer', () => {
    it('should handle initial state', () => {
      expect(reducers.tempName(undefined, {})).toBe('');
    });

    it('should handle changeTempName', () => {
      const name = 'Player1';
      expect(reducers.tempName('', changeTempName(name))).toBe(name);
    });
  });

  describe('piece reducer', () => {
    it('should handle initial state', () => {
      expect(reducers.piece(undefined, {})).toEqual([]);
    });

    it('should handle fillPiece', () => {
      const piece = { id: 1, type: 'T' };
      expect(reducers.piece([], fillPiece(piece))).toEqual(piece);
    });
  });
});
