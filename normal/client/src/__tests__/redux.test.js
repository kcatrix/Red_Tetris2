import { createSlice } from '@reduxjs/toolkit';

// Mock Redux slice for testing
const gameSlice = createSlice({
  name: 'game',
  initialState: {
    playerName: '',
    roomName: '',
    board: Array(20).fill(Array(10).fill(0)),
    currentPiece: null,
    nextPiece: null,
    score: 0,
    level: 1,
    gameOver: false
  },
  reducers: {
    setPlayerName: (state, action) => {
      state.playerName = action.payload;
    },
    setRoomName: (state, action) => {
      state.roomName = action.payload;
    },
    updateBoard: (state, action) => {
      state.board = action.payload;
    },
    setScore: (state, action) => {
      state.score = action.payload;
    },
    setLevel: (state, action) => {
      state.level = action.payload;
    },
    setGameOver: (state, action) => {
      state.gameOver = action.payload;
    }
  }
});

describe('Game Redux State', () => {
  const { reducer, actions } = gameSlice;
  
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      playerName: '',
      roomName: '',
      board: Array(20).fill(Array(10).fill(0)),
      currentPiece: null,
      nextPiece: null,
      score: 0,
      level: 1,
      gameOver: false
    });
  });

  test('should handle setPlayerName', () => {
    const previousState = {
      playerName: '',
      roomName: '',
      board: Array(20).fill(Array(10).fill(0)),
      currentPiece: null,
      nextPiece: null,
      score: 0,
      level: 1,
      gameOver: false
    };

    expect(
      reducer(previousState, {
        type: actions.setPlayerName.type,
        payload: 'Player1'
      })
    ).toEqual({
      ...previousState,
      playerName: 'Player1'
    });
  });

  test('should handle setScore', () => {
    const previousState = {
      playerName: 'Player1',
      roomName: 'Room1',
      board: Array(20).fill(Array(10).fill(0)),
      currentPiece: null,
      nextPiece: null,
      score: 0,
      level: 1,
      gameOver: false
    };

    expect(
      reducer(previousState, {
        type: actions.setScore.type,
        payload: 100
      })
    ).toEqual({
      ...previousState,
      score: 100
    });
  });
});
