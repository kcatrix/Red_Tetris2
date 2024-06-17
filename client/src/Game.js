import React, { useState, useEffect, useCallback} from 'react';

function Game({ pieces, setPieces, catalogPieces }) {
  const [pieceIndex, setPieceIndex] = useState(0);
  const [position, setPosition] = useState([{ x: 4, y: 0 }]);
  const [gameLaunched, setGameLaunched] = useState(false);
  const timer = 1000;
  const [isMovingDown, setIsMovingDown] = useState(false);

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
          } 
          else if (piece[y][x] == 1 && action == 0) {
            newRows[position.y + y][position.x + x] = 0;
          }
        }
      }
      return (newRows);
    });
  };

  const searchMatchingPatterns = async (catalogPieces, pieces, pieceIndex) => {
    // let newPiece = [];
    // var hash = {};
    // for(var i = 0 ; i < catalogPieces.length; i++) {
    //   for(var j = 0; j < catalogPieces[i].length; j++) {
    //     hash[catalogPieces[i][j]] = [i, j];
    //   }
    // }
    // console.log("catalogue ", catalogPieces)
    // if(hash.hasOwnProperty(pieces[pieceIndex])) {
    //     newPiece = (hash[pieces[pieceIndex]]);
    // }
    for(let i = 0 ; i < catalogPieces.length; i++) {
      for(let y = 0; y < catalogPieces[i].length; y++)
        {
          for(let z = 0; z < catalogPieces[i][y].length; z++)
          {
            if(same_array(catalogPieces[i][y], pieces[pieceIndex]) == true)
              return ([i, y])
             
          }
        }
    }
    
    //  return newPiece;
  }

  const same_array = (catalogPieces, pieces) => {
    if (catalogPieces.length == pieces.length)
    {
      for(let i = 0; i < catalogPieces.length; i++)
      {
        if (catalogPieces[i].length == pieces[i].length)
        {
          for (let y = 0; y < catalogPieces[i].length; y++)
          {
            if (catalogPieces[i][y] != pieces[i][y])
                return false
          }
        }
        else if (catalogPieces[i].length != pieces[i].length)
          return false
     }
    }
    else if (catalogPieces.length != pieces.length)
      return false
    return true
  }

  const check1 = (rows, piece, newPiece, position, axe) => {
    
  let it;
  let tmpPosition;
  let rowsClean = rows;

	if (axe == "y" || axe == "+x" || axe == "r") {
		for (let y = 0; y < piece.length; y++) {
			for (let x = 0; x < piece[y].length; x++) {
				if (piece[y][x] == 1) {
					const newY = position.y + y;
					const newX = position.x + x;

				if (axe == "r")
					rowsClean[newY][newX] = 0;

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
						{
							return 1; // Collision avec la grille en Y
						}
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

				}
			}
		}
	}	

	if (axe == "-x") {

		for (let y = 0; y < piece.length; y++) {
			for (let x = piece[y].length - 1; x >= 0; x--) {
				if (piece[y][x] == 1) {

					const newY = position.y + y;
        	const newX = position.x + x;
					let itp = 0
					it = x;
					tmpPosition = 0;
					
					for(it; it >= 0; it--) {
						if (piece[y][it] == 1){
							tmpPosition = ++itp;
						}
					}

					it = tmpPosition;

					if (newX == 0 || rows[newY][newX - it] == 1){
						return 2;
					}
				}
			}
		}
	}

  if (axe == "r"){
  
	for (let dy = 0; dy < newPiece.length; dy++) {
	  for (let dx = 0; dx < newPiece[dy].length; dx++) {
		if (newPiece[dy][dx] == 1) {
		  const newPieceY = position.y + dy;
		  const newPieceX = position.x + dx;

		if (newPieceX == 0 || newPieceX > rows[dy].length - 1 || newPieceY >= rows.length || rowsClean[newPieceY][newPieceX] == 1)
		  return 1;
		}
	  }
	}
  }
  return 0; // Pas de collision
};

const handleKeyDown = useCallback((event) => {
  console.log(gameLaunched);
  console.log(pieces[pieceIndex]);
  if (!gameLaunched || !pieces[pieceIndex]) return;
  let newPosition = { ...position[pieceIndex] };

  switch (event.key) {
    case 'ArrowLeft':
      console.log("arrow left");
      newPosition.x -= 1;
      if (check1(rows, pieces[pieceIndex], 0, position[pieceIndex], "-x") === 0) {
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
      if (check1(rows, pieces[pieceIndex], 0, position[pieceIndex], "+x") === 0) {
        writePiece(0, pieces[pieceIndex], position[pieceIndex]);
        setPosition(prevPositions => {
          const newPositions = [...prevPositions];
          newPositions[pieceIndex] = newPosition;
          writePiece(1, pieces[pieceIndex], newPosition);
          return newPositions;
        });
      }
      break;
    case 'ArrowUp':
      let newPiecePosition = searchMatchingPatterns(catalogPieces, pieces, pieceIndex);
      newPiecePosition[1] = (newPiecePosition[1] === 3) ? 0 : newPiecePosition[1] + 1;
      const newPiece = catalogPieces[newPiecePosition[0]][newPiecePosition[1]];
      if (check1(rows, pieces[pieceIndex], newPiece, position[pieceIndex], "r") === 0 && (newPiece.length - 1) + position[pieceIndex].y < rows.length) {
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
      newPosition.y += 1;
      if (check1(rows, pieces[pieceIndex], 0, newPosition, "y") === 0) {
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
}, [gameLaunched, pieces, pieceIndex, position, rows]);

    const movePieceDown  = () => {
      if (!gameLaunched) return;
      console.log("move")
      const currentPiece = pieces[pieceIndex];
      writePiece(0, currentPiece, position[pieceIndex]);
      writePiece(1, currentPiece, position[pieceIndex]);
      const currentPos = position[pieceIndex];
      const newPos = { ...currentPos, y: currentPos.y + 1 };

      // if (await checkCollision(currentPiece, newPos, rows, "y") == 1) {
        if (check1(rows, currentPiece, 0, currentPos, "y") == 1) {
          console.log("cas 1")
          const nextIndex = (pieceIndex + 1) % pieces.length;
          setPieceIndex(nextIndex);
          setPosition([...position, { x: 4, y: 0 }]);
        }
        // console.log("rows end = ", rows)
    //}
       else if (check1(rows, currentPiece, 0, currentPos, "y") == 0){
        console.log("cas 2")
        writePiece(0, currentPiece, currentPos);
        writePiece(1, currentPiece, newPos);
        setPosition(prevPosition => {
          const newPositions = [...prevPosition];
          newPositions[pieceIndex] = newPos;
          // console.log("rows loop = ", rows)
          return (newPositions);
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
     useEffect(() => {
      if (gameLaunched) {
        const intervalId = setInterval(movePieceDown, 1000);
        return () => clearInterval(intervalId);
      }
    }, [gameLaunched, pieceIndex, position, rows]);


  const control = (e) => {
    if (e.keyCode === 37)
      console.log("left")
  }
  
  const launchGame = async () => {
    setGameLaunched(true)
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