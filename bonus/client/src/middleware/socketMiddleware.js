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
import { modifyLastMalus } from '../reducers/lastMalusSlice';
import { changeKeyDown } from '../reducers/keyDownSlice';
import { gameOverOff, gameOverOn } from '../reducers/gameOverSlice';
import { modifyRows } from '../reducers/rowsSlice';
import { startPieceOn } from '../reducers/startPieceSlice';
import { resetPositions } from '../reducers/positionsSlice';
import { musicOn } from '../reducers/musicSlice';
import { modifyMalus } from '../reducers/malusSlice';

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
      // Ajoutez d'autres cas selon les besoins
      default:
        break;
    }

    return next(action);
  };
})();

export default socketMiddleware;

