const Scores = require('../scores');

describe('Scores Tests', () => {
  describe('Score Creation', () => {
    test('creates score with correct properties', () => {
      const name = 'player1';
      const score = 100;
      const nature = 'tetris';

      const scoreObj = new Scores(name, score, nature);

      expect(scoreObj.name).toBe(name);
      expect(scoreObj.scores).toBe(score);
      expect(scoreObj.nature).toBe(nature);
    });

    test('handles zero score', () => {
      const scoreObj = new Scores('player1', 0, 'tetris');
      expect(scoreObj.scores).toBe(0);
    });

    test('handles negative score', () => {
      const scoreObj = new Scores('player1', -10, 'tetris');
      expect(scoreObj.scores).toBe(-10);
    });
  });
});
