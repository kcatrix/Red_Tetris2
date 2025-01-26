import io from 'socket.io-client';
import { fillPiece } from '../reducers/pieceSlice';
import { fillCatalog } from '../reducers/catalogPiecesSlice';
import { changeUrl } from '../reducers/urlSlice';
import { changeOldUrl } from '../reducers/oldUrlSlice';
import { changeCheckUrl } from '../reducers/checkUrlSlice';
import { changeTempName } from '../reducers/tempNameSlice';
import { multiOn, multiOff } from '../reducers/multiSlice';
import { noNameOn } from '../reducers/noNameSlice';
import { changeOkOff, changeOkOn } from '../reducers/changeOkSlice';
import { changeScoreList } from '../reducers/scoreListSlice';
import { leaderOff, leaderOn } from '../reducers/leaderSlice';
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
import { musicOff, musicOn } from '../reducers/musicSlice';
import { modifyMalus } from '../reducers/malusSlice';
import { modifyAddMalusGo } from '../reducers/addMalusGoSlice';
import { fillPlayers } from '../reducers/playersSlice';
import { modifyTime } from '../reducers/timeSlice';
import { createRoomOff } from '../reducers/createRoomSlice';
import { modifyPieceIndex } from '../reducers/pieceIndexSlice';

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

const resetGameOver = (state, store, socket) => {

	store.dispatch(musicOn())
	socket.emit('changestatusPlayer', state.url, state.tempName, false);
	store.dispatch(gameLaunchedOff());
	store.dispatch(modifyLastMalus(0));
	store.dispatch(changeKeyDown("null"))
	store.dispatch(gameOverOn());
	// store.dispatch(modifyTime(1000))
	socket.emit("gameStopped", state.url);
	return state.gameLaunched;
}

const launchGame = (state, store, socket) => {
	
	store.dispatch(gameLaunchedOn());
	store.dispatch(changeResultats("Game over"));
	if (state.leader) {
		socket.emit('changestatusPlayer',  state.url, state.tempName, true)
		socket.emit("gameStarted", state.url)
	}
}

const Retry = (state, store, socket) => {

	store.dispatch(modifyLastMalus(0))
	store.dispatch(changeKeyDown("null"))
	socket.emit('changestatusPlayer', state.url, state.tempName, true)
	store.dispatch(gameOverOff())
	if (state.leader) {
		socket.emit('all_retry', state.url, state.tempName)
	}
	store.dispatch(modifyRows(Array.from({ length: 20 }, () => Array(10).fill(0))));
	store.dispatch(startPieceOn())
	store.dispatch(retrySignalOn())
	launchGame(state, store, socket)
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
        socket.emit('createGameRoom', state.tempName, state.piece);
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
						store.dispatch(leaderOn());
				}) 
				break;
			}
			case 'SET_HIGHER_POS': {
				let y = 19;
				for (y; state.rows[y].includes(1) || state.rows[y].includes(2); y--) {}
		
				let index = y;
				socket.emit("setHigherPos", index, state.url, state.tempName);
				break;
			}
			case 'LAUNCH_GAME': {
				socket.on('launchGame', () => {
					if(state.leader == false)
						launchGame(state, store, socket)
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
					if (state.tempName != nameleader) {
						Retry(state, store, socket)
					}
				})
				break;
			}
			case 'RETRY_GAME': {
				Retry(state, store, socket)
				break;
			}
			case 'WINNER': {
				socket.on('winner', (name_winner) => {
					if (name_winner == state.tempName)
					{
						store.dispatch(changeResultats("winner"))
						store.dispatch(gameOverOn())
						store.dispatch(gameLaunchedOff())
						socket.emit("gameStopped", state.url)
						return state.gameLaunched
					}
				})
				break;
			}
			case 'NEW_LEADER': {
				socket.on('newLeader', (name_leader) => {
					if(name_leader == state.tempName)
						store.dispatch(leaderOn())
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
			case 'GAME_OVER': {
				resetGameOver(state, store, socket)
				break;
			}
			case 'LAUNCH_CLICK': {
				launchGame(state, store, socket)
				break;
			}
			case 'PLAYER_DISCONNECTED': {
				socket.on('playerDisconnected', (disconnectedPlayer) => {
					store.dispatch(fillPlayers(state.players.filter(element => element.name !== disconnectedPlayer)))
					console.log("-- Inside PLAYER_DISCONNECTED")
				});
				break;
			}
			case 'BACK_HOME': {
				store.dispatch(changeOldUrl(""))
				store.dispatch(createRoomOff())
				store.dispatch(changeCheckUrl(""))
				store.dispatch(changeUrl("/"))
				store.dispatch(changeTempName(''))
				store.dispatch(modifyPieceIndex(0))
				store.dispatch(noNameOn());
				store.dispatch(multiOff())
				store.dispatch(gameOverOff())
				store.dispatch(fillPlayersOff([]))
				store.dispatch(fillPlayers([]))
				store.dispatch(fillPiece([]))
				store.dispatch(leaderOff())
				store.dispatch(gameLaunchedOff())

				socket.emit('quit');

				socket.emit('requestRandomPiece');

				socket.on('randomPiece', (randomPiece) => {
					store.dispatch(fillPiece(randomPiece)); // Add the randomPiece to the pieces array
				});

				store.dispatch(modifyRows(Array.from({ length: 20 }, () => Array(10).fill(0))));
				break;
			}
			case 'RESET_GAME_OVER': {
				resetGameOver(state, store, socket)
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
