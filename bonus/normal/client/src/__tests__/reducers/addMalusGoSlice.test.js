import reducer, { 
    modifyAddMalusGo,
    selectAddMalusGo
} from '../../reducers/addMalusGoSlice';

describe('addMalusGoSlice', () => {
    test('should return the initial state', () => {
        expect(reducer(undefined, { type: undefined })).toBe(0);
    });

    test('should handle modifyAddMalusGo', () => {
        const previousState = 0;
        expect(reducer(previousState, modifyAddMalusGo(5))).toBe(5);
    });

    test('should handle multiple modifications', () => {
        let state = reducer(undefined, { type: undefined });
        state = reducer(state, modifyAddMalusGo(5));
        state = reducer(state, modifyAddMalusGo(10));
        expect(state).toBe(10);
    });

    test('should handle zero value', () => {
        const previousState = 5;
        expect(reducer(previousState, modifyAddMalusGo(0))).toBe(0);
    });

    test('should handle negative values', () => {
        const previousState = 5;
        expect(reducer(previousState, modifyAddMalusGo(-3))).toBe(-3);
    });

    test('selector should return current state', () => {
        const state = { addMalusGo: 5 };
        expect(selectAddMalusGo(state)).toBe(5);
    });
});
