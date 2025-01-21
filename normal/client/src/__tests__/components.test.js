import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { HighScoreBoard } from '../components/HighScoreBoard';
import { coucou } from '../components/changeButton';
import ChangeButton from '../components/changeButton';

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

  test('renders title grid correctly', () => {
    const scores = [{ name: 'Player1', scores: 1000, nature: 'Solo' }];

    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HighScoreBoard scoresList={scores} />
        </BrowserRouter>
      </Provider>
    );

    expect(getByText("Player's Name")).toBeInTheDocument();
    expect(getByText('Best score')).toBeInTheDocument();
    expect(getByText('Type')).toBeInTheDocument();
  });

  test('renders multiple scores correctly', () => {
    const scores = [
      { name: 'Player1', scores: 1000, nature: 'Solo' },
      { name: 'Player2', scores: 2000, nature: 'Multi' },
      { name: 'Player3', scores: 3000, nature: 'Solo' }
    ];

    const { getAllByText, getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HighScoreBoard scoresList={scores} />
        </BrowserRouter>
      </Provider>
    );

    // Vérifier les en-têtes
    expect(getByText("Player's Name")).toBeInTheDocument();
    expect(getByText('Best score')).toBeInTheDocument();
    expect(getByText('Type')).toBeInTheDocument();

    // Vérifier chaque score individuellement
    expect(getByText('Player1')).toBeInTheDocument();
    expect(getByText('1000')).toBeInTheDocument();
    const soloElements = getAllByText('Solo');
    expect(soloElements).toHaveLength(2);
    expect(getByText('Player2')).toBeInTheDocument();
    expect(getByText('2000')).toBeInTheDocument();
    expect(getByText('Multi')).toBeInTheDocument();
    expect(getByText('Player3')).toBeInTheDocument();
    expect(getByText('3000')).toBeInTheDocument();
  });

  test('dispatches showHighScoreOff action when Go Back button is clicked', () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HighScoreBoard scoresList={[]} />
        </BrowserRouter>
      </Provider>
    );

    const goBackButton = getByText('Go Back');
    fireEvent.click(goBackButton);

    const actions = store.getState();
    expect(actions).toBe(false);
  });

  test('renders grid layout correctly', () => {
    const scores = [{ name: 'Player1', scores: 1000, nature: 'Solo' }];
    
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <HighScoreBoard scoresList={scores} />
        </BrowserRouter>
      </Provider>
    );

    expect(container.getElementsByClassName('grid-container')).toHaveLength(2); // 1 pour le titre + 1 pour le score
    expect(container.getElementsByClassName('jtem1')).toHaveLength(1);
    expect(container.getElementsByClassName('jtem2')).toHaveLength(1);
    expect(container.getElementsByClassName('jtem3')).toHaveLength(1);
    expect(container.getElementsByClassName('item1')).toHaveLength(1);
    expect(container.getElementsByClassName('item2')).toHaveLength(1);
    expect(container.getElementsByClassName('item3')).toHaveLength(1);
  });

});

describe('ChangeButton Component', () => {
  let store;
  
  beforeEach(() => {
    store = configureStore({
      reducer: {
        tempName: (state = '', action) => 
          action.type === 'tempName/modifyTempName' ? action.payload : state,
        pieces: (state = [], action) => 
          action.type === 'pieces/modifyPieces' ? action.payload : state
      }
    });
  });

  test('renders change button with correct text', () => {
    const setCou = jest.fn();
    const socket = { emit: jest.fn() };
    
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ChangeButton cou={true} setCou={setCou} socket={socket} />
        </BrowserRouter>
      </Provider>
    );
    
    expect(getByText('Change Game Mode')).toBeInTheDocument();
  });

  test('handles click event correctly when cou is true', () => {
    const setCou = jest.fn();
    const socket = { emit: jest.fn() };
    store.dispatch({ type: 'tempName/modifyTempName', payload: 'Player1' });
    store.dispatch({ type: 'pieces/modifyPieces', payload: [1, 2, 3] });
    
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ChangeButton cou={true} setCou={setCou} socket={socket} />
        </BrowserRouter>
      </Provider>
    );
    
    const button = getByText('Change Game Mode');
    fireEvent.click(button);
    
    expect(setCou).toHaveBeenCalledWith(false);
    expect(socket.emit).toHaveBeenCalledWith('createGameRoom', 'Player1', [1, 2, 3]);
  });

  test('handles click event correctly when cou is false', () => {
    const setCou = jest.fn();
    const socket = { emit: jest.fn() };
    store.dispatch({ type: 'tempName/modifyTempName', payload: 'Player1' });
    store.dispatch({ type: 'pieces/modifyPieces', payload: [1, 2, 3] });
    
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ChangeButton cou={false} setCou={setCou} socket={socket} />
        </BrowserRouter>
      </Provider>
    );
    
    const button = getByText('Change Game Mode');
    fireEvent.click(button);
    
    expect(setCou).toHaveBeenCalledWith(true);
    expect(socket.emit).toHaveBeenCalledWith('createGameRoom', 'Player1', [1, 2, 3]);
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
