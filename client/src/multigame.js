import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


function MultiGame({ pieces, setPieces, catalogPieces, play, setPlay, audio, name, socket }) {
	const [pieceIndex, setPieceIndex] = useState(0);
	const [position, setPosition] = useState([{ x: 4, y: 0}]);
	const [gameLaunched, setGameLaunched] = useState(false);
	const movePieceDownRef = useRef();
	const [Time, setTime] = useState(1000);
	const [score, setScore] = useState(0);
	const [startPiece, setStartPiece] = useState(true);
	const [gameover, setGameOver] = useState(false)
	const [leader, setleader] = useState(false)
	const location = useLocation();
	const [Players, setPlayers] = useState([])
	const [Playersoff, setPlayersoff] = useState([])
	const [down, setDown] = useState(false);
	const [resultat, setResultat] = useState("Game over")
	const navigate = useNavigate();
	const [lastMalus, setLastMalus] = useState(0);

		const [rows, setRows] = useState(
	  Array.from({ length: 20 }, () => Array(10).fill(0))
	);

	let intervalId;


	useEffect(() => {
		socket.emit('leaderornot', location.pathname, name)
	}, [Players]);


	useEffect(() => {
		if (down) {
			let y = 19;
			for (y; rows[y].includes(1); y--) {}
	
			let index = y;
			console.log("higherPos = ", index)
			socket.emit("setHigherPos", index - lastMalus, location.pathname, name);
			setDown(false);
		}
	}, [down == true]);

	socket.on('leaderrep', (checkleader, piecesleader) => { // Provient de "leaderornot" du front
		console.log("socket leaderrep")
		setPieces(piecesleader);
		if (checkleader)
			setleader(true)

	})

	socket.on('launchGame', (Room) => {
		console.log("in socket.on launchgame", Room)
		console.log("leader = ", leader)
		console.log("roooom = ", socket.Rooms)
		if(leader == false)
			launchGame()
		})

	socket.on('namePlayer', (Players) => {
		console.log(Players)
		setPlayersoff(Players.filter(element => element != name))
	})
	
	socket.on('retry', (nameleader) => {
		if (name != nameleader)
			Retry()
	})

	socket.on('winner', (name_winner) => {
		if (name_winner == name)
		{
			setResultat("winner")
			setGameLaunched(false)
		  setGameOver(true)
		  play ? setPlay(false) : setPlay(true);
		  play ? audio.pause() : audio.play();
		  socket.emit("gameStopped", location.pathname)
		  return gameLaunched
		}
	})

	useEffect(() => {
		socket.emit('malus', (lastMalus));

	}, [lastMalus]);	
	
	socket.on('malusSent', (number) => {
		console.log("malusSent received");
	
		addMalusLines(number);
	});

	socket.on('higherPos', (Players, Url) => {
		if (Url == location.pathname) {
			setPlayers(Players.filter(element => element.name !== name));
		}
	});
  
	const addMalusLines = (number) => {
    const newRows = [...rows];
    let newPos = 0; 

    // Clear piece from current position in tempRows
    for (let y = 0; y < pieces.length; y++) {
        for (let x = 0; x < pieces[y].length; x++) {
            if (pieces[y][x] === 1) {
                newRows[position.y + y][position.x + x] = 0;
            }
        }
    }
    // Find the highest row containing '1' from the bottom
    let highestRowWith1 = -1;
    for (let y = rows.length - 1; y >= 0; y--) {
        if (newRows[y].includes(1))
            highestRowWith1 = y;            
				else if (!newRows[y].includes(1))
					break;
    }

    // Check if adding malus lines would cause game over
    if (highestRowWith1 <= number) {
        setGameLaunched(false);
        setGameOver(true);
        if (play) {
            setPlay(false);
            audio.pause();
        } else {
            setPlay(true);
            audio.play();
        }
        socket.emit("gameStopped", location.pathname);
        return;
    }

		for (let y = highestRowWith1; y < rows.length - lastMalus; y++) {
					newRows[y - number] = [...rows[y]];
					// newRows[y] = new Array(rows[0].length).fill(0);
					// debugger;
			}
	

    // Add malus lines at the bottom
    for (let y = rows.length - (number + lastMalus); y < rows.length - lastMalus; y++) {
        newRows[y] = new Array(rows[0].length).fill(2);
    }

    // Restore piece in its original position in newRows
    for (let y = 0; y < pieces.length; y++) {
        for (let x = 0; x < pieces[y].length; x++) {
						if (newPos == 0 && pieces[y][x] === 1)
							newPos = y;
            if (pieces.length < rows.length - (number + lastMalus) && pieces[y][x] === 1) {
                newRows[position.y + y][position.x + x] = 1;
            }
            else if (pieces.length >= rows.length - (number + lastMalus) && pieces[y][x] === 1) { // Si 1ere pos de y et suivantes sont >= à rows.length - number, on déplace de number pieces
                newRows[position.y + y - (number + lastMalus)][position.x + x] = 1;
            }
        }
    }

		if (newPos != 0) {
			setPosition(prevPosition => {
				const newPositions = [...prevPosition];
				newPositions[pieceIndex] = newPos;
				return newPositions;
			});
	}

		setLastMalus(number);

    // Update the rows state
    setRows([...newRows]);
}


	const equal = (row, number) => {
	  return row.every(cell => cell === number);
	};
  
	const checkRowsEqual = (rows, firstY, lastY, number) => {
	  for (let y = lastY; y >= firstY; y--) {
			if (equal(rows[y], number)) {
				return true;
			}
	  }
	  return false;
	};

	const checkLastRows = (rows) => {
		let y = rows.length - 1;
	  for (y; rows[y].includes(1); y--) {}
		if (y == 20)
			return 19;
		else
	  return y;
	};
  
	movePieceDownRef.current = useCallback(() => {
	  if (!gameLaunched) return;
	  
	  const currentPiece = pieces[pieceIndex];
	  const currentPos = position[pieceIndex];
	  const newPos = { ...currentPos, y: currentPos.y + 1 };
  
	  if (startPiece == true && check1(rows, currentPiece, 0, currentPos, "y") == 0)
	  {
		writePiece(1, currentPiece, currentPos)
		setStartPiece(false)
		return startPiece;
	  }
  
	  if (check1(rows, currentPiece, 0, currentPos, "y") == 0) { // Condition écrivant si il n'y a que des zéros en bas de la pièce
		writePiece(0, currentPiece, currentPos);
		writePiece(1, currentPiece, newPos);
		setPosition(prevPosition => {
		  const newPositions = [...prevPosition];
		  newPositions[pieceIndex] = newPos;
		  return newPositions;
		});
	  }
  
	  else if (check1(rows, currentPiece, 0, currentPos, "y") == 1) { // Condition lorsqu'on repère un 1 en bas de la pièce
		if (position[pieceIndex].y == 0 ) { // Condition provoquant le Game Over
		  setGameLaunched(false)
		  setGameOver(true)
		  play ? setPlay(false) : setPlay(true);
		  play ? audio.pause() : audio.play();
		  socket.emit("gameStopped", location.pathname)
		  return gameLaunched
		}
		let newRows = rows;
		let oldScore = score;
		let newScore = 0;
		let tmpScore = 0;
		for (let checkPiece = currentPos.y + currentPiece.length - 1; checkPiece >= currentPos.y && currentPos.y >= 0; checkPiece--) { // Logique détruisant les pieces lorsque ligne de 1
		  if (checkRowsEqual(rows, currentPos.y, checkPiece, 1)) {
			newRows = deleteLine(newRows, currentPos.y + currentPiece.length - 1, currentPos.y)
			tmpScore += 100;
		  }
		  if (checkPiece == currentPos.y){
			setRows(oldRows => { 
			  return newRows});
		  }
		  setScore(score + tmpScore)
			newScore = score + tmpScore;
		}
		let sum = newScore - oldScore;
		setDown(true)
		if (sum / 100 > 1) {
			setLastMalus(sum / 100)
		}
		setPieceIndex(pieceIndex + 1);
		setStartPiece(true)
		setPosition([...position, { x: 4, y: 0 }]);
	  } 
	}, [gameLaunched, pieceIndex, position, rows, down, score, lastMalus]);
  
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
  
	const deleteLine = (rows, start, end) => {
	  let newRows = [...rows];
	  for (let y = start; y >= end; y--) {
			if (equal(newRows[y], 1)) {
				newRows.splice(y, 1);
				newRows.unshift(Array(10).fill(0));
			}
	  }
	  if (Time > 100)
		setTime(Time - 50);
	  return newRows;
	};
  
	const searchMatchingPatterns = (catalogPieces, pieces, pieceIndex) => {
	  for(let i = 0 ; i < catalogPieces.length; i++) {
		for(let y = 0; y < catalogPieces[i].length; y++) {
		  for(let z = 0; z < catalogPieces[i][y].length; z++) {
			if(sameArray(catalogPieces[i][y], pieces[pieceIndex]) === true)
			  return ([i, y]);
		  }
		}
	  }
	}
  
	const sameArray = (array1, array2) => {
	  if (array1.length !== array2.length) return false;
			for (let i = 0; i < array1.length; i++) {
				if (array1[i].length !== array2[i].length) return false;
			for (let j = 0; j < array1[i].length; j++) {
				if (array1[i][j] !== array2[i][j]) return false;
			}
	  }
	  return true;
	};
  
	const check1 = (rows, piece, newPiece, position, axe) => {
	  let it;
	  let tmpPosition;
	  let rowsClean = rows;
	  let final = 0;
  
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
				if (newY + it >= rows.length || rows[newY + it][newX] === 1 || rows[newY + it][newX] === 2) //surment ici
				{
				  return 1;
				}
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
			
						if (newPieceX === 0 || newPieceX > rows[dy].length - 1 || newPieceY >= rows.length || rowsClean[newPieceY][newPieceX] === 1 || rowsClean[newPieceY][newPieceX] === 2){
							return 1;
						}
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
		  // if (await check1(rows, pieces[pieceIndex], newPiece, position[pieceIndex], "r") === 0 && (newPiece.length - 1) + position[pieceIndex].y < rows.length) {
		  if (await check1(rows, pieces[pieceIndex], newPiece, position[pieceIndex], "r") === 0) {
			writePiece(0, pieces[pieceIndex], position[pieceIndex]);
			setPieces(oldPieces => {
			  const newPieces = [...oldPieces];
			  newPieces[pieceIndex] = newPiece;
			  writePiece(1, newPiece, position[pieceIndex]);
			  return newPieces;
			});
		  }
		  else if (await check1(rows, pieces[pieceIndex], newPiece, position[pieceIndex], "r") === 1) {
			writePiece(0, pieces[pieceIndex], position[pieceIndex]);
			writePiece(1, pieces[pieceIndex], position[pieceIndex]);
		  }
		  break;
		case 'ArrowDown':
		  newPosition.y += 1;
		  if (check1(rows, pieces[pieceIndex], 0, position[pieceIndex], "y") === 0) {
			await writePiece(0, pieces[pieceIndex], position[pieceIndex]);
			setPosition(prevPositions => {
			  const newPositions = [...prevPositions];
			  newPositions[pieceIndex] = newPosition;
			  writePiece(1, pieces[pieceIndex], newPosition);
			  return newPositions;
			});
		  }
		  break;
		  case ' ':
			writePiece(0, pieces[pieceIndex], position[pieceIndex]);
			let tempPosition = { ...position[pieceIndex] };
			while (check1(rows, pieces[pieceIndex], 0, tempPosition, "y") === 0) {
			  tempPosition.y++;
			}
			// tempPosition.y--; // Move back one step to the last valid position
			setPosition(prevPositions => {
			  const newPositions = [...prevPositions];
			  newPositions[pieceIndex] = tempPosition;
			  writePiece(1, pieces[pieceIndex], tempPosition);
			  return newPositions;
			});
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
		}, Time);
	  }
	  return () => {
		if (intervalId) clearInterval(intervalId);
	  };
	}, [gameLaunched, movePieceDownRef, Time]);
  
	const launchGame = async () => {
	  setGameLaunched(true);
	  setResultat("Game over")
	  if (leader)
	  {
		socket.emit('changestatusPlayer',  location.pathname, name, true)
	  	socket.emit("gameStarted", location.pathname)
	  }
	  play ? setPlay(false) : setPlay(true);
	  play ? audio.pause() : audio.play();
	};

	const Retry = () => {
		setGameOver(false)
		if (leader)
			socket.emit('all_retry', location.pathname, name)
		setRows(Array.from({ length: 20 }, () => Array(10).fill(0)));
		setPosition(prevPosition => {
			const newPosition = [...prevPosition];
			newPosition[pieceIndex] = { x: 4, y: 0 };
			return newPosition;
		  });
		launchGame()
	}

	const toHome = async () => {
		navigate("/");
	}

  
	return (
  
		<div className="App">
			<div className="Opponents">
        {gameover === false && 
          <div className="board1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="row">
                <div className={`cell ${Players.some(player => player.higherPos === i && player.higherPos !== 0) ? 'piece' : ''}`}></div>
                <div className="player-names">
                  {Players.filter(player => player.higherPos === i && player.higherPos !== 0).map(player => player.name).join(', ')}
                </div>
              </div>
            ))}
          </div>
        }
      </div>
			<div className="middle"> 
				{gameover == true && 
				<h2>{resultat}</h2>}
				{gameover == true && leader &&
				<button onClick={Retry}>Retry</button>}
				<h3>{name} : {score} </h3>
				
				{gameover == false &&
				<div className="board">
						{rows.map((row, i) => (
							<div key={i} className="row">
								{row.map((cell, j) => (
									<div key={j} className={`cell ${cell === 1 ? 'piece' : ''}  ${cell === 2 ? 'cellMalus' : ''}`}></div>
								))}
							</div>
						))}
					</div>
					}
				<div className="button">
					{gameover == false && leader == true && gameLaunched == false &&
						<button onClick={launchGame}>Launch Game</button>
					}
					<button onClick={toHome}> Go back </button>
				</div>
			</div>
			<div className="visuaPiece">
					{gameLaunched == 1 &&
						pieces[pieceIndex + 1].map((row, i) => (
							<div key={i} className="row">
								{row.map((cell, j) => (
									<div key={j} className={`cell ${cell === 1 ? 'cellPiece' : ''}`}></div>
								))}
							</div>
						))}
						<div>
						{gameLaunched == false && gameover == false &&
						Playersoff.map((player, index) => (
						<h2 key={index}>{player}</h2>
					))}
					</div>
			</div>
    </div>
  );
}

  export default MultiGame