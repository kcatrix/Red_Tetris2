import React, { useEffect, useState } from 'react';
import './App.css';
import Game from './Game';
import io from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [pieces, setPieces] = useState([]); // Array to hold the pieces
  const [catalogPieces, setCatalogPieces] = useState([]);

  // Connexion au serveur socket.io
  useEffect(() => {
    const socketIo = io('http://localhost:4000');
    setSocket(socketIo);

    socketIo.emit('requestRandomPiece');

    socketIo.on('randomPiece', (randomPiece) => {
      setPieces(prevPieces => [...prevPieces, randomPiece]); // Add the randomPiece to the pieces array
    });

	socketIo.emit('allPieces')

	socketIo.on('piecesDelivered', (pieces) => {
		setCatalogPieces(pieces);
	});

    // Nettoyer la connexion socket lors du démontage du composant
    return () => socketIo.disconnect();
  }, []);

  return (
    <div className="App">
      <Game pieces={pieces} setPieces={setPieces} catalogPieces={catalogPieces} />
    </div>
  );
}

export default App;
