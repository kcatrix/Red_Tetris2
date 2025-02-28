import { coucou } from '../components/changeButton';

describe('changeButton', () => {
    let mockSocket;
    let mockSetCou;

    beforeEach(() => {
        // Mock socket.emit
        mockSocket = {
            emit: jest.fn()
        };

        // Mock setState function
        mockSetCou = jest.fn();
    });

    test('toggles cou state from true to false', () => {
        const initialCou = true;
        const tempName = 'testPlayer';
        const pieces = ['piece1', 'piece2'];

        coucou(initialCou, mockSetCou, mockSocket, tempName, pieces);

        expect(mockSetCou).toHaveBeenCalledWith(false);
        expect(mockSocket.emit).toHaveBeenCalledWith('createGameRoom', tempName, pieces);
    });

    test('toggles cou state from false to true', () => {
        const initialCou = false;
        const tempName = 'testPlayer';
        const pieces = ['piece1', 'piece2'];

        coucou(initialCou, mockSetCou, mockSocket, tempName, pieces);

        expect(mockSetCou).toHaveBeenCalledWith(true);
        expect(mockSocket.emit).toHaveBeenCalledWith('createGameRoom', tempName, pieces);
    });

    test('handles empty pieces array', () => {
        const initialCou = true;
        const tempName = 'testPlayer';
        const pieces = [];

        coucou(initialCou, mockSetCou, mockSocket, tempName, pieces);

        expect(mockSetCou).toHaveBeenCalledWith(false);
        expect(mockSocket.emit).toHaveBeenCalledWith('createGameRoom', tempName, pieces);
    });

    test('handles empty tempName', () => {
        const initialCou = true;
        const tempName = '';
        const pieces = ['piece1'];

        coucou(initialCou, mockSetCou, mockSocket, tempName, pieces);

        expect(mockSetCou).toHaveBeenCalledWith(false);
        expect(mockSocket.emit).toHaveBeenCalledWith('createGameRoom', tempName, pieces);
    });

    test('handles null values', () => {
        const initialCou = true;
        const tempName = null;
        const pieces = null;

        coucou(initialCou, mockSetCou, mockSocket, tempName, pieces);

        expect(mockSetCou).toHaveBeenCalledWith(false);
        expect(mockSocket.emit).toHaveBeenCalledWith('createGameRoom', tempName, pieces);
    });
});
