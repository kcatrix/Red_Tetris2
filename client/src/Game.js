import React, { useState, useEffect } from 'react';

function Game({ pieces, onPieceLanded }) {
  const [pieceIndex, setPieceIndex] = useState(0);
  const [position, setPosition] = useState([{ x: 4, y: 0 }]);
  const [gameLaunched, setGameLaunched] = useState(false);
  const timer = 1000;

  const [rows, setRows] = useState(
    Array.from({ length: 20 }, () => Array(10).fill(0))
  );

  const writePiece = async (action, piece, position) => {
    setRows(prevRows => {
      let newRows = [...prevRows];
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x] == 1 && action == 1) {
            newRows[position.y + y][position.x + x] = 1;
          } else if (piece[y][x] == 1 && action == 0) {
            newRows[position.y + y][position.x + x] = 0;
          }
        }
      }
      return (newRows);
    });
  };

  const check1 = async (rows, piece, position, axe) => {
    
    console.log('Checking collision for position:', position);
    let it;
    let tmpPosition;

  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x] == 1) {
        const newY = position.y + y;
        const newX = position.x + x;
        // if(newY > 19) //évite de vérifier en dessous du tableau  
        //   return 0;

        // Vérifier les limites du tableau
        if (newY >= rows.length || newX >= rows[0].length || newX < 0 || newY < 0) {
          console.log(`Collision with boundaries at (x: ${newX}, y: ${newY})`);
          return 1; // Collision avec les bords du tableau
        }

        // Vérifier la collision avec un autre bloc
        // Gestion de collision vers le bas de toute partie de la pièce
        it = 0;

        console.log("----------------------start----------------");

        console.log("Regarde mon bel axe = ", axe)
        console.log("et la position de la piece = y: ", y, " + x: ",x)

        if (axe == "y"){

          console.log("bout de piece en cours = ", newY, " et = ", newX)
          console.log("itY avant boucle = ", it);

          for(it; it + y < piece.length; it++) {
            if (piece[it + y][x] == 1) {
              tmpPosition = it;
              console.log("tmpPosition = ", tmpPosition)
            }
          }
          it = tmpPosition + 1;
          console.log("it après boucle = ", it);

          console.log (" --- ");

          console.log("positionY = ", position.y)
          console.log("y = ", y)
          console.log("itY = ", it)
          console.log("newY = ", newY)


        if (newY + it >= rows.length) {
          console.log(`Collision in Y with grid (x: ${newX}, y: ${newY})`);
          return 1; 
        }
          if (rows[newY + it][newX] == 1) { // + 2 pour prendre en compte 1 cran plus loin dans le tableau et un cran plus loin dans la pièce
            console.log(`Collision in Y with another block at (x: ${newX}, y: ${newY})`);
            debugger;
            return 1; // Collision avec la grille en Y
          }
        }
        // Gestion de collision vers la droite de toute partie de la pièce
        
        if (axe == "+x") {

          console.log("itX avant boucle = ", it)
          console.log("piece[y].length ",piece[y].length)

          for(it; it + x < piece[y].length; it++) {
            if (piece[y][it + x] == 1) {
              tmpPosition = it;
              console.log("tmpPosition X = ", tmpPosition)
            }
          }

          it = tmpPosition + 1;
          console.log("itX après boucle = ", it)

          console.log(" --- ")

          console.log("positionX = ", position.x)
          console.log("itX = ", it)
          console.log("newX = ", newX)
          console.log("newY = ", newY)

          console.log("----------------------end------------------");

          if (newX + it > rows[y].length - 1) {
            // console.log(`Collision in X with grid (x: ${newX}, y: ${newY})`);
            return 2;
          }
          if (rows[newY][newX + it] == 1) {
            // console.log(`Collision in X with another block at (x: ${newX}, y: ${newY})`);
            // debugger;
            return 2;
          }
        }
        if (axe == "-x") {

          console.log("it-X avant boucle = ", it)
          console.log("piece[y].length ",piece[y].length)

          it = piece[y].length - 1;
          for(it; it - x >= 0; it--) {
            if (piece[y][it - x] == 1) {
              tmpPosition = it;
              console.log("tmpPosition X- = ", tmpPosition)
            }
          }

          it = tmpPosition + 1;
          console.log("itX- après boucle = ", it)

          console.log(" --- ")

          console.log("positionX = ", position.x)
          console.log("itX- = ", it)
          console.log("newX = ", newX)
          console.log("newY = ", newY)

          console.log("----------------------end------------------");

          if (newX == 0) {
            // console.log(`Collision in X with grid (x: ${newX}, y: ${newY})`);
            return 2;
          }
          if (rows[newY][newX - it] == 1) {
            // console.log(`Collision in X with another block at (x: ${newX}, y: ${newY})`);
            // debugger;
            console.log("check1 = 0")
            return 2;
          }
        }
      }
    }
  }
  console.log("coucou end check1")
  return 0; // Pas de collision
};

  // Problème 1: l'ordre de check1 ne permet pas d'avoir un retour juste
  // Problème 2: de problème 1, en découle que les mouvements avec les fleches n'ont pas les erreurs correctes

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (!gameLaunched || !pieces[pieceIndex]) return;
      let newPosition = { ...position[pieceIndex] };

      switch (event.key) {
        case 'ArrowLeft':
          newPosition.x -= 1;
          if (await check1(rows, pieces[pieceIndex], position[pieceIndex], "-x") == 0) { 
            await writePiece(0, pieces[pieceIndex], position[pieceIndex]);
            console.log("On va a gaucheee")
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
          if (await check1(rows, pieces[pieceIndex], position[pieceIndex], "+x") == 0) {
            console.log("allo apres")
            await writePiece(0, pieces[pieceIndex], position[pieceIndex]);
            console.log("On va a droiteeee")
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
          if (await check1(rows, pieces[pieceIndex], position[pieceIndex], "y" ) == 0)
            await writePiece(0, pieces[pieceIndex], position[pieceIndex]);
            console.log("On appuie sur bassssssss")
            setPosition(prevPositions => {
              const newPositions = [...prevPositions];
              newPositions[pieceIndex] = newPosition;
              writePiece(1, pieces[pieceIndex], newPosition);
              return (newPositions);
            });
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

      // if (await checkCollision(currentPiece, newPos, rows, "y") == 1) {
        if (await check1(rows, currentPiece, currentPos, "y") == 1) {
          const nextIndex = (pieceIndex + 1) % pieces.length;
          setPieceIndex(nextIndex);
          setPosition([...position, { x: 4, y: 0 }]);
        }
        // console.log("rows end = ", rows)
    //}
       else if (await check1(rows, currentPiece, currentPos, "y") == 0){
        console.log("On va en bassssss");
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
              <div key={j} className={`cell ${cell == 1 ? 'cell piece' : ''}`}>{cell}</div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={launchGame}>Launch Game</button>
    </div>
  );
}

export default Game;
