const Player = require('../players');

describe('Player Tests', () => {
  describe('Player Creation', () => {
    test('creates player with correct properties', () => {
      const name = 'player1';
      const leader = true;
      const higherPos = 0;
      const ingame = true;
      const id = '123';
      const scores = 100;

      const player = new Player(name, leader, higherPos, ingame, id, scores);

      expect(player.name).toBe(name);
      expect(player.leader).toBe(leader);
      expect(player.higherPos).toBe(higherPos);
      expect(player.ingame).toBe(ingame);
      expect(player.id).toBe(id);
      expect(player.scores).toBe(scores);
    });
  });

  describe('Score Management', () => {
    test('updates score when new score is higher', () => {
      const player = new Player('player1', false, 0, true, '123', 100);
      player.setScore(200);
      expect(player.scores).toBe(200);
    });

    test('keeps existing score when new score is lower', () => {
      const player = new Player('player1', false, 0, true, '123', 200);
      player.setScore(100);
      expect(player.scores).toBe(200);
    });

    test('sets initial score when undefined', () => {
      const player = new Player('player1', false, 0, true, '123');
      player.setScore(100);
      expect(player.scores).toBe(100);
    });
  });

  describe('Position Management', () => {
    test('updates higher position', () => {
      const player = new Player('player1', false, 0, true, '123', 0);
      player.setHigherPos(5);
      expect(player.higherPos).toBe(5);
    });
  });

  describe('Leader Management', () => {
    test('sets player as leader', () => {
      const player = new Player('player1', false, 0, true, '123', 0);
      player.setLeader();
      expect(player.leader).toBe(1);
    });
  });

  describe('Game Status', () => {
    test('updates ingame status', () => {
      const player = new Player('player1', false, 0, true, '123', 0);
      player.setIngame(false);
      expect(player.ingame).toBe(false);
    });
  });
});
