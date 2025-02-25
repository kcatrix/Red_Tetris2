import React, { useEffect, useState } from 'react';
import './App.css';
import MultiGame from './multigame';
import * as changeButtonFunctions from './components/changeButton'; // Importation de toutes les fonctions
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HighScoreBoard } from './components/HighScoreBoard';
import { selectRandomPiece } from "./reducers/pieceSlice";
import { selectCatalogPieces } from './reducers/catalogPiecesSlice';
import { multiOff, selectMulti } from './reducers/multiSlice';
import { selectUrl, changeUrl } from './reducers/urlSlice';
import { changeOkOff, selectChangeOk } from './reducers/changeOkSlice';
import { selectShowHighScore, showHighScoreOn } from './reducers/showHighScoreSlice';
import { createRoomOn } from './reducers/createRoomSlice';
import { changeTempName, selectTempName } from './reducers/tempNameSlice';
import { selectCheckUrl } from './reducers/checkUrlSlice';
import { noNameOff, noNameOn, selectNoName } from './reducers/noNameSlice';
import { changeOldUrl, selectOldUrl } from './reducers/oldUrlSlice';
import { changeCheckUrl } from './reducers/checkUrlSlice';
import { selectScoreList } from './reducers/scoreListSlice';
import { backOff, selectBack } from './reducers/backSlice';

function App() {
  const catalogPieces = useSelector(selectCatalogPieces);
  const multi = useSelector(selectMulti);
  const url = useSelector(selectUrl);
	const back = useSelector(selectBack);
  const changeOk = useSelector(selectChangeOk);
  const tempName = useSelector(selectTempName);
  const checkUrl = useSelector(selectCheckUrl);
  const noName = useSelector(selectNoName);
  const oldUrl = useSelector(selectOldUrl);
  const scoresList = useSelector(selectScoreList);
  const showHighScore = useSelector(selectShowHighScore);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialiser la connexion socket via le middleware
    dispatch({ type: 'SOCKET_INIT' });

  }, []);

	useEffect(() => {
		 // Si Url n'est pas encore attribué et que loca.path est différent d'initial, stock Url dans check
		
		//  if (url === "" && location.pathname.length > 1 && back == false) {
		 if (url === "" && location.pathname.length > 1 ) {
			const tempUrl = location.pathname
			dispatch(changeCheckUrl(tempUrl));
    }
    navigate("/");
  }, [checkUrl]);

	useEffect(() => { // Lorsque multi est true est qu'une url existe, on navigue vers l'url multi
		// multi et url est modifié dans le socketMiddleware lorsqu'on appuie sur createRoom
    if (multi && url.length > 1) {
      navigate(url);
    }
  }, [multi]);

	useEffect(() => { // Logique vérifiant si on tente d'accéder à l'URL avec un nom déja rempli ou pas

		if (tempName.length === 0) {
			dispatch(changeOldUrl(checkUrl));
			navigate("/");
		} 
		// if (checkUrl && checkUrl.length > 3 && back == false) {
		if (checkUrl && checkUrl.length > 3 ) {
			dispatch({ type: 'URL_CHECK' });
		}

	}, [checkUrl]);

	useEffect(() => { // Continuité de la vérif d'url au-dessus.
		// Si changeOk est true et que l'ancienne URL est valide, on navigue vers l'url validé et on crée nouveau joueur dans room
		
		if (changeOk && oldUrl.length > 0 && !noName) {
			dispatch(changeUrl(oldUrl));
			dispatch({ type: 'CREATE_PLAYER' });
			dispatch(changeOldUrl(""));
			navigate(oldUrl);
		}

	}, [noName]);

  const handleInputChange = (event) => { // logique de construction du nom
    dispatch(changeTempName(event.target.value));
  };

  const handleValidation = () => { // logique de clean et validation du nom
    const sanitizedTempName = tempName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const finalTempName = sanitizedTempName.replace(/[^a-zA-Z0-9]/g, '');

    if (finalTempName.length >= 2 && finalTempName.length <= 15) {
      dispatch(changeTempName(finalTempName));
      dispatch(noNameOff());
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
							<MultiGame/>
         	 </div>
        	}/>
        )}
        <Route path="/" element={
          <>
            {!noName && !showHighScore && (
              <div className="button">
                <button onClick={() => dispatch(createRoomOn())}>Create Room</button>
                <button onClick={() => dispatch(showHighScoreOn())}>High Score</button>
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
              <HighScoreBoard scoresList={scoresList} />
            )}
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
