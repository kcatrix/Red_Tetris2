import io from 'socket.io-client';
import { allPieceAdded } from '../reducers/randomPieceSlice';
import { fillCatalog } from '../reducers/catalogPiecesSlice';
import { changeUrl } from '../reducers/urlSlice';
import { multiOn } from '../reducers/multiSlice';
import { changeOkOff, changeOkOn } from '../reducers/changeOkSlice';
import { changeScoreList } from '../reducers/scoreListSlice';

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
        store.dispatch(allPieceAdded(randomPiece)); // Add the randomPiece to the pieces array
      });

      socket.emit('allPieces');

      socket.on('piecesDelivered', (pieces) => {
        store.dispatch(fillCatalog(pieces));
      });

      // Listeners should be set up here only once
      socket.on('GiveUrl', (givenUrl) => {
        store.dispatch(changeUrl(givenUrl));
        store.dispatch(multiOn());
      });

      socket.on('highScoreSorted', (scoreSorted) => {
        store.dispatch(changeScoreList(scoreSorted));
      });

      socket.on('urlChecked', (check) => { // réponse de demande d'accès
        check ? store.dispatch(changeOkOn()) : store.dispatch(changeOkOff());
      });

      // Déconnexion de la socket lors du démontage
      return () => socket.disconnect();
    }

    switch (action.type) {
      case 'createRoom/createRoomOn': {
        const state = store.getState();
        socket.emit('createGameRoom', state.tempName, state.randomPiece);
        break;
      }
      case 'showHighScore/showHighScoreOn': {
        socket.emit('highScore');
        break;
      }
      case 'URL_CHECK': {
        const state = store.getState();
        socket.emit('urlCheck', state.checkUrl);
        break;
      }
      case 'CREATE_PLAYER': {
        const state = store.getState();
        socket.emit('createPlayer', state.oldUrl, state.tempName);
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

