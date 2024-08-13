import io from 'socket.io-client';
import { fillPiece } from '../reducers/pieceSlice';
import { fillCatalog } from '../reducers/catalogPiecesSlice';
import { changeUrl } from '../reducers/urlSlice';
import { multiOn } from '../reducers/multiSlice';
import { changeOkOff, changeOkOn } from '../reducers/changeOkSlice';
import { changeScoreList } from '../reducers/scoreListSlice';
import { leaderOn } from '../reducers/leaderSlice';
import { modifyBestScore } from '../reducers/bestScoreSlice';
import { modifyScore } from '../reducers/scoreSlice';
import { gameLaunchedOff, gameLaunchedOn } from '../reducers/gameLaunchedSlice';
import { retrySignalOn } from '../reducers/retrySignalSlice';
import { changeResultats } from '../reducers/resultatsSlice';
import { fillPlayersOff } from '../reducers/playersOffSlice';
import { addLastMalus, modifyLastMalus } from '../reducers/lastMalusSlice';
import { changeKeyDown } from '../reducers/keyDownSlice';
import { gameOverOff, gameOverOn } from '../reducers/gameOverSlice';
import { modifyRows } from '../reducers/rowsSlice';
import { startPieceOn } from '../reducers/startPieceSlice';
import { modifyPositions, resetPositions } from '../reducers/positionsSlice';
import { musicOn } from '../reducers/musicSlice';
import { modifyMalus } from '../reducers/malusSlice';
import { modifyAddMalusGo } from '../reducers/addMalusGoSlice';
import { fillPlayers } from '../reducers/playersSlice';
import { modifyTime } from '../reducers/timeSlice';

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

const launchGame = (state, store) => {
	
	store.dispatch(modifyScore(0)) // Je ne sais pas si il faut que je change la ref par un redux, pour le moment on laisse
	store.dispatch(gameLaunchedOn(true));
	store.dispatch(changeResultats("Game over"));
	if (state.leader) {
		socket.emit('changestatusPlayer',  state.url, state.tempName, true)
		socket.emit("gameStarted", state.url)
	}
	store.dispatch(musicOn())
}

const Retry = (state, store) => {

	store.dispatch(modifyLastMalus(0))
	store.dispatch(changeKeyDown("null"))
	socket.emit('changestatusPlayer', state.url, state.tempName, true)
	store.dispatch(gameOverOff(false))
	if (state.leader) {
		socket.emit('all_retry', state.url, state.tempName)
	}
	store.dispatch(modifyRows(Array.from({ length: 20 }, () => Array(10).fill(0))));
	store.dispatch(resetPositions(state.pieceIndex))
	store.dispatch(startPieceOn())
	launchGame(state, store)
}

const addMalusLines = (state, store) => {
	// initialement dans setRows, on va modifier cela
	// setRows((oldRows) => { 
		let newPos = {x: state.position.x, y: 0};
		
		let newRows = [...state.rows];
		let pieces = state.pieces
		let pieceIndex = state.pieceIndex
		let position = state.position
		let rows = state.rows
		let number = state.addMalusGo

		// Clear piece from current position in newRows
		for (let y = 0; y < pieces.length; y++) {
				for (let x = 0; x < pieces[y].length; x++) {
						if (pieces[y][x] === 1) {
								newRows[position.y + y][position.x + x] = 0;
						}
				}
		}

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
				socket.emit('changestatusPlayer', state.url, state.tempName, false);
				socket.emit("score_add", state.score, state.tempName, state.url);
				store.dispatch(gameLaunchedOff());
				store.dispatch(modifyLastMalus(0));
				store.dispatch(changeKeyDown("null"))
				store.dispatch(gameOverOn());
				store.dispatch(modifyTime(1000))
				if (state.score > state.bestScore)
					store.dispatch(modifyBestScore(store.score))
				store.dispatch(modifyScore(0));
				socket.emit("gameStopped", state.url);
				return;
		}

		// Move rows up by 'number' positions
		for (let y = highestRowWith1; y < rows.length - state.lastMalus + number; y++) {
				newRows[y - number] = rows[y];		
		}
		
		// Add malus lines at the bottom
		for (let y = (rows.length - 1) - state.lastMalus; y > (rows.length - 1) - (state.lastMalus + number); y--) {
			newRows[y] = new Array(rows[0].length).fill(2);
		}

		// Restore piece in its original position or adjusted position in newRows
		

		if (position.y + pieces.length < rows.length - (number + state.lastMalus)) {
			for (let y = 0; y < pieces.length; y++) {
				for (let x = 0; x < pieces[y].length; x++) {
					if (pieces[y][x] === 1) {
						if (newPos.y == 0 && position.y != 0) {
							newPos.y = position.y + y;
						}
						newRows[position.y + y][position.x + x] = 1;	
					}							
				}
			}
		}
		else if (position.y + pieces.length >= rows.length - (number + state.lastMalus)) {
			for (let y = 0; y < pieces.length; y++) {
				for (let x = 0; x < pieces[y].length; x++) {
					if (pieces[y][x] === 1) {
						if (newPos.y == 0) {
							newPos.y = position.y + y - (number + state.lastMalus);
						}
						newRows[position.y + y - (number + state.lastMalus)][position.x + x] = 1;
					}
				}
			}
		}

		// Update piece position if necessary
		if (newPos !== 0) {
			store.dispatch(modifyPositions({newPos, pieceIndex}))
		}
		// Update the rows state
		return newRows;
}

const socketMiddleware = (() => {
  let socket;

  return store => next => action => {
    if (!socket && action.type === 'SOCKET_INIT') {
      // Initialiser la connexion socket une seule fois
      socket = io('http://localhost:4000'); // Utilisez votre adresse publique ici

      socket.on('connect', () => {
        console.log('Connected to socket server');
      });

      socket.emit('requestRandomPiece');

      socket.on('randomPiece', (randomPiece) => {
        store.dispatch(fillPiece(randomPiece)); // Add the randomPiece to the pieces array
      });

      socket.emit('allPieces');

      socket.on('piecesDelivered', (pieces) => {
        store.dispatch(fillCatalog(pieces));
      });

      // Déconnexion de la socket lors du démontage
      return () => socket.disconnect();
    }

		const state = store.getState();


    switch (action.type) {
      case 'createRoom/createRoomOn': {
        socket.emit('createGameRoom', state.tempName, state.randomPiece);
				socket.on('GiveUrl', (givenUrl) => {
					store.dispatch(changeUrl(givenUrl));
					store.dispatch(multiOn());
				});
        break;
      }
      case 'showHighScore/showHighScoreOn': {
        socket.emit('highScore');
				socket.on('highScoreSorted', (scoreSorted) => {
					store.dispatch(changeScoreList(scoreSorted));
				});
        break
      }
      case 'URL_CHECK': {
        socket.emit('urlCheck', state.checkUrl);
				socket.on('urlChecked', (check) => { // réponse de demande d'accès
					check ? store.dispatch(changeOkOn()) : store.dispatch(changeOkOff());
				});
        break;
      }
      case 'CREATE_PLAYER': {
        socket.emit('createPlayer', state.oldUrl, state.tempName);
        break;
      }
      case 'LEADER_OR_NOT': {
        socket.emit('leaderornot', state.url, state.tempName)
        break;
      }
			case 'LEADER_REP': {
				socket.on('leaderrep', (checkleader, piecesleader, best) => { // Provient de "leaderornot" du front
					store.dispatch(fillPiece(piecesleader));
					store.dispatch(modifyBestScore(best));
					if (checkleader)
						store.dispatch(leaderOn(true));
				}) 
				break;
			}
			case 'SET_HIGHER_POS': {
				let y = 19;
				for (y; state.rows[y].includes(1) || state.rows[y].includes(2); y--) {}
		
				let index = y;
				socket.emit("setHigherPos", index, state.Url, state.tempName);
				break;
			}
			case 'LAUNCH_GAME': {
				socket.on('launchGame', () => {
					if(state.leader == false)
						launchGame(state, store)
					})
				break;
			}
			case 'NAME_PLAYER': {
				socket.on('namePlayer', (Players) => {
					store.dispatch(fillPlayersOff(Players.filter(element => element != state.tempName)))
				})
				break;
			}
			case 'RETRY_SIGNAL': {
				socket.on('retry', (nameleader) => {
					if (state.tempName != nameleader)
						store.dispatch(retrySignalOn())
				})
				break;
			}
			case 'RETRY_GAMES': {
				if (state.retrySignal == true)
					Retry(state, store)
				break;
			}
			case 'WINNER': {
				socket.on('winner', (name_winner) => {
					if (name_winner == state.tempName)
					{
						store.dispatch(changeResultats("winner"))
						socket.emit("score_add", state.score, state.tempName, state.url)
						if (state.score > state.bestScore)
							store.dispatch(modifyBestScore(state.score))
						store.dispatch(modifyScore(0))
						store.dispatch(gameOverOn())
						store.dispatch(gameLaunchedOff())
						store.dispatch(musicOn())
						socket.emit("gameStopped", state.url)
						return state.gameLaunched
					}
				})
				break;
			}
			case 'NEW_LEADER': {
				socket.on('newLeader', (name_leader) => {
					if(name_leader == tempName)
						leaderOn()
				})
				break;
			}
			case 'MALUS': {
				if (state.malus > 1) {
					let trueMalus = state.malus - 1;
					socket.emit('malus', trueMalus, state.url);
					store.dispatch(modifyMalus(0));
				}
				break;
			}
			case 'MALUS_SENT': {
				socket.on('malusSent', (number) => {
					store.dispatch(modifyAddMalusGo(number))
				});
				break;
			}
			case 'HIGHER_POS': {
				socket.on('higherPos', (Players, Url) => {
					if (Url == state.url) {
						store.dispatch(fillPlayers(Players.filter(element => element.name !== state.tempName)));
					}
				});
				break;
			}
			case 'ADD_MALUS_LINES': {
				if (state.addMalusGo) {
					addMalusLines(state, store)
					store.dispatch(addLastMalus(state.addMalusGo))
					store.dispatch(modifyAddMalusGo(0))
				}
				break;
			}
      // Ajoutez d'autres cas selon les besoins
      default:
        break;
    }

    return next(action);
  };
})();

export default socketMiddleware;

