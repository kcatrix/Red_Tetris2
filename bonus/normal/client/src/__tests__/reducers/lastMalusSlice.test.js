import reducer, { 
    modifyLastMalus,
    addLastMalus,
    selectLastMalus
} from '../../reducers/lastMalusSlice';

describe('lastMalusSlice', () => {
    test('should return the initial state', () => {
        expect(reducer(undefined, { type: undefined })).toBe(0);
    });

    test('should handle modifyLastMalus', () => {
        const previousState = 0;
        expect(reducer(previousState, modifyLastMalus(5))).toBe(5);
    });

    test('should handle addLastMalus', () => {
        const previousState = 3;
        expect(reducer(previousState, addLastMalus(2))).toBe(5);
    });

    test('should handle multiple modifications', () => {
        let state = reducer(undefined, { type: undefined });
        state = reducer(state, modifyLastMalus(5));
        state = reducer(state, addLastMalus(3));
        state = reducer(state, addLastMalus(2));
        expect(state).toBe(10);
    });

    test('should handle zero value in modifyLastMalus', () => {
        const previousState = 5;
        expect(reducer(previousState, modifyLastMalus(0))).toBe(0);
    });

    test('should handle zero value in addLastMalus', () => {
        const previousState = 5;
        expect(reducer(previousState, addLastMalus(0))).toBe(5);
    });

    test('should handle negative values in modifyLastMalus', () => {
        const previousState = 5;
        expect(reducer(previousState, modifyLastMalus(-3))).toBe(-3);
    });

    test('should handle negative values in addLastMalus', () => {
        const previousState = 5;
        expect(reducer(previousState, addLastMalus(-2))).toBe(3);
    });

    test('selector should return current state', () => {
        const state = { lastMalus: 5 };
        expect(selectLastMalus(state)).toBe(5);
    });

    test('should handle chained operations', () => {
        let state = reducer(undefined, { type: undefined });
        state = reducer(state, modifyLastMalus(10));
        state = reducer(state, addLastMalus(-5));
        state = reducer(state, addLastMalus(3));
        state = reducer(state, modifyLastMalus(0));
        expect(state).toBe(0);
    });
});
