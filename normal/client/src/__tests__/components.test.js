import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import HighScoreBoard from '../components/HighScoreBoard';
import ChangeButton from '../components/changeButton';
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
import { positionsReducer } from '../reducers/positionsSlice';
import { showHighScoreReducer } from '../reducers/showHighScoreSlice';
import { changeOkReducer } from '../reducers/changeOkSlice';
import { noNameReducer } from '../reducers/noNameSlice';
import { scoreListReducer } from '../reducers/scoreListSlice';

describe('Components', () => {
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
        positions: positionsReducer,
        showHighScore: showHighScoreReducer,
        changeOk: changeOkReducer,
        noName: noNameReducer,
        scoreList: scoreListReducer
      },
      preloadedState: {
        tempName: 'TestPlayer',
        showHighScore: false,
        changeOk: false,
        noName: false,
        scoreList: []
      }
    });
  });

  describe('HighScoreBoard', () => {
    test('renders no scores message when list is empty', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <HighScoreBoard />
          </BrowserRouter>
        </Provider>
      );
      expect(screen.getByText(/No high scores yet/i)).toBeInTheDocument();
    });

    test('renders scores when list is not empty', () => {
      store.dispatch({
        type: 'scoreList/setScoreList',
        payload: [
          { name: 'Player1', score: 100 },
          { name: 'Player2', score: 200 }
        ]
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <HighScoreBoard />
          </BrowserRouter>
        </Provider>
      );

      expect(screen.getByText('Player1')).toBeInTheDocument();
      expect(screen.getByText('Player2')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
    });
  });

  describe('ChangeButton', () => {
    test('renders change button', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <ChangeButton />
          </BrowserRouter>
        </Provider>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('handles name input and button click', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <ChangeButton />
          </BrowserRouter>
        </Provider>
      );

      const input = screen.getByPlaceholderText('Enter your name');
      const button = screen.getByRole('button');

      fireEvent.change(input, { target: { value: 'NewPlayer' } });
      fireEvent.click(button);

      expect(store.getState().tempName).toBe('NewPlayer');
      expect(store.getState().changeOk).toBe(true);
    });

    test('handles empty name input', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <ChangeButton />
          </BrowserRouter>
        </Provider>
      );

      const input = screen.getByPlaceholderText('Enter your name');
      const button = screen.getByRole('button');

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(button);

      expect(store.getState().noName).toBe(true);
    });
  });

  describe('MultiGame', () => {
    test('renders game component', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <MultiGame />
          </BrowserRouter>
        </Provider>
      );
      // Add assertions here
    });
  });
});
