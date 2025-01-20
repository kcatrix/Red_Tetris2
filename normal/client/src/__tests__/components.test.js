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
          action.type === 'showHighScore/modifyShowHighScore' ? action.payload : state
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
});

describe('ChangeButton Component', () => {
  test('toggles game mode and emits socket event', () => {
    const setCou = jest.fn();
    const socket = { emit: jest.fn() };
    const tempName = 'Player1';
    const pieces = [];

    coucou(true, setCou, socket, tempName, pieces);

    expect(setCou).toHaveBeenCalledWith(false);
    expect(socket.emit).toHaveBeenCalledWith('createGameRoom', tempName, pieces);

    coucou(false, setCou, socket, tempName, pieces);

    expect(setCou).toHaveBeenCalledWith(true);
    expect(socket.emit).toHaveBeenCalledWith('createGameRoom', tempName, pieces);
  });
});
