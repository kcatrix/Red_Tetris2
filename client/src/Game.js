import React, { useState, useEffect } from 'react';

function Game({ pieces, setPieces, catalogPieces }) {
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
          if (piece[y][x] == 1 && action == 1 && position.y + y < rows.length) {
            newRows[position.y + y][position.x + x] = 1;
          } else if (piece[y][x] == 1 && action == 0) {
            newRows[position.y + y][position.x + x] = 0;
          }
        }
      }
      return (newRows);
    });
  };

  const searchMatchingPatterns = (catalogPieces, pieces, pieceIndex) => {
    let newPiece = [];
    var hash = {};
    for(var i = 0 ; i < catalogPieces.length; i++) {
      for(var j = 0; j < catalogPieces[i].length; j++) {
          hash[catalogPieces[i][j]] = [i, j];
      }
    }
  
    if(hash.hasOwnProperty(pieces[pieceIndex])) {
        newPiece = (hash[pieces[pieceIndex]]);
    }
    console.log(newPiece);
     return newPiece;
  }

  const check1 = async (rows, piece, position, axe) => {
    
    let it;
    let tmpPosition;

  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x] == 1) {
        const newY = position.y + y;
        const newX = position.x + x;

        // Vérifier les limites du tableau
        if (newY >= rows.length || newX >= rows[0].length || newX < 0 || newY < 0) {
          return 1; // Collision avec les bords du tableau
        }

        // Vérifier la collision avec un autre bloc
        // Gestion de collision vers le bas de toute partie de la pièce
        it = 0;

        if (axe == "y"){

          for(it; it + y < piece.length; it++)
            if (piece[it + y][x] == 1) 
              tmpPosition = it;

          it = tmpPosition + 1;
          if (newY + it >= rows.length || rows[newY + it][newX] == 1) // it représente le dernier 1 de la piece
            return 1; // Collision avec la grille en Y
        }
        
        // Gestion de collision vers la droite de toute partie de la pièce
        if (axe == "+x") {

          for(it; it + x < piece[y].length; it++) 
            if (piece[y][it + x] == 1) 
              tmpPosition = it;
          
          it = tmpPosition + 1;
          if (newX + it > rows[y].length - 1 ||  rows[newY][newX + it] == 1) 
            return 2; // on retourne 2 pour ne trigger ni le 1 de collision ni le 0 de tout est ok
        }

        // Gestion de collision vers la gauche de toute partie de la pièce
        if (axe == "-x") {

          it = piece[y].length - 1;
          for(it; it - x >= 0; it--) 
            if (piece[y][it - x] == 1) 
              tmpPosition = it;

          it = tmpPosition + 1;
          if (newX == 0 || rows[newY][newX - it] == 1) 
            return 2;
        }
      }
    }
  }
  return 0; // Pas de collision
};

  // Problème : les pieces sont interchangé parfois lors de la rotation

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
        case 'ArrowUp': // faire tourner la piece
          let newPiecePosition = searchMatchingPatterns(catalogPieces, pieces, pieceIndex)
          if (newPiecePosition[1] + 1 == 4 || newPiecePosition[0] == 3) // 3 représente le carré
            newPiecePosition[1] = 0;
          else
            newPiecePosition[1] = newPiecePosition[1] + 1;
            const newPiece = catalogPieces[newPiecePosition[0]][newPiecePosition[1]];
              if (await check1(newPiece, position[pieceIndex], "y") === 0 && await check1(newPiece, position[pieceIndex], "+x") === 0 
              && await check1(newPiece, position[pieceIndex], "-x") === 0 && (newPiece.length - 1) + position[pieceIndex].y < rows.length){
                writePiece(0, pieces[pieceIndex], position[pieceIndex]);
                setPieces(oldPieces => {
                  const newPieces = [...oldPieces];
                  newPieces[pieceIndex] = newPiece;
                  return newPieces;
                });
                writePiece(1, newPiece, position[pieceIndex]);
                // erreur sur piece I -> quand on rotate, ca trasnforme en pièce O (carré) = cause probable: le hash se trompe entre des pieces "ressemblantes" entre 1 et 0
                // erreur sur piece S -> quand on rotate, ça transforme en pièce Z
                // erreur générale -> quand on rotate et que la piece a venir rentre en collision avec d'autres 1, suppression de ces 1   
                // erreur générale -> quand on utilise fleche du bas, les 0 entre plusieurs 1 en dessous seront susceptibles d'être changé en 1
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