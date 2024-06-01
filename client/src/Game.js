import React, { useState, useEffect } from 'react';

function Game({ pieces, onPieceLanded }) {
  const [pieceIndex, setPieceIndex] = useState(0);
  const [position, setPosition] = useState([{ x: 4, y: 0 }]);
  const [gameLaunched, setGameLaunched] = useState(false);
  const [timer, setTimer] = useState(1000);

  const [rows, setRows] = useState(
    Array.from({ length: 20 }, () => Array(10).fill(0))
  );

  const writePiece = async (action, piece, position) => {
    setRows(prevRows => {
      let newRows = [...prevRows];
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x] === 1 && action === 1) {
            newRows[position.y + y][position.x + x] = 1;
          } else if (piece[y][x] === 1 && action === 0) {
            newRows[position.y + y][position.x + x] = 0;
          }
        }
      }
      return (newRows);
    });
  };

  const check1 = (rows, piece, position) => {
    
    console.log('Checking collision for position:', position);
    let itY;
    let itX;
    let tmpPosition;
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x] === 1) {
        const newY = position.y + y;
        const newX = position.x + x;
        if(newY > 19) //évite de vérifier en dessous du tableau  
          return 0;

        // Vérifier les limites du tableau
        if (newY >= rows.length || newX >= rows[0].length || newX < 0 || newY < 0) {
          console.log(`Collision with boundaries at (x: ${newX}, y: ${newY})`);
          return true; // Collision avec les bords du tableau
        }

        // Vérifier la collision avec un autre bloc
        // Gestion de collision vers le bas de toute partie de la pièce
        itY = 0;

        console.log("----------------------start----------------");

        console.log("bout de piece en cours = ", newY, " et = ", newX)

        console.log("itY avant boucle = ", itY);
        for(itY; itY + y < piece.length; itY++) {
          if (piece[itY][x] == 1) {
            tmpPosition = itY;
            console.log("tmpPosition = ", tmpPosition)
          }
          if (itY == piece.length - 1) {
            itY = tmpPosition + 1;
            break;
          }

        }
        console.log("itY après boucle = ", itY);

        console.log (" --- ");

        console.log("positionY = ", position.y)
        console.log("y = ", y)
        console.log("itY = ", itY)
        console.log("newY = ", newY)


        // if (newY + itY + 1 == rows.length - 1) {
        //   console.log(`Collision in Y with grid (x: ${newX}, y: ${newY})`);
        //   return true; 
        // }
        if (newY + itY < 20 && rows[newY + itY][newX] == 1) { // + 2 pour prendre en compte 1 cran plus loin dans le tableau et un cran plus loin dans la pièce
          console.log(`Collision in Y with another block at (x: ${newX}, y: ${newY})`);
          debugger;
          return true; // Collision avec la grille en Y
        }
        // Gestion de collision vers la droite de toute partie de la pièce
        itX = 0;
        console.log("itX avant boucle = ", itX)
        console.log("piece[y].length ",piece[y].length)
        for(itX; itX + x < piece[y].length; itX++) {
          tmpPosition = itX;
          console.log("tmpPosition X = ", tmpPosition)
          if (itX == piece[y].length - 1) {
            itX = tmpPosition + 1;
            break; 
          }
        }
        console.log("itX après boucle = ", itX)

        console.log(" --- ")

        console.log("positionX = ", position.x)
        console.log("itX = ", itX)
        console.log("newX = ", newX)
        console.log("----------------------end------------------");

        // if (newX + itX + 1 == rows[y].length - 1) {
        //   // console.log(`Collision in X with grid (x: ${newX}, y: ${newY})`);
        //   return true;
        // }
        if (rows[newY][newX + itX] == 1) {
          // console.log(`Collision in X with another block at (x: ${newX}, y: ${newY})`);
          // debugger;
          return false
        }
      }
    }
  }
  return false; // Pas de collision
};
  
  

  const rangeDiscover = (piece, position, option) => {
    const maxRangeY = piece.length - 1;
    const maxGridOnX = 9;

    switch (option) {
      case "+x":
        let max = 0;
        for (let i = 0; i < maxRangeY; i++) {
          for (let j = 0; j < piece[i].length; j++) {
            if (max < j && piece[i][j] === 1)
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
      default:
        return position.y;
    }
  };

  const checkCollision = (piece, position, rows) => {
    const maxRangeY = piece.length;
    const maxGridOnX = 9;
    const maxGridOnY = 19;
    if (position.y + maxRangeY > maxGridOnY || position.x < 0 || rangeDiscover(piece, position, "+x") > maxGridOnX)
    {
      console.log("ici c'est check collisio")
      return 1;
    }
    if (check1(rows, piece, position) == 1)
      return 1;
    else
      return 0;
  };

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (!gameLaunched || !pieces[pieceIndex]) return;
      let newPosition = { ...position[pieceIndex] };

      switch (event.key) {
        case 'ArrowLeft':
          newPosition.x -= 1;
          if (checkCollision(pieces[pieceIndex], newPosition, rows) === 0) {
            await writePiece(0, pieces[pieceIndex], position[pieceIndex]);
            setPosition(prevPositions => {
              const newPositions = [...prevPositions];
              newPositions[pieceIndex] = newPosition;
              writePiece(1, pieces[pieceIndex], newPosition);
              return (newPositions);
            });
          }
          break;
        case 'ArrowRight':
          newPosition.x += 1;
          if (checkCollision(pieces[pieceIndex], newPosition, rows) === 0) {
            await writePiece(0, pieces[pieceIndex], position[pieceIndex]);
            setPosition( prevPositions => {
              const newPositions = [...prevPositions];
              newPositions[pieceIndex] = newPosition;
              writePiece(1, pieces[pieceIndex], newPosition);
              return (newPositions);
            });
          }
          break;
        case 'ArrowDown':
          newPosition.y += 1;
          if (checkCollision(pieces[pieceIndex], newPosition, rows) === 0) {
            await writePiece(0, pieces[pieceIndex], position[pieceIndex]);
            setPosition(prevPositions => {
              const newPositions = [...prevPositions];
              newPositions[pieceIndex] = newPosition;
              writePiece(1, pieces[pieceIndex], newPosition);
              return (newPositions);
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
  }, [gameLaunched, pieceIndex, position, pieces, rows]);

  useEffect(() => {
    const movePieceDown = async () => {
      if (!gameLaunched) return;
      const currentPiece = pieces[pieceIndex];
      await writePiece(1, currentPiece, position[pieceIndex]);
      const currentPos = position[pieceIndex];
      const newPos = { ...currentPos, y: currentPos.y + 1 };

      if (checkCollision(currentPiece, currentPos, rows) === 1) {
        const nextIndex = (pieceIndex + 1) % pieces.length;
        setPieceIndex(nextIndex);
        setPosition([...position, { x: 4, y: 0 }]);
        // console.log("rows end = ", rows)
      } else {
        await writePiece(0, currentPiece, currentPos);
        await writePiece(1, currentPiece, newPos);
        setPosition(prevPosition => {
          const newPositions = [...prevPosition];
          newPositions[pieceIndex] = newPos;
          // console.log("rows loop = ", rows)
          return (newPositions);
        });
      }
    };

    const intervalId = setInterval(movePieceDown, timer);

    return () => clearInterval(intervalId);
  }, [gameLaunched, pieceIndex, position, pieces, rows, timer]);

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
