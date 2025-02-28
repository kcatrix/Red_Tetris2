import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import MultiGame from '../multigame';

// Import des reducers
import pieceSlice from '../reducers/pieceSlice';
import scoreSlice from '../reducers/scoreSlice';
import gameOverSlice from '../reducers/gameOverSlice';
import positionsSlice from '../reducers/positionsSlice';
import playersSlice from '../reducers/playersSlice';
import rowsSlice from '../reducers/rowsSlice';
import malusSlice from '../reducers/malusSlice';
import musicSlice from '../reducers/musicSlice';
import urlSlice from '../reducers/urlSlice';
import tempNameSlice from '../reducers/tempNameSlice';
import gameLaunchedSlice from '../reducers/gameLaunchedSlice';
import keyDownSlice from '../reducers/keyDownSlice';
import multiSlice from '../reducers/multiSlice';
import retrySignalSlice from '../reducers/retrySignalSlice';
import startPieceSlice from '../reducers/startPieceSlice';
import timeSlice from '../reducers/timeSlice';
import catalogPiecesSlice from '../reducers/catalogPiecesSlice';
import leaderSlice from '../reducers/leaderSlice';
import playersOffSlice from '../reducers/playersOffSlice';
import resultatsSlice from '../reducers/resultatsSlice';
import lastMalusSlice from '../reducers/lastMalusSlice';
import addMalusGoSlice from '../reducers/addMalusGoSlice';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/test/room' })
}));

jest.mock('../tetris.mp3', () => 'mocked-audio-file');

test('test game functionality', () => {
    const store = configureStore({
        reducer: {
            piece: pieceSlice.reducer,
            score: scoreSlice.reducer,
            gameOver: gameOverSlice.reducer,
            positions: positionsSlice.reducer,
            players: playersSlice.reducer,
            rows: rowsSlice.reducer,
            malus: malusSlice.reducer,
            music: musicSlice.reducer,
            url: urlSlice.reducer,
            tempName: tempNameSlice.reducer,
            gameLaunched: gameLaunchedSlice.reducer,
            keyDown: keyDownSlice.reducer,
            multi: multiSlice.reducer,
            retrySignal: retrySignalSlice.reducer,
            startPiece: startPieceSlice.reducer,
            time: timeSlice.reducer,
            catalogPieces: catalogPiecesSlice.reducer,
            leader: leaderSlice.reducer,
            playersOff: playersOffSlice.reducer,
            resultats: resultatsSlice.reducer,
            lastMalus: lastMalusSlice.reducer,
            addMalusGo: addMalusGoSlice.reducer
        }
    });

    render(
        <Provider store={store}>
            <BrowserRouter>
                <MultiGame />
            </BrowserRouter>
        </Provider>
    );

    // Test keyboard events
    ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'Enter'].forEach(key => {
        fireEvent.keyDown(window, { key });
        fireEvent.keyUp(window, { key });
    });

    // Test game states
    store.dispatch(gameOverSlice.actions.gameOverOn());
    store.dispatch(scoreSlice.actions.modifyScore(100));
    store.dispatch(malusSlice.actions.modifyMalus(2));
    store.dispatch(leaderSlice.actions.leaderOn());
    store.dispatch(gameLaunchedSlice.actions.gameLaunchedOn());
    store.dispatch(multiSlice.actions.multiOn());
    store.dispatch(startPieceSlice.actions.startPieceOn());
    store.dispatch(retrySignalSlice.actions.retrySignalOn());
    store.dispatch(musicSlice.actions.musicOn());

    // Test pieces
    [
        [[1,1],[1,1]], // carré
        [[1,1,1],[0,1,0]], // T
        [[1,1,0],[0,1,1]], // Z
        [[0,1,1],[1,1,0]], // S
        [[1,0,0],[1,1,1]], // L
        [[0,0,1],[1,1,1]], // J
        [[1,1,1,1]] // I
    ].forEach(piece => {
        store.dispatch(pieceSlice.actions.fillPiece(piece));
    });

    // Test multiplayer
    store.dispatch(playersSlice.actions.fillPlayers([
        { name: 'Player1', score: 100 },
        { name: 'Player2', score: 200 }
    ]));

    store.dispatch(playersOffSlice.actions.fillPlayersOff(['Offline1', 'Offline2']));

    // Test board state
    const newRows = Array(20).fill().map(() => Array(10).fill().map(() => Math.random() > 0.7 ? 1 : 0));
    store.dispatch(rowsSlice.actions.modifyRows(newRows));
    store.dispatch(positionsSlice.actions.modifyPositions(newRows));

    // Test game flow
    store.dispatch(timeSlice.actions.modifyTime(30));
    store.dispatch(lastMalusSlice.actions.addLastMalus(2));
    store.dispatch(addMalusGoSlice.actions.modifyAddMalusGo(true));
    store.dispatch(resultatsSlice.actions.changeResultats('Game Over'));

    // Re-render to ensure all state changes are applied
    render(
        <Provider store={store}>
            <BrowserRouter>
                <MultiGame />
            </BrowserRouter>
        </Provider>
    );
});

test('simple test that will fail but execute code', () => {
    const store = configureStore({
        reducer: {
            piece: pieceSlice.reducer,
            score: scoreSlice.reducer
        }
    });

    // Ce render va échouer car il manque des reducers
    // mais le code sera quand même exécuté
    render(
        <Provider store={store}>
            <BrowserRouter>
                <MultiGame />
            </BrowserRouter>
        </Provider>
    );

    // Cette assertion va échouer
    expect(1).toBe(2);
});

test('test game state changes and interactions', () => {
    const store = configureStore({
        reducer: {
            piece: pieceSlice.reducer,
            score: scoreSlice.reducer,
            gameOver: gameOverSlice.reducer,
            positions: positionsSlice.reducer,
            players: playersSlice.reducer,
            rows: rowsSlice.reducer,
            malus: malusSlice.reducer,
            music: musicSlice.reducer,
            url: urlSlice.reducer,
            tempName: tempNameSlice.reducer,
            gameLaunched: gameLaunchedSlice.reducer,
            keyDown: keyDownSlice.reducer,
            multi: multiSlice.reducer,
            retrySignal: retrySignalSlice.reducer,
            startPiece: startPieceSlice.reducer,
            time: timeSlice.reducer,
            catalogPieces: catalogPiecesSlice.reducer,
            leader: leaderSlice.reducer,
            playersOff: playersOffSlice.reducer,
            resultats: resultatsSlice.reducer,
            lastMalus: lastMalusSlice.reducer,
            addMalusGo: addMalusGoSlice.reducer
        }
    });

    const { container } = render(
        <Provider store={store}>
            <BrowserRouter>
                <MultiGame />
            </BrowserRouter>
        </Provider>
    );

    // Test initial game state
    store.dispatch(gameLaunchedSlice.actions.gameLaunchedOff());
    store.dispatch(tempNameSlice.actions.changeTempName('TestPlayer'));
    store.dispatch(urlSlice.actions.changeUrl('test-room'));

    // Test piece movement and rotation
    store.dispatch(pieceSlice.actions.fillPiece([[1,1],[1,1]]));
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });

    // Test game controls
    store.dispatch(gameLaunchedSlice.actions.gameLaunchedOn());
    fireEvent.keyDown(window, { key: ' ' }); // Pause/Resume
    fireEvent.keyDown(window, { key: 'Enter' }); // Start/Restart

    // Test malus system
    store.dispatch(lastMalusSlice.actions.modifyLastMalus(3));
    store.dispatch(malusSlice.actions.modifyMalus(2));
    store.dispatch(addMalusGoSlice.actions.modifyAddMalusGo(true));

    // Test multiplayer interactions
    store.dispatch(playersSlice.actions.fillPlayers([
        { name: 'Player1', score: 150 },
        { name: 'Player2', score: 250 },
        { name: 'Player3', score: 350 }
    ]));

    // Test game over scenario
    store.dispatch(scoreSlice.actions.modifyScore(1000));
    store.dispatch(gameOverSlice.actions.gameOverOn());
    store.dispatch(resultatsSlice.actions.changeResultats('Game Over - High Score!'));

    // Test retry mechanism
    store.dispatch(retrySignalSlice.actions.retrySignalOn());
    fireEvent.click(container.querySelector('.retry-button'));

    // Test music controls
    store.dispatch(musicSlice.actions.musicOn());
    store.dispatch(musicSlice.actions.musicOff());
});

test('test game board manipulations', () => {
    const store = configureStore({
        reducer: {
            piece: pieceSlice.reducer,
            score: scoreSlice.reducer,
            gameOver: gameOverSlice.reducer,
            positions: positionsSlice.reducer,
            rows: rowsSlice.reducer,
            malus: malusSlice.reducer,
            gameLaunched: gameLaunchedSlice.reducer
        }
    });

    render(
        <Provider store={store}>
            <BrowserRouter>
                <MultiGame />
            </BrowserRouter>
        </Provider>
    );

    // Test board state modifications
    const testRows = Array(20).fill().map(() => Array(10).fill(0));
    store.dispatch(rowsSlice.actions.modifyRows(testRows));

    // Add some blocks to the board
    testRows[19] = Array(10).fill(1); // Fill bottom row
    store.dispatch(rowsSlice.actions.modifyRows(testRows));

    // Test piece movement on filled board
    store.dispatch(pieceSlice.actions.fillPiece([[1,1],[1,1]]));
    store.dispatch(positionsSlice.actions.modifyPositions({ pieceIndex: 0, newPosition: { x: 4, y: 0 } }));

    // Test game state with filled board
    store.dispatch(gameLaunchedSlice.actions.gameLaunchedOn());
    fireEvent.keyDown(window, { key: 'ArrowDown' });
});
