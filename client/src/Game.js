import React, { useState, useEffect, useCallback, useRef } from 'react';

function Game({ pieces, setPieces, catalogPieces }) {
  const [pieceIndex, setPieceIndex] = useState(0);
  const [position, setPosition] = useState([{ x: 4, y: 0 }]);
  const [gameLaunched, setGameLaunched] = useState(false);
  const [isMovingDown, setIsMovingDown] = useState(false);
  const movePieceDownRef = useRef();
  const [rows, setRows] = useState(
    Array.from({ length: 20 }, () => Array(10).fill(0))
  );

  const timer = 1000;
  let intervalId;

  movePieceDownRef.current = useCallback(() => {
    if (!gameLaunched) return;
    const currentPiece = pieces[pieceIndex];
    writePiece(1, currentPiece, position[pieceIndex]);
    const currentPos = position[pieceIndex];
    const newPos = { ...currentPos, y: currentPos.y + 1 };

    if (check1(rows, currentPiece, 0, currentPos, "y") == 1) {
      const nextIndex = (pieceIndex + 1) % pieces.length;
      setPieceIndex(nextIndex);
      setPosition([...position, { x: 4, y: 0 }]);
    } else if (check1(rows, currentPiece, 0, currentPos, "y") == 0) {
      writePiece(0, currentPiece, currentPos);
      writePiece(1, currentPiece, newPos);
      setPosition(prevPosition => {
        const newPositions = [...prevPosition];
        newPositions[pieceIndex] = newPos;
        return newPositions;
      });
    }
  }, [gameLaunched, pieceIndex, position, rows]);

  const writePiece = (action, piece, position) => {
    setRows(prevRows => {
      let newRows = [...prevRows];
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x] === 1) {
            if (action === 1 && position.y + y < rows.length) {
              newRows[position.y + y][position.x + x] = 1;
            } else if (action === 0) {
              newRows[position.y + y][position.x + x] = 0;
            }
          }
        }
      }
      return newRows;
    });
  };

  const searchMatchingPatterns = (catalogPieces, pieces, pieceIndex) => {
    for(let i = 0 ; i < catalogPieces.length; i++) {
      for(let y = 0; y < catalogPieces[i].length; y++) {
        for(let z = 0; z < catalogPieces[i][y].length; z++) {
          if(same_array(catalogPieces[i][y], pieces[pieceIndex]) === true)
            return ([i, y]);
        }
      }
    }
  }

  const same_array = (catalogPieces, pieces) => {
    if (catalogPieces.length === pieces.length) {
      for(let i = 0; i < catalogPieces.length; i++) {
        if (catalogPieces[i].length === pieces[i].length) {
          for (let y = 0; y < catalogPieces[i].length; y++) {
            if (catalogPieces[i][y] !== pieces[i][y])
                return false;
          }
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
    return true;
  }

  const check1 = (rows, piece, newPiece, position, axe) => {
    let it;
    let tmpPosition;
    let rowsClean = rows;

    if (axe === "y" || axe === "+x" || axe === "r") {
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x] === 1) {
            const newY = position.y + y;
            const newX = position.x + x;

            if (axe === "r")
              rowsClean[newY][newX] = 0;

            if (newY >= rows.length || newX >= rows[0].length || newX < 0 || newY < 0) {
              return 1;
            }

            it = 0;
            if (axe === "y") {
              for(it; it + y < piece.length; it++)
                if (piece[it + y][x] === 1) 
                  tmpPosition = it;

              it = tmpPosition + 1;
              if (newY + it >= rows.length || rows[newY + it][newX] === 1) 
                return 1;
            }

            if (axe === "+x") {
              for(it; it + x < piece[y].length; it++) 
                if (piece[y][it + x] === 1) 
                  tmpPosition = it;

              it = tmpPosition + 1;
              if (newX + it > rows[y].length - 1 || rows[newY][newX + it] === 1) 
                return 2;
            }
          }
        }
      }
    }  

    if (axe === "-x") {
      for (let y = 0; y < piece.length; y++) {
        for (let x = piece[y].length - 1; x >= 0; x--) {
          if (piece[y][x] === 1) {
            const newY = position.y + y;
            const newX = position.x + x;
            let itp = 0;
            it = x;
            tmpPosition = 0;

            for(it; it >= 0; it--) {
              if (piece[y][it] === 1){
                tmpPosition = ++itp;
              }
            }

            it = tmpPosition;

            if (newX === 0 || rows[newY][newX - it] === 1) {
              return 2;
            }
          }
        }
      }
    }

    if (axe === "r") {
      for (let dy = 0; dy < newPiece.length; dy++) {
        for (let dx = 0; dx < newPiece[dy].length; dx++) {
          if (newPiece[dy][dx] === 1) {
            const newPieceY = position.y + dy;
            const newPieceX = position.x + dx;

            if (newPieceX === 0 || newPieceX > rows[dy].length - 1 || newPieceY >= rows.length || rowsClean[newPieceY][newPieceX] === 1)
              return 1;
          }
        }
      }
    }
    return 0;
  };

  const handleKeyDown = async (event) => {
    if (!gameLaunched || !pieces[pieceIndex]) return;

    let newPosition = { ...position[pieceIndex] };

    switch (event.key) {
      case 'ArrowLeft':
        newPosition.x -= 1;
        if (await check1(rows, pieces[pieceIndex], 0, position[pieceIndex], "-x") === 0) { 
          await writePiece(0, pieces[pieceIndex], position[pieceIndex]);
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
        if (await check1(rows, pieces[pieceIndex], 0, position[pieceIndex], "+x") === 0) {
          await writePiece(0, pieces[pieceIndex], position[pieceIndex]);
          setPosition(prevPositions => {
            const newPositions = [...prevPositions];
            newPositions[pieceIndex] = newPosition;
            writePiece(1, pieces[pieceIndex], newPosition);
            return newPositions;
          });
        }
        break;
      case 'ArrowUp':
        let newPiecePosition = await searchMatchingPatterns(catalogPieces, pieces, pieceIndex);
        newPiecePosition[1] = newPiecePosition[1] === 3 ? 0 : newPiecePosition[1] + 1;
        const newPiece = catalogPieces[newPiecePosition[0]][newPiecePosition[1]];
        if (await check1(rows, pieces[pieceIndex], newPiece, position[pieceIndex], "r") === 0 && (newPiece.length - 1) + position[pieceIndex].y < rows.length) {
          setPieces(oldPieces => {
            const newPieces = [...oldPieces];
            newPieces[pieceIndex] = newPiece;
            writePiece(0, pieces[pieceIndex], position[pieceIndex]);
            writePiece(1, newPiece, position[pieceIndex]);
            return newPieces;
          });
        }
        break;
      case 'ArrowDown':
        const collisionCheck = await check1(rows, pieces[pieceIndex], 0, newPosition, "y");
        newPosition.y += 1;
        if (collisionCheck === 0) {
          await writePiece(0, pieces[pieceIndex], position[pieceIndex]);
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

  useEffect(() => {

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameLaunched) {
      intervalId = setInterval(() => {
        movePieceDownRef.current();
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [gameLaunched, movePieceDownRef]);

  const launchGame = async () => {
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
