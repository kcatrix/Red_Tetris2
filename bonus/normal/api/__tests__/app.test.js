const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

describe('API Integration Tests', () => {
  let io;
  let serverSocket;
  let clientSocket;
  const port = Math.floor(Math.random() * 1000) + 4000; // Port aléatoire pour éviter les conflits

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(port, () => {
      clientSocket = Client(`http://localhost:${port}`, {
        transports: ['websocket'],
        forceNew: true,
        reconnection: false
      });
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  }, 5000);

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  describe('Socket Connection', () => {
    test('establishes socket connection', (done) => {
      expect(clientSocket.connected).toBe(true);
      done();
    }, 1000);
  });

  describe('Room Management', () => {
    test('creates room', (done) => {
      clientSocket.emit('createGameRoom', 'test-room', ['I', 'O', 'T']);
      serverSocket.on('createGameRoom', (name, pieces) => {
        expect(name).toBe('test-room');
        expect(pieces).toEqual(['I', 'O', 'T']);
        serverSocket.emit('GiveUrl', '/123/test-room');
      });
      clientSocket.on('GiveUrl', (url) => {
        expect(url).toBeDefined();
        expect(url).toBe('/123/test-room');
        done();
      });
    }, 1000);

    test('checks room URL', (done) => {
      clientSocket.emit('urlCheck', '/123/test-room');
      serverSocket.on('urlCheck', (url) => {
        expect(url).toBe('/123/test-room');
        serverSocket.emit('urlChecked', 1);
      });
      clientSocket.on('urlChecked', (status) => {
        expect(status).toBe(1);
        done();
      });
    }, 1000);
  });

  describe('Game Events', () => {
    test('requests random piece', (done) => {
      clientSocket.emit('requestRandomPiece');
      serverSocket.on('requestRandomPiece', () => {
        serverSocket.emit('randomPiece', ['I', 'O', 'T']);
      });
      clientSocket.on('randomPiece', (pieces) => {
        expect(Array.isArray(pieces)).toBe(true);
        done();
      });
    }, 1000);

    test('starts game', (done) => {
      clientSocket.emit('gameStarted', '/123/test-room');
      serverSocket.on('gameStarted', (url) => {
        expect(url).toBe('/123/test-room');
        serverSocket.emit('launchGame');
      });
      clientSocket.on('launchGame', done);
    }, 1000);
  });

  describe('Player Updates', () => {
    test('updates player position', (done) => {
      clientSocket.emit('setHigherPos', 5, '/123/test-room', 'player1');
      serverSocket.on('setHigherPos', (pos, url, name) => {
        expect(pos).toBe(5);
        expect(url).toBe('/123/test-room');
        expect(name).toBe('player1');
        serverSocket.emit('higherPos', [{name: 'player1', pos: 5}], url);
      });
      clientSocket.on('higherPos', (players, url) => {
        expect(Array.isArray(players)).toBe(true);
        expect(url).toBe('/123/test-room');
        done();
      });
    }, 1000);
  });

  describe('Score Management', () => {
    test('adds score', (done) => {
      clientSocket.emit('score_add', 100, 'player1', '/123/test-room');
      serverSocket.on('score_add', (score, name, url) => {
        expect(score).toBe(100);
        expect(name).toBe('player1');
        expect(url).toBe('/123/test-room');
        done();
      });
    }, 1000);
  });
});
