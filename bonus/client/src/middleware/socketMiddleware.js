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
import { gameLaunchedOn } from '../reducers/gameLaunchedSlice';
import { retrySignalOn } from '../reducers/retrySignalSlice';
import { changeResultats } from '../reducers/resultatsSlice';
import { fillPlayersOff } from '../reducers/playersOffSlice';

const launchGame = (state) => {
	
	state.dispatch(modifyScore(0)) // Je ne sais pas si il faut que je change la ref par un redux, pour le moment on laisse
	state.dispatch(gameLaunchedOn(true));
	state.dispatch(changeResultats("Game over"));
	if (state.leader) {
		socket.emit('changestatusPlayer',  state.url, state.tempName, true)
		socket.emit("gameStarted", state.url)
	}
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

    switch (action.type) {
      case 'createRoom/createRoomOn': {
        const state = store.getState();
        socket.emit('createGameRoom', state.tempName, state.randomPiece);
				socket.on('GiveUrl', (givenUrl) => {
					state.dispatch(changeUrl(givenUrl));
					state.dispatch(multiOn());
				});
        break;
      }
      case 'showHighScore/showHighScoreOn': {
				const state = store.getState();
        socket.emit('highScore');
				socket.on('highScoreSorted', (scoreSorted) => {
					state.dispatch(changeScoreList(scoreSorted));
				});
        break
      }
      case 'URL_CHECK': {
        const state = store.getState();
        socket.emit('urlCheck', state.checkUrl);
				socket.on('urlChecked', (check) => { // réponse de demande d'accès
					check ? state.dispatch(changeOkOn()) : state.dispatch(changeOkOff());
				});
        break;
      }
      case 'CREATE_PLAYER': {
        const state = store.getState();
        socket.emit('createPlayer', state.oldUrl, state.tempName);
        break;
      }
      case 'LEADER_OR_NOT': {
        const state = store.getState();
        socket.emit('leaderornot', state.url, state.tempName)
        break;
      }
			case 'LEADER_REP': {
				const state = store.getState();
				socket.on('leaderrep', (checkleader, piecesleader, best) => { // Provient de "leaderornot" du front
					state.dispatch(fillPiece(piecesleader));
					state.dispatch(modifyBestScore(best));
					if (checkleader)
						state.dispatch(leaderOn(true));
				}) 
				break;
			}
			case 'SET_HIGHER_POS': {
				const state = store.getState();
				let y = 19;
				for (y; state.rows[y].includes(1) || state.rows[y].includes(2); y--) {}
		
				let index = y;
				socket.emit("setHigherPos", index, state.Url, state.tempName);
				break;
			}
			case 'LAUNCH_GAME': {
				const state = store.getState();
				socket.on('launchGame', () => {
					if(state.leader == false)
						launchGame()
					})
				break;
			}
			case 'NAME_PLAYER': {
				const state = store.getState();
				socket.on('namePlayer', (Players) => {
					state.dispatch(fillPlayersOff(Players.filter(element => element != state.tempName)))
				})
				break;
			}
			case 'RETRY': {
				const state = store.getState();
				socket.on('retry', (nameleader) => {
					if (state.tempName != nameleader)
						state.dispatch(retrySignalOn())
				})
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

