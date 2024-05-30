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

  // a placer dans fonction pratique
  const maxRangeX = (piece, position) => {
    let max = 0 ;
    for (let i = 0; i < piece.length; i++) {
      for (let j = 0; j < piece[i].length; j++) {
        if (max < j && piece[i][j] == 1)
          max = j;
      }
    }
    return max + position.x;
  }


  const checkCollision = (piece ,position) => {
    const overstepGridOnY = rows.length - 1 - piece.length;
    const maxGridOnX = 9;
    if ((position.y == overstepGridOnY) || (position.x < 0 || maxRangeX(piece, position) > maxGridOnX)) //check collision growd only
      return 1
    else if (position.y + 1 == 1 || position.x + 1 == 1 || position.y - 1 == 1 || position.x - 1 == 1)
      return 2
    else 
      return 0
  };

  //---------------------gestion des touches---------------------

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!gameLaunched || !pieces[pieceIndex]) return;
      let newPosition = { ...position[pieceIndex] };

      switch (event.key) {
        case 'ArrowLeft':
          newPosition.x -= 1;
          if (checkCollision(pieces[pieceIndex], newPosition) === 0) {
            writePiece(0, pieces[pieceIndex], position[pieceIndex]);
            setPosition(prevPositions => {
              const newPositions = [...prevPositions];
              newPositions[pieceIndex] = newPosition;
              writePiece(1, pieces[pieceIndex], newPosition);
              return newPositions;
            });
          }
          break;
        case 'ArrowRight':
          newPosition.x += 1;
          if (checkCollision(pieces[pieceIndex], newPosition) === 0) {
            writePiece(0, pieces[pieceIndex], position[pieceIndex]);
            setPosition(prevPositions => {
              const newPositions = [...prevPositions];
              newPositions[pieceIndex] = newPosition;
              writePiece(1, pieces[pieceIndex], newPosition);
              return newPositions;
            });
          }
          break;
        // Add other cases for ArrowDown, etc.
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameLaunched, pieces, pieceIndex, position]);

  //---------------------gestion de la chute---------------------

  useEffect(() => {
    if (!gameLaunched || !pieces[pieceIndex]) return;
    writePiece(1, pieces[pieceIndex], position[pieceIndex]);

    const intervalId = setInterval(() => {
      setPosition(prevPositions => {
        if (checkCollision(pieces[pieceIndex], prevPositions[pieceIndex]) == 1)
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
