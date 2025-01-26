import io from 'socket.io-client';
import socketMiddleware, { 
    equal, 
    checkRowsEqual, 
    resetGameOver, 
    launchGame, 
    Retry 
} from '../middleware/socketMiddleware';
import { configureStore } from '@reduxjs/toolkit';
import pieceSlice, { fillPiece } from '../reducers/pieceSlice';
import catalogPiecesSlice, { fillCatalog } from '../reducers/catalogPiecesSlice';
import urlSlice, { changeUrl } from '../reducers/urlSlice';
import tempNameSlice, { changeTempName } from '../reducers/tempNameSlice';
import multiSlice, { multiOn, multiOff } from '../reducers/multiSlice';
import leaderSlice, { leaderOn, leaderOff } from '../reducers/leaderSlice';
import gameOverSlice, { gameOverOn, gameOverOff } from '../reducers/gameOverSlice';
import scoreSlice, { modifyScore } from '../reducers/scoreSlice';
import bestScoreSlice, { modifyBestScore } from '../reducers/bestScoreSlice';
import scoreListSlice, { changeScoreList } from '../reducers/scoreListSlice';
import rowsSlice, { modifyRows } from '../reducers/rowsSlice';
import malusSlice from '../reducers/malusSlice';
import timeSlice from '../reducers/timeSlice';
import playersSlice from '../reducers/playersSlice';
import musicSlice, { musicOn } from '../reducers/musicSlice';
import gameLaunchedSlice, { gameLaunchedOff, gameLaunchedOn } from '../reducers/gameLaunchedSlice';
import addMalusGoSlice from '../reducers/addMalusGoSlice';
import playersOffSlice from '../reducers/playersOffSlice';
import lastMalusSlice, { modifyLastMalus } from '../reducers/lastMalusSlice';
import keyDownSlice, { changeKeyDown } from '../reducers/keyDownSlice';
import startPieceSlice, { startPieceOn } from '../reducers/startPieceSlice';
import retrySignalSlice, { retrySignalOn } from '../reducers/retrySignalSlice';
import resultatsSlice, { changeResultats } from '../reducers/resultatsSlice';

jest.mock('socket.io-client');

describe('socketMiddleware', () => {
    let store;
    let next;
    let invoke;
    let mockSocket;

    beforeEach(() => {
        mockSocket = {
            on: jest.fn(),
            emit: jest.fn(),
            connect: jest.fn(),
            disconnect: jest.fn()
        };

        io.mockReturnValue(mockSocket);

        store = configureStore({
            reducer: {
                piece: pieceSlice.reducer,
                catalogPieces: catalogPiecesSlice.reducer,
                url: urlSlice.reducer,
                tempName: tempNameSlice.reducer,
                multi: multiSlice.reducer,
                leader: leaderSlice.reducer,
                gameOver: gameOverSlice.reducer,
                score: scoreSlice.reducer,
                bestScore: bestScoreSlice.reducer,
                scoreList: scoreListSlice.reducer,
                rows: rowsSlice.reducer,
                malus: malusSlice.reducer,
                time: timeSlice.reducer,
                players: playersSlice.reducer,
                music: musicSlice.reducer,
                gameLaunched: gameLaunchedSlice.reducer,
                addMalusGo: addMalusGoSlice.reducer,
                playersOff: playersOffSlice.reducer,
                lastMalus: lastMalusSlice.reducer,
                keyDown: keyDownSlice.reducer,
                startPiece: startPieceSlice.reducer,
                retrySignal: retrySignalSlice.reducer,
                resultats: resultatsSlice.reducer
            },
            middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware)
        });

        next = jest.fn();
        invoke = socketMiddleware(store)(next);
    });

    // Test des fonctions utilitaires
    test('equal function', () => {
        const row = [1, 1, 1];
        const row2 = [1, 0, 1];
        
        expect(equal(row, 1)).toBe(true);
        expect(equal(row2, 1)).toBe(false);
    });

    test('checkRowsEqual function', () => {
        const rows = [
            [1, 1, 1],
            [0, 0, 0],
            [1, 1, 1]
        ];
        
        expect(checkRowsEqual(rows, 0, 2, 1)).toBe(true);
        expect(checkRowsEqual(rows, 1, 1, 0)).toBe(true);
    });

    // Test des fonctions de jeu
    test('resetGameOver function', () => {
        const state = {
            url: 'test-url',
            tempName: 'test-player'
        };
        
        resetGameOver(state, store, mockSocket);
        
        expect(mockSocket.emit).toHaveBeenCalledWith('changestatusPlayer', 'test-url', 'test-player', false);
        expect(mockSocket.emit).toHaveBeenCalledWith('gameStopped', 'test-url');
    });

    test('launchGame function', () => {
        const state = {
            url: 'test-url',
            tempName: 'test-player',
            leader: true
        };
        
        launchGame(state, store, mockSocket);
        
        expect(mockSocket.emit).toHaveBeenCalledWith('changestatusPlayer', 'test-url', 'test-player', true);
        expect(mockSocket.emit).toHaveBeenCalledWith('gameStarted', 'test-url');
    });

    test('Retry function', () => {
        const state = {
            url: 'test-url',
            tempName: 'test-player',
            leader: true
        };
        
        Retry(state, store, mockSocket);
        
        expect(mockSocket.emit).toHaveBeenCalledWith('changestatusPlayer', 'test-url', 'test-player', true);
        expect(mockSocket.emit).toHaveBeenCalledWith('all_retry', 'test-url', 'test-player');
    });

    // Test des actions socket
    test('SOCKET_INIT action', () => {
        invoke({ type: 'SOCKET_INIT' });
        
        expect(io).toHaveBeenCalledWith('http://localhost:4000');
        expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
        expect(mockSocket.emit).toHaveBeenCalledWith('requestRandomPiece');
        expect(mockSocket.emit).toHaveBeenCalledWith('allPieces');
    });

    test('createRoom/createRoomOn action', () => {
        store.dispatch({ type: 'createRoom/createRoomOn' });
        expect(mockSocket.emit).toHaveBeenCalledWith('createGameRoom', expect.any(String), expect.any(Array));
    });

    test('showHighScore/showHighScoreOn action', () => {
        store.dispatch({ type: 'showHighScore/showHighScoreOn' });
        expect(mockSocket.emit).toHaveBeenCalledWith('highScore');
    });

    test('URL_CHECK action', () => {
        store.dispatch({ type: 'URL_CHECK' });
        expect(mockSocket.emit).toHaveBeenCalledWith('urlCheck', expect.any(String));
    });

    test('CREATE_PLAYER action', () => {
        store.dispatch({ type: 'CREATE_PLAYER' });
        expect(mockSocket.emit).toHaveBeenCalledWith('createPlayer', expect.any(String), expect.any(String));
    });

    test('LEADER_OR_NOT action', () => {
        store.dispatch({ type: 'LEADER_OR_NOT' });
        expect(mockSocket.emit).toHaveBeenCalledWith('leaderornot', expect.any(String), expect.any(String));
    });

    test('SET_HIGHER_POS action', () => {
        const validRows = Array(20).fill(Array(10).fill(0));
        store.dispatch(modifyRows(validRows));
        store.dispatch({ type: 'SET_HIGHER_POS' });
        expect(mockSocket.emit).toHaveBeenCalledWith('setHigherPos', expect.any(Number), expect.any(String), expect.any(String));
    });

    // Test des événements socket
    test('socket event handlers', () => {
        invoke({ type: 'SOCKET_INIT' });

        // Simuler la réception d'événements socket
        const handlers = {};
        mockSocket.on.mockImplementation((event, handler) => {
            handlers[event] = handler;
        });

        // Test randomPiece
        handlers.randomPiece?.([1, 1]);
        expect(store.getState().piece).toEqual([1, 1]);

        // Test piecesDelivered
        handlers.piecesDelivered?.([[1, 1], [2, 2]]);
        expect(store.getState().catalogPieces).toEqual([[1, 1], [2, 2]]);

        // Test GiveUrl
        handlers.GiveUrl?.('test-url');
        expect(store.getState().url).toBe('test-url');

        // Test urlChecked
        handlers.urlChecked?.(true);
        expect(store.getState().changeOk).toBe(true);

        // Test leaderrep
        handlers.leaderrep?.(true, [[1, 1]], 100);
        expect(store.getState().leader).toBe(true);
        expect(store.getState().piece).toEqual([[1, 1]]);
        expect(store.getState().bestScore).toBe(100);

        // Test namePlayer
        handlers.namePlayer?.(['player1', 'player2']);
        expect(store.getState().playersOff).toEqual(['player1', 'player2']);

        // Test retry
        handlers.retry?.('leader');
        expect(store.getState().retrySignal).toBe(true);

        // Test winner
        handlers.winner?.(store.getState().tempName);
        expect(store.getState().resultats).toBe('winner');
        expect(store.getState().gameOver).toBe(true);

        // Test launchGame
        handlers.launchGame?.();
        expect(store.getState().gameLaunched).toBe(true);
    });

    // Test des événements socket
    test('socket events', () => {
        // Test SOCKET_INIT
        store.dispatch({ type: 'SOCKET_INIT' });
        expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('randomPiece', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('piecesDelivered', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('GiveUrl', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('checkUrl', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('playerCreated', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('leaderIs', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('gameStarted', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('gameStopped', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('all_retry', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('playerLeft', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('playerJoined', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('setHigherPos', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('addMalus', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('highScore', expect.any(Function));
    });

    // Test des actions avec le store
    test('store actions', () => {
        // Test fillPiece
        store.dispatch(fillPiece([1, 1]));
        expect(store.getState().piece).toEqual([1, 1]);

        // Test fillCatalog
        store.dispatch(fillCatalog([[1, 1], [2, 2]]));
        expect(store.getState().catalogPieces).toEqual([[1, 1], [2, 2]]);

        // Test changeUrl
        store.dispatch(changeUrl('test-url'));
        expect(store.getState().url).toBe('test-url');

        // Test changeTempName
        store.dispatch(changeTempName('test-player'));
        expect(store.getState().tempName).toBe('test-player');

        // Test multiOn/Off
        store.dispatch(multiOn());
        expect(store.getState().multi).toBe(true);
        store.dispatch(multiOff());
        expect(store.getState().multi).toBe(false);

        // Test leaderOn/Off
        store.dispatch(leaderOn());
        expect(store.getState().leader).toBe(true);
        store.dispatch(leaderOff());
        expect(store.getState().leader).toBe(false);

        // Test gameOverOn/Off
        store.dispatch(gameOverOn());
        expect(store.getState().gameOver).toBe(true);
        store.dispatch(gameOverOff());
        expect(store.getState().gameOver).toBe(false);
    });

    // Test des événements de jeu
    test('game events', () => {
        // Test SET_HIGHER_POS avec des données valides
        const validRows = Array(20).fill(Array(10).fill(0));
        store.dispatch(modifyRows(validRows));
        store.dispatch({ type: 'SET_HIGHER_POS' });
        expect(mockSocket.emit).toHaveBeenCalledWith('setHigherPos', expect.any(Number), expect.any(String), expect.any(String));

        // Test ADD_MALUS avec des données valides
        store.dispatch({ type: 'ADD_MALUS', payload: 2 });
        expect(store.getState().malus).toBe(2);

        // Test GAME_OVER
        store.dispatch({ type: 'GAME_OVER' });
        expect(store.getState().gameOver).toBe(true);
        expect(mockSocket.emit).toHaveBeenCalledWith('gameOver', expect.any(String), expect.any(String));
    });

    // Test des événements de score
    test('score events', () => {
        // Test modifyScore
        store.dispatch(modifyScore(100));
        expect(store.getState().score).toBe(100);

        // Test modifyBestScore
        store.dispatch(modifyBestScore(200));
        expect(store.getState().bestScore).toBe(200);

        // Test changeScoreList
        const scoreList = [
            { name: 'player1', score: 100 },
            { name: 'player2', score: 200 }
        ];
        store.dispatch(changeScoreList(scoreList));
        expect(store.getState().scoreList).toEqual(scoreList);
    });

    // Test des événements de jeu supplémentaires
    test('WINNER event', () => {
        const state = {
            tempName: 'player1',
            url: 'test-url'
        };
        store.dispatch({ type: 'WINNER' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.winner?.('player1');
        expect(store.getState().gameLaunched).toBe(false);
    });

    test('NEW_LEADER event', () => {
        store.dispatch({ type: 'NEW_LEADER' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.newLeader?.('player1');
        expect(store.getState().leader).toBe(true);
    });

    test('MALUS event', () => {
        store.getState().malus = 3;
        store.dispatch({ type: 'MALUS' });
        expect(mockSocket.emit).toHaveBeenCalledWith('malus', 2, expect.any(String));
    });

    test('MALUS_SENT event', () => {
        store.dispatch({ type: 'MALUS_SENT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.malusSent?.(2);
        expect(store.getState().addMalusGo).toBe(2);
    });

    test('HIGHER_POS event', () => {
        store.dispatch({ type: 'HIGHER_POS' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.higherPos?.([{name: 'player2', pos: 5}], 'test-url');
        expect(store.getState().players).toEqual([{name: 'player2', pos: 5}]);
    });

    test('PLAYER_DISCONNECTED event', () => {
        store.getState().players = [{name: 'player1'}, {name: 'player2'}];
        store.dispatch({ type: 'PLAYER_DISCONNECTED' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.playerDisconnected?.('player2');
        expect(store.getState().players).toEqual([{name: 'player1'}]);
    });

    test('BACK_HOME action', () => {
        store.dispatch({ type: 'BACK_HOME' });
        expect(store.getState().url).toBe('/');
        expect(store.getState().tempName).toBe('');
        expect(store.getState().multi).toBe(false);
        expect(store.getState().gameOver).toBe(false);
        expect(store.getState().players).toEqual([]);
        expect(store.getState().leader).toBe(false);
        expect(store.getState().gameLaunched).toBe(false);
        expect(mockSocket.emit).toHaveBeenCalledWith('quit');
        expect(mockSocket.emit).toHaveBeenCalledWith('requestRandomPiece');
    });

    test('LEADER_REP event', () => {
        store.dispatch({ type: 'LEADER_REP' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.leaderrep?.(true, [1, 2], 100);
        expect(store.getState().piece).toEqual([1, 2]);
        expect(store.getState().bestScore).toBe(100);
        expect(store.getState().leader).toBe(true);
    });

    test('LAUNCH_GAME event', () => {
        store.getState().leader = false;
        store.dispatch({ type: 'LAUNCH_GAME' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.launchGame?.();
        expect(store.getState().gameLaunched).toBe(true);
    });

    test('NAME_PLAYER event', () => {
        store.dispatch({ type: 'NAME_PLAYER' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.namePlayer?.(['player1', 'player2', 'player3']);
        expect(store.getState().playersOff).toEqual(['player1', 'player2', 'player3']);
    });

    test('RETRY_SIGNAL event', () => {
        store.getState().tempName = 'player2';
        store.dispatch({ type: 'RETRY_SIGNAL' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.retry?.('player1');
        expect(store.getState().gameLaunched).toBe(true);
    });

    test('RETRY_GAME action', () => {
        store.dispatch({ type: 'RETRY_GAME' });
        expect(store.getState().gameOver).toBe(false);
        expect(store.getState().gameLaunched).toBe(true);
    });

    // Tests supplémentaires pour la couverture
    test('SOCKET_INIT with randomPiece event', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.randomPiece?.([1, 2, 3]);
        expect(store.getState().piece).toEqual([1, 2, 3]);
    });

    test('SOCKET_INIT with piecesDelivered event', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.piecesDelivered?.([[1, 1], [2, 2]]);
        expect(store.getState().catalogPieces).toEqual([[1, 1], [2, 2]]);
    });

    test('createRoom/createRoomOn with GiveUrl event', () => {
        store.dispatch({ type: 'createRoom/createRoomOn' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.GiveUrl?.('/test-room');
        expect(store.getState().url).toBe('/test-room');
        expect(store.getState().multi).toBe(true);
    });

    test('showHighScore/showHighScoreOn with highScoreSorted event', () => {
        store.dispatch({ type: 'showHighScore/showHighScoreOn' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.highScoreSorted?.([{name: 'player1', score: 100}]);
        expect(store.getState().scoreList).toEqual([{name: 'player1', score: 100}]);
    });

    test('URL_CHECK with urlChecked event true', () => {
        store.dispatch({ type: 'URL_CHECK' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.urlChecked?.(true);
        expect(store.getState().changeOk).toBe(true);
    });

    test('URL_CHECK with urlChecked event false', () => {
        store.dispatch({ type: 'URL_CHECK' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.urlChecked?.(false);
        expect(store.getState().changeOk).toBe(false);
    });

    test('SET_HIGHER_POS with different row states', () => {
        // Test avec une ligne contenant 1
        store.dispatch(modifyRows([Array(10).fill(1)]));
        store.dispatch({ type: 'SET_HIGHER_POS' });
        expect(mockSocket.emit).toHaveBeenCalledWith('setHigherPos', expect.any(Number), expect.any(String), expect.any(String));

        // Test avec une ligne contenant 2
        store.dispatch(modifyRows([Array(10).fill(2)]));
        store.dispatch({ type: 'SET_HIGHER_POS' });
        expect(mockSocket.emit).toHaveBeenCalledWith('setHigherPos', expect.any(Number), expect.any(String), expect.any(String));
    });

    test('MALUS with different malus values', () => {
        // Test avec malus = 1
        store.getState().malus = 1;
        store.dispatch({ type: 'MALUS' });
        expect(mockSocket.emit).not.toHaveBeenCalled();

        // Test avec malus = 2
        store.getState().malus = 2;
        store.dispatch({ type: 'MALUS' });
        expect(mockSocket.emit).toHaveBeenCalledWith('malus', 1, expect.any(String));

        // Test avec malus = 5
        store.getState().malus = 5;
        store.dispatch({ type: 'MALUS' });
        expect(mockSocket.emit).toHaveBeenCalledWith('malus', 4, expect.any(String));
    });

    test('WINNER with different winner names', () => {
        store.getState().tempName = 'player1';
        
        // Test quand le gagnant est différent du joueur
        store.dispatch({ type: 'WINNER' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.winner?.('player2');
        expect(store.getState().gameLaunched).not.toBe(false);

        // Test quand le gagnant est le joueur
        handlers.winner?.('player1');
        expect(store.getState().gameLaunched).toBe(false);
        expect(store.getState().gameOver).toBe(true);
    });

    test('HIGHER_POS with different URLs', () => {
        store.getState().url = 'room1';
        
        // Test avec une URL différente
        store.dispatch({ type: 'HIGHER_POS' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.higherPos?.([{name: 'player2', pos: 5}], 'room2');
        expect(store.getState().players).not.toEqual([{name: 'player2', pos: 5}]);

        // Test avec la même URL
        handlers.higherPos?.([{name: 'player2', pos: 5}], 'room1');
        expect(store.getState().players).toEqual([{name: 'player2', pos: 5}]);
    });

    test('RETRY_SIGNAL with different player names', () => {
        store.getState().tempName = 'player1';
        
        // Test quand le leader est le même joueur
        store.dispatch({ type: 'RETRY_SIGNAL' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.retry?.('player1');
        expect(store.getState().retrySignal).toBe(false);

        // Test quand le leader est un autre joueur
        handlers.retry?.('player2');
        expect(store.getState().retrySignal).toBe(true);
    });

    test('multiple socket events in sequence', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Simulate multiple events in sequence
        handlers.connect?.();
        handlers.randomPiece?.([1, 2]);
        handlers.piecesDelivered?.([[1, 1]]);
        handlers.higherPos?.([{name: 'p1', pos: 5}], store.getState().url);
        handlers.malusSent?.(2);
    });

    test('edge cases for game state', () => {
        // Test with empty arrays
        store.dispatch(modifyRows([]));
        store.dispatch({ type: 'SET_HIGHER_POS' });

        // Test with null values
        store.getState().url = null;
        store.getState().tempName = null;
        store.dispatch({ type: 'CREATE_PLAYER' });

        // Test with undefined
        store.getState().malus = undefined;
        store.dispatch({ type: 'MALUS' });

        // Test with extreme values
        store.getState().malus = 999;
        store.dispatch({ type: 'MALUS' });

        // Test with empty string
        store.getState().url = '';
        store.dispatch({ type: 'GAME_OVER' });
    });

    test('rapid state changes', () => {
        // Simulate rapid state changes
        store.dispatch({ type: 'GAME_OVER' });
        store.dispatch({ type: 'LAUNCH_CLICK' });
        store.dispatch({ type: 'GAME_OVER' });
        store.dispatch({ type: 'RETRY_GAME' });
        store.dispatch({ type: 'BACK_HOME' });
    });

    test('multiple disconnections and reconnections', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Simulate multiple disconnections
        for(let i = 0; i < 5; i++) {
            handlers.playerDisconnected?.('player' + i);
        }

        // Simulate new connections
        for(let i = 0; i < 5; i++) {
            store.dispatch({ type: 'CREATE_PLAYER' });
        }
    });

    test('multiple malus interactions', () => {
        // Test different malus scenarios
        for(let i = 0; i < 10; i++) {
            store.getState().malus = i;
            store.dispatch({ type: 'MALUS' });
        }
    });

    test('game state transitions', () => {
        // Test various game state transitions
        const transitions = [
            'SOCKET_INIT',
            'CREATE_PLAYER',
            'LEADER_REP',
            'SET_HIGHER_POS',
            'LAUNCH_GAME',
            'WINNER',
            'RETRY_GAME',
            'GAME_OVER',
            'BACK_HOME'
        ];

        transitions.forEach(action => {
            store.dispatch({ type: action });
        });
    });

    test('boundary conditions', () => {
        // Test with maximum array size
        store.dispatch(modifyRows(Array(100).fill(Array(100).fill(1))));
        store.dispatch({ type: 'SET_HIGHER_POS' });

        // Test with very long player names
        store.getState().tempName = 'a'.repeat(1000);
        store.dispatch({ type: 'CREATE_PLAYER' });

        // Test with special characters in URL
        store.getState().url = '!@#$%^&*()';
        store.dispatch({ type: 'URL_CHECK' });
    });

    test('concurrent events', () => {
        // Simulate concurrent events
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Dispatch multiple events "simultaneously"
        Promise.all([
            handlers.randomPiece?.([1, 2]),
            handlers.piecesDelivered?.([[1, 1]]),
            handlers.GiveUrl?.('/room'),
            handlers.urlChecked?.(true),
            handlers.winner?.('player1')
        ]);
    });

    test('nested state changes', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Nested event handling
        handlers.launchGame?.(() => {
            handlers.winner?.('player1', () => {
                handlers.retry?.('player2', () => {
                    handlers.newLeader?.('player3');
                });
            });
        });
    });

    test('mixed game actions and socket events', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Mix game actions and socket events
        store.dispatch({ type: 'CREATE_PLAYER' });
        handlers.leaderrep?.(true, [1,2], 100);
        store.dispatch({ type: 'SET_HIGHER_POS' });
        handlers.higherPos?.([{name: 'p1', pos: 5}], store.getState().url);
        store.dispatch({ type: 'LAUNCH_GAME' });
        handlers.launchGame?.();
        store.dispatch({ type: 'MALUS' });
        handlers.malusSent?.(2);
        store.dispatch({ type: 'GAME_OVER' });
        handlers.winner?.('p1');
    });

    test('state manipulation edge cases', () => {
        // Test with various state manipulations
        store.getState().rows = null;
        store.dispatch({ type: 'SET_HIGHER_POS' });

        store.getState().rows = undefined;
        store.dispatch({ type: 'SET_HIGHER_POS' });

        store.getState().rows = [[]];
        store.dispatch({ type: 'SET_HIGHER_POS' });

        store.getState().rows = Array(20).fill(null);
        store.dispatch({ type: 'SET_HIGHER_POS' });
    });

    test('rapid socket event sequences', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Rapid sequence of socket events
        for(let i = 0; i < 10; i++) {
            handlers.randomPiece?.([i, i+1]);
            handlers.piecesDelivered?.([[i, i], [i+1, i+1]]);
            handlers.higherPos?.([{name: 'p'+i, pos: 19-i}], store.getState().url);
            handlers.malusSent?.(i);
        }
    });

    test('complex game flow simulation', () => {
        // Simulate a complex game flow
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Game start sequence
        store.dispatch({ type: 'CREATE_PLAYER' });
        handlers.leaderrep?.(true, [1,2,3], 100);
        store.dispatch({ type: 'LAUNCH_GAME' });
        handlers.launchGame?.();

        // Game play sequence
        for(let i = 0; i < 5; i++) {
            store.getState().rows = Array(20).fill(Array(10).fill(j % 2));
            store.dispatch({ type: 'SET_HIGHER_POS' });
            store.getState().malus = j + 1;
            store.dispatch({ type: 'MALUS' });
            handlers.malusSent?.(j);
            handlers.higherPos?.([{name: 'player1', pos: 19-j}], store.getState().url);
        }

        // Game end sequence
        store.dispatch({ type: 'GAME_OVER' });
        handlers.winner?.('player1');
        store.dispatch({ type: 'RETRY_GAME' });
        store.dispatch({ type: 'BACK_HOME' });
    });

    test('concurrent socket events and actions', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Simulate concurrent events and actions
        const promises = [];
        const actions = ['CREATE_PLAYER', 'SET_HIGHER_POS', 'MALUS', 'GAME_OVER'];
        
        for(let i = 0; i < 5; i++) {
            promises.push(
                Promise.resolve().then(() => {
                    store.dispatch({ type: actions[i % actions.length] });
                    handlers.randomPiece?.([i, i+1]);
                    handlers.piecesDelivered?.([[i, i], [i+1, i+1]]);
                    handlers.higherPos?.([{name: 'p'+i, pos: 19-i}], store.getState().url);
                    handlers.malusSent?.(i);
                })
            );
        }

        return Promise.all(promises);
    });

    test('state transitions with invalid data', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Test with invalid data
        handlers.randomPiece?.(null);
        handlers.randomPiece?.(undefined);
        handlers.randomPiece?.({});
        
        handlers.piecesDelivered?.(null);
        handlers.piecesDelivered?.(undefined);
        handlers.piecesDelivered?.({});
        
        handlers.GiveUrl?.(null);
        handlers.GiveUrl?.(undefined);
        handlers.GiveUrl?.({});
        
        handlers.winner?.(null);
        handlers.winner?.(undefined);
        handlers.winner?.({});
        
        handlers.malusSent?.(null);
        handlers.malusSent?.(undefined);
        handlers.malusSent?.("invalid");
    });

    test('rapid state changes with socket events', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Rapid alternation between state changes and socket events
        for(let i = 0; i < 10; i++) {
            store.getState().rows = Array(20).fill(Array(10).fill(i % 2));
            store.dispatch({ type: 'SET_HIGHER_POS' });
            handlers.higherPos?.([{name: 'p1', pos: 19-i}], store.getState().url);
            
            store.dispatch({ type: 'SET_MALUS', payload: i });
            store.dispatch({ type: 'MALUS' });
            handlers.malusSent?.(i);
            
            store.dispatch({ type: 'GAME_OVER' });
            handlers.winner?.('p1');
            
            store.dispatch({ type: 'RETRY_GAME' });
            handlers.retry?.('p1');
        }
    });

    test('mixed socket events with varying payloads', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        store.dispatch(modifyRows(Array(20).fill(Array(10).fill(0)))); // Initialize rows
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Test with various payloads
        const payloads = [
            { type: 'SET_HIGHER_POS', data: [{name: 'p1', pos: 15}] },
            { type: 'MALUS', data: 3 },
            { type: 'CREATE_PLAYER', data: 'player1' }
        ];

        payloads.forEach(({ type, data }) => {
            store.dispatch({ type });
            if (handlers[type.toLowerCase()]) {
                handlers[type.toLowerCase()](data);
            }
        });
    });

    test('complex state mutations with events', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        store.dispatch(modifyRows(Array(20).fill(Array(10).fill(0)))); // Initialize rows
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Complex state changes with various events
        const stateChanges = [
            { rows: Array(20).fill(Array(10).fill(1)), malus: 5 },
            { rows: Array(20).fill(Array(10).fill(0)), malus: 2 },
            { rows: Array(20).fill(Array(10).fill(2)), malus: 3 }
        ];

        stateChanges.forEach(change => {
            store.dispatch(modifyRows(change.rows));
            store.dispatch({ type: 'SET_MALUS', payload: change.malus });
            
            // Dispatch all relevant actions
            store.dispatch({ type: 'SET_HIGHER_POS' });
            store.dispatch({ type: 'MALUS' });
            store.dispatch({ type: 'CREATE_PLAYER' });
            store.dispatch({ type: 'GAME_OVER' });
        });
    });

    test('action dispatch patterns', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        store.dispatch(modifyRows(Array(20).fill(Array(10).fill(0)))); // Initialize rows

        const patterns = [
            ['SET_HIGHER_POS', 'MALUS', 'CREATE_PLAYER'],
            ['GAME_OVER', 'MALUS', 'SET_HIGHER_POS'],
            ['CREATE_PLAYER', 'SET_HIGHER_POS', 'MALUS']
        ];

        patterns.forEach(pattern => {
            store.dispatch({ type: 'SET_MALUS', payload: 5 });
            store.dispatch(changeUrl('test-room'));
            pattern.forEach(action => store.dispatch({ type: action }));

            store.dispatch(modifyRows(Array(20).fill(Array(10).fill(2))));
            store.dispatch({ type: 'SET_MALUS', payload: 2 });
        });
    });

    test('mixed event and action patterns', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        const patterns = [
            { action: 'SET_HIGHER_POS', events: ['higherPos', 'malus'], data: [[{pos: 15}], 3] },
            { action: 'MALUS', events: ['malus', 'higherPos'], data: [2, [{pos: 10}]] },
            { action: 'CREATE_PLAYER', events: ['createPlayer', 'malus'], data: ['player1', 1] }
        ];

        patterns.forEach(pattern => {
            store.dispatch(modifyRows(Array(20).fill(Array(10).fill(1))));
            store.dispatch({ type: pattern.action });
            pattern.events.forEach((event, index) => {
                if (handlers[event]) {
                    handlers[event](pattern.data[index]);
                }
            });
        });
    });

    test('test all socket events with various payloads', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Test connect event
        handlers.connect?.();
        handlers.disconnect?.();

        // Test randomPiece with different piece arrays
        handlers.randomPiece?.([1, 2, 3]);
        handlers.randomPiece?.([]);
        handlers.randomPiece?.([4, 5, 6, 7]);

        // Test piecesDelivered with different catalogs
        handlers.piecesDelivered?.([[1, 1], [2, 2]]);
        handlers.piecesDelivered?.([]);
        handlers.piecesDelivered?.([[3, 3], [4, 4], [5, 5]]);

        // Test GiveUrl with different URLs
        handlers.GiveUrl?.('test-room');
        handlers.GiveUrl?.('');
        handlers.GiveUrl?.('long-room-name-test');

        // Test urlChecked
        handlers.urlChecked?.(true);
        handlers.urlChecked?.(false);

        // Test leaderrep with different combinations
        handlers.leaderrep?.(true, [1, 2], 100);
        handlers.leaderrep?.(false, [], 0);
        handlers.leaderrep?.(true, [3, 4, 5], 200);

        // Test launchGame
        handlers.launchGame?.();

        // Test namePlayer with different arrays
        handlers.namePlayer?.(['player1']);
        handlers.namePlayer?.(['player1', 'player2']);
        handlers.namePlayer?.([]);

        // Test retry with different names
        handlers.retry?.('player1');
        handlers.retry?.('');
        handlers.retry?.('long-player-name');

        // Test winner with different names
        handlers.winner?.('player1');
        handlers.winner?.('');
        handlers.winner?.('long-winner-name');

        // Test newLeader with different names
        handlers.newLeader?.('player1');
        handlers.newLeader?.('');
        handlers.newLeader?.('long-leader-name');

        // Test malusSent with different values
        handlers.malusSent?.(0);
        handlers.malusSent?.(5);
        handlers.malusSent?.(10);

        // Test higherPos with different positions
        handlers.higherPos?.([{name: 'p1', pos: 0}], 'room1');
        handlers.higherPos?.([{name: 'p2', pos: 10}], 'room2');
        handlers.higherPos?.([{name: 'p3', pos: 19}], 'room3');

        // Test playerDisconnected with different names
        handlers.playerDisconnected?.('player1');
        handlers.playerDisconnected?.('');
        handlers.playerDisconnected?.('long-disconnected-name');
    });

    test('test all actions with different states', () => {
        const actions = [
            'SOCKET_INIT',
            'CREATE_PLAYER',
            'SET_HIGHER_POS',
            'LAUNCH_GAME',
            'MALUS',
            'GAME_OVER',
            'RETRY_GAME',
            'BACK_HOME',
            'URL_CHECK'
        ];

        // Test with empty state
        actions.forEach(action => {
            store.dispatch({ type: action });
        });

        // Test with null/undefined values
        store.getState().rows = null;
        store.getState().malus = undefined;
        store.getState().url = null;
        store.getState().tempName = undefined;
        actions.forEach(action => {
            store.dispatch({ type: action });
        });

        // Test with various row configurations
        store.getState().rows = Array(20).fill(Array(10).fill(0));
        store.getState().rows = Array(20).fill(Array(10).fill(1));
        store.getState().rows = Array(20).fill(Array(10).fill(2));
        actions.forEach(action => {
            store.dispatch({ type: action });
        });

        // Test with different malus values
        store.getState().malus = 0;
        store.getState().malus = 5;
        store.getState().malus = 10;
        actions.forEach(action => {
            store.dispatch({ type: action });
        });

        // Test with different URLs
        store.getState().url = '';
        store.getState().url = 'test-room';
        store.getState().url = 'long-room-name';
        actions.forEach(action => {
            store.dispatch({ type: action });
        });

        // Test with different player names
        store.getState().tempName = '';
        store.getState().tempName = 'player1';
        store.getState().tempName = 'long-player-name';
        actions.forEach(action => {
            store.dispatch({ type: action });
        });
    });

    test('test socket middleware error handling', () => {
        // Test with invalid socket
        mockSocket = null;
        store.dispatch({ type: 'SOCKET_INIT' });
        store.dispatch({ type: 'CREATE_PLAYER' });
        store.dispatch({ type: 'SET_HIGHER_POS' });

        // Test with invalid handlers
        mockSocket = {
            on: jest.fn(),
            emit: jest.fn()
        };
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Call handlers with invalid data
        handlers.randomPiece?.(null);
        handlers.piecesDelivered?.(undefined);
        handlers.GiveUrl?.(null);
        handlers.urlChecked?.(undefined);
        handlers.leaderrep?.(null, undefined, null);
        handlers.namePlayer?.(null);
        handlers.retry?.(undefined);
        handlers.winner?.(null);
        handlers.newLeader?.(undefined);
        handlers.malusSent?.(null);
        handlers.higherPos?.(undefined, null);
        handlers.playerDisconnected?.(null);
    });

    test('test socket middleware with rapid state changes', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Rapid state changes
        for(let i = 0; i < 20; i++) {
            store.getState().rows = Array(20).fill(Array(10).fill(i % 3));
            store.getState().malus = i;
            store.getState().url = `room${i}`;
            store.getState().tempName = `player${i}`;

            store.dispatch({ type: 'SET_HIGHER_POS' });
            store.dispatch({ type: 'MALUS' });
            store.dispatch({ type: 'CREATE_PLAYER' });
            store.dispatch({ type: 'GAME_OVER' });

            handlers.higherPos?.([{name: `player${i}`, pos: i}], `room${i}`);
            handlers.malusSent?.(i);
            handlers.winner?.(`player${i}`);
            handlers.newLeader?.(`player${i}`);
        }
    });

    test('test edge cases for all socket events', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Test extreme values
        handlers.randomPiece?.([...Array(100).keys()]);
        handlers.piecesDelivered?.([...Array(50).fill([1,1])]);
        handlers.GiveUrl?.('a'.repeat(1000));
        handlers.leaderrep?.(true, [...Array(100).keys()], Number.MAX_SAFE_INTEGER);
        handlers.namePlayer?.([...Array(100).fill('player')]);
        handlers.higherPos?.([...Array(100).fill({name: 'player', pos: 19})], 'room');
        
        // Test invalid values
        handlers.randomPiece?.(undefined);
        handlers.piecesDelivered?.(null);
        handlers.GiveUrl?.(undefined);
        handlers.urlChecked?.(null);
        handlers.leaderrep?.(undefined, null, undefined);
        handlers.launchGame?.(null);
        handlers.namePlayer?.(undefined);
        handlers.retry?.(null);
        handlers.winner?.(undefined);
        handlers.newLeader?.(null);
        handlers.malusSent?.(undefined);
        handlers.higherPos?.(null, undefined);
        handlers.playerDisconnected?.(undefined);

        // Test empty values
        handlers.randomPiece?.([]);
        handlers.piecesDelivered?.([]);
        handlers.GiveUrl?.('');
        handlers.namePlayer?.([]);
        handlers.retry?.('');
        handlers.winner?.('');
        handlers.newLeader?.('');
        handlers.playerDisconnected?.('');
    });

    test('test all possible game states', () => {
        const states = [
            { rows: Array(20).fill(Array(10).fill(0)) },
            { rows: Array(20).fill(Array(10).fill(1)) },
            { rows: Array(20).fill(Array(10).fill(2)) },
            { rows: null },
            { rows: undefined },
            { rows: [] },
            { malus: 0 },
            { malus: 1 },
            { malus: 5 },
            { malus: 10 },
            { malus: -1 },
            { malus: null },
            { malus: undefined },
            { url: 'room' },
            { url: '' },
            { url: null },
            { url: undefined },
            { tempName: 'player' },
            { tempName: '' },
            { tempName: null },
            { tempName: undefined },
            { leader: true },
            { leader: false },
            { leader: null },
            { leader: undefined },
            { gameLaunched: true },
            { gameLaunched: false },
            { gameLaunched: null },
            { gameLaunched: undefined }
        ];

        states.forEach(state => {
            Object.keys(state).forEach(key => {
                store.getState()[key] = state[key];
            });
            store.dispatch({ type: 'SET_HIGHER_POS' });
            store.dispatch({ type: 'MALUS' });
            store.dispatch({ type: 'CREATE_PLAYER' });
            store.dispatch({ type: 'GAME_OVER' });
            store.dispatch({ type: 'RETRY_GAME' });
            store.dispatch({ type: 'LAUNCH_GAME' });
            store.dispatch({ type: 'BACK_HOME' });
            store.dispatch({ type: 'URL_CHECK' });
        });
    });

    test('test rapid action sequences', () => {
        const actions = [
            'SET_HIGHER_POS',
            'MALUS',
            'CREATE_PLAYER',
            'GAME_OVER',
            'RETRY_GAME',
            'LAUNCH_GAME',
            'BACK_HOME',
            'URL_CHECK'
        ];

        // Dispatch actions rapidly in sequence
        for(let i = 0; i < 100; i++) {
            store.getState().rows = Array(20).fill(Array(10).fill(i % 3));
            store.getState().malus = i % 10;
            store.getState().url = `room${i}`;
            store.getState().tempName = `player${i}`;
            store.getState().leader = i % 2 === 0;
            store.getState().gameLaunched = i % 2 === 1;

            actions.forEach(action => {
                store.dispatch({ type: action });
            });
        }
    });

    test('test socket event combinations', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        const events = [
            'connect',
            'disconnect',
            'randomPiece',
            'piecesDelivered',
            'GiveUrl',
            'urlChecked',
            'leaderrep',
            'launchGame',
            'namePlayer',
            'retry',
            'winner',
            'newLeader',
            'malusSent',
            'higherPos',
            'playerDisconnected'
        ];

        // Test all possible combinations of events
        events.forEach((event1, i) => {
            events.forEach((event2, j) => {
                if (i !== j) {
                    if (handlers[event1]) handlers[event1]([1,2,3]);
                    if (handlers[event2]) handlers[event2]([4,5,6]);
                }
            });
        });
    });

    test('test middleware initialization with different configurations', () => {
        const configs = [
            { socket: null, store: null },
            { socket: undefined, store: undefined },
            { socket: {}, store: {} },
            { socket: { on: null }, store: { getState: null } },
            { socket: { emit: null }, store: { dispatch: null } },
            { socket: { on: jest.fn(), emit: jest.fn() }, store: { getState: jest.fn(), dispatch: jest.fn() } }
        ];

        configs.forEach(config => {
            mockSocket = config.socket;
            const mockStore = config.store;
            const next = jest.fn();
            const action = { type: 'SOCKET_INIT' };
            
            try {
                socketMiddleware(mockStore)(next)(action);
            } catch (e) {
                // Expected errors
            }
        });
    });

    test('test extreme game scenarios', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Test with maximum values
        store.getState().rows = Array(1000).fill(Array(1000).fill(1));
        store.getState().malus = Number.MAX_SAFE_INTEGER;
        store.getState().url = 'a'.repeat(10000);
        store.getState().tempName = 'b'.repeat(10000);
        store.dispatch({ type: 'SET_HIGHER_POS' });
        store.dispatch({ type: 'MALUS' });

        // Test with minimum values
        store.getState().rows = Array(1).fill(Array(1).fill(0));
        store.getState().malus = Number.MIN_SAFE_INTEGER;
        store.getState().url = '';
        store.getState().tempName = '';
        store.dispatch({ type: 'SET_HIGHER_POS' });
        store.dispatch({ type: 'MALUS' });

        // Test with special characters
        store.getState().url = '!@#$%^&*()';
        store.getState().tempName = '{}[]<>?';
        store.dispatch({ type: 'CREATE_PLAYER' });
        store.dispatch({ type: 'URL_CHECK' });
    });

    test('test all possible action combinations', () => {
        const actions = [
            'SOCKET_INIT',
            'CREATE_PLAYER',
            'SET_HIGHER_POS',
            'LAUNCH_GAME',
            'MALUS',
            'GAME_OVER',
            'RETRY_GAME',
            'BACK_HOME',
            'URL_CHECK'
        ];

        // Test every possible combination of two actions
        actions.forEach(action1 => {
            actions.forEach(action2 => {
                store.getState().rows = Array(20).fill(Array(10).fill(1));
                store.getState().malus = 5;
                store.getState().url = 'test-room';
                store.getState().tempName = 'player1';
                store.getState().leader = true;
                store.getState().gameLaunched = true;

                store.dispatch({ type: action1 });
                store.dispatch({ type: action2 });
            });
        });
    });

    test('test socket events with various data types', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        const testData = [
            null,
            undefined,
            0,
            1,
            -1,
            '',
            'test',
            [],
            [1,2,3],
            {},
            {test: 'data'},
            true,
            false,
            NaN,
            Infinity,
            -Infinity,
            new Date(),
            /regex/,
            new Error('test'),
            Buffer.from('test'),
            Symbol('test')
        ];

        // Test each handler with each type of data
        Object.keys(handlers).forEach(event => {
            testData.forEach(data => {
                try {
                    handlers[event](data);
                } catch (e) {
                    // Expected errors
                }
            });
        });
    });

    test('test state mutations during socket events', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Test state mutations during socket events
        for(let i = 0; i < 20; i++) {
            store.getState().rows = Array(20).fill(Array(10).fill(i % 3));
            store.getState().malus = i;
            store.getState().url = `room${i}`;
            store.getState().tempName = `player${i}`;
            store.getState().leader = i % 2 === 0;
            store.getState().gameLaunched = i % 2 === 1;

            handlers.randomPiece?.([i, i+1, i+2]);
            handlers.piecesDelivered?.([[i, i], [i+1, i+1]]);
            handlers.GiveUrl?.(`room${i}`);
            handlers.urlChecked?.(i % 2 === 0);
            handlers.leaderrep?.(i % 2 === 0, [i, i+1], i * 100);
            handlers.launchGame?.();
            handlers.namePlayer?.([`player${i}`]);
            handlers.retry?.(`player${i}`);
            handlers.winner?.(`player${i}`);
            handlers.newLeader?.(`player${i}`);
            handlers.malusSent?.(i);
            handlers.higherPos?.([{name: `player${i}`, pos: i}], `room${i}`);
            handlers.playerDisconnected?.(`player${i}`);
        }
    });

    test('test concurrent socket events and actions', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Simulate concurrent events and actions
        for(let i = 0; i < 10; i++) {
            // Set random state
            store.getState().rows = Array(20).fill(Array(10).fill(Math.floor(Math.random() * 3)));
            store.getState().malus = Math.floor(Math.random() * 10);
            store.getState().url = `room${Math.random()}`;
            store.getState().tempName = `player${Math.random()}`;
            store.getState().leader = Math.random() > 0.5;
            store.getState().gameLaunched = Math.random() > 0.5;

            // Dispatch multiple actions
            store.dispatch({ type: 'SET_HIGHER_POS' });
            store.dispatch({ type: 'MALUS' });
            store.dispatch({ type: 'CREATE_PLAYER' });

            // Trigger multiple socket events
            handlers.randomPiece?.([1,2,3]);
            handlers.piecesDelivered?.([[1,1],[2,2]]);
            handlers.higherPos?.([{name: 'player1', pos: 5}], 'room1');

            // More actions
            store.dispatch({ type: 'GAME_OVER' });
            store.dispatch({ type: 'RETRY_GAME' });

            // More socket events
            handlers.winner?.('player1');
            handlers.newLeader?.('player2');
            handlers.malusSent?.(3);
        }
    });

    test('test socket middleware with malformed actions', () => {
        const malformedActions = [
            { type: undefined },
            { type: null },
            { type: '' },
            { type: 123 },
            { type: {} },
            { type: [] },
            { },
            null,
            undefined,
            'string',
            123,
            true,
            false,
            [],
            {},
            new Date(),
            /regex/,
            new Error('test'),
            Symbol('test')
        ];

        malformedActions.forEach(action => {
            try {
                store.dispatch(action);
            } catch (e) {
                // Expected errors
            }
        });
    });

    test('test socket middleware with rapid socket reconnections', () => {
        for(let i = 0; i < 10; i++) {
            // Simulate socket disconnection
            mockSocket = null;
            store.dispatch({ type: 'SOCKET_INIT' });

            // Simulate socket reconnection
            mockSocket = {
                on: jest.fn(),
                emit: jest.fn()
            };
            store.dispatch({ type: 'SOCKET_INIT' });

            // Test actions during reconnection
            store.dispatch({ type: 'CREATE_PLAYER' });
            store.dispatch({ type: 'SET_HIGHER_POS' });
            store.dispatch({ type: 'MALUS' });
        }
    });

    test('test utility functions', () => {
        // Test equal function
        expect(equal([0,0,0], 0)).toBe(true);
        expect(equal([1,1,1], 1)).toBe(true);
        expect(equal([0,1,0], 0)).toBe(false);
        expect(equal([], 0)).toBe(true);
        expect(equal([2,2,2], 2)).toBe(true);

        // Test checkRowsEqual function
        const rows = [
            [0,0,0],
            [1,1,1],
            [2,2,2],
            [0,1,2]
        ];
        expect(checkRowsEqual(rows, 0, 3, 0)).toBe(true);
        expect(checkRowsEqual(rows, 1, 3, 1)).toBe(true);
        expect(checkRowsEqual(rows, 2, 3, 2)).toBe(true);
        expect(checkRowsEqual(rows, 0, 3, 3)).toBe(false);
    });

    test('test createRoom functionality', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        store.getState().tempName = 'testPlayer';
        store.getState().piece = [1,2,3];
        
        store.dispatch({ type: 'createRoom/createRoomOn' });
        expect(mockSocket.emit).toHaveBeenCalledWith('createGameRoom', 'testPlayer', [1,2,3]);
        
        // Simulate server response
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.GiveUrl?.('testRoom');
    });

    test('test showHighScore functionality', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        store.dispatch({ type: 'showHighScore/showHighScoreOn' });
        expect(mockSocket.emit).toHaveBeenCalledWith('highScore');
        
        // Simulate server response
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.highScoreSorted?.([{name: 'player1', score: 100}]);
    });

    test('test leader functionality', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        store.getState().url = 'testRoom';
        store.getState().tempName = 'testPlayer';
        
        store.dispatch({ type: 'LEADER_OR_NOT' });
        expect(mockSocket.emit).toHaveBeenCalledWith('leaderornot', 'testRoom', 'testPlayer');
        
        store.dispatch({ type: 'LEADER_REP' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.leaderrep?.(true, [1,2,3], 1000);
    });

    test('test game state transitions', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Test game launch
        store.getState().leader = false;
        store.dispatch({ type: 'LAUNCH_GAME' });
        
        expect(mockSocket.emit).toHaveBeenCalledWith('changestatusPlayer', store.getState().url, store.getState().tempName, true);
        expect(mockSocket.emit).toHaveBeenCalledWith('gameStarted', store.getState().url);

        // Test name player
        store.getState().tempName = 'player1';
        store.dispatch({ type: 'NAME_PLAYER' });
        handlers.namePlayer?.(['player1', 'player2', 'player3']);

        // Test retry signal
        store.getState().tempName = 'player2';
        store.dispatch({ type: 'RETRY_SIGNAL' });
        handlers.retry?.('player1');

        // Test winner
        store.getState().tempName = 'player1';
        store.dispatch({ type: 'WINNER' });
        handlers.winner?.('player1');

        // Test new leader
        store.dispatch({ type: 'NEW_LEADER' });
        handlers.newLeader?.('player1');
    });

    test('test resetGameOver function', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        store.getState().url = 'testRoom';
        store.getState().tempName = 'testPlayer';
        store.getState().gameLaunched = true;

        resetGameOver(store.getState(), store, mockSocket);

        expect(mockSocket.emit).toHaveBeenCalledWith('changestatusPlayer', 'testRoom', 'testPlayer', false);
        expect(mockSocket.emit).toHaveBeenCalledWith('gameStopped', 'testRoom');
    });

    test('test launchGame function', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        store.getState().url = 'testRoom';
        store.getState().tempName = 'testPlayer';
        store.getState().leader = true;

        launchGame(store.getState(), store, mockSocket);

        expect(mockSocket.emit).toHaveBeenCalledWith('changestatusPlayer', 'testRoom', 'testPlayer', true);
        expect(mockSocket.emit).toHaveBeenCalledWith('gameStarted', 'testRoom');
    });

    test('test Retry function', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        store.getState().url = 'testRoom';
        store.getState().tempName = 'testPlayer';
        store.getState().leader = true;

        Retry(store.getState(), store, mockSocket);

        expect(mockSocket.emit).toHaveBeenCalledWith('changestatusPlayer', 'testRoom', 'testPlayer', true);
        expect(mockSocket.emit).toHaveBeenCalledWith('all_retry', 'testRoom', 'testPlayer');
    });

    test('test game over scenarios', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        
        // Test game over when all rows are filled
        store.getState().rows = Array(20).fill(Array(10).fill(1));
        store.getState().gameLaunched = true;
        store.dispatch({ type: 'SET_HIGHER_POS' });
        
        expect(mockSocket.emit).toHaveBeenCalledWith('changestatusPlayer', store.getState().url, store.getState().tempName, false);
        expect(mockSocket.emit).toHaveBeenCalledWith('gameStopped', store.getState().url);
        
        // Test game over with malus
        store.getState().rows = Array(20).fill(Array(10).fill(2));
        store.getState().malus = 10;
        store.dispatch({ type: 'SET_HIGHER_POS' });
        
        expect(mockSocket.emit).toHaveBeenCalledWith('changestatusPlayer', store.getState().url, store.getState().tempName, false);
        expect(mockSocket.emit).toHaveBeenCalledWith('gameStopped', store.getState().url);
    });

    test('test game launch scenarios', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        
        // Test game launch as leader
        store.getState().leader = true;
        store.dispatch({ type: 'LAUNCH_GAME' });
        
        expect(mockSocket.emit).toHaveBeenCalledWith('changestatusPlayer', store.getState().url, store.getState().tempName, true);
        expect(mockSocket.emit).toHaveBeenCalledWith('gameStarted', store.getState().url);
        
        // Test game launch as non-leader
        store.getState().leader = false;
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.launchGame?.();
    });

    test('test retry scenarios', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        
        // Test retry as leader
        store.getState().leader = true;
        store.dispatch({ type: 'RETRY_GAME' });
        
        expect(mockSocket.emit).toHaveBeenCalledWith('changestatusPlayer', store.getState().url, store.getState().tempName, true);
        expect(mockSocket.emit).toHaveBeenCalledWith('all_retry', store.getState().url, store.getState().tempName);
        
        // Test retry as non-leader
        store.getState().leader = false;
        store.getState().tempName = 'player2';
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        handlers.retry?.('player1');
    });

    test('test row checking scenarios', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        
        // Test with empty rows
        store.getState().rows = Array(20).fill(Array(10).fill(0));
        store.dispatch({ type: 'SET_HIGHER_POS' });
        
        // Test with one full row
        store.getState().rows = [
            ...Array(19).fill(Array(10).fill(0)),
            Array(10).fill(1)
        ];
        store.dispatch({ type: 'SET_HIGHER_POS' });
        
        // Test with multiple full rows
        store.getState().rows = [
            ...Array(18).fill(Array(10).fill(0)),
            Array(10).fill(1),
            Array(10).fill(1)
        ];
        store.dispatch({ type: 'SET_HIGHER_POS' });
        
        // Test with alternating rows
        store.getState().rows = Array(20).fill().map((_, i) => Array(10).fill(i % 2));
        store.dispatch({ type: 'SET_HIGHER_POS' });
    });

    test('test malus handling', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        
        // Test with no malus
        store.getState().malus = 0;
        store.dispatch({ type: 'MALUS' });
        
        // Test with small malus
        store.getState().malus = 1;
        store.dispatch({ type: 'MALUS' });
        handlers.malusSent?.(1);
        
        // Test with large malus
        store.getState().malus = 10;
        store.dispatch({ type: 'MALUS' });
        handlers.malusSent?.(10);
        
        // Test with negative malus
        store.getState().malus = -1;
        store.dispatch({ type: 'MALUS' });
        handlers.malusSent?.(-1);
    });

    test('test player interactions', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });
        
        // Test player creation
        store.dispatch({ type: 'CREATE_PLAYER' });
        expect(mockSocket.emit).toHaveBeenCalledWith('createPlayer', store.getState().oldUrl, store.getState().tempName);
        
        // Test player name updates
        handlers.namePlayer?.(['player1', 'player2', 'player3']);
        
        // Test player disconnection
        handlers.playerDisconnected?.('player2');
        
        // Test leader changes
        handlers.newLeader?.('player1');
        
        // Test winner announcement
        handlers.winner?.(store.getState().tempName);
    });

    test('test socket initialization and reconnection', () => {
        // Test initial connection
        store.dispatch({ type: 'SOCKET_INIT' });
        expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
        expect(mockSocket.emit).toHaveBeenCalledWith('requestRandomPiece');
        expect(mockSocket.emit).toHaveBeenCalledWith('allPieces');

        // Get socket handlers
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Test random piece delivery
        handlers.randomPiece?.([1, 2, 3]);
        
        // Test pieces catalog delivery
        handlers.piecesDelivered?.([[1,1], [2,2]]);

        // Test reconnection
        mockSocket = null;
        store.dispatch({ type: 'SOCKET_INIT' });
    });

    test('test url and room management', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Test URL check
        store.getState().checkUrl = 'testRoom';
        store.dispatch({ type: 'URL_CHECK' });
        expect(mockSocket.emit).toHaveBeenCalledWith('urlCheck', 'testRoom');
        
        // Test URL check response - valid
        handlers.urlChecked?.(true);
        
        // Test URL check response - invalid
        handlers.urlChecked?.(false);

        // Test URL assignment
        handlers.GiveUrl?.('newRoom');
    });

    test('test game state transitions with multiple events', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Initial game setup
        store.getState().url = 'gameRoom';
        store.getState().tempName = 'player1';
        store.getState().leader = true;

        // Start game
        store.dispatch({ type: 'LAUNCH_GAME' });
        handlers.launchGame?.();

        // Simulate piece movements and malus
        store.getState().rows = Array(20).fill(Array(10).fill(0));
        store.getState().malus = 2;
        store.dispatch({ type: 'SET_HIGHER_POS' });
        store.dispatch({ type: 'MALUS' });

        // Game over
        store.getState().rows = Array(20).fill(Array(10).fill(1));
        store.dispatch({ type: 'SET_HIGHER_POS' });

        // Retry game
        store.dispatch({ type: 'RETRY_GAME' });
        handlers.retry?.('player1');

        // New leader assignment
        handlers.newLeader?.('player2');

        // Winner announcement
        handlers.winner?.('player1');
    });

    test('test multiple player interactions', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        // Multiple players join
        handlers.namePlayer?.(['player1', 'player2', 'player3']);

        // Leader checks
        store.dispatch({ type: 'LEADER_OR_NOT' });
        store.dispatch({ type: 'LEADER_REP' });
        handlers.leaderrep?.(true, [1,2,3], 1000);

        // Player positions update
        handlers.higherPos?.([
            {name: 'player1', pos: 15},
            {name: 'player2', pos: 10},
            {name: 'player3', pos: 5}
        ], 'gameRoom');

        // Player disconnection
        handlers.playerDisconnected?.('player3');

        // New leader assignment after disconnection
        handlers.newLeader?.('player2');
    });

    test('test rapid game state changes', () => {
        store.dispatch({ type: 'SOCKET_INIT' });
        const handlers = {};
        mockSocket.on.mock.calls.forEach(([event, handler]) => {
            handlers[event] = handler;
        });

        for(let i = 0; i < 5; i++) {
            // Change game state
            store.getState().rows = Array(20).fill(Array(10).fill(i % 2));
            store.getState().malus = i;
            store.getState().leader = i % 2 === 0;
            store.getState().gameLaunched = true;

            // Dispatch multiple actions
            store.dispatch({ type: 'SET_HIGHER_POS' });
            store.dispatch({ type: 'MALUS' });
            store.dispatch({ type: 'LAUNCH_GAME' });

            // Simulate socket events
            handlers.randomPiece?.([i, i+1, i+2]);
            handlers.malusSent?.(i);
            handlers.higherPos?.([{name: 'p'+i, pos: 19-i}], 'gameRoom');
        }
    });
});
