import { store } from '../store'
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { allPieceAdded } from '../reducers/randomPieceSlice';

const socketMiddleware = (() => {

	const dispatch = useDispatch();
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

		}

		// switch (action.type) {
		// 	case '':
		// 			socket.emit('');
		// 			break;
		// 	case '':
				
		// 	// Ajoutez d'autres cas selon les besoins
		// 	default:
		// 			break;
		// }

		return next(action);
	};
})();	

export default socketMiddleware;
