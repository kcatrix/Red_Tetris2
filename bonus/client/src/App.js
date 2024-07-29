import React, { useEffect, useState } from 'react';
import './App.css';
import MultiGame from './multigame';
import io from 'socket.io-client';
import * as changeButtonFunctions from './components/changeButton'; // Importation de toutes les fonctions
// import sound from './tetris.mp3';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';

function App() {
  const [socket, setSocket] = useState(null);
  const [pieces, setPieces] = useState([]); // Array to hold the pieces
  const [catalogPieces, setCatalogPieces] = useState([]);
  const [multi, setMulti] = useState(false); // Ajout de l'état multi
  const [cou, setCou] = useState(false);
  const [Url, setUrl] = useState('');
  const [changeOk, setChangeOk] = useState(false);
  const [tempName, setTempName] = useState(''); // État temporaire pour l'input
  const [checkUrl, setCheckUrl] = useState();
  const [noName, setNoName] = useState(true)
  const [showHighScore, setShowHighScore] = useState(false)
  const [oldUrl, setoldUrl] = useState()
	const [scoresList, setScoresList] = useState([{name: 0, scores: 0, nature: ""}])
  // const audio = document.getElementById("audio_tag");
  const navigate = useNavigate();
  const location = useLocation();

  // Connexion au serveur socket.io
  useEffect(() => {
    // const socketIo = io('http://90.5.107.160:4000'); // Utilisez votre adresse publique ici
    const socketIo = io('http://localhost:4000'); // Utilisez votre adresse publique ici
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
      setCheckUrl(location.pathname)
    }

    socketIo.on("urlChecked", (check) => { // réponse de demande d'accès
      check ? setChangeOk(true) : setChangeOk(false);
      navigate("/");
    })

    // Nettoyer la connexion socket lors du démontage du composant
    return () => socketIo.disconnect();
  }, [changeOk]);

	useEffect(() => {
		console.log("police de showhighscore = ", showHighScore)
		if (showHighScore) {
			socket.emit("highScore")
			socket.on("highScoreSorted", (scoreSorted) => {
				console.log("scoreSorted = ", scoreSorted)
				setScoresList(scoreSorted);
			})
		}
	}, [showHighScore])

  useEffect( () => { // demande d'acceptation d'accès a room existante
    if (tempName.length == 0)
    {
      setoldUrl(checkUrl)
      navigate("/")
    }
    if (checkUrl && checkUrl.length > 3) {
      socket.emit("urlCheck", checkUrl)
    }
    
  }, [checkUrl])
  
  useEffect( () => { // Redirection auto si pas de name nous devont vérifier available !!!!!!!

    if (changeOk && oldUrl.length > 0)
    {
      const tempUrl = oldUrl
      setoldUrl("")
      socket.emit('createPlayer', oldUrl, tempName)
      navigate(tempUrl)
    }
  }, [noName])

  const handleInputChange = (event) => {
    setTempName(event.target.value);
  };

  const handleValidation = () => {
    // Remplacer les caractères accentués par leurs équivalents non accentués
    const sanitizedTempName = tempName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
    // Supprimer les autres caractères spéciaux
    const finalTempName = sanitizedTempName.replace(/[^a-zA-Z0-9]/g, '');
  
    if (finalTempName.length >= 2 && finalTempName.length <= 15) {
      setTempName(finalTempName);
      setNoName(false);
    } else {
      alert('Name must be between 2 and 15 characters');
    }
  };
  

  return (
    <div className='Game'>
      <h1>Red Tetris</h1>
      <Routes>
        {!noName && (
        <Route path="/:roomId/:name" element={
          <div>
            <MultiGame OgPieces={pieces} catalogPieces={catalogPieces} name={tempName} socket={socket}/>
          </div>
        }/>
        )}
        <Route path="/" element={
          <>
            {!noName && !showHighScore && (
              <div className="button">
                <button onClick={() => changeButtonFunctions.coucou(cou, setCou, socket, tempName, pieces)}>Create Room</button>
                <button onClick={() => setShowHighScore(true)}>High Score</button>
              </div>
            )}
            {noName && !showHighScore && (
              <div>
                <input type="text" id="name" placeholder="Add your name" name="name" required
                  minLength="4" maxLength="15" size="10" value={tempName} onChange={handleInputChange} />
                <button onClick={handleValidation}>Validate</button>
              </div>
            )}
						{showHighScore && (
							<div>
							{scoresList.length == 0 && (
								<p> No Score Yet </p>
							)}
							{scoresList && (
								<div className="row">
									{scoresList.map((score, i) => {
										<div key={i} classname="player-name">
											<h1> {score.name} : {score.scores} --- {score.nature} </h1>
										</div>
									})}
									<div className="button">
										<button onClick={() => setShowHighScore(false)}> Go Back </button>
									</div>
								</div>
							)}
							</div>
						)}
          </>
        }/>
      </Routes>
    </div>
  );
}

export default App;
