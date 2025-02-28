const Room = require('../room');

describe('Room Tests', () => {
  describe('Room Creation', () => {
    test('creates room with correct properties', () => {
      const name = 'test-room';
      const pieces = ['I', 'O', 'T'];
      const socketId = '123';
      const score = 0;

      const room = new Room(name, pieces, socketId, score);

      expect(room.name).toBe(name);
      expect(room.pieces).toBe(pieces);
      expect(room.available).toBe(true);
      expect(room.Players).toHaveLength(1);
      expect(room.Players[0].name).toBe(name);
      expect(room.Players[0].leader).toBe(true);
      expect(room.token).toMatch(/^\d{3}$/);
      expect(room.Url).toBe('/' + room.token + '/' + name);
    });
  });

  describe('Player Management', () => {
    test('adds new player successfully', () => {
      const room = new Room('test-room', [], '123', 0);
      room.creatNewPlayer('player2', '456', 0);
      
      expect(room.Players).toHaveLength(2);
      expect(room.Players[1].name).toBe('player2');
      expect(room.Players[1].leader).toBe(false);
    });

    test('removes player successfully', () => {
      const room = new Room('test-room', [], '123', 0);
      room.creatNewPlayer('player2', '456', 0);
      room.removePlayer('456');
      
      expect(room.Players[0].name).toBe('test-room');
      expect(room.Players.some(p => p.socketId === '456')).toBe(false);
    });
  });

  describe('Token Generation', () => {
    test('generates valid token', () => {
      const room = new Room('test-room', [], '123', 0);
      expect(room.token).toMatch(/^\d{3}$/);
    });
  });

  describe('URL Generation', () => {
    test('generates valid URL', () => {
      const room = new Room('test-room', [], '123', 0);
      expect(room.Url).toBe('/' + room.token + '/' + room.name);
    });
  });

  describe('Room Availability', () => {
    test('room is initially available', () => {
      const room = new Room('test-room', [], '123', 0);
      expect(room.available).toBe(true);
    });

    test('can change room availability', () => {
      const room = new Room('test-room', [], '123', 0);
      room.available = false;
      expect(room.available).toBe(false);
    });
  });
});
