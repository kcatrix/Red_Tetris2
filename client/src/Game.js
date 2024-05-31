import React, { useState, useEffect } from 'react';

function Game({ pieces, onPieceLanded }) {
  const [pieceIndex, setPieceIndex] = useState(0);
  const [position, setPosition] = useState([{ x: 4, y: 0 }]);
  const [isPieceDropping, setIsPieceDropping] = useState(false);
  const [gameLaunched, setGameLaunched] = useState(false);
  const [timer, setTimer] = useState(1000);

  const [rows, setRows] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

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
  const rangeDiscover = (piece, position, option) => {
    const maxRangeY = piece.length;
    const maxGridOnX = 9;
    const maxGridOnY = 19;

    switch (option) {

      case "+x":

        let max = 0 ;
        for (let i = 0; i < maxRangeY; i++) {
          for (let j = 0; j < piece[i].length; j++) {
            if (max < j && piece[i][j] == 1)
              max = j;
          }
        }

      return (max + position.x);

      case "-x":
        return position.x;

      case "+y":
        return (position.y + maxRangeY);

      case "-y":
        return (position.y);
    }
  }


  const checkCollision = (piece, position, rows) => {
    const maxRangeY = piece.length;
    const maxGridOnX = 9;
    const maxGridOnY = 19;
    // console.log("position x = ", position.x)
    // console.log("position y = ", position.y)
    // if (rows != undefined)
    //   console.log(rows[position.x][position.y + 2])
    if (position.y + maxRangeY > maxGridOnY || position.x < 0 || rangeDiscover(piece, position, "+x") > maxGridOnX ) //check collision grid only || rows[rangeDiscover(piece, position, "+y") + 1][position.x] == 1
      return 1;
    else if (rows != undefined && rows[position.x][position.y + 2] == 1)
      return 1
    else
      return 0;
  };


  //---------------------gestion des touches---------------------

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!gameLaunched || !pieces[pieceIndex]) return;
      let newPosition = { ...position[pieceIndex] };

      switch (event.key) {
        case 'ArrowLeft':
          newPosition.x -= 1;
          if (newPosition.x > -1 && checkCollision(pieces[pieceIndex], newPosition) === 0) {
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
          if (newPosition.x < 8 && checkCollision(pieces[pieceIndex], newPosition) === 0) {
            writePiece(0, pieces[pieceIndex], position[pieceIndex]);
            setPosition(prevPositions => {
              const newPositions = [...prevPositions];
              newPositions[pieceIndex] = newPosition;
              writePiece(1, pieces[pieceIndex], newPosition);
              return newPositions;
            });
          }
          break;
          case 'ArrowDown':
            newPosition.y += 1;
            if (newPosition.y < 19 && checkCollision(pieces[pieceIndex], newPosition) === 0) {
              writePiece(0, pieces[pieceIndex], position[pieceIndex]);
              setPosition(prevPositions => {
                const newPositions = [...prevPositions];
                newPositions[pieceIndex] = newPosition;
                writePiece(1, pieces[pieceIndex], newPosition);
                return newPositions;
              });
            }
            break;
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
    if (!gameLaunched) return;
	    writePiece(1, pieces[pieceIndex], position[pieceIndex]);
    console.log("position = ", position[pieceIndex])
    console.log("Piece index = ", pieceIndex)
    console.log(rows)

    const intervalId = setInterval(() => {
      console.log("after ", rows)
      setPosition(prevPosition => {
        const currentPiece = pieces[pieceIndex];
        const currentPos = prevPosition[pieceIndex];
        const newPos = { ...currentPos, y: currentPos.y + 1 };

        if (checkCollision(currentPiece, currentPos, rows) == 1) {
          const nextIndex = (pieceIndex + 1);
          setPieceIndex(nextIndex); // Incrémenter directement dans le set ne marche pas
          return [...prevPosition, { x: 4, y: 0 }];
		  // on ne peut pas retourner position avec piece index, piece index ne peut pas etre utilisé/
		  // dans cette instance car la variable ne sera pas modifié dans ce set Interval
        }

        writePiece(0, pieces[pieceIndex], currentPos);
        writePiece(1, pieces[pieceIndex], newPos);

        const newPositions = [...prevPosition];
        newPositions[pieceIndex] = newPos;
        return newPositions;
      });

    }, timer);

    return () => clearInterval(intervalId);
  }, [gameLaunched, pieceIndex, pieces]);


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
