// App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import Game from './Game';
import io from 'socket.io-client';
import * as changeButtonFunctions from './components/changeButton'; // Importation de toutes les fonctions
import sound from './tetris.mp3';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

function App() {
  const [socket, setSocket] = useState(null);
  const [pieces, setPieces] = useState([]); // Array to hold the pieces
  const [catalogPieces, setCatalogPieces] = useState([]);
  const [solo, setSolo] = useState(false); // Ajout de l'état solo
  const [multi, setMulti] = useState(false); // Ajout de l'état multi
  const [play, setPlay] = useState(false);
  const [cou, setCou] = useState(false);
  const [Url, setUrl] = useState('');
  const [tempName, setTempName] = useState(''); // État temporaire pour l'input
  const audio = document.getElementById("audio_tag");
  const navigate = useNavigate();

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

    socketIo.on('GiveUrl', (givenUrl) => {
      setUrl(givenUrl);
      setMulti(true);
      navigate(givenUrl); // Rediriger vers la nouvelle URL
    });

    // Nettoyer la connexion socket lors du démontage du composant
    return () => socketIo.disconnect();
  }, [navigate]);

  const handleInputChange = (event) => {
    setTempName(event.target.value);
  };

  const handleValidation = () => {
    if (tempName.length >= 2 && tempName.length <= 15) {
      socket.emit('createGameRoom', tempName);
      setCou(false);
    } else {
      alert('Name must be between 4 and 15 characters');
    }
  };

  return (
    <div className='Game'>
      <h1>Red Tetris</h1>
      <audio id="audio_tag" src={sound} />
      <Routes>
        <Route path="/:roomId" element={
          <div>
            <Game pieces={pieces} setPieces={setPieces} catalogPieces={catalogPieces} play={play} setPlay={setPlay} audio={audio} />
            <button onClick={() => changeButtonFunctions.changeButton(solo, setSolo, audio, setPlay)}> Go back </button>
          </div>
        }/>
        <Route path="/" element={
          <>
            {!solo && (
              <div className="button">
                <button onClick={() => changeButtonFunctions.changeButton(solo, setSolo, audio, setPlay)}>Solo</button>
                <button onClick={() => changeButtonFunctions.coucou(cou, setCou)}>Create Room</button>
              </div>
            )}
            {solo &&
              <div>
                <Game pieces={pieces} setPieces={setPieces} catalogPieces={catalogPieces} play={play} setPlay={setPlay} audio={audio} />
                <button onClick={() => changeButtonFunctions.changeButton(solo, setSolo, audio, setPlay)}> Go back </button>
              </div>
            }
            {cou && !solo && (
              <div>
                <input type="text" id="name" placeholder="Add your name" name="name" required
                  minLength="4" maxLength="15" size="10" value={tempName} onChange={handleInputChange} />
                <button onClick={handleValidation}>Validate</button>
              </div>
            )}
          </>
        }/>
      </Routes>
    </div>
  );
}

export default App;
