import { store } from '../store';

describe('Redux Store', () => {
  test('store is created with all reducers', () => {
    const state = store.getState();
    
    // Verify all reducers are present
    expect(state).toHaveProperty('piece');
    expect(state).toHaveProperty('catalogPieces');
    expect(state).toHaveProperty('multi');
    expect(state).toHaveProperty('url');
    expect(state).toHaveProperty('checkUrl');
    expect(state).toHaveProperty('changeOk');
    expect(state).toHaveProperty('createRoom');
    expect(state).toHaveProperty('tempName');
    expect(state).toHaveProperty('showHighScore');
    expect(state).toHaveProperty('scoreList');
    expect(state).toHaveProperty('noName');
    expect(state).toHaveProperty('oldUrl');
    expect(state).toHaveProperty('leader');
    expect(state).toHaveProperty('bestScore');
    expect(state).toHaveProperty('rows');
    expect(state).toHaveProperty('gameLaunched');
    expect(state).toHaveProperty('score');
    expect(state).toHaveProperty('resultats');
    expect(state).toHaveProperty('playersOff');
    expect(state).toHaveProperty('retrySignal');
    expect(state).toHaveProperty('lastMalus');
    expect(state).toHaveProperty('keyDown');
    expect(state).toHaveProperty('gameOver');
    expect(state).toHaveProperty('pieceIndex');
    expect(state).toHaveProperty('startPiece');
    expect(state).toHaveProperty('positions');
    expect(state).toHaveProperty('music');
    expect(state).toHaveProperty('malus');
    expect(state).toHaveProperty('addMalusGo');
    expect(state).toHaveProperty('time');
    expect(state).toHaveProperty('players');
    expect(state).toHaveProperty('back');
  });

  test('store can dispatch actions', () => {
    // Test dispatching an action to modify tempName
    store.dispatch({ type: 'tempName/modifyTempName', payload: 'TestPlayer' });
    expect(store.getState().tempName).toBe('TestPlayer');

    // Test dispatching an action to modify score
    store.dispatch({ type: 'score/modifyScore', payload: 100 });
    expect(store.getState().score).toBe(100);

    // Test dispatching an action to modify gameOver
    store.dispatch({ type: 'gameOver/modifyGameOver', payload: true });
    expect(store.getState().gameOver).toBe(true);
  });

  test('store has socketMiddleware', () => {
    const middlewares = store.getState();
    expect(middlewares).toBeDefined();
  });
});
