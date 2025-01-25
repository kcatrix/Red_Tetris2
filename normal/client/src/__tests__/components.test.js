import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { HighScoreBoard } from '../components/HighScoreBoard';
import { ChangeButton } from '../components/changeButton';

// Tests for HighScoreBoard component
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
          action.type === 'pieces/setPieces' ? action.payload : state,
        scoreList: (state = [], action) =>
          action.type === 'scoreList/changeScoreList' ? action.payload : state
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
      { name: 'Player1', score: 1000, nature: 'Solo' },
      { name: 'Player2', score: 800, nature: 'Multi' }
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
    expect(getByText('800')).toBeInTheDocument();
    expect(getByText('Multi')).toBeInTheDocument();
  });

  test('handles back button click', () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HighScoreBoard scoresList={[]} />
        </BrowserRouter>
      </Provider>
    );

    const backButton = getByText('Go Back');
    fireEvent.click(backButton);
    expect(store.getState().showHighScore).toBe(false);
  });

  test('displays scores in descending order', () => {
    const scores = [
      { name: 'Player3', score: 500, nature: 'Solo' },
      { name: 'Player1', score: 1000, nature: 'Solo' },
      { name: 'Player2', score: 800, nature: 'Multi' }
    ];

    const { getAllByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HighScoreBoard scoresList={scores} />
        </BrowserRouter>
      </Provider>
    );

    const scoreElements = getAllByTestId('score-item');
    expect(scoreElements[0]).toHaveTextContent('1000');
    expect(scoreElements[1]).toHaveTextContent('800');
    expect(scoreElements[2]).toHaveTextContent('500');
  });
});

// Tests for ChangeButton component
describe('ChangeButton Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        changeOk: (state = false, action) =>
          action.type === 'changeOk/changeOkOn' ? true : 
          action.type === 'changeOk/changeOkOff' ? false : state,
        tempName: (state = '', action) =>
          action.type === 'tempName/changeTempName' ? action.payload : state
      }
    });
  });

  test('renders change button correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ChangeButton />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  test('handles button click with valid input', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ChangeButton />
        </BrowserRouter>
      </Provider>
    );

    const input = screen.getByPlaceholderText('Enter your name');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'ValidName' } });
    fireEvent.click(button);

    expect(store.getState().changeOk).toBe(true);
    expect(store.getState().tempName).toBe('ValidName');
  });

  test('handles empty input', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ChangeButton />
        </BrowserRouter>
      </Provider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(store.getState().changeOk).toBe(false);
  });

  test('handles input validation for long names', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ChangeButton />
        </BrowserRouter>
      </Provider>
    );

    const input = screen.getByPlaceholderText('Enter your name');
    const button = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'ThisIsAVeryLongPlayerNameThatShouldNotBeAllowed' } });
    fireEvent.click(button);
    
    expect(store.getState().changeOk).toBe(false);
  });

  test('updates tempName in store when input changes', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ChangeButton />
        </BrowserRouter>
      </Provider>
    );

    const input = screen.getByPlaceholderText('Enter your name');
    fireEvent.change(input, { target: { value: 'NewPlayer' } });
    
    expect(store.getState().tempName).toBe('NewPlayer');
  });
});
