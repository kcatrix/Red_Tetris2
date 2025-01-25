import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { HighScoreBoard } from '../components/HighScoreBoard';
import { coucou } from '../components/changeButton';

describe('HighScoreBoard Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        showHighScore: (state = false, action) =>
          action.type === 'showHighScore/setShowHighScore' ? action.payload : state,
        tempName: (state = '', action) =>
          action.type === 'tempName/changeTempName' ? action.payload : state,
        pieces: (state = [], action) =>
          action.type === 'pieces/setPieces' ? action.payload : state
      }
    });
  });

  test('renders no scores message when list is empty', () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HighScoreBoard scoresList={[]} />
        </BrowserRouter>
      </Provider>
    );

    expect(getByText('No Score Yet')).toBeInTheDocument();
    expect(getByText('Go Back')).toBeInTheDocument();
  });

  test('renders score list when scores exist', () => {
    const scores = [
      { name: 'Player1', scores: 1000, nature: 'Solo' }
    ];

    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HighScoreBoard scoresList={scores} />
        </BrowserRouter>
      </Provider>
    );

    expect(getByText('Player1')).toBeInTheDocument();
    expect(getByText('1000')).toBeInTheDocument();
    expect(getByText('Solo')).toBeInTheDocument();
  });

  test('renders multiple scores correctly', () => {
    const scores = [
      { name: 'Player1', scores: 1000, nature: 'Solo' },
      { name: 'Player2', scores: 2000, nature: 'Multi' }
    ];

    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HighScoreBoard scoresList={scores} />
        </BrowserRouter>
      </Provider>
    );

    expect(getByText('Player1')).toBeInTheDocument();
    expect(getByText('1000')).toBeInTheDocument();
    expect(getByText('Solo')).toBeInTheDocument();
    expect(getByText('Player2')).toBeInTheDocument();
    expect(getByText('2000')).toBeInTheDocument();
    expect(getByText('Multi')).toBeInTheDocument();
  });

  test('handles Go Back button click', () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HighScoreBoard scoresList={[]} />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(getByText('Go Back'));
    expect(store.getState().showHighScore).toBe(false);
  });
});

describe('ChangeButton Function', () => {
  test('handles function call correctly', () => {
    const setCou = jest.fn();
    const socket = { emit: jest.fn() };
    const tempName = 'Player1';
    const pieces = [1, 2, 3];

    coucou(true, setCou, socket, tempName, pieces);

    expect(setCou).toHaveBeenCalledWith(false);
    expect(socket.emit).toHaveBeenCalledWith('createGameRoom', tempName, pieces);
  });

  test('toggles cou value', () => {
    const setCou = jest.fn();
    const socket = { emit: jest.fn() };
    const tempName = 'Player1';
    const pieces = [1, 2, 3];

    coucou(false, setCou, socket, tempName, pieces);
    expect(setCou).toHaveBeenCalledWith(true);
  });
});
