import React, { useState, useEffect } from 'react';

function Game({ pieces, onPieceLanded }) {
  const [pieceIndex, setPieceIndex] = useState(0);
  const [position, setPosition] = useState([{ x: 4, y: 0 }]);
  const [isPieceDropping, setIsPieceDropping] = useState(false);
  const [gameLaunched, setGameLaunched] = useState(false);

  const [rows, setRows] = useState(
    Array.from({ length: 20 }, () => Array(10).fill(0))
  );

  const addPieceToRow = (piece, position) => {
    setRows(prevRows => {
      let newRows = [...prevRows];
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x] === 1) {
            newRows[position.y + y][position.x + x] = 1;
          }
        }
      }
      return newRows;
    });
  };

  const removePiece = (piece, position) => {
    setRows(prevRows => {
      let newRows = [...prevRows];
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x] === 1) {
            newRows[position.y + y][position.x + x] = 0;
          }
        }
      }
      return newRows;
    });
  };

  useEffect(() => {
    if (!gameLaunched || !pieces[pieceIndex]) return;
    addPieceToRow(pieces[pieceIndex], position[pieceIndex]);

    const intervalId = setInterval(() => {
      setPosition(prevPositions => {
        const newPosition = { ...prevPositions[pieceIndex], y: prevPositions[pieceIndex].y + 1 };
        removePiece(pieces[pieceIndex], prevPositions[pieceIndex]);
        addPieceToRow(pieces[pieceIndex], newPosition);
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
