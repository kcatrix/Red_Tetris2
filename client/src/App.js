import React, { useEffect, useState } from 'react';
import './App.css';
import Game from './Game';
import io from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [piece, setPiece] = useState(null);

  // Connexion au serveur socket.io
  useEffect(() => {
    const socketIo = io('http://localhost:4000');
    setSocket(socketIo);

    socketIo.on('randomPiece', (randomPiece) => {
      setPiece(randomPiece);
    });

    socketIo.emit('requestRandomPiece');

    // Nettoyer la connexion socket lors du démontage du composant
    return () => socketIo.disconnect();
  }, []);

  return (
    <div className="App">
      <Game piece={piece} />
    </div>
  );
}

export default App;