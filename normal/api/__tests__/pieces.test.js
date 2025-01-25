const Pieces = require('../pieces');

describe('Pieces Tests', () => {
  let pieces;

  beforeEach(() => {
    pieces = new Pieces();
  });

  describe('getRandomPiece', () => {
    test('generates a valid piece', () => {
      const piece = pieces.getRandomPiece();
      expect(piece).toBeDefined();
      expect(Array.isArray(piece)).toBe(true);
    });

    test('generates different pieces', () => {
      const generatedPieces = new Set();
      for (let i = 0; i < 10; i++) {
        const piece = pieces.getRandomPiece();
        generatedPieces.add(JSON.stringify(piece));
      }
      expect(generatedPieces.size).toBeGreaterThan(1);
    });
  });

  describe('getallPiece', () => {
    test('generates multiple pieces', () => {
      const allPieces = pieces.getallPiece();
      expect(Array.isArray(allPieces)).toBe(true);
      expect(allPieces.length).toBe(2000);
    });
  });
});
