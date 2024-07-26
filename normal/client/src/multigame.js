import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import sound from './tetris.mp3';


function MultiGame({ OgPieces, catalogPieces, name, socket }) {
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
	const [malus, setMalus] = useState(0);
	const [bestScore, setBestScore] = useState();
	const audio = document.getElementById("audio_tag");
	const [play, setPlay] = useState(false);
	const [pieces, setPieces] = useState([...OgPieces])
	const [keyDown, setKeyDown] = useState("null")
	const [tick, setTick] = useState(false)
	const [addMalusGo, setAddMalusGo] = useState(0)
	const [spaceRaised, setSpaceRaised] = useState(false)


		const [rows, setRows] = useState(
	  Array.from({ length: 20 }, () => Array(10).fill(0))
	);

	let intervalId;
	const actualUrl = location.pathname;

	useEffect(() => {

		socket.emit('leaderornot', actualUrl, name)
	}, []);

	useEffect(() => {
		if (down) {
			let y = 19;
			for (y; rows[y].includes(1) || rows[y].includes(2); y--) {}
	
			let index = y;
			socket.emit("setHigherPos", index, actualUrl, name);
			setDown(false)
		}
	}, [down]);

	useEffect(() => {

		socket.on('leaderrep', (checkleader, piecesleader, best) => { // Provient de "leaderornot" du front
			setPieces(piecesleader);
			if (checkleader)
				setleader(true)
		})

	}, [])


	useEffect(() => {

		socket.on('launchGame', () => {
			if(leader == false)
				launchGame()
			})

	}, [])


		socket.on('namePlayer', (Players) => {
			setPlayersoff(Players.filter(element => element != name))
		})

		socket.on('retry', (nameleader) => {
			if (name != nameleader)
				Retry()
		})

	useEffect(() => {
		socket.on('winner', (name_winner) => {
			if (name_winner == name)
			{
				setResultat("winner")
				setGameLaunched(false)
				socket.emit("score_add", score, name, actualUrl)
				setScore(0)
				setGameOver(true)
				// toggleAudioPlayback(); BONUS
				socket.emit("gameStopped", actualUrl)
				return gameLaunched
			}
		})
	}, [])

useEffect(() => {
	
	socket.on('newLeader', (name_leader) => {
		if(name_leader == name)
			setleader(true)
	})
}, [])

	useEffect(() => {
		if (malus > 1) {
			console.log("--- malus = ", malus)
			let trueMalus = malus - 1;
			socket.emit('malus', trueMalus, actualUrl);
			setMalus(0);
		}
	}, [malus]);	
	
	useEffect(() => {
		socket.on('malusSent', (number) => {
			console.log("-- malusSent ->  malus received = ", number)
			setAddMalusGo(number)
			console.log("-- before setLastMalus, lastMalus = ", lastMalus, " && number = ", number)
		});
	}, [addMalusGo])

	useEffect(() => {
		socket.on('higherPos', (Players, Url) => {
			if (Url == actualUrl) {
				setPlayers(Players.filter(element => element.name !== name));
			}
		});
	}, [Players]);
  
	useEffect(() => {
		if (addMalusGo) {
			addMalusLines(addMalusGo, position[pieceIndex], pieces[pieceIndex])
			setLastMalus(old => old + addMalusGo)
			setAddMalusGo(0)
		}
	}, [addMalusGo, lastMalus])

const addMalusLines = (number, position, pieces) => {
	setRows((oldRows) => { 
		let newPos = {x: position.x, y: 0};
		
		let newRows = [...oldRows];

		console.log("--------- inside addMalusLines")
		console.log("malus = ", number)
		console.log("lastMalus = ", lastMalus)
		console.log("position = ", position)
		console.log("position.x = ", position.x)
		console.log("position.y = ", position.y)

		// Clear piece from current position in newRows
		for (let y = 0; y < pieces.length; y++) {
				for (let x = 0; x < pieces[y].length; x++) {
						if (pieces[y][x] === 1) {
								console.log("position.y (", position.y, ")  + y (", y,") = ", position.y + y)
								newRows[position.y + y][position.x + x] = 0;
						}
				}
		}
		// debugger;

		// Find the highest row containing '1' or '2' from the bottom
		let highestRowWith1 = 0;
		for (let y = rows.length - 1; y >= 0; y--) {
				if (newRows[y].includes(1) || newRows[y].includes(2)) {
						highestRowWith1 = y;
				} else if (equal(newRows[y], 0)) {
						break;
				}
		}

		// Check if adding malus lines would cause game over
		if (highestRowWith1 !== 0 && highestRowWith1 <= number) {
				console.log("--  game over from addMalus")
				socket.emit('changestatusPlayer', actualUrl, name, false);
				setGameLaunched(false);
				setLastMalus((old) => old = 0);
				setKeyDown("null")
				setGameOver(true);
				setTime(1000)
				setScore(0);
				socket.emit("gameStopped", actualUrl);
				return;
		}

		// Move rows up by 'number' positions
		for (let y = highestRowWith1; y < rows.length - lastMalus + number; y++) {
				newRows[y - number] = rows[y];		
		}
		
		// Add malus lines at the bottom
		console.log("----- add malus bottom goal  = ", lastMalus + number)
		for (let y = (rows.length - 1) - lastMalus; y > (rows.length - 1) - (lastMalus + number); y--) {
			console.log("add malus lines -> y = ", y)
			newRows[y] = new Array(rows[0].length).fill(2);
		}

		// Restore piece in its original position or adjusted position in newRows
		
		console.log("newPos ? ", newPos)

		if (position.y + pieces.length < rows.length - (number + lastMalus)) {
			for (let y = 0; y < pieces.length; y++) {
				for (let x = 0; x < pieces[y].length; x++) {
					if (pieces[y][x] === 1) {
						if (newPos.y == 0 && position.y != 0) {
							newPos.y = position.y + y;
							console.log("addmalus -> si piece avant malus, newpos = ", position.y + y - (number + lastMalus))
						}
						newRows[position.y + y][position.x + x] = 1;	
					}							
				}
			}
		}
		else if (position.y + pieces.length >= rows.length - (number + lastMalus)) {
			for (let y = 0; y < pieces.length; y++) {
				for (let x = 0; x < pieces[y].length; x++) {
					if (pieces[y][x] === 1) {
						if (newPos.y == 0) {
							newPos.y = position.y + y - (number + lastMalus);
							console.log("addmalus -> si piece apres malus, newpos = ", position.y + y - (number + lastMalus))
						}
						newRows[position.y + y - (number + lastMalus)][position.x + x] = 1;
					}
				}
			}
		}

		console.log("newPos pupu", newPos)
		// Update piece position if necessary
		if (newPos !== 0) {
			console.log("suce -> newPos = ", newPos)
			setPosition(prevPosition => {
					const newPositions = [...prevPosition];
					newPositions[pieceIndex] = newPos;
					return newPositions;
			});
		}
		// Update the rows state
		return newRows;
	})
}

	const equal = (row, number) => {
	  return row.every(cell => cell === number);
	};
  
	const checkRowsEqual = (rows, firstY, lastY, number) => {
	  for (let y = lastY; y >= firstY; y--) {
			if (equal(rows[y], number)) {
				return true;
	  	}
			else
				return false
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
			
			if (startPiece && check1(rows, pieces[pieceIndex], 0, position[pieceIndex], "y") === 0) {
					writePiece(pieces[pieceIndex], position[pieceIndex], position[pieceIndex], 0);
					setStartPiece(false);
					return startPiece;
			}

			if (tick && keyDown == "null") { // Condition écrivant si il n'y a que des zéros en bas de la pièce
				handleKeyDown("ArrowDown")
			}
			else if (!tick && keyDown != "null" && !spaceRaised) {
				handleKeyDown(keyDown);
				if (keyDown == ' ') {
					setSpaceRaised(true)
				}
				setKeyDown("null")
			}
			
			if (check1(rows, pieces[pieceIndex], 0, position[pieceIndex], "y") === 1) { // Condition lorsqu'on repère un 1 en bas de la pièce
				if (!spaceRaised && tick == false) { // fix potentiel slide bot
					return
				}
				if (position[pieceIndex].y === 0) { // Condition provoquant le Game Over
						console.log("game over from normal")
						socket.emit('changestatusPlayer', actualUrl, name, false);
						setGameLaunched(false);
						setLastMalus((old) => old = 0);
						setKeyDown("null")
						setGameOver(true);
						setTime(1000)
						socket.emit("gameStopped", actualUrl);
						return gameLaunched;
				}

				let newRows = [ ...rows];
				let oldScore = score;
				let newScore = 0;
				let tmpScore = 0;
				let sum = 0;
				for (let checkPiece = position[pieceIndex].y + pieces[pieceIndex].length - 1; checkPiece >= position[pieceIndex].y && position[pieceIndex].y >= 0; checkPiece--) { // Logique détruisant les pieces lorsque ligne de 1
						if (checkRowsEqual(rows, position[pieceIndex].y, checkPiece, 1)) {
								newRows = deleteLine(newRows, position[pieceIndex].y + pieces[pieceIndex].length - 1, position[pieceIndex].y);
								tmpScore += 100;
						}
						if (checkPiece === position[pieceIndex].y) {
								setRows(newRows);
						}
						setScore(score + tmpScore); 
						newScore = oldScore + tmpScore;
						sum = newScore - oldScore;
				}

				if (!down) {
					if (sum / 100 > 1) {  // modification vitesse pour bonus only
							setMalus(sum / 100);
					}
						setDown(true);
				}
				if (spaceRaised)
					setSpaceRaised(false)
				setPieceIndex(pieceIndex + 1);
				setStartPiece(true);
				setPosition([...position, { x: 4, y: 0 }]);
			}
}, [gameLaunched, pieceIndex, position, rows, malus, malus, startPiece, down, tick, keyDown, lastMalus, addMalusGo]);


  
	const writePiece = (piece, oldPosition, newPosition, oldPiece) => {
	  setRows(prevRows => {
			let newRows = [...prevRows];

			if (oldPiece == 0) {
				for (let y = 0; y < piece.length; y++) {
					for (let x = 0; x < piece[y].length; x++) {
						if (piece[y][x] === 1) 
							newRows[oldPosition.y + y][oldPosition.x + x] = 0;
					}
				}
			}

			else if (oldPiece) {
				for (let y = 0; y < oldPiece.length; y++) {
					for (let x = 0; x < oldPiece[y].length; x++) {
						if (oldPiece[y][x] === 1) 
							newRows[oldPosition.y + y][oldPosition.x + x] = 0;
					}
				}
			}

			for (let y = 0; y < piece.length; y++) {
				for (let x = 0; x < piece[y].length; x++) {
					if (piece[y][x] === 1) {
						if (newPosition.y + y < rows.length) {
							newRows[newPosition.y + y][newPosition.x + x] = 1;
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
	  // if (Time > 100)  BONUS
		// 	setTime(Time - 100);
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
	  let rowsClean = [...rows];
  
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
							if (newY + it >= rows.length || rows[newY + it][newX] === 1 || rows[newY + it][newX] === 2) { 
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
  
	const handleKeyDown = (keyDown) => {

		// const currentTime = Date.now();
		// if (currentTime - lastKeyTime < keyDelay) return;
		// setLastKeyTime(currentTime);

	if (!gameLaunched || !pieces[pieceIndex]) return;

	let newPosition = { ...position[pieceIndex] };

	switch (keyDown) {
		case 'ArrowLeft':
			if (tick)
				return
			newPosition.x -= 1;
			if (check1(rows, pieces[pieceIndex], 0, position[pieceIndex], "-x") === 0) { 
				setPosition(prevPositions => {
					writePiece(pieces[pieceIndex], position[pieceIndex], newPosition, 0);
					const newPositions = [...prevPositions];
					newPositions[pieceIndex] = newPosition;
					return newPositions;
				});
			}
			break;
		case 'ArrowRight':
			if (tick)
				return
			newPosition.x += 1;
			if (check1(rows, pieces[pieceIndex], 0, position[pieceIndex], "+x") === 0) {
				setPosition(prevPositions => {
					writePiece(pieces[pieceIndex], position[pieceIndex], newPosition, 0);
					const newPositions = [...prevPositions];
					newPositions[pieceIndex] = newPosition;
					return newPositions;
				});
			}
			break;
		case 'ArrowUp':
			if (tick)
				return
			let newPiecePosition = searchMatchingPatterns(catalogPieces, pieces, pieceIndex);
			newPiecePosition[1] = newPiecePosition[1] === 3 ? 0 : newPiecePosition[1] + 1;
			const newPiece = catalogPieces[newPiecePosition[0]][newPiecePosition[1]];
			if (check1(rows, pieces[pieceIndex], newPiece, position[pieceIndex], "r") === 0) {
				setPieces(oldPieces => {
					writePiece(newPiece, position[pieceIndex], position[pieceIndex], pieces[pieceIndex]);
					const newPieces = [...oldPieces];
					newPieces[pieceIndex] = newPiece;
					return newPieces;
				});
			}
			else if (check1(rows, pieces[pieceIndex], newPiece, position[pieceIndex], "r") === 1) {
				writePiece(pieces[pieceIndex], position[pieceIndex], position[pieceIndex], 0);
			}
			break;
		case 'ArrowDown':
			newPosition.y += 1;
			if (check1(rows, pieces[pieceIndex], 0, position[pieceIndex], "y") === 0) {
				setPosition(prevPositions => {
					writePiece(pieces[pieceIndex], position[pieceIndex], newPosition, 0);
					const newPositions = [...prevPositions];
					newPositions[pieceIndex] = newPosition;
					return newPositions;
				});
			}
			break;
			case ' ':
				let tempPosition = { ...position[pieceIndex] };
				while (check1(rows, pieces[pieceIndex], 0, tempPosition, "y") === 0) {
					tempPosition.y++;
				}
			// tempPosition.y--; // Move back one step to the last valid position
				writePiece(pieces[pieceIndex], position[pieceIndex], tempPosition, 0);
				setPosition(prevPositions => {
					const newPositions = [...prevPositions];
					newPositions[pieceIndex] = tempPosition;
					return newPositions;
				});
			break; 
		default:
			break;
		}
	};

	const saveKeyDown = (event) => {

		if (tick == false && down == false && event.key == "ArrowDown" || event.key == "ArrowUp" || event.key == "ArrowLeft" ||
				event.key == "ArrowRight" || event.key == " ") {
			setTimeout(() => {
				setKeyDown(event.key);
			}, 25)
		}
		else
			return;
	}
  
	useEffect(() => {
	  document.addEventListener('keydown', saveKeyDown);
  
	  return () => {
		document.removeEventListener('keydown', saveKeyDown);
	  };
	}, [saveKeyDown]);

	useEffect(() => {
		if (gameLaunched){
			movePieceDownRef.current(tick)
	}
 }, [gameLaunched, keyDown, tick, movePieceDownRef, addMalusGo])


 useEffect(() => {
	if (gameLaunched){
		intervalId = setInterval(() => {
		  setTick(true)
			}, Time);
	  }
	  return () => {
		if (intervalId) clearInterval(intervalId);
			setTick(false)
	  };
	}, [gameLaunched, tick]);
  
	const launchGame = () => {
	  setScore(0)
	  setGameLaunched(true);
	  setResultat("Game over")
	  if (leader) {
			socket.emit('changestatusPlayer',  actualUrl, name, true)
	  	socket.emit("gameStarted", actualUrl)
	  }
	  // toggleAudioPlayback(); BONUS
	};

	const toggleAudioPlayback = () => {
		if (!play) {
		  if (audio) {
			audio.play();
		  }
		} else {
		  if (audio) {
			audio.pause();
		  }
		}
		setPlay(!play);
	};  

	const Retry = () => {
		setLastMalus(0)
		setKeyDown("null")
		socket.emit('changestatusPlayer', actualUrl, name, true)
		setGameOver(false)
		if (leader) {
			socket.emit('all_retry', actualUrl, name)
		}
		setRows(Array.from({ length: 20 }, () => Array(10).fill(0)));
		setPosition(prevPosition => {
			const newPosition = [...prevPosition];
			setStartPiece(true)
			newPosition[pieceIndex] = { x: 4, y: 0 };
			return newPosition;
		  });
		launchGame()
	}

	const toHome = () => {
		navigate("/");
	}

  
	return (
  
		<div className="App">
		  <audio id="audio_tag" src={sound} />
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
				<div className='score'>
{/*				<h3>{name} : {score} </h3>   Pour Bonus ! */} 
				<h3>{name}</h3>
				{bestScore > 0 &&
				<div>
					<h4>/ &nbsp;&nbsp; &nbsp;&nbsp;Best Score : {bestScore} </h4>
				</div>
				}
				</div>
				
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