import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import sound from './tetris.mp3';
import { selectUrl } from './reducers/urlSlice';
import { selectPiece, modifyPiece } from './reducers/pieceSlice';
import { selectRetrySignal, retrySignalOff } from './reducers/retrySignalSlice';
import { selectMusic, musicOff } from './reducers/musicSlice';
import { selectStartPiece, startPieceOff, startPieceOn } from './reducers/startPieceSlice';
import { modifyRows } from './reducers/rowsSlice';
import { modifyTime, addTime, selectTime } from './reducers/timeSlice';
import { modifyPositions, newPositions, resetPositions, selectPositions } from './reducers/positionsSlice';
import { changeKeyDown, selectKeyDown } from './reducers/keyDownSlice';
import { selectCatalogPieces } from './reducers/catalogPiecesSlice';
import { selectTempName } from './reducers/tempNameSlice';
import { addScore, selectScore } from './reducers/scoreSlice';
import { modifyPieceIndex, selectPieceIndex } from './reducers/pieceIndexSlice';
import { selectGameLaunched } from './reducers/gameLaunchedSlice';
import { selectGameOver } from './reducers/gameOverSlice';
import { selectLeader } from './reducers/leaderSlice';
import { selectPlayers } from './reducers/playersSlice';
import { selectPlayersOff } from './reducers/playersOffSlice';
import { selectResultats } from './reducers/resultatsSlice';
import { selectLastMalus } from './reducers/lastMalusSlice';
import { modifyMalus, selectMalus } from './reducers/malusSlice';
import { selectBestScore } from './reducers/bestScoreSlice';
import { selectAddMalusGo } from './reducers/addMalusGoSlice';


function MultiGame() {

	const name = useSelector(selectTempName)
	const url = useSelector(selectUrl);
	const music = useSelector(selectMusic)
	const pieces = useSelector(selectPiece);
	const catalogPieces = useSelector(selectCatalogPieces)
	const retrySignal = useSelector(selectRetrySignal)
	const score = useSelector(selectScore);
	const pieceIndex = useSelector(selectPieceIndex);
	const position = useSelector(selectPositions);
	const gameLaunched = useSelector(selectGameLaunched);
	const Time = useSelector(selectTime);
	const startPiece = useSelector(selectStartPiece);
	const gameover = useSelector(selectGameOver)
	const leader = useSelector(selectLeader)
	const Players = useSelector(selectPlayers)
	const Playersoff = useSelector(selectPlayersOff)
	const resultat = useSelector(selectResultats)
	const lastMalus = useSelector(selectLastMalus);
	const malus = useSelector(selectMalus);
	const bestScore = useSelector(selectBestScore);
	const keyDown = useSelector(selectKeyDown)
	const addMalusGo = useSelector(selectAddMalusGo)
	const [play, setPlay] = useState(false);
	const [tick, setTick] = useState(false)
	const [down, setDown] = useState(false);
	const [spaceRaised, setSpaceRaised] = useState(false)
	const audio = document.getElementById("audio_tag");
	const movePieceDownRef = useRef();
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();


	const [rows, setRows] = useState(
	  Array.from({ length: 20 }, () => Array(10).fill(0))
	);

	let intervalId;
	const actualUrl = location.pathname;

	useEffect(() => { // remplacable par un dispatch({ message a la con })

		dispatch({ type: 'LEADER_OR_NOT' })
	}, []);

	useEffect(() => { // continuité du useEffect du dessus

		dispatch({ type: 'LEADER_REP' }) // avec variable url et tempName
	}, [])

	useEffect(() => { // lors du dispatch de down, je peux utiliser le middleWare
		if (down) {
			dispatch({ type: 'SET_HIGHER_POS' })
			setDown(false)
		}
	}, [down]);

	useEffect(() => { // un peu de mal a imaginer comment catch cette socket, remplacer par un dispatch ? 
		// Peut être setInterval peut aider a boucler sur action dispatch
		dispatch({ type: 'LAUNCH_GAME' })
	}, [])

	useEffect(() => {
		if (music == true)
			toggleAudioPlayback();
	}, [music])

	dispatch({ type: 'NAME_PLAYER' })

	dispatch({ type: 'RETRY_SIGNAL' })

	useEffect(() => {
		if (retrySignal)
			dispatch({ type: 'RETRY_GAMES' })
		dispatch(retrySignalOff())
	}, [retrySignal])


	useEffect(() => {
		dispatch({ type: 'WINNER'})
	}, [])

	useEffect(() => {
		
		dispatch({ type: 'NEW_LEADER'})
	}, [])

	useEffect(() => {

		dispatch({ type: 'MALUS' })
	}, [malus]);	
	
		// ----- La suite des événements !! 

	useEffect(() => {

		dispatch({ type: 'MALUS_SENT' })
	}, [addMalusGo])

	useEffect(() => {

		dispatch({ type: 'HIGHER_POS' })
	}, [Players]);
  
	useEffect(() => {

		dispatch({ type: 'ADD_MALUS_LINES' })
	}, [addMalusGo, lastMalus])

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

	// Not used
	// const checkLastRows = (rows) => {
	// 	let y = rows.length - 1;
	//   for (y; rows[y].includes(1); y--) {}
	// 	if (y == 20)
	// 		return 19;
	// 	else
	//   return y;
	// };
  
	movePieceDownRef.current = useCallback(() => {
			
			if (startPiece && check1(rows, pieces[pieceIndex], 0, position[pieceIndex], "y") === 0) {
					writePiece(pieces[pieceIndex], position[pieceIndex], position[pieceIndex], 0);
					dispatch(startPieceOff());
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
				dispatch(changeKeyDown("null"))
			}
			
			if (check1(rows, pieces[pieceIndex], 0, position[pieceIndex], "y") === 1) { // Condition lorsqu'on repère un 1 en bas de la pièce
				if (!spaceRaised && tick == false) { // fix potentiel slide bot
					return
				}
				if (position[pieceIndex].y === 0) { // Condition provoquant le Game Over
						// console.log("game over from normal")
						dispatch({ type: 'GAME_OVER'})
						// socket.emit('changestatusPlayer', actualUrl, name, false);
						// socket.emit("score_add", score.current, name, actualUrl);
						// setGameLaunched(false);
						// setLastMalus((old) => old = 0);
						// setKeyDown("null");
						// if (score.current > bestScore)
						// 	setBestScore(score.current)
						// score.current = 0 // En modifiant score.current ici, le perdant affichera un score.current a 0 et le best score.current sera affiché meme si il n'y a pas eu de précédent
						// setGameOver(true);
						// setTime(1000)
						// socket.emit("gameStopped", actualUrl);
						// return gameLaunched;
				}

				let newRows = [ ...rows];
				let oldScore = score.current;
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
								dispatch(addScore(tmpScore)); // score.current
								newScore = oldScore + tmpScore;
								sum = newScore - oldScore;
						}
				}

				if (!down) {
					if (sum / 100 > 1) {  // Calcul pour générer Malus par rapport au score.current fait
							dispatch(modifyMalus(sum / 100));
					}
						setDown(true); // Indique si la pièce a touché le sol
				}
				if (spaceRaised)
					setSpaceRaised(false)
				dispatch(modifyPieceIndex(pieceIndex + 1));
				dispatch(startPieceOn());
				dispatch(newPositions());
			}
}, [gameLaunched, pieceIndex, position, rows, malus, malus, startPiece, down, tick, keyDown, lastMalus, addMalusGo]);


  
	const writePiece = (piece, oldPosition, newPosition, oldPiece) => {
	  // setRows(prevRows => {
			let newRows = [...rows];

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
			dispatch(modifyRows(newRows));
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
			dispatch(addTime(-100));
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

	if (!gameLaunched || !pieces[pieceIndex]) return;

	let newPosition = { ...position[pieceIndex] };

	switch (keyDown) {
		case 'ArrowLeft':
			if (tick)
				return
			newPosition.x -= 1;
			if (check1(rows, pieces[pieceIndex], 0, position[pieceIndex], "-x") === 0) { 
				writePiece(pieces[pieceIndex], position[pieceIndex], newPosition, 0);
				dispatch.modifyPositions(newPosition, pieceIndex)
			}
			break;
		case 'ArrowRight':
			if (tick)
				return
			newPosition.x += 1;
			if (check1(rows, pieces[pieceIndex], 0, position[pieceIndex], "+x") === 0) {
				writePiece(pieces[pieceIndex], position[pieceIndex], newPosition, 0);
				dispatch(modifyPositions(newPosition, pieceIndex))
			}
			break;
		case 'ArrowUp':
			if (tick)
				return
			let newPiecePosition = searchMatchingPatterns(catalogPieces, pieces, pieceIndex);
			newPiecePosition[1] = newPiecePosition[1] === 3 ? 0 : newPiecePosition[1] + 1;
			const newPiece = catalogPieces[newPiecePosition[0]][newPiecePosition[1]];
			if (check1(rows, pieces[pieceIndex], newPiece, position[pieceIndex], "r") === 0) {
				writePiece(newPiece, position[pieceIndex], position[pieceIndex], pieces[pieceIndex]);
				dispatch(modifyPiece())
			}
			else if (check1(rows, pieces[pieceIndex], newPiece, position[pieceIndex], "r") === 1) {
				writePiece(pieces[pieceIndex], position[pieceIndex], position[pieceIndex], 0);
			}
			break;
		case 'ArrowDown':
			newPosition.y += 1;
			if (check1(rows, pieces[pieceIndex], 0, position[pieceIndex], "y") === 0) {
				writePiece(pieces[pieceIndex], position[pieceIndex], newPosition, 0);
				dispatch(modifyPositions(newPosition, pieceIndex))
			}
			break;
			case ' ':
				let tempPosition = { ...position[pieceIndex] };
				while (check1(rows, pieces[pieceIndex], 0, tempPosition, "y") === 0) {
					tempPosition.y++;
				}
				writePiece(pieces[pieceIndex], position[pieceIndex], tempPosition, 0);
				dispatch(modifyPositions(tempPosition, pieceIndex))
			break; 
		default:
			break;
		}
	};

	const saveKeyDown = (event) => {

		if (tick == false && down == false && event.key == "ArrowDown" || event.key == "ArrowUp" || event.key == "ArrowLeft" ||
				event.key == "ArrowRight" || event.key == " ") {
			setTimeout(() => {
				dispatch(changeKeyDown(event.key));
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
		dispatch({ type: 'LAUNCH_CLICK' })
	  toggleAudioPlayback();
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
		dispatch(musicOff())
	};  

	const Retry = () => {
		dispatch({ type: 'RETRY_SIGNAL' })
	}
	// const Retry = () => {
	// 	setLastMalus(0)
	// 	setKeyDown("null")
	// 	socket.emit('changestatusPlayer', actualUrl, name, true)
	// 	setGameOver(false)
	// 	if (leader) {
	// 		socket.emit('all_retry', actualUrl, name)
	// 	}
	// 	setRows(Array.from({ length: 20 }, () => Array(10).fill(0)));
	// 	setPosition(prevPosition => {
	// 		const newPosition = [...prevPosition];
	// 		setStartPiece(true)
	// 		newPosition[pieceIndex] = { x: 4, y: 0 };
	// 		return newPosition;
	// 	  });
	// 	launchGame()
	// }

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
                {/* <div className={`cell ${Players.some(player => player.higherPos === i && player.higherPos !== 0) ? 'piece' : ''}`}></div> */}
                <div className="player-names">
                  {/* {Players.filter(player => player.higherPos === i && player.higherPos !== 0).map(player => player.name).join(', ')} */}
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
				<button onClick={Retry()}>Retry</button>}
				<div className='score'>
				<h3> {name} : {score} </h3>
				{/* <h3> {name} </h3> */}
				{bestScore > 0 &&
				<div>
					<h4>/ &nbsp;&nbsp; &nbsp;&nbsp;Best score : {bestScore} </h4>
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
