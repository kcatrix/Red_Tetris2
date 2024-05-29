import React, { useState, useEffect } from 'react';

function Game({ pieces, onPieceLanded }) {
  const [pieceIndex, setPieceIndex] = useState(0);
  const [position, setPosition] = useState([{ x: 4, y: 0 }]);
  const [isPieceDropping, setIsPieceDropping] = useState(false);
  const [gameLaunched, setGameLaunched] = useState(false);

  const [rows, setRows] = useState(
    Array.from({ length: 20 }, () => Array(10).fill(0))
  );

  // Action premet de supprimer quand on donne 0 ou d'écrire quand on donne 1
  const writePiece = (action, piece, position) => {
    setRows(prevRows => {
      let newRows = [...prevRows];
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x] === 1 && action == 1) {
            newRows[position.y + y][position.x + x] = 1;
          }
		  else if (piece[y][x] === 1 && action == 0) {
            newRows[position.y + y][position.x + x] = 0;
          }
        }
      }
      return newRows;
    });
  };

  const check_collison = (piece ,position) => {
    if (position.y == rows.length - 1 - piece.length)
      return true
    else 
      return false
  };


  useEffect(() => {
    if (!gameLaunched || !pieces[pieceIndex]) return;
    writePiece(1, pieces[pieceIndex], position[pieceIndex]);

    const intervalId = setInterval(() => {
      setPosition(prevPositions => {
        if (check_collison(pieces[pieceIndex], prevPositions[pieceIndex]))
          clearInterval(intervalId)
        const newPosition = { ...prevPositions[pieceIndex], y: prevPositions[pieceIndex].y + 1 };
        writePiece(0, pieces[pieceIndex], prevPositions[pieceIndex]);
        writePiece(1, pieces[pieceIndex], newPosition);
        const newPositions = [...prevPositions];
        newPositions[pieceIndex] = newPosition;
        return newPositions;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [gameLaunched, pieces, pieceIndex]);

  const launchGame = () => {
    setGameLaunched(true);
  };

  return (
    <div className="Game">
      <h1>RED_TETRIS</h1>
      <div className="board">
        {rows.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div key={j} className={`cell ${cell === 1 ? 'cell piece' : ''}`}>{cell}</div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={launchGame}>Launch Game</button>
    </div>
  );
}

export default Game;
