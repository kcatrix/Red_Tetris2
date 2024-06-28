// App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import Game from './Game';
import MultiGame from './multigame';
import io from 'socket.io-client';
import * as changeButtonFunctions from './components/changeButton'; // Importation de toutes les fonctions
import sound from './tetris.mp3';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';

function App() {
  const [socket, setSocket] = useState(null);
  const [pieces, setPieces] = useState([]); // Array to hold the pieces
  const [catalogPieces, setCatalogPieces] = useState([]);
  const [solo, setSolo] = useState(false); // Ajout de l'état solo
  const [multi, setMulti] = useState(false); // Ajout de l'état multi
  const [play, setPlay] = useState(false);
  const [cou, setCou] = useState(false);
  const [Url, setUrl] = useState('');
  const [changeOk, setChangeOk] = useState(false);
  const [tempName, setTempName] = useState(''); // État temporaire pour l'input
  const [checkUrl, setCheckUrl] = useState();
  const [noName, setNoName] = useState(true)
  const [oldUrl, setoldUrl] = useState()
  const audio = document.getElementById("audio_tag");
  const navigate = useNavigate();
  const location = useLocation();

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

    if (Url == "" && location.pathname.length > 1) { // IL FAUT SORTIR TOUS DU USEEFFECT
      console.log("location.pathname = ", location.pathname)
      setCheckUrl(location.pathname)
    }

    socketIo.on("urlChecked", (check) => { // réponse de demande d'accès
      console.log("yo")
      check ? setChangeOk(true) : setChangeOk(false);
      console.log("check = ", check)
      if (changeOk)
      {
        socket.emit('createPlayer', "vier", "gros vier") 
        navigate(location.pathname)
      }
      else
        navigate("/");
    })

    // Nettoyer la connexion socket lors du démontage du composant
    return () => socketIo.disconnect();
  }, [changeOk]);

  useEffect( () => { // demande d'acceptation d'accès a room existante
    console.log("checkUrl = ", checkUrl)
    if (tempName.length == 0)
    {
      setoldUrl(checkUrl)
      navigate("/")
    }
    if (checkUrl && checkUrl.length > 3) {
      socket.emit("urlCheck", checkUrl)
      console.log("emit done")
    }
    
  }, [checkUrl])
  
  useEffect( () => { // Redirection auto si pas de name nous devont vérifier available !!!!!!!

    if (oldUrl && changeOk)
    {
      const tempUrl = oldUrl
      setoldUrl()
      socket.emit('createPlayer', oldUrl, tempName)
      navigate(tempUrl)
    }
  }, [noName])

  // useEffect(() => {
  //   if (gameStart == true)
  //     socket.emit("gameStarted", location.pathname)
  //   if (play == true && gameStart == false)
  //     socket.emit("gameStopped", location.pathname)
  // }, [gameStart])

  const handleInputChange = (event) => {
    setTempName(event.target.value);
  };

  const handleValidation = () => {
    if (tempName.length >= 2 && tempName.length <= 15) {
      setNoName(false);
    } else {
      alert('Name must be between 4 and 15 characters');
    }
};

  return (
    <div className='Game'>
      <h1>Red Tetris</h1>
      <audio id="audio_tag" src={sound} />
      <Routes>
        {!noName && (
        <Route path="/:roomId/:name" element={
          <div>
            <MultiGame pieces={pieces} setPieces={setPieces} catalogPieces={catalogPieces} play={play} setPlay={setPlay} audio={audio} name={tempName} socket={socket}/>
            <button onClick={() => changeButtonFunctions.changeButton(solo, setSolo, audio, setPlay)}> Go back </button>
          </div>
        }/>
        )}
        <Route path="/" element={
          <>
            {!noName && !solo && (
              <div className="button">
                <button onClick={() => changeButtonFunctions.changeButton(solo, setSolo, audio, setPlay)}>Solo</button>
                <button onClick={() => changeButtonFunctions.coucou(cou, setCou, socket, tempName)}>Create Room</button>
              </div>
            )}
            {!noName && solo &&
              <div>
                <Game pieces={pieces} setPieces={setPieces} catalogPieces={catalogPieces} play={play} setPlay={setPlay} audio={audio} name={tempName} socket={socket}/>
                <button onClick={() => changeButtonFunctions.changeButton(solo, setSolo, audio, setPlay)}> Go back </button>
              </div>
            }
            {noName && (
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
