// App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import Game from './Game';
import io from 'socket.io-client';
import * as changeButtonFunctions from './components/changeButton'; // Importation de toutes les fonctions
import sound from './tetris.mp3'


function App() {
  const [socket, setSocket] = useState(null);
  const [pieces, setPieces] = useState([]); // Array to hold the pieces
  const [catalogPieces, setCatalogPieces] = useState([]);
  const [solo, setSolo] = useState(false); // Ajout de l'état solo
  const [play, setPlay] = useState(false);
  const [cou, setCou] = useState(false);
  const audio = document.getElementById("audio_tag");


  // Connexion au serveur socket.io
  useEffect(() => {
    const socketIo = io('http://90.5.107.160:4000');
    setSocket(socketIo);

    socketIo.emit('requestRandomPiece');

    socketIo.on('randomPiece', (randomPiece) => {
      setPieces(randomPiece); // Add the randomPiece to the pieces array
    });

    socketIo.emit('allPieces');

    socketIo.on('piecesDelivered', (pieces) => {
      setCatalogPieces(pieces);

    });

    // Nettoyer la connexion socket lors du démontage du composant
    return () => socketIo.disconnect();
  }, []);

  useEffect(() => {
    if (cou){
    const socketIo = io('http://90.5.107.160:4000');
    setSocket(socketIo);
    socket.emit('createGameRoom')
    setCou(false)
    return () => socketIo.disconnect();
    }

  }, [cou == 1]);


  return (
      <div className='Game'>
        <h1>Red Tetris</h1>
        <audio id="audio_tag" src={sound} />
        {solo === true &&
          <Game pieces={pieces} setPieces={setPieces} catalogPieces={catalogPieces} play={play} setPlay={setPlay} audio={audio}/>
        }
        {solo === true &&
          <button onClick={() => changeButtonFunctions.changeButton(solo, setSolo, audio, setPlay)}> Go back </button>
        }
        {solo == false &&
        <div className="button">
          <button onClick={() => changeButtonFunctions.changeButton(solo, setSolo, audio, setPlay)}>Solo</button>
          <button onClick={() => changeButtonFunctions.coucou(cou, setCou)}>Create Room</button>
        </div>
        }
      </div>
  );
}

export default App;
